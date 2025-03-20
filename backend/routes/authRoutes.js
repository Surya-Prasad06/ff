const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

// Profile Picture Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Signup Route
// Signup Route with Email Verification
router.post("/signup", upload.single("profilePic"), async (req, res) => {
    const { username, email, password, bio } = req.body;
    const profilePic = req.file ? req.file.path : "";

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            bio,
            profilePic,
            isVerified: false,
            otp,
            otpExpiry,
        });

        await newUser.save();

        // Nodemailer setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send OTP Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Email Verification OTP",
            html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>
                   <p>This OTP will expire in 10 minutes.</p>`,
        });

        res.status(201).json({ message: "OTP sent to your email for verification." });
    } catch (err) {
        console.error(err);
        console.error("Signup error:", err);
        res.status(500).json({ error: "Error in Signing Up" });
    }
});

// OTP Verification Route
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User already verified!" });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ error: "Invalid or expired OTP!" });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ error: "OTP has expired!" });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined; // Remove OTP after successful verification
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully. You can now log in!" });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ error: "Error verifying OTP" });
    }
});


// Email Verification Route
router.post("/resend-otp", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User already verified!" });
        }

        // Generate a new OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry

        // Update user with new OTP
        user.otp = newOtp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send new OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Resend OTP for Email Verification",
            html: `<p>Your new OTP is: <strong>${newOtp}</strong></p>
                   <p>This OTP will expire in 10 minutes.</p>`,
        });

        res.status(200).json({ message: "New OTP sent successfully!" });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        res.status(500).json({ error: "Error resending OTP" });
    }
});







// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: "Please verify your email before logging in!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        return res.status(200).json({ message: "Login successful!", user });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Server error during login" });
    }
});


// Get Profile Route
router.get("/profile/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user profile" });
    }
});

module.exports = router;
