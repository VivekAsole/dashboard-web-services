import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_STRING)
        console.log('connected')
    } catch (error) {
        console.log("MONGODB connection error:", error)
        process.exit(1) // node process object
    }
}

export default connectDB;