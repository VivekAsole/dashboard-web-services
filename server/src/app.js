import express from "express"
import cors from "cors"

console.log(process.env.CORS_URL)
const app = express()

const corsOptions ={
    origin: process.env.CORS_URL
}

app.use(cors(corsOptions))
app.use(express.json())

// routes import
import userRouter from "../routes/userRouter.js"

app.use("/api/v1/users", userRouter)

export { app }