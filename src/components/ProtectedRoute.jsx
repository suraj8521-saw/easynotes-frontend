import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Debugging ke liye (Browser console mein check karna F12 daba kar)
  console.log("Checking Token in ProtectedRoute:", token);

  if (!token) {
    // Agar token nahi mila toh login par bhejo
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;