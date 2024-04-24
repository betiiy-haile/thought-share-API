import cloudinary from "../utils/cloudinary.js";
import asyncHandler from "express-async-handler";
import PostModel from "../Models/PostModel.js";

export const createPost = asyncHandler( async (req, res) => {
    const { title, content, category, image , slug} = req.body
    const result = await cloudinary.uploader.upload(image, {
        resource_type: "image",
        folder: "posts"        
    })
    console.log(result)
    console.log("after cloud")

    const post = await PostModel.create({
        title,
        content,
        category,
        slug, 
        image:{
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    if (post) {
        res.status(201).json({
            _id: post._id,
            title: post.title,
            content: post.content,
            category: post.category,
            slug: post.slug,
            image: post.image
        })
    } else {
        res.status(400).json({ error: "Invalid post data" })
    }
    
})

export const getPosts = asyncHandler( async (req, res) => {
    const posts = await PostModel.find()
    res.status(200).json(posts)
})