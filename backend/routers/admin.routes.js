import { Router } from "express";
import { vendor_delete, getVendors, getCustomers, addTokens, checkSession } from '../controllers/admin.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { checkAdmin } from "../middlewares/auth.middlewares.js";

const adminRouter = Router()

adminRouter.route('/vendors').get(checkAdmin, asyncHandler(async (req, res) => {
    console.log("In /vendors")
    getVendors(req, res)
} ) )

adminRouter.route('/customers').get(checkAdmin, asyncHandler(async (req, res) => {
    console.log("In /customers")
    getCustomers(req, res)
} ))

adminRouter.route('/delete/:username').delete(checkAdmin, asyncHandler(async (req, res) => {
    vendor_delete(req, res)
} ))

adminRouter.route('/:username').put(checkAdmin, asyncHandler(async (req, res) => {
    addTokens(req, res)
}))

adminRouter.route('/session').get( asyncHandler(async (req,res) => {
    checkSession(req,res)
}) )

export { adminRouter }