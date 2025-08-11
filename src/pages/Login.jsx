import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAlert } from "../context/AlertContext";
import { FaPaw, FaEnvelope, FaLock, FaRocket, FaInfoCircle, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import { showSuccessToast, showErrorToast } from '../utils/toast.jsx';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) rootElement.classList.add('fullwidth-page');
    return () => {
      if (rootElement) rootElement.classList.remove('fullwidth-page');
    };
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, role, userId } = res.data;
      if (!token || !role) throw new Error("Invalid response");

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      const normalizedRole = role.toLowerCase();
      localStorage.setItem("role", normalizedRole);

      // Fetch user details for name/email
      let userName = "";
      try {
        const userRes = await API.get(`/users/${userId}`);
        const { username, fullName, email: userEmail } = userRes.data;
        if (fullName) {
          userName = fullName;
          localStorage.setItem("userName", fullName);
        } else if (username) {
          userName = username;
          localStorage.setItem("userName", username);
        } else if (userEmail) {
          userName = userEmail;
          localStorage.setItem("email", userEmail);
        }
      } catch (userErr) {
        // fallback: store login email
        userName = email;
        localStorage.setItem("email", email);
      }

      // Show success alert with user name and role
      const roleDisplayNames = {
        admin: "Administrator",
        vet: "Veterinarian", 
        shelter: "Shelter Manager",
        user: "User"
      };
      
      showSuccessToast(`Welcome back, ${userName}! You are logged in as ${roleDisplayNames[normalizedRole] || 'User'}`);

      // Navigate after a short delay to show the alert
      setTimeout(() => {
        const redirectTo = location.state?.redirectTo;
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else {
          const routeMap = {
            admin: "/dashboard/admin",
            vet: "/dashboard/vet",
            shelter: "/dashboard/shelter",
            user: "/dashboard/user"
          };
          navigate(routeMap[normalizedRole] || "/dashboard/user", { replace: true });
        }
      }, 1500);

    } catch (err) {
      showErrorToast("Invalid credentials or server error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <div className="login-header">
              <div className="logo-icon">
                <FaPaw size={48} />
              </div>
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to your Pet Adoption Portal</p>
              {message && (
                <div className="message-alert">
                  <span className="alert-icon">
                    <FaInfoCircle />
                  </span>
                  {message}
                </div>
              )}
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="forgot-password-link">
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="button-icon">
                      <FaRocket />
                    </span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p className="footer-text">
                Don't have an account?{" "}
                <Link to="/register" className="footer-link">
                  Register here
                </Link>
              </p>
            </div>

            <div className="security-note">
              <span className="security-icon">
                <FaShieldAlt />
              </span>
              <span>Your information is secure</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
