import mongoose from "mongoose";

const getCollection = async (req, res) => {
  const interval = req.params.interval

  try {
    const DB = mongoose.connection.useDb('RQ_Analytics');

    const groupId = {};

    switch (interval) {
      case 'daily':
        groupId.date = {
          $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
        }
        break;
      case 'monthly':
        groupId.date = {
          $dateToString: { format: "%Y-%m", date: "$created_at" }
        }
        break;
      case 'quarterly':
        groupId.date = {
          $concat: [
            { $toString: { $year: "$created_at" } },
            "-Q",
            { $toString: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } } }
          ]
        }
        break;
      case 'yearly':
        groupId.date = {
          $dateToString: { format: "%Y", date: "$created_at" }
        }
        break;
      default:
        throw new Error('Invalid interval')
    }

    const result = await DB.collection('shopifyOrders').aggregate([
      {
        $addFields: {
          created_at: { $toDate: "$created_at" } // Convert created_at to Date
        }
      },
      {
        $group: {
          _id: groupId,
          totalSales: { $sum: { $toDouble: "$total_price_set.shop_money.amount" } }
        }
      },
      {
        $sort: { "_id.date": 1 }
      },
      {
        $project: {
          date: "$_id.date",
          amount: "$totalSales",
          _id: 0
        }
      }
    ]).toArray()

    // Format and send the data
    const data = result.map(entry => ({
      date: entry.date,
      amount: entry.amount.toFixed(2)
    }))
    return res
      .status(200)
      .json(data);
  } catch (error) {
    return res
      .status(500)
      .send('Internal Server Error')
  }
}

export { getCollection };
