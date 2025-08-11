import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaUserMd, FaClipboardList, FaExclamationTriangle, FaEnvelope, FaEdit, FaList } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const VetDashboard = () => {
  const navigate = useNavigate();
  const [emergencyCases, setEmergencyCases] = useState([]);
  const [allAppointmentRequests, setAllAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Check for dashboard refresh flag
  useEffect(() => {
    const checkForRefresh = () => {
      const refreshNeeded = localStorage.getItem('dashboardRefreshNeeded');
      if (refreshNeeded === 'true') {
        localStorage.removeItem('dashboardRefreshNeeded');
        fetchDashboardData();
      }
    };

    // Check immediately
    checkForRefresh();

    // Set up interval to check periodically
    const interval = setInterval(checkForRefresh, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const appointmentRequestsResponse = await API.get("/appointment-requests");

      const appointmentRequests = appointmentRequestsResponse.data;

      // Calculate emergency cases (appointment requests with emergency flag)
      console.log("[DEBUG] All appointment requests:", appointmentRequests);
      console.log("[DEBUG] Appointment requests with isEmergency field:", appointmentRequests.filter(req => req.hasOwnProperty('isEmergency')));
      
      const emergencyCasesList = appointmentRequests.filter(req => req.isEmergency === true);
      console.log("[DEBUG] Emergency cases list:", emergencyCasesList);

      setAllAppointmentRequests(appointmentRequests);
      setEmergencyCases(emergencyCasesList);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh dashboard data (can be called from child components)
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  const stats = [
    {
      label: "Appointment Requests",
      value: loading ? "Loading..." : `${allAppointmentRequests.filter(req => req.status === 'pending').length}`,
      icon: <FaClipboardList />,
      color: "#555879",
      change: "Pending",
      description: "Review user appointment requests"
    },
    {
      label: "Emergency Cases",
      value: loading ? "Loading..." : `${emergencyCases.filter(req => req.status === 'pending').length}`,
      icon: <FaExclamationTriangle />,
      color: "#dc3545",
      change: "Urgent",
      description: "View urgent cases requiring immediate attention"
    },
    {
      label: "Send Health Record",
      value: "Create",
      icon: <FaEnvelope />,
      color: "#ffc107",
      change: "New",
      description: "Send a health record to a pet adopter"
    },
    {
      label: "Create Blog Post",
      value: "Write",
      icon: <FaEdit />,
      color: "#28a745",
      change: "Share",
      description: "Share tips and stories with the community"
    },
    {
      label: "Manage Blog Posts",
      value: "View",
      icon: <FaList />,
      color: "#6f42c1",
      change: "Manage",
      description: "View and delete your blog posts"
    }
  ];

  const handleCardClick = async (label) => {
    if (label === "Appointment Requests") {
      navigate("/dashboard/vet/appointment-requests");
    } else if (label === "Emergency Cases") {
      navigate("/dashboard/vet/emergency-cases");
    } else if (label === "Send Health Record") {
      navigate("/dashboard/vet/send-health-record");
    } else if (label === "Create Blog Post") {
      navigate("/dashboard/vet/create-blog");
    } else if (label === "Manage Blog Posts") {
      navigate("/dashboard/vet/manage-blogs");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ 
        minHeight: '100vh',
        background: '#F8F9FA'
      }}>
        <div className="spinner-border" style={{ color: '#2C3E50' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#F8F9FA',
        padding: '2rem',
        boxSizing: 'border-box',
      }}>
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5" style={{ color: '#2C3E50' }}>
              <FaUserMd style={{ marginRight: 10, verticalAlign: 'middle' }} /> Veterinarian Dashboard
            </h2>
            <p className="fs-5" style={{ color: '#6C757D' }}>Manage patient care, appointments, and medical records effectively.</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Stats Cards - 3x3 Grid Layout */}
          <div className="dashboard-section">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row g-4">
                  {stats.map((stat, idx) => (
                    <div className="col-md-4" key={idx}>
                      <div
                        className="dashboard-card stats-card fade-in"
                        style={{ 
                          animationDelay: `${idx * 0.2}s`,
                          background: '#FFFFFF !important',
                          border: '1px solid rgba(108, 117, 125, 0.1)',
                          borderRadius: '20px',
                          padding: '2rem',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          height: '100%',
                          marginBottom: '1.5rem',
                          textAlign: 'center',
                          minHeight: '280px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}
                        onClick={() => handleCardClick(stat.label)}
                      >
                        <div 
                          className="stats-icon"
                          style={{
                            fontSize: '2.5rem',
                            color: '#FFFFFF',
                            background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                            borderRadius: '16px',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            display: 'inline-block'
                          }}
                        >
                          {stat.icon}
                        </div>
                        <h5 className="stats-label" style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: '#2C3E50',
                          marginBottom: '0.5rem'
                        }}>
                          {stat.label}
                        </h5>
                        <h3 className="stats-value" style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '2.5rem',
                          fontWeight: '700',
                          color: '#555879',
                          marginBottom: '0.5rem',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                          {stat.value}
                        </h3>
                        <span className="stats-change" style={{
                          background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)',
                          color: '#F4EBD3',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          boxShadow: '0 2px 8px rgba(85, 88, 121, 0.3)',
                          marginBottom: '1rem',
                          display: 'inline-block'
                        }}>
                          {stat.change}
                        </span>
                        <p className="stats-description" style={{
                          fontSize: '0.875rem',
                          color: '#555879',
                          marginTop: '0.5rem',
                          fontWeight: '400',
                          lineHeight: '1.4',
                          opacity: '0.8'
                        }}>
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VetDashboard;
