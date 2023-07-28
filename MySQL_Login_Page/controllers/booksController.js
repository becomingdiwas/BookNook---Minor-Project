const mysql = require('mysql');
const config = require('../config'); // Replace '../path/to/config' with '../config'
const multer = require('multer');
const path = require('path');

const db = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

// Test the database connection
try {
    // Database connection code
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
      } else {
        console.log('Connected to the database!');
        connection.release(); // Release the connection
      }
    });
  } catch (error) {
    console.error('Error in database connection:', error);
  }
  

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    // Generate a unique name for the uploaded image
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Controller function to handle book data submission
// Controller function to handle book data submission
exports.addBook = [
  upload.single('image'),
  (req, res) => {
    const { title, author, book_condition, trade_condition, price, exchangewith } = req.body; // Change 'exchangeWith' to 'exchangewith'
    const image = req.file ? req.file.filename : null;

    if (!title) {
      return res.status(400).json({ error: 'Book title is required' });
    }

    const sql =
      'INSERT INTO books (title, author, book_condition, trade_condition, price, image, exchangewith) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, author, book_condition, trade_condition, price, image, exchangewith], (err, result) => {
      if (err) {
        console.error('Error saving book data to the database:', err);
        return res.status(500).json({ error: 'Error saving book data to the database' });
      } else {
        console.log('Book data saved successfully!');
        return res.redirect('/profile');
      }
    });
  },
];


  exports.getAllBooks = (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching books:', err);
        return res.status(500).send('An error occurred while fetching books.');
      }
      res.render('all_books', { books: results });
    });
  };