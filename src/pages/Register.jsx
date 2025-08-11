import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaPaw, FaUser, FaEnvelope, FaLock, FaCheck, FaRocket, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';
import { showSuccessToast, showErrorToast } from '../utils/toast.jsx';

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.getElementById('root');
    root?.classList.add('fullwidth-page');
    return () => root?.classList.remove('fullwidth-page');
  }, []);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 2) {
          error = "Full name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "Full name can only contain letters and spaces";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          error = "Password must contain at least one special character (@$!%*?&)";
        }
        break;
        
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'role') { // Skip role validation
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorToast("Please fix the errors in the form.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/register", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        fullName: formData.name
      });

      showSuccessToast("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (
        err.response?.data?.message?.toLowerCase().includes('already') ||
        err.response?.data?.message?.toLowerCase().includes('exist')
      ) {
        showErrorToast('User already registered.');
      } else {
        showErrorToast(err.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="register-page">
        <div className="register-container">
          <div className="register-box">
            <div className="register-header">
              <div className="logo-icon">
                <FaPaw size={48} />
              </div>
              <h1 className="register-title">Join Our Community</h1>
              <p className="register-subtitle">Create your Pet Adoption account</p>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              {/* Removed Account Type dropdown, always register as Pet Lover */}

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a strong password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>

              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaCheck />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Re-enter your password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    <span className="button-icon">
                      <FaRocket />
                    </span>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="register-footer">
              <p className="footer-text">
                Already have an account?{" "}
                <Link to="/login" className="footer-link">
                  Login here
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
