import mysql from 'mysql2';
import fs from 'fs'
import csv from 'csv-parser'
import { v4 as uuidv4 } from 'uuid';

// Set up the MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Vid24Siv$',
  database: 'versevault',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

const hasNullOrEmpty = (fields) => {
    return fields.some(field => {
      const trimmedField = field ? field.toString().trim() : '';
      return trimmedField === null || trimmedField === undefined || trimmedField === '';
    });
  };
  
  // Function to insert data into the books table
  const seedBooksData = () => {
    const csvFilePath = 'goodreads_data.csv';
  
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Extract fields from the CSV and trim whitespace
        const title = row['Book'] ? row['Book'].trim() : '';
        const author = row['Author'] ? row['Author'].trim() : '';
        
        // Parse genres by removing brackets and single quotes, then splitting by commas
        const genres = row['Genres'] ? row['Genres'].replace(/[\[\]']/g, '').split(',') : [];
        const genre = genres.length > 0 ? genres[0].trim() : '';
  
        const plot = row['Description'] ? row['Description'].trim() : '';
        const book_price = 100;
        const book_cover = 'http://res.cloudinary.com/dwdzc4g1n/image/upload/v1731563257/siuihg4hcxork9ogulau.png '
        const vendor_username = 'vendor1';
  
        // Debug print to see the values and if they pass the null/empty check
        console.log(`Processing row: ${JSON.stringify(row)}`);
        console.log(`Parsed values - title: "${title}", author: "${author}", genre: "${genre}", plot: "${plot}"`);
  
        // Check for null or empty required fields
        if (hasNullOrEmpty([title, author, genre, plot])) {
          console.log(`Skipping row due to missing data in required fields.`);
          return;
        }
  
        // Generate UUID for book_id
        const book_id = uuidv4();
  
        // Insert into MySQL
        const query = `
          INSERT INTO books 
          (book_id, title, author, genre, plot, book_price, book_cover, vendor_username) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [book_id, title, author, genre, plot, book_price, book_cover, vendor_username];
  
        connection.query(query, values, (err, results) => {
          if (err) throw err;
          console.log(`Inserted book: ${title}`);
        });
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        connection.end();
      });
  };
  
  // Start the data seeding process
  seedBooksData();