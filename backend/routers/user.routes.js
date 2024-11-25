import { Router } from "express";
import { getUser,userLogin,userLogout,userRegistration,shoppingCart,admin, getCart } from '../controllers/user.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { checkAdmin, isLogin } from "../middlewares/auth.middlewares.js";

const userRouter = Router()
// const upload = multer()

userRouter.route('/').get( isLogin, asyncHandler( async (req,res) => {
    getUser(req,res)
} ) )

userRouter.route('/register').post( upload.single("profile"), asyncHandler( async (req,res) => {
    userRegistration(req,res)
} ) )

userRouter.route('/login').post( asyncHandler( async (req,res) => {
    userLogin(req,res)
} ) )

userRouter.route('/logout').post( asyncHandler( async (req,res) => {
    userLogout(req,res)
} ) )

userRouter.route('/shopping').get( isLogin, asyncHandler( async (req,res) => {
    getCart(req,res)
} ) )

userRouter.route('/shopping').post( isLogin, asyncHandler( async (req,res) => {
    shoppingCart(req,res)
} ) )

userRouter.route('/protected').get(isLogin, checkAdmin, asyncHandler( async (req,res) => {
    console.log(`In protected route!`);
    
} ))

userRouter.route('/admin').post(asyncHandler( async (req,res) => {
    admin(req,res)
}))

export {userRouter}