import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedAuth = ({ children }) => {
  const { user } = useContext(AuthContext); // ✅ Ensure context is used correctly

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedAuth;

