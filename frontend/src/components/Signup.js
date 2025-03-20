import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        bio: "",
        profilePic: null
    });

    const [message, setMessage] = useState(""); // Store success/error messages
    const navigate = useNavigate();
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePic: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("bio", formData.bio);
        if (formData.profilePic) {
            formDataToSend.append("profilePic", formData.profilePic);
        }
    
        try {
            await axios.post(`http://localhost:5000/api/auth/signup`,
               formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage("Signup Successful! Check your email for OTP."); // ✅ Use setMessage
            navigate("/verify-otp"); // ✅ Redirect to OTP page
        } catch (error) {
            setMessage("Signup Failed. Try again."); // ✅ Use setMessage
            console.log("erroe" + error);


            
        }
    };
    
    

    return (
        <div className="signup-container">
      <h2 className="signup-title">Create an Account</h2>

      {message && <p className="signup-message">{message}</p>} {/* Display verification message */}

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Password"
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        <textarea
          name="bio"
          placeholder="Tell us about yourself..."
          onChange={handleChange}
          className="signup-textarea"
        ></textarea>

        <label className="file-upload">
          Upload Profile Picture
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="signup-file-input"
          />
        </label>

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
    );
};

export default Signup;
