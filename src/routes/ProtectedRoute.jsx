// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

export default ProtectedRoute;
