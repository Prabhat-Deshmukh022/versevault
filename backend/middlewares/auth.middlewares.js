import { pool } from "../index.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const isLogin = asyncHandler( async (req,res,next) => {

    console.log(`In isLogin middleware`);

    if(req.session && req.session.user){
        console.log(`Logged In!`)
        return next()
    }
    else{
        console.log(`User not logged in!`);
        return res.status(401).json({"message":`User not logged in!`})
    }
} )

const checkAdmin = asyncHandler(async (req, res, next) => {
    const username = req.session.user;
    console.log(username);
    console.log("checkAdmin");

    const [admin] = await pool.query(`SELECT * FROM admin WHERE admin_username = ?`, [username]);

    if (admin.length === 0) {
        return res.status(403).send('Not an admin');
    }

    req.session.role = "admin";
    next();
});


const checkVendor = asyncHandler(async( req,res,next ) => {
    console.log(`In checkVendor middleware`);

    if(req.session.role === "vendor"){
        return next()
    }
    else{
        console.log(`Not a vendor`);
        return res.status(401).json({"message":`Not a vendor`})
    }
} )

export {isLogin, checkAdmin, checkVendor}