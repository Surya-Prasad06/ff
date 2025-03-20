require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.error("Nodemailer Transport Error:", error);
    } else {
        console.log("Nodemailer Transport is ready.");
    }
});

module.exports = transporter;