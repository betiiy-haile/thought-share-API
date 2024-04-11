import asyncHandler from 'express-async-handler'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import UserModel from '../Models/UserModel.js'

export const registerUser = asyncHandler(async ( req, res ) => {
    const { name, email, password } = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.status(400)
        res.json({
            errors: errors.array()
        })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPaswword = await bcrypt.hash(password, salt)


    const user = await UserModel.create({
        name,
        email,
        password: hashedPaswword
    })

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else  {
        res.status(400)
        throw new Error("Invalid User Data")
    }
})


export const loginUser = asyncHandler( async (req, res) => {
    console.log("hello from login user")
    const { email, password } = req.body

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400)
        res.json({
            errors: errors.array()
        })
    }

    const user = await UserModel.findOne({ email })
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
                _id: user._id,
                name:user.name,
                email: user.email,
                token: generateToken(user._id),
        })
    }else {
        res.status(401)
        throw new Error("Invalid Credentials")
    }
})


export const getAllusers =  asyncHandler(async (req, res) => {
    const users = await UserModel.find()
    res.status(200).json(users)
})

export const generateToken = ( id ) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d'})
}