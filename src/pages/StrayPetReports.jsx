import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import './StrayPetReports.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const StrayPetReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, high, medium, low

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // API endpoint for fetching stray pet reports
      const response = await fetch('http://localhost:8080/api/stray-pet-reports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        console.error('Failed to fetch reports:', response.status, response.statusText);
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      try {
        const response = await fetch(`http://localhost:8080/api/stray-pet-reports/${reportId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setReports(prev => prev.filter(report => report.id !== reportId));
          alert("Report deleted successfully!");
        } else {
          const error = await response.json();
          alert(`Failed to delete report: ${error.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting report:', error);
        alert("Failed to delete report. Please try again.");
      }
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      case 'low': return 'urgency-low';
      default: return 'urgency-medium';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'status-pending';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.urgency === filter;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="text-center">
            <div className="spinner-border loading-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="loading-text">Loading stray pet reports...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="stray-pet-reports-container">
        <div className="container">
          {/* Header */}
          <div className="stray-pet-reports-header">
            <div>
              <h2 className="stray-pet-reports-title">🐾 Stray Pet Reports</h2>
              <p className="stray-pet-reports-subtitle">Reports from concerned citizens about pets in need</p>
            </div>
            <button 
              className="btn-back-dashboard"
              onClick={() => navigate('/dashboard/shelter')}
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <div className="filter-card">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="filter-label">Filter by urgency:</span>
                    <div className="filter-buttons">
                      <button
                        type="button"
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
                        onClick={() => setFilter('high')}
                      >
                        High
                      </button>
                      <button
                        type="button"
                        className={`filter-btn ${filter === 'medium' ? 'active' : ''}`}
                        onClick={() => setFilter('medium')}
                      >
                        Medium
                      </button>
                      <button
                        type="button"
                        className={`filter-btn ${filter === 'low' ? 'active' : ''}`}
                        onClick={() => setFilter('low')}
                      >
                        Low
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="row">
            <div className="col-12">
              {filteredReports.length === 0 ? (
                <div className="no-reports-found">
                  <h4>No reports found</h4>
                  <p>There are no stray pet reports matching your filter.</p>
                </div>
              ) : (
                <div className="reports-grid">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="report-card">
                      {/* Photo Section - First */}
                      <div className="report-photo-section">
                        {report.photoUrl ? (
                          <div className="report-photo-container">
                            <img 
                              src={`http://localhost:8080/api/stray-pet-reports/photo/${report.photoUrl.includes('/') ? report.photoUrl.split('/').pop() : report.photoUrl}`}
                              alt={`${report.petType} photo`}
                              className="report-photo"
                              onError={(e) => {
                                console.log("Photo failed to load:", report.photoUrl);
                                if (!e.target.dataset.fallbackTried) {
                                  e.target.dataset.fallbackTried = 'true';
                                  e.target.src = `http://localhost:8080/uploads/stray-pets/${report.photoUrl.includes('/') ? report.photoUrl.split('/').pop() : report.photoUrl}`;
                                } else {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }
                              }}
                            />
                            <div className="photo-error" style={{display: 'none'}}>
                              <div className="photo-placeholder">
                                <span className="photo-icon">📷</span>
                                <p>No photo</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="photo-error">
                            <div className="photo-placeholder">
                              <span className="photo-icon">📷</span>
                              <p>No photo available</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Header Section - After Photo */}
                      <div className="report-header">
                        <h5 className="report-title">
                          {report.petType.charAt(0).toUpperCase() + report.petType.slice(1)} Report #{report.id}
                        </h5>
                        <p className="report-subtitle">
                          Reported on {formatDate(report.timestamp)}
                        </p>
                        <div className="report-badges">
                          <span className={`urgency-badge ${getUrgencyColor(report.urgency)}`}>
                            {report.urgency} URGENCY
                          </span>
                          <span className={`status-badge ${getStatusColor(report.status)}`}>
                            {report.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="report-info-section">
                        <div className="detail-section">
                          <div className="detail-section-title">Description:</div>
                          <div className="detail-item">{report.description}</div>
                        </div>

                        <div className="detail-section">
                          <div className="detail-section-title">Location:</div>
                          <div className="detail-item">{report.location}</div>
                        </div>

                        <div className="detail-section">
                          <div className="detail-section-title">Contact:</div>
                          <div className="detail-item">{report.contactPhone || 'No phone provided'}</div>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="report-actions-section">
                        <div className="action-buttons">
                          <button 
                            className="action-btn btn-delete"
                            onClick={() => handleDeleteReport(report.id)}
                            title="Delete this report"
                          >
                            🗑️ Delete Report
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StrayPetReports; 