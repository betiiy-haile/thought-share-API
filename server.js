import express from "express"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT

const app = express()
app.get("/", (req, res) => {
    res.send("Hello World")
})


app.listen(PORT, () => {
    console.log(`server is running on port number ${PORT}`)
})