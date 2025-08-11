import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [userName, setUserName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [token, setToken] = useState("");

    const updateAuthState = () => {
        const currentToken = localStorage.getItem("token");
        const storedUserName = localStorage.getItem("userName") || localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        
        const newIsLoggedIn = !!currentToken;
        
        // Only log if there's a change in login state
        if (newIsLoggedIn !== isLoggedIn) {
            console.log("Auth state change detected:", {
                wasLoggedIn: isLoggedIn,
                nowLoggedIn: newIsLoggedIn,
                token: currentToken ? "present" : "missing",
                userName: storedUserName,
                role: storedRole
            });
        }
        
        setToken(currentToken || "");
        setUserName(storedUserName || "");
        setIsLoggedIn(newIsLoggedIn);
        setUserRole(storedRole || "");
    };

    const logout = () => {
        console.log("Logout called - clearing localStorage");
        localStorage.clear();
        setToken("");
        setUserName("");
        setIsLoggedIn(false);
        setUserRole("");
    };

    const login = (userData) => {
        console.log("Login called with userData:", userData);
        if (userData.token) {
            localStorage.setItem("token", userData.token);
        }
        if (userData.userName) {
            localStorage.setItem("userName", userData.userName);
        }
        if (userData.email) {
            localStorage.setItem("email", userData.email);
        }
        if (userData.role) {
            localStorage.setItem("role", userData.role);
        }
        updateAuthState();
    };

    useEffect(() => {
        // Initial state update
        updateAuthState();

        // Listen for storage events (when localStorage changes in other tabs)
        const handleStorageChange = (e) => {
            if (e.key === "token" || e.key === "userName" || e.key === "email" || e.key === "role") {
                console.log("Storage event detected:", e.key, e.newValue);
                updateAuthState();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // Cleanup
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return {
        userName,
        isLoggedIn,
        userRole,
        token,
        updateAuthState,
        logout,
        login
    };
}; 