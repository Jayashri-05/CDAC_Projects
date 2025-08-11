import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageShelters.css';
import Navbar from "../components/Navbar";
import { FaHome, FaEnvelope, FaPhone, FaCheckCircle, FaTimesCircle, FaUserCheck, FaUserTimes } from "react-icons/fa";

const ManageShelters = () => {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("ManageShelters component mounted");
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      setLoading(true);
      console.log("Fetching shelters from database...");
      
      // Debug token
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token ? "Present" : "Missing");
      
      const response = await API.get("/users");
      console.log("Users response:", response.data);
      
      // Filter only shelters from all users
      const shelterUsers = response.data.filter(user => user.role === 'SHELTER');
      console.log("Shelters found:", shelterUsers.length);
      shelterUsers.forEach(shelter => {
        console.log(`- ${shelter.username} (${shelter.role})`);
      });
      
      setShelters(shelterUsers);
    } catch (err) {
      console.error("Failed to fetch shelters:", err);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      setError("Failed to load shelters from database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return status === "active" ? 
      <span className="badge bg-success">Active</span> : 
      <span className="badge bg-warning">Inactive</span>;
  };

  const handleEditShelter = (shelterId) => {
    navigate(`/dashboard/admin/edit-shelter/${shelterId}`);
  };

  const handleViewShelter = (shelterId) => {
    navigate(`/dashboard/admin/view-shelter/${shelterId}`);
  };

  const handleToggleShelterStatus = async (shelterId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await API.put(`/users/${shelterId}/status`, { status: newStatus });
      // Refresh the shelters list
      fetchShelters();
    } catch (err) {
      console.error("Failed to update shelter status:", err);
      alert("Failed to update shelter status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3 className="error-title">❌ Error</h3>
          <p className="error-message">{error}</p>
          <button className="refresh-btn" onClick={fetchShelters}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      color: '#fff',
      icon: <FaHome />,
      value: shelters.length,
      label: 'Total Shelters',
      description: 'All shelter accounts'
    },
    {
      color: '#fff',
      icon: <FaCheckCircle />,
      value: shelters.filter(s => s.status === 'active' || !s.status).length,
      label: 'Active Shelters',
      description: 'Active shelter accounts'
    },
    {
      color: '#fff',
      icon: <FaTimesCircle />,
      value: shelters.filter(s => s.status === 'inactive').length,
      label: 'Inactive Shelters',
      description: 'Inactive shelter accounts'
    },
    {
      color: '#fff',
      icon: <FaUserCheck />,
      value: shelters.filter(s => s.approved).length,
      label: 'Approved Shelters',
      description: 'Approved by admin'
    }
  ];

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', width: '100vw', background: '#F8F9FA', padding: 0, boxSizing: 'border-box' }}>
        <div className="container-fluid px-4" style={{ paddingTop: '2.5rem' }}>
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h1 className="fw-bold mb-2 letter-spacing-1 fs-2" style={{ letterSpacing: 1, color: '#2C3E50' }}>
                <FaHome style={{ marginRight: 6, verticalAlign: 'middle' }} /> Manage Shelters
              </h1>
              <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>View and manage all shelter accounts from database</p>
            </div>
            <button
              className="btn px-4 py-2 rounded-3 shadow-sm fw-bold"
              onClick={() => navigate('/dashboard/admin')}
              style={{
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
          {/* Stats Cards */}
          <div className="row g-4 mb-4 flex-nowrap overflow-auto justify-content-center" style={{ marginLeft: 0, marginRight: 0 }}>
            {stats.map((stat, idx) => (
              <div className="col-md-2 col-8" key={stat.label} style={{ minWidth: 200, maxWidth: 220 }}>
                <div
                  className="card shadow"
                  style={{
                    borderRadius: '20px',
                    background: '#FFFFFF',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    padding: '2rem',
                    minHeight: '280px',
                    maxWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.5rem',
                      color: '#F4EBD3',
                      background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)',
                      borderRadius: '16px',
                      padding: '1rem',
                      marginBottom: '1.5rem',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      width: 'fit-content',
                      margin: '0 auto 1.5rem auto'
                    }}
                  >
                    {stat.icon}
                  </div>
                  <h5 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: '500', color: '#fff', marginBottom: '0.5rem' }}>{stat.label}</h5>
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>{stat.value}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#fff', marginTop: '0.5rem', fontWeight: '400', lineHeight: '1.4', opacity: '0.8' }}>{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Shelters Table */}
          <div className="card shadow-lg" style={{ borderRadius: '20px', background: '#FFFFFF', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(108, 117, 125, 0.1)', marginBottom: '2.5rem', transition: 'all 0.3s ease' }}>
            <div className="card-header d-flex align-items-center justify-content-between rounded-top px-4 py-3" style={{ background: '#2C3E50', color: '#ffffff' }}>
              <h5 className="mb-0 fw-bold fs-4 letter-spacing-1"><FaHome style={{ marginRight: 6, verticalAlign: 'middle' }} /> Shelters from Database ({shelters.length})</h5>
              <button
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold"
                onClick={fetchShelters}
                title="Refresh"
                style={{ background: 'transparent', color: '#ffffff', border: '2px solid #ffffff' }}
              >
                &#x21bb; Refresh
              </button>
            </div>
            <div className="card-body p-0">
              {shelters.length === 0 ? (
                <div className="text-center py-5">
                  <h5 style={{ color: '#555879' }}>No shelters found in database</h5>
                  <p style={{ color: '#555879' }}>The database might not have any shelter accounts or there's a connection issue</p>
                  <button
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{ background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)', color: '#F4EBD3', border: 'none' }}
                    onClick={fetchShelters}
                  >
                    &#x21bb; Refresh
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead style={{ background: '#2C3E50', color: '#ffffff' }}>
                      <tr>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaHome style={{ marginRight: 6, verticalAlign: 'middle' }} /> Shelter</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaEnvelope style={{ marginRight: 6, verticalAlign: 'middle' }} /> Email</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaPhone style={{ marginRight: 6, verticalAlign: 'middle' }} /> Contact</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} /> Status</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaUserCheck style={{ marginRight: 6, verticalAlign: 'middle' }} /> Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shelters.map((shelter) => (
                        <tr key={shelter.id} style={{ background: '#fff' }}>
                          <td style={{ color: '#111' }}>
                            <div className="d-flex align-items-center">
                              <div className="shelter-avatar" style={{ background: '#FFD700', color: '#2C3E50', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                {shelter.username?.charAt(0).toUpperCase() || 'S'}
                              </div>
                              <div className="shelter-info">
                                <div className="shelter-name" style={{ color: '#111' }}>{shelter.fullName || shelter.username}</div>
                                <div className="shelter-username" style={{ color: '#555' }}>@{shelter.username}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>{shelter.email}</td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            {shelter.phone ? (
                              <span style={{ color: '#111' }}>{shelter.phone}</span>
                            ) : (
                              <span className="text-muted" style={{ color: '#555' }}>Not provided</span>
                            )}
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <span className={`status-badge ${shelter.status === 'active' || !shelter.status ? 'active' : 'inactive'}`} style={{ background: shelter.status === 'active' || !shelter.status ? '#28A745' : '#6C757D', color: '#fff' }}>
                              {shelter.status || 'active'}
                            </span>
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <span className={`status-badge ${shelter.approved ? 'approved' : 'pending'}`} style={{ background: shelter.approved ? '#FFD700' : '#FFC107', color: '#2C3E50' }}>
                              {shelter.approved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageShelters; 