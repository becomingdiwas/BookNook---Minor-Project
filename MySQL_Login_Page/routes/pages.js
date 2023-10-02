const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const path = require("path");

router.get('/', authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render('profile', { user: req.user });
  } else {
    res.sendFile(path.join(__dirname, "../public/main.html"));
  }
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render('profile', { user: req.user });
  } else {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  }
});


module.exports = router;
