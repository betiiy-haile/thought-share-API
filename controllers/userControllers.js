import asyncHandler from 'express-async-handler'
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import UserModel from '../Models/UserModel.js'

const slugify = (str) =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");



export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400);
        res.json({
            errors: errors.array(),
        });
        return;
    }

    // Check if user with the provided email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        res.status(400);
        res.json({
            error: "Email already exists",
        });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
        name,
        email,
        username: slugify(name),
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id, user.email, user.name, user.image),
        });
    } else {
        res.status(400).json({ error: "Invalid user data" });
    }
});


export const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body
    
    const user = await UserModel.findOne({ email });
    if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                posts: user.posts,
                username: user.username,
                image: user.image,
                token: generateToken(user._id, user.email, user.name, user.image),
            });
        } else {
            res.status(401).json({ error: "Invalid password" });
        }
    } else {
        res.status(401).json({ error: "User not found" });
    }
})

export const updateProfile = asyncHandler(async (req, res) => {
    // the image needs to be in base64 format
    const { image } = req.body
    const token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.decode(token)
    const result = await cloudinary.uploader.upload(image, {
        resource_type: "image",
        folder: "profile"
    })
    const user = await UserModel.findById(id)
    const updateUser = await UserModel.findByIdAndUpdate(id, {
        image: {
            public_id: result.public_id,
            url: result.secure_url
        },
        token: generateToken(user._id, user.email, user.name, result.secure_url)
    }, { new: true })  
    
    res.status(200).json({
        msg: "Profile Updated Successfully",
        user: updateUser
    })
    })


export const getAllusers =  asyncHandler(async (req, res) => {
    const users = await UserModel.find().populate('posts')
    res.status(200).json(users)
})

export const getUser =  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id).populate('posts')
    res.status(200).json(user)
})

export const generateToken = ( id, email, name, image ) => {
    return jwt.sign({ id, email, name, image }, process.env.JWT_SECRET, { expiresIn: '30d'})
}