import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageVets.css';
import { FaUserMd, FaEnvelope, FaPhone, FaCheckCircle, FaTimesCircle, FaUserCheck } from "react-icons/fa";

const ManageVets = () => {
  const navigate = useNavigate();
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("ManageVets component mounted");
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      setLoading(true);
      console.log("Fetching veterinarians from database...");
      
      // Debug token
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token ? "Present" : "Missing");
      
      const response = await API.get("/users");
      console.log("Users response:", response.data);
      
      // Filter only veterinarians from all users
      const vetUsers = response.data.filter(user => user.role === 'VET');
      console.log("Veterinarians found:", vetUsers.length);
      vetUsers.forEach(vet => {
        console.log(`- ${vet.username} (${vet.role})`);
      });
      
      setVets(vetUsers);
    } catch (err) {
      console.error("Failed to fetch veterinarians:", err);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      setError("Failed to load veterinarians from database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return status === "active" ? 
      <span className="badge bg-success">Active</span> : 
      <span className="badge bg-warning">Inactive</span>;
  };

  const handleEditVet = (vetId) => {
    navigate(`/dashboard/admin/edit-vet/${vetId}`);
  };

  const handleViewVet = (vetId) => {
    navigate(`/dashboard/admin/view-vet/${vetId}`);
  };

  const handleToggleVetStatus = async (vetId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await API.put(`/users/${vetId}/status`, { status: newStatus });
      // Refresh the vets list
      fetchVets();
    } catch (err) {
      console.error("Failed to update vet status:", err);
      alert("Failed to update vet status. Please try again.");
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
          <button className="refresh-btn" onClick={fetchVets}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      color: '#fff',
      icon: <FaUserMd />,
      value: vets.length,
      label: 'Total Veterinarians',
      description: 'All veterinarian accounts'
    },
    {
      color: '#fff',
      icon: <FaCheckCircle />,
      value: vets.filter(v => v.status === 'active' || !v.status).length,
      label: 'Active Vets',
      description: 'Active veterinarian accounts'
    },
    {
      color: '#fff',
      icon: <FaTimesCircle />,
      value: vets.filter(v => v.status === 'inactive').length,
      label: 'Inactive Vets',
      description: 'Inactive veterinarian accounts'
    },
    {
      color: '#fff',
      icon: <FaUserCheck />,
      value: vets.filter(v => v.approved).length,
      label: 'Approved Vets',
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
                <FaUserMd style={{ marginRight: 6, verticalAlign: 'middle' }} /> Manage Veterinarians
              </h1>
              <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>View and manage all veterinarian accounts from database</p>
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
              <div className="col-md-2 col-8" key={stat.label} style={{ minWidth: 220, maxWidth: 220, flex: '0 0 220px' }}>
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
                    maxHeight: '320px',
                    height: '100%',
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
          {/* Vets Table */}
          <div className="card shadow-lg" style={{ borderRadius: '20px', background: '#FFFFFF', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(108, 117, 125, 0.1)', marginBottom: '2.5rem', transition: 'all 0.3s ease' }}>
            <div className="card-header d-flex align-items-center justify-content-between rounded-top px-4 py-3" style={{ background: '#2C3E50', color: '#ffffff' }}>
              <h5 className="mb-0 fw-bold fs-4 letter-spacing-1"><FaUserMd style={{ marginRight: 6, verticalAlign: 'middle' }} /> Veterinarians from Database ({vets.length})</h5>
              <button
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold"
                onClick={fetchVets}
                title="Refresh"
                style={{ background: 'transparent', color: '#ffffff', border: '2px solid #ffffff' }}
              >
                &#x21bb; Refresh
              </button>
            </div>
            <div className="card-body p-0">
              {vets.length === 0 ? (
                <div className="text-center py-5">
                  <h5 style={{ color: '#555879' }}>No veterinarians found in database</h5>
                  <p style={{ color: '#555879' }}>The database might not have any veterinarian accounts or there's a connection issue</p>
                  <button
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{ background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)', color: '#F4EBD3', border: 'none' }}
                    onClick={fetchVets}
                  >
                    &#x21bb; Refresh
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead style={{ background: '#2C3E50', color: '#ffffff' }}>
                      <tr>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaUserMd style={{ marginRight: 6, verticalAlign: 'middle' }} /> Veterinarian</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaEnvelope style={{ marginRight: 6, verticalAlign: 'middle' }} /> Email</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaPhone style={{ marginRight: 6, verticalAlign: 'middle' }} /> Contact</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} /> Status</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaUserCheck style={{ marginRight: 6, verticalAlign: 'middle' }} /> Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vets.map((vet) => (
                        <tr key={vet.id} style={{ background: '#fff' }}>
                          <td style={{ color: '#111' }}>
                            <div className="d-flex align-items-center">
                              <div className="vet-avatar" style={{ background: '#FFD700', color: '#2C3E50', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                {vet.username?.charAt(0).toUpperCase() || 'V'}
                              </div>
                              <div className="vet-info">
                                <div className="vet-name" style={{ color: '#111' }}>{vet.fullName || vet.username}</div>
                                <div className="vet-username" style={{ color: '#555' }}>@{vet.username}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>{vet.email}</td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            {vet.phone ? (
                              <span style={{ color: '#111' }}>{vet.phone}</span>
                            ) : (
                              <span className="text-muted" style={{ color: '#555' }}>Not provided</span>
                            )}
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <span className={`status-badge ${vet.status === 'active' || !vet.status ? 'active' : 'inactive'}`} style={{ background: vet.status === 'active' || !vet.status ? '#28A745' : '#6C757D', color: '#fff' }}>
                              {vet.status || 'active'}
                            </span>
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <span className={`status-badge ${vet.approved ? 'approved' : 'pending'}`} style={{ background: vet.approved ? '#FFD700' : '#FFC107', color: '#2C3E50' }}>
                              {vet.approved ? 'Approved' : 'Pending'}
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

export default ManageVets; 