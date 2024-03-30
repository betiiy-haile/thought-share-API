import express from "express"
import { body } from "express-validator"
import  UserModel from "../Models/UserModel.js"
import { registerUser } from "../controllers/userControllers.js"

const userRoute = express.Router()

userRoute.post('/register', [
    body('name').not().isEmpty().withMessage("Name is Required!!"),
    body('email').isEmail().withMessage("Email is Invalid!!"),
    body('email').not().isEmpty().withMessage("Email is Required!!"),
    body('email').custom(async (email) => {
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            throw new Error("Email already exists")
        }
    }),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 5 characters")
] , registerUser)

export default userRoute

