import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);

    // 🚀 Redirect logged-in users away from login page
    useEffect(() => {
        if (user) {
            navigate("/profile"); // Redirect to home if user is already logged in
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
      e.preventDefault();
  
      // Validate input
      if (!email || !password) {
          alert("Email and Password are required.");
          return; // Stop execution if validation fails
      }
  
      try {
          const res = await axios.post(`http://localhost:5000/api/auth/login`, { 
              email, 
              password 
          });
  
          console.log("Login Success:", res.data); // Log response to debug
          alert(res.data.message); // Assuming the response has a message
  
          // Update AuthContext with token and userId
          login({ token: res.data.token, userId: res.data.user._id });
  
          // Redirect user to home page
          navigate("/");
  
      } catch (error) {
          // Enhanced error handling
          if (error.response) {
              console.error('Backend Error:', error.response.data); // Log backend error details
              alert(error.response?.data?.error || "Login failed!");
          } else if (error.request) {
              console.error('Request Error:', error.request); // Log request error (e.g., network issues)
              alert("No response from server, please try again later.");
          } else {
              console.error('Error Message:', error.message); // Log general error message
              alert("An unexpected error occurred. Please try again.");
          }
      }
  };
  
    return (
        <div className="login-container">
        <h2 className="login-title">Login</h2>
  
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          
          <button type="submit" className="login-button">Login</button>
        </form>
  
        <p className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    );
};

export default Login;

