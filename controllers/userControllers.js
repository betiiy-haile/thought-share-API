import asyncHandler from 'express-async-handler'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import UserModel from '../Models/UserModel.js'

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
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
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
                token: generateToken(user._id, user.email, user.name, user.image),
            });
        } else {
            res.status(401).json({ error: "Invalid password" });
        }
    } else {
        res.status(401).json({ error: "User not found" });
    }
})


export const getAllusers =  asyncHandler(async (req, res) => {
    const users = await UserModel.find()
    res.status(200).json(users)
})

export const getUser =  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id)
    res.status(200).json(user)
})

export const generateToken = ( id, email, name, image ) => {
    return jwt.sign({ id, email, name, image }, process.env.JWT_SECRET, { expiresIn: '30d'})
}