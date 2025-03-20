import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate(); // ✅ Import useNavigate

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
            setMessage(response.data.message);
            setError("");
            alert("OTP Verified Successfully! Redirecting to login...");
            navigate("/login"); // ✅ Redirect to Login after successful OTP verification
        } catch (err) {
            setError(err.response?.data?.error || "OTP verification failed");
            setMessage("");
        }
    };

    const handleResendOTP = async () => {
        if (!email) {
            setError("Please enter your email first!");
            return;
        }

        setIsResending(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/resend-otp`, { email });
            setMessage(response.data.message);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to resend OTP");
        }
        setIsResending(false);
    };

    return (
        <div className="verify-container">
        <h2 className="verify-heading">Verify Your Email</h2>
    
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
    
        <form onSubmit={handleVerify} className="verify-form">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
            />
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="input-field"
            />
            <button type="submit" className="verify-button">Verify OTP</button>
        </form>
    
        <button onClick={handleResendOTP} disabled={isResending} className="resend-button">
            {isResending ? "Resending..." : "Resend OTP"}
        </button>
    </div>
    
    );
};

export default VerifyOTP;
