import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import userRoute from "./Routes/userRoute.js"
import cors from "cors"

dotenv.config()
connectDB()

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoute)
app.get("/", (req, res) =>{
    res.json("Hello from server")
})

app.listen(PORT, () => {
    console.log(`server is running on port number ${PORT}`)
})