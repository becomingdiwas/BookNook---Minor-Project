const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const app = express();
const cookieParser = require("cookie-parser");
const config = require('./config');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes);
app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs'); // Set the view engine to EJS
app.set('views', path.join(__dirname, 'views')); // Set the views directory

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.get('/my-book-list', (req, res) => {
  res.redirect('/books');
});
// Define the route for the profile page
app.get('/profile', (req, res) => {
  // Assuming you have a 'user' object available in your session or request
  // You can pass the 'user' object to the profile.ejs view for displaying user information
  const user = req.user; // Change this to the actual way you get the user object

  // Render the profile.ejs view with the 'user' object
  res.render('profile', { user });
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
    console.log('Port 3000 is already in use. Please choose a different port.');
  } else {
    console.log('An error occurred while starting the server:', err);
  }
});
