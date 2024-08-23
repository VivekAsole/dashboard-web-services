import mongoose from "mongoose";

async function geoDistribution(req, res) {
    try {
        const DB = mongoose.connection.useDb('RQ_Analytics')
        const ordersCollection = DB.collection('shopifyCustomers')

        // Aggregation pipeline
        const pipeline = [
            {
                $group: {
                    _id: "$default_address.city",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    city: "$_id",
                    customer_count: "$count",
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

export { geoDistribution };