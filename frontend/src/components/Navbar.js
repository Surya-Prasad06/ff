import "./All.css"
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); // ✅ Use user state correctly
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // ✅ Calls context logout function
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          My Website <br />
        </Link>
        

        <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Menu"}
        </button>

        <ul className={`nav-links ${isOpen ? "show" : ""}`}>
          {user ? (
            <>
              
              <li>
                <Link to="/profile" className="nav-item">Profile</Link>
              </li>
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-item">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="nav-item">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
