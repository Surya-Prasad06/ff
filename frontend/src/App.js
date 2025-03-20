import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyOTP from "./components/VerifyOTP";
import ProtectedAuth from "./context/ProtectedAuth";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> <br />
        <Routes>
          <Route
            path="/profile"
            element={
              <ProtectedAuth>
                <Profile />
              </ProtectedAuth>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
