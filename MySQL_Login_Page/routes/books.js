const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

// Route to display all books
router.get('/', booksController.getAllBooks);

// Route to handle book data submission
router.post('/add-book', booksController.addBook);

module.exports = router;
