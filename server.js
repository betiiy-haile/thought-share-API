import express from "express"
import dotenv from "dotenv"
import cookiesParser from "cookie-parser"
import connectDB from "./config/db.js"
import userRoute from "./Routes/userRoute.js"
import cors from "cors"
import postRoute from "./Routes/postRoute.js"

dotenv.config()
connectDB()

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(cookiesParser())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)

app.get("/", (req, res) =>{
    res.json("Hello from server")
})

app.listen(PORT, () => {
    console.log(`server is running on port number ${PORT}`)
})