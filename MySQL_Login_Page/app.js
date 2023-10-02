const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const app = express();
const cookieParser = require("cookie-parser");
const config = require('./config');
const session = require('express-session'); // Add session support

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Set the view engine to EJS and specify views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from 'public' directory
app.use(express.static("public"));

// Initialize session middleware
app.use(session({
  secret: 'your-secret-key', // Change this to a secure secret key
  resave: false,
  saveUninitialized: true
}));

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth')); // Handle regular user authentication

// Add admin routes
const adminRoutes = require('./routes/auth'); // Replace with the actual path to your admin routes
app.use('/admin', adminRoutes); // Use a specific route for admin authentication

// Include routes related to books
const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes);

// Serve uploaded files from 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Define the route for the profile page
app.get('/profile', (req, res) => {
  const user = req.user;

  // Render the profile.ejs view with the 'user' object
  res.render('profile', { user });
});

// Define the route for redirecting to the book list
app.get('/my-book-list', (req, res) => {
  res.redirect('/books');
});
app.get('/admin-profile', (req, res) => {
  // Check if the user is authenticated as an admin
  if (req.session.admin) {
    // Fetch data from the 'users' and 'books' tables
    db.query('SELECT * FROM users', (userErr, users) => {
      if (userErr) {
        console.error('Error fetching user data:', userErr);
        // Handle the error appropriately
        res.status(500).send('Internal Server Error');
      } else {
        // Fetch book data
        db.query('SELECT * FROM books', (bookErr, books) => {
          if (bookErr) {
            console.error('Error fetching book data:', bookErr);
            // Handle the error appropriately
            res.status(500).send('Internal Server Error');
          } else {
            // Render the 'admin-profile.ejs' page with user and book data
            res.render('admin-profile', { users, books, admin: req.session.admin });
          }
        });
      }
    });
  } else {
    // Redirect to the admin login page if not authenticated
    res.redirect('/admin-login');
  }
});
// Start the server
const server = app.listen(5000, () => {
  console.log('Server started on port 5000');
});

// Establish a MySQL connection pool
const db = mysql.createPool(config.db);

db.getConnection((err, connection) => {
  if (err) {
    console.log('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database!');
    connection.release(); // Release the connection
  }
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port 5000 is already in use. Please choose a different port.');
  } else {
    console.log('An error occurred while starting the server:', err);
  }
});
