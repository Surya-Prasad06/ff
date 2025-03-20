const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profilePic: { type: String },
    isVerified: { type: Boolean, default: false }, // ✅ Track email verification status
    otp: { type: String }, // ✅ Store OTP
    otpExpires: { type: Date }, // ✅ Expiry time for OTP
});

module.exports = mongoose.model("User", UserSchema);
