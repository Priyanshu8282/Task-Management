const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
} = require('../controller/usercontroller'); // Adjust path if needed

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', logoutUser);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

module.exports = router;