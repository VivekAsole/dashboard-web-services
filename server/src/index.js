import connectDB from "../database/index.js";
import { app } from "./app.js";

(async () => {
    try {
        await connectDB()
        app.listen(8000, () => {
            console.log(`Server listening on port 8000`)
          }
        )    
    } catch (error) {
        console.log("error while connecting")
    }
})()