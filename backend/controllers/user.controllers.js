import {pool} from "../index.js"
import bcryptjs from "bcryptjs"
import validator from "validator";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

function checkBookId(books,id){
    let found=false;
    for(let book of books){
        if(book.id === id){
            found=true
        }
    }
    return found
}

async function getUser(req,res) { 
    const username = req.session.user
    const role = req.session.role

    console.log(`Username and role ${username}, ${role}`);

    return res. 
    json({username:username, role: role})
}

async function userRegistration(req, res) {
    console.log(`In registration`);

    let { username, email, user_password, confirm_password, contact, isVendor } = req.body;

    console.log(username, email, user_password, confirm_password, contact, isVendor);

    if (!(username && email && user_password && confirm_password && contact)) {
        console.log(`Field not entered!`);
        return res.status(400).send(`Field not entered!`);
    }

    const validEmail = validator.isEmail(email);
    const validContact = validator.isMobilePhone(contact, "en-IN");

    if (!validEmail) {
        console.log(`Wrong email format!`);
        return res.status(400).send(`Wrong email format!`);
    }

    if (!validContact) {
        console.log(`Wrong phone number format!`);
        return res.status(400).send(`Wrong phone number format!`);
    }

    if (user_password !== confirm_password) {
        console.log(`Confirm password wrong!`);
        return res.status(400).send(`Confirm password wrong!`);
    }

    const password = await bcryptjs.hash(user_password, 10);

    const profileLocalPath = req?.file?.path;
    let profile;

    if (profileLocalPath) {
        console.log("Profile path received ", profileLocalPath);
        profile = await uploadOnCloudinary(profileLocalPath);

        if (!profile) {
            console.log("Cloudinary upload failed!");
            return res.status(500).send(`Error uploading profile picture`);
        }
        console.log("Cloudinary URL received ", profile.url);
    } else {
        console.log("Profile path not received");
    }

    isVendor= (isVendor === "true") ? true : false

    // Check if the user already exists in the respective table based on isVendor
    let query = (isVendor)
        ? `SELECT * FROM vendor WHERE vendor_email = ? AND vendor_username = ? AND vendor_contact = ?`
        : `SELECT * FROM customer WHERE customer_email = ? AND customer_username = ? AND customer_contact = ?`;
    
    const [result] = await pool.query(query, [email, username, contact]);
    
    if (result.length > 0) {
        console.log(`User already exists!`);
        return res.status(400).json({ msg: `User already exists!` });
    }

    // Insert user into the appropriate table based on isVendor
    if (isVendor ) {
        await pool.query(
            `INSERT INTO vendor (vendor_username, vendor_email, vendor_password, vendor_contact, profile) VALUES (?, ?, ?, ?, ?)`,
            [username, email, password, contact, profile?.url || ""]
        );
    } else {
        await pool.query(
            `INSERT INTO customer (customer_username, customer_email, customer_password, customer_contact, profile) VALUES (?, ?, ?, ?, ?)`,
            [username, email, password, contact, profile?.url || ""]
        );
    }

    return res.status(200).json({ success: true });
}

async function userLogin(req, res) {
    const { username, password } = req.body;

    console.log(username, password);

    if (!(username && password)) {
        return res.status(400).json({ success: false, message: 'Credentials not entered!' });
    }

    const [customer] = await pool.query(`SELECT * FROM customer WHERE customer_username = ?`, [username]);
    const [vendor] = await pool.query(`SELECT * FROM vendor WHERE vendor_username = ?`, [username]);
    const [admin] = await pool.query(`SELECT * FROM admin WHERE admin_username = ?`, [username]);
    let user=""
    let valid_user;

    console.log(customer, vendor, admin);

    if(customer.length!==0){
        user="customer"
        valid_user = await bcryptjs.compare(password, customer[0].customer_password);
    }
    else if(vendor.length!==0){
        user="vendor"
        valid_user = await bcryptjs.compare(password, vendor[0].vendor_password);
    }
    else{
        user="admin"
        valid_user = await bcryptjs.compare(password, admin[0].admin_password);
    }   

    if (!valid_user) {
        console.log(`In not valid user!`)
        return res.status(401).json({ message: "Invalid username or password" });
    }

    console.log(`In Login, checking user ${req.session.user}`);

    if(req.session.user !== username){
        console.log("In IF!");
        
        req.session.user = username;
        req.session.role = user;

        console.log(`After login ${req.session.user}`);
    }

    return res.status(200).json({ user: req.session.user, role: req.session.role, success: true });
}

async function userLogout(req, res) {
    console.log(`In logout ${req.session.user}`);

    if (req.session && req.session.user) {
        console.log(`In Logout checking req.session ${req.session.user}`);
        
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Failed to log out!');
            }

            console.log(`After logout ${req.session}`);

            return res
                .status(200)
                .clearCookie('cookies') // Use the correct session cookie name
                .json({ success: true });
        });
    } else {
        return res.status(400).send('User is not logged in or session does not exist');
    }
}

async function shoppingCart(req,res){
    console.log("In shoppingCart")
    let {book_id, copies} = req.body

    console.log(copies)

    if(!book_id){
        console.log(`book is not received!`);
        return res.status(400).send(`book is not received!`)
    }

    if(!copies){
        copies = 1;
    }

    console.log(`Book is ${book_id}`);

    let [isBookIdValid] = await pool.query(`select * from books where book_id=?`,[book_id])

    if(isBookIdValid.length === 0){
        console.log(`Invalid book id ${book_id}`);
        return res.status(400).send(`book id not valid!`)
    }

    // // Fetch the number of copies from the database
    // let [copiesResult] = await pool.query(`SELECT copies FROM books WHERE book_id=?`, [book_id]);
    // console.log("copiesResult:", copiesResult);

    // // Correctly handle the result to get isCopies
    // let [{ copies: isCopies } = {}] = copiesResult;

    // console.log(`Copies are ${isCopies}`);

    // if(copies > isCopies){
    //     console.log(`Sorry, book copies not available`);
    //     return res.status(400).send(`Sorry, book copies not available`)
    // }

    // Check if enough copies are available
    const [copiesCheck] = await pool.query(`SELECT IsCopiesGreaterThan(?, ?) AS is_greater`, [book_id, copies]);
    if (!copiesCheck[0].is_greater) {
        console.error(`Not enough copies available for book ID ${book_id}`);
        return res.send(`Not enough copies available`);
    }

    if(!req.session.book){
        req.session.book = []
    }

    let check_id = checkBookId(req.session.book, book_id)

    if(check_id){

        console.log(`In checkBookId true`);

        for(let book of req.session.book){
            if(book.id === book_id){
                book.copies += copies
            }
        }
    }
    else{
        req.session.book.push({"id":book_id, "copies":copies})
    }

    return res
    .status(200)
    .json({"success":true})
}

async function getCart(req, res) {
    console.log("In getCart")
    console.log(req.session.book)
    let books;
    if (req.session.book) {
        books = await Promise.all(
            req.session.book.map(async (item) => {
                const [book] = await pool.query('SELECT * FROM books WHERE book_id = ?', [item.id]);
                return book[0]
            })
        );
    } else {
        books = []
    }
    console.log(books)
    return res.json(books)
}

async function admin(req,res){
    const {username, name, password} = req.body

    const hashed = await bcryptjs.hash(password, 12)

    const query = await pool.query(`insert into admin values(?,?,?)`,[username, name, hashed])

    console.log([query])

    return res
    .send("admin added")
}

export {getUser, userRegistration, userLogin, userLogout, shoppingCart, getCart, admin}