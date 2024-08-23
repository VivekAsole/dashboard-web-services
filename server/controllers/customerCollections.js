import mongoose from "mongoose";

async function newCustomers(req, res) {
    try {
        const DB = mongoose.connection.useDb('RQ_Analytics')
        const first = await DB.collection('shopifyCustomers').aggregate([
            {
                $addFields: {
                    created_at: { $dateFromString: { dateString: { $ifNull: ["$created_at", ""] } } }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" }
                                }
                            }
                        ]
                    },
                    Customer_Count: "$count"
                }
            }
        ]).toArray();

        return res
            .status(200)
            .json(first)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

async function repeatCustomers(req, res) {
    const interval = req.params.interval

    try {
        const DB = mongoose.connection.useDb('RQ_Analytics')
        const ordersCollection = DB.collection('shopifyOrders')

        let dateFormat, dateGroup;
        switch (interval) {
            case 'quarterly':
                dateFormat = {
                    $concat: [
                        { $toString: { $year: "$created_at" } },
                        "-Q",
                        { $toString: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } } }
                    ]
                }
                dateGroup = { date: dateFormat }
                break;
            case 'yearly':
                dateFormat = { $year: "$created_at" }
                dateGroup = { date: dateFormat }
                break;
            case 'monthly':
            default:
                dateFormat = { $dateToString: { format: "%Y-%m", date: "$created_at" } }
                dateGroup = { date: dateFormat }
                break;
        }

        // Aggregation pipeline
        const pipeline = [
            {
                $addFields: {
                    created_at: { $toDate: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        date: dateFormat,
                        customerId: "$customer.id"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    count: { $gt: 1 } // Find customers with more than one purchase
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    customers: { $addToSet: "$_id.customerId" } // Collect unique customer IDs
                }
            },
            {
                $sort: { "_id": 1 }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    customer_count: { $size: "$customers" } // Count of unique customers
                }
            }
        ];

        // Run the aggregation
        const result = await ordersCollection.aggregate(pipeline).toArray()

        return res
            .status(200)
            .json(result)
    } catch (error) {
        return res
            .status(500)
            .send("An error occurred while fetching repeat customers.")
    }
}


export { newCustomers, repeatCustomers }