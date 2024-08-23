import mongoose from "mongoose";

async function clvCohorts(req, res) {
    try {
        const DB = mongoose.connection.useDb('RQ_Analytics')
        const ordersCollection = DB.collection('shopifyOrders')

        // Aggregation pipeline
        const pipeline = [
            {
                $addFields: {
                    firstPurchaseMonthYear: {
                        $dateToString: { format: "%Y-%m", date: { $toDate: "$customer.created_at" } }
                    }
                }
            },
            // Step 2: Group by customer and cohort (first purchase month/year)
            {
                $group: {
                    _id: {
                        customer_id: "$customer.id",
                        cohort: "$firstPurchaseMonthYear"
                    },
                    totalSpent: { $sum: { $toDouble: "$total_price" } }
                }
            },
            // Step 3: Group by cohort to get CLV per cohort
            {
                $group: {
                    _id: "$_id.cohort",
                    cohortCLV: { $sum: "$totalSpent" },
                    customerCount: { $sum: 1 }
                }
            },
            // Step 4: Calculate average CLV per customer in each cohort
            {
                $project: {
                    _id: 0,
                    cohort: "$_id",
                    total_CLV: "$cohortCLV",
                    total_customer: "$customerCount"
                }
            },
            {
                $sort: { cohort: 1 }
            }
        ]

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

export { clvCohorts };