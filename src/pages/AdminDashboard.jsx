// src/pages/AdminDashboard.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import { FaPaw, FaUserFriends, FaDog, FaBuilding, FaUserMd, FaBullhorn, FaEnvelope } from "react-icons/fa";

const AdminDashboard = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    root?.classList.add("fullwidth-page");
    return () => root?.classList.remove("fullwidth-page");
  }, []);

  const actions = [
    { label: "Manage Users", link: "/dashboard/admin/manage-users", icon: <FaUserFriends /> },
    { label: "Manage Pets", link: "/dashboard/admin/manage-pets", icon: <FaDog /> },
    { label: "Manage Shelters", link: "/dashboard/admin/manage-shelters", icon: <FaBuilding /> },
    { label: "Veterinarians", link: "/dashboard/admin/manage-vets", icon: <FaUserMd /> },
    { label: "Announcements", link: "/dashboard/admin/manage-announcements", icon: <FaBullhorn /> },
    { label: "Contact Messages", link: "/dashboard/admin/contact-messages", icon: <FaEnvelope /> },
  ];

  // Logo component with gradient styling
  const AdminLogo = () => (
    <div style={{
      background: 'var(--color-primary)',
      borderRadius: '50%',
      width: '110px',
      height: '110px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      boxShadow: '0 2px 10px rgba(244, 185, 66, 0.3)',
      flexDirection: 'row' // Make it horizontal
    }}>
      <span className="pet-icon" style={{ fontSize: '56px', color: '#2C3E50' }}>
        <FaPaw size={56} />
      </span>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-container">
        <div className="admin-card">
          <div className="admin-header">
            <AdminLogo />
            <h2 className="admin-title">
              Admin Dashboard
            </h2>
            <p className="admin-subtitle">Welcome back, Administrator</p>
          </div>

          <div className="admin-actions">
            {actions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="admin-action-btn"
              >
                <span className="admin-action-icon">{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/" className="admin-back-link">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
