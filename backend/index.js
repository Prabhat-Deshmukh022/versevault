import mysql from 'mysql2';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import session from 'express-session';
import mysqlSession from 'express-mysql-session';
import passport from 'passport';

const MySQLStore = mysqlSession(session);

dotenv.config({
    path: './.env'
});

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

console.log(`Pool ${pool}`);

const app = express();

console.log("APP ", process.env.CORS_ORIGIN);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Use the pool variable after it has been initialized
const sessionStore = new MySQLStore({
    expiration: 10800000, // Optional: session expiration time
    createDatabaseTable: true,
    schema: {
        tableName: 'session_table',
        columnNames: {
            session_id: 'session_id', // Correctly defined column name
            expires: 'expires',
            data: 'data'
        }
    }
}, pool); // Pass the pool instance here

app.use(session({
    name: "cookies",
    key:process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    }
}));

sessionStore.onReady().then(() => {
    // MySQL session store ready for use.
    console.log('MySQLStore ready');
}).catch(error => {
    // Something went wrong.
    console.error(error);
});

app.use(passport.initialize())
app.use(passport.session())

// _________________________________________________________________________________________________________________________________

import { userRouter } from './routers/user.routes.js';
import { booksRouter } from './routers/books.routes.js';
import { adminRouter } from './routers/admin.routes.js';

app.use('/api/v1/users', userRouter)
app.use('/api/v1/books', booksRouter)
app.use('/api/v1/admin', adminRouter)

const port_val = process.env.PORT || 8080;

app.listen(port_val, () => {
    console.log(`App is running on ${port_val}`);
});

export { pool };

//Trigger to Validate Bulk Order Quantity Against Total Inventory, Trigger to Block Vendor Deletion if They Have Unfulfilled Orders