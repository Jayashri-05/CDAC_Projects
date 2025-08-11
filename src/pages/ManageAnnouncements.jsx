import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import './ManageShelters.css';
import { showSuccessToast, showErrorToast, showConfirmToast } from '../utils/toast.jsx';
import { FaBullhorn, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaPlus, FaPause, FaTrash } from "react-icons/fa";

const ManageAnnouncements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("ManageAnnouncements component mounted");
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      console.log("Fetching announcements from database...");
      
      const response = await API.get("/announcements");
      console.log("Announcements response:", response.data);
      console.log("Announcements found:", response.data.length);
      
      setAnnouncements(response.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      setError("Failed to load announcements from database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    showConfirmToast("Are you sure you want to delete this announcement?", async () => {
      try {
        await API.delete(`/announcements/${announcementId}`);
        showSuccessToast("Announcement deleted successfully!");
        fetchAnnouncements(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete announcement:", err);
        showErrorToast("Failed to delete announcement. Please try again.");
      }
    });
  };

  const handleToggleStatus = async (announcementId) => {
    try {
      await API.put(`/announcements/${announcementId}/toggle`);
      showSuccessToast("Announcement status updated successfully!");
      fetchAnnouncements(); // Refresh the list
    } catch (err) {
      console.error("Failed to toggle announcement status:", err);
      showErrorToast("Failed to update announcement status. Please try again.");
    }
  };

  const stats = [
    {
      color: '#fff',
      icon: <FaBullhorn />,
      value: announcements.length,
      label: 'Total Announcements',
      description: 'All announcements in the database'
    },
    {
      color: '#fff',
      icon: <FaCheckCircle />,
      value: announcements.filter(a => a.active).length,
      label: 'Active',
      description: 'Active announcements'
    },
    {
      color: '#fff',
      icon: <FaTimesCircle />,
      value: announcements.filter(a => !a.active).length,
      label: 'Inactive',
      description: 'Inactive announcements'
    },
    {
      color: '#fff',
      icon: <FaInfoCircle />,
      value: announcements.filter(a => a.type === 'info').length,
      label: 'Info',
      description: 'Info type announcements'
    }
  ];
  const getTypeBadge = (type) => {
    const typeConfig = {
      info: { class: 'bg-info', icon: <FaInfoCircle /> },
      success: { class: 'bg-success', icon: <FaCheckCircle /> },
      warning: { class: 'bg-warning', icon: <FaPause /> },
      danger: { class: 'bg-danger', icon: <FaTimesCircle /> }
    };
    const config = typeConfig[type] || typeConfig.info;
    return (
      <span className={`badge ${config.class} text-white`}>
        {config.icon} {type.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
          <button className="refresh-btn" onClick={fetchAnnouncements}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', width: '100vw', background: '#F8F9FA', padding: 0, boxSizing: 'border-box' }}>
        <div className="container-fluid px-4" style={{ paddingTop: '2.5rem' }}>
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h1 className="fw-bold mb-2 letter-spacing-1 fs-2" style={{ letterSpacing: 1, color: '#2C3E50' }}>
                <FaBullhorn style={{ marginRight: 6, verticalAlign: 'middle' }} /> Manage Announcements
              </h1>
              <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>View and manage all announcements from database</p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn px-4 py-2 rounded-3 shadow-sm fw-bold"
                onClick={() => navigate('/dashboard/admin/create-announcement')}
                style={{
                  letterSpacing: '1px',
                  background: 'linear-gradient(135deg, #28A745 0%, #F4B942 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                <FaPlus style={{ marginRight: 6, verticalAlign: 'middle' }} /> Create New
              </button>
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
          {/* Announcements Table */}
          <div className="card shadow-lg" style={{ borderRadius: '20px', background: '#FFFFFF', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(108, 117, 125, 0.1)', marginBottom: '2.5rem', transition: 'all 0.3s ease' }}>
            <div className="card-header d-flex align-items-center justify-content-between rounded-top px-4 py-3" style={{ background: '#2C3E50', color: '#ffffff' }}>
              <h5 className="mb-0 fw-bold fs-4 letter-spacing-1"><FaBullhorn style={{ marginRight: 6, verticalAlign: 'middle' }} /> Announcements from Database ({announcements.length})</h5>
              <button
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold"
                onClick={fetchAnnouncements}
                title="Refresh"
                style={{ background: 'transparent', color: '#ffffff', border: '2px solid #ffffff' }}
              >
                &#x21bb; Refresh
              </button>
            </div>
            <div className="card-body p-0">
              {announcements.length === 0 ? (
                <div className="text-center py-5">
                  <h5 style={{ color: '#555879' }}>No announcements found in database</h5>
                  <p style={{ color: '#555879' }}>The database might not have any announcements or there's a connection issue</p>
                  <button
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{ background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)', color: '#F4EBD3', border: 'none' }}
                    onClick={fetchAnnouncements}
                  >
                    &#x21bb; Refresh
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead style={{ background: '#2C3E50', color: '#ffffff' }}>
                      <tr>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}>Title</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}>Content</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}>Type</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}>Status</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}>Created</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {announcements.map((announcement) => (
                        <tr key={announcement.id}>
                          <td style={{ textAlign: 'center' }}>
                            <div className="fw-semibold">{announcement.title}</div>
                            <small className="text-muted">
                              by {announcement.createdBy?.username || 'Unknown'}
                            </small>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="text-truncate" style={{ maxWidth: '200px', margin: '0 auto' }}>
                              {announcement.content}
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>{getTypeBadge(announcement.type)}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`status-badge ${announcement.active ? 'active' : 'inactive'}`}>{announcement.active ? 'Active' : 'Inactive'}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <small>{formatDate(announcement.createdAt)}</small>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="action-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                              <button
                                className={`action-btn toggle ${announcement.active ? '' : 'inactive'}`}
                                onClick={() => handleToggleStatus(announcement.id)}
                                title={announcement.active ? 'Deactivate' : 'Activate'}
                              >
                                {announcement.active ? <FaPause /> : <FaCheckCircle />}
                              </button>
                              <button
                                className="action-btn edit"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                title="Delete Announcement"
                              >
                                <FaTrash />
                              </button>
                            </div>
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

export default ManageAnnouncements; 