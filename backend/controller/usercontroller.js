const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthUser = require('../models/userModel.js'); // Use authUser model
const dotenv = require('dotenv');
const validator = require('validator');
const { sendEmail } = require('../config/nodemailer.js');
const crypto = require('crypto');
dotenv.config();

// Create JWT Token
const createToken = (id) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
    } catch (error) {
        console.error('Token creation error:', error);
        return null;
    }
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const emailExists = await AuthUser.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await AuthUser.create({
            name,
            email,
            password: hashedPassword
        });

        const token = createToken(newUser._id);
        newUser.accessToken = token;
        await newUser.save();

        return res.status(200).json({
            message: 'User registered successfully',
            token,
            newUser,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await AuthUser.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        user.accessToken = token;
        await user.save();

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout User
const logoutUser = async (req, res) => {
    try {
        const user = await AuthUser.findByIdAndUpdate(
            req.body._id,
            { accessToken: "" },
            { new: true }
        );

        if (user) {
            return res.status(200).json({ message: "Successfully logged out" });
        }

        return res.status(400).json({ message: "Could not log out, please try again" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await AuthUser.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save the hashed token and expiration time to the user
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send the reset token via email
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const subject = 'Password Reset Request';
        const text = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;

        await sendEmail(user.email, subject, text);

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        // Hash the incoming token
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await AuthUser.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
};