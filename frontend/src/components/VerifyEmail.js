import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Verifying...");

    useEffect(() => {
        console.log("Received Token from URL:", token); // Debugging
    
        const verifyEmail = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
                console.log("Verification Response:", res.data); // Debugging
                setMessage(res.data.message);
                setTimeout(() => navigate("/login"), 3000);
            } catch (error) {
                console.error("Error verifying email:", error);
                setMessage(error.response?.data?.error || "Invalid or expired token!");
            }
        };
    
        verifyEmail();
    }, [token, navigate]);
    

    return (
        <div>
            <h2>Email Verification</h2>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;
