import express from "express"

import { createPost, getPosts } from "../controllers/postController.js"

const postRoute = express.Router()

// postRoute.post("/new-post", createPost)
postRoute.post("/", createPost)

postRoute.get("/",  getPosts)

postRoute.get("/:id",  (req, res) => {
    res.json({ message: "single post route" })
})

postRoute.put("/:id",  (req, res) => {
    res.json({ message: "update post route" })
})

postRoute.delete("/:id",  (req, res) => {
    res.json({ message: "delete post route" })
})





export default postRoute