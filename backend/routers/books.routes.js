import { Router } from "express";
import { bookSearch, viewBook, newBook, recommend, updateBook, buy, getVendorBooks, addReviews } from '../controllers/books.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { isLogin, checkVendor } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const booksRouter = Router()

booksRouter.route('/').post(isLogin, asyncHandler( async (req,res) => {
    console.log("Book search")
    bookSearch(req, res);
} ) )

booksRouter.route('/new').post(checkVendor, asyncHandler( async (req,res) => {
    newBook(req, res);
} ) )

booksRouter.route('/recommend').get(isLogin, asyncHandler( async (req,res) => {
    recommend(req, res);
} ) )

booksRouter.route('/vendor').get(checkVendor, asyncHandler( async (req, res) => {
    getVendorBooks(req, res)
} ))

booksRouter.route('/:id').get( asyncHandler( async (req,res) => {
    viewBook(req, res);
} ) )

booksRouter.route('/:id/review').post( asyncHandler( async (req, res) => {
    addReviews(req, res)
} ) )

booksRouter.route('/new').post(isLogin, checkVendor, upload.single("book_cover"), asyncHandler( async (req,res) => {
    newBook(req, res);
} ) )

booksRouter.route('/:id/buy').post(isLogin, asyncHandler( async (req,res) => {
    buy(req,res)
} ))
booksRouter.route('/:id').put(checkVendor, asyncHandler( async (req,res) => {
    updateBook(req, res);
} ) )


export { booksRouter }