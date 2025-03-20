require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");

// ✅ Load environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/authDB";
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// ✅ Connect to MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));
const app = express();
const router = express.Router();
app.use(express.json());
app.use(cors());
app.use("/api", router);
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});


// ✅ User Model
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    bio: String,
    profilePic: String,
});

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", UserSchema);


// ✅ Multer Storage for Profile Pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure 'uploads/' folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Signup Route
app.post("/api/auth/signup", upload.single("profilePic"), async (req, res) => {
    const { username, email, password, bio } = req.body;

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already in use!" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user in the database
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        bio,
        profilePic: req.file ? req.file.path : null,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!", user: newUser });
});

// ✅ Login Route
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "User not found!" });
    }

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials!" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token, user });
});

// ✅ Profile Route (Protected)
app.get("/api/auth/profile", async (req, res) => {
    const { userId } = req.query;

    // ✅ Fetch user data
    const user = await User.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }

    res.json(user);
});

router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


const nodemailer = require("nodemailer");

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
