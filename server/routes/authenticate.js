const express = require('express');
const router = express.Router();
const authController = require("../controller/authenticate.js");


router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
