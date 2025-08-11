import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPaw, FaLock, FaEdit, FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FiGrid } from "react-icons/fi";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../hooks/useAuth";
import "./navbar.css";
import { showInfoToast } from '../utils/toast.jsx';
import { useState } from "react";

export default function Navbar({ darkMode, setDarkMode }) {
    const { userName, isLoggedIn, userRole, logout } = useAuth();
    const { showInfoAlert } = useAlert();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Debug logging
    console.log("Navbar render - isLoggedIn:", isLoggedIn, "userRole:", userRole, "userName:", userName);

    const handleLogout = () => {
        const currentUserName = userName;
        
        logout();
        
        // Show logout alert with user name
        showInfoToast(`Goodbye, ${currentUserName}! You have been logged out successfully.`);
        
        // Navigate after showing the alert
        setTimeout(() => {
            navigate("/login");
        }, 1500);
    };

    const getDashboardPath = () => {
        switch (userRole) {
            case "admin":
                return "/dashboard/admin";
            case "user":
                return "/dashboard/user";
            case "shelter":
                return "/dashboard/shelter";
            case "vet":
                return "/dashboard/vet";
            default:
                return "/dashboard";
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <div className="logo-icon">
                        <span className="pet-icon">
                            <FaPaw size={24} />
                        </span>
                    </div>
                    <span className="logo-text">AdoptoCare</span>
                </div>
                
                {/* Hamburger Menu Button */}
                <button 
                    className="hamburger-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`navbar-links ${isMenuOpen ? 'menu-open' : ''}`}>
                    {/* Only show navigation links if user is not logged in or is not a shelter */}
                    {(!isLoggedIn || userRole !== 'shelter') && (
                        <>
                            <NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)} end>Home</NavLink>
                            <NavLink to="/about-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>About Us</NavLink>
                            <NavLink to="/gallery" className="nav-link" onClick={() => setIsMenuOpen(false)}>Gallery</NavLink>
                            <NavLink to="/contact-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact Us</NavLink>
                        </>
                    )}
                    {isLoggedIn && (
                        <Link to={getDashboardPath()} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <FiGrid style={{ fontSize: '1rem', marginRight: '0.3rem' }} />
                            Dashboard
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <div className="user-info-logout">
                            <span className="user-info">
                                <FaUserCircle style={{ fontSize: '1.5rem' }} />
                                {userName}
                            </span>
                            <button
                                className="logout-btn"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                title="Logout"
                            >
                                <FiLogOut style={{ fontSize: '1.2rem' }} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-btn login-btn" onClick={() => setIsMenuOpen(false)}>
                                <span className="btn-icon">
                                    <FaLock />
                                </span>
                                <span className="btn-text">Login</span>
                            </Link>
                            <Link to="/register" className="auth-btn register-btn" onClick={() => setIsMenuOpen(false)}>
                                <span className="btn-icon">
                                    <FaEdit />
                                </span>
                                <span className="btn-text">Register</span>
                            </Link>
                            {typeof darkMode !== 'undefined' && typeof setDarkMode === 'function' && (
                                <button
                                    className="darkmode-toggle-btn"
                                    onClick={() => {
                                        setDarkMode(!darkMode);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    {darkMode ? (
                                        <>
                                            <FaMoon className="me-1" />
                                            Dark
                                        </>
                                    ) : (
                                        <>
                                            <FaSun className="me-1" />
                                            Light
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
