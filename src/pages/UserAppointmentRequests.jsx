import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaHospitalAlt, FaClipboardList, FaClock, FaCheckCircle, FaExclamationTriangle, FaEye, FaPlus } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserAppointmentRequests = () => {
  const navigate = useNavigate();
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchUserAppointmentRequests();
  }, []);

  const fetchUserAppointmentRequests = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await API.get(`/appointment-requests/user/${userId}`);
      setAppointmentRequests(response.data);
    } catch (err) {
      console.error("Error fetching appointment requests:", err);
      setError("Failed to load appointment requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger',
      completed: 'bg-secondary'
    };
    return `badge ${statusColors[status] || 'bg-secondary'}`;
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyColors = {
      low: 'bg-success',
      medium: 'bg-warning',
      high: 'bg-danger',
      emergency: 'bg-danger'
    };
    return `badge ${urgencyColors[urgency] || 'bg-secondary'}`;
  };

  // White Color Scheme styles
  const pageBg = {
    minHeight: '100vh',
    width: '100vw',
    background: '#F8F9FA',
    padding: '0',
    boxSizing: 'border-box',
  };
  
  const cardStyle = {
    borderRadius: '20px',
    background: '#FFFFFF',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(108, 117, 125, 0.1)',
    marginBottom: '2.5rem',
    transition: 'all 0.3s ease',
  };
  
  const statCard = {
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(108, 117, 125, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    padding: '1.7rem 1.2rem',
    background: '#FFFFFF',
    marginBottom: '1rem',
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
    minWidth: 170,
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const cardBodyStyle = {
    background: '#FFFFFF',
    borderRadius: '0 0 20px 20px',
    padding: '2.5rem 1.5rem',
    minHeight: 300,
  };
  
  const tableRowHover = {
    transition: 'background 0.2s',
    cursor: 'pointer',
  };
  
  const iconStyle = { marginRight: 6, verticalAlign: 'middle' };

  const stats = [
    {
      color: '#fff',
      icon: <FaClipboardList />,
      value: appointmentRequests.length,
      label: 'Total Requests',
      description: 'All appointment requests'
    },
    {
      color: '#fff',
      icon: <FaClock />,
      value: appointmentRequests.filter(req => req.status === 'pending').length,
      label: 'Pending',
      description: 'Awaiting response'
    },
    {
      color: '#fff',
      icon: <FaCheckCircle />,
      value: appointmentRequests.filter(req => req.status === 'approved').length,
      label: 'Approved',
      description: 'Confirmed appointments'
    },
    {
      color: '#fff',
      icon: <FaExclamationTriangle />,
      value: appointmentRequests.filter(req => req.urgency === 'emergency').length,
      label: 'Emergency',
      description: 'Urgent care requests'
    }
  ];

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

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ 
        minHeight: '100vh',
        background: '#F8F9FA'
      }}>
        <div className="text-center">
          <h3 style={{ color: '#2C3E50' }}>Error</h3>
          <p style={{ color: '#2C3E50' }}>{error}</p>
          <button 
            className="btn px-4 py-2 rounded-3 fw-bold"
            style={{ 
              background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
              color: '#FFFFFF',
              border: 'none'
            }}
            onClick={fetchUserAppointmentRequests}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={pageBg}>
        <div className="container-fluid px-4" style={{paddingTop: '2.5rem'}}>
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h1 className="fw-bold mb-2 letter-spacing-1 fs-2" style={{
                letterSpacing: 1,
                color: '#2C3E50'
              }}>
                <FaHospitalAlt style={iconStyle}/> My Appointment Requests
              </h1>
              <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>View your veterinary appointment requests and responses</p>
            </div>
            <button 
              className="btn px-4 py-2 rounded-3 shadow-sm fw-bold"
              onClick={() => navigate('/dashboard/user')}
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
                  <h5 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#fff',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.label}
                  </h5>
                  <h3 style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '0.5rem',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    {stat.value}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#fff',
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

          {/* Appointment Requests Table */}
          <div className="card shadow-lg" style={cardStyle}>
            <div className="card-header d-flex align-items-center justify-content-between rounded-top px-4 py-3" style={{
              background: '#2C3E50',
              color: '#ffffff'
            }}>
              <h5 className="mb-0 fw-bold fs-4 letter-spacing-1"><FaClipboardList style={iconStyle}/> My Appointment Requests ({appointmentRequests.length})</h5>
              <button 
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold" 
                onClick={() => navigate("/dashboard/user/appointment-request")}
                title="New Request"
                style={{
                  background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                  color: '#2C3E50',
                  border: 'none'
                }}
              >
                <FaPlus style={{ marginRight: 4 }} /> New Request
              </button>
            </div>
            <div className="card-body p-0" style={cardBodyStyle}>
              {appointmentRequests.length === 0 ? (
                <div className="text-center py-5">
                  <h5 style={{ color: '#555879' }}>No appointment requests found</h5>
                  <p style={{ color: '#555879' }}>You haven't submitted any appointment requests yet</p>
                  <button 
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)',
                      color: '#F4EBD3',
                      border: 'none'
                    }}
                    onClick={() => navigate("/dashboard/user/appointment-request")}
                  >
                    <FaPlus style={{ marginRight: 8 }} /> Submit Your First Request
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead style={{
                      background: '#2C3E50',
                      color: '#ffffff'
                    }}>
                      <tr>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaHospitalAlt style={iconStyle}/> <span>Pet</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaClipboardList style={iconStyle}/> <span>Type</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaClock style={iconStyle}/> <span>Date/Time</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaExclamationTriangle style={iconStyle}/> <span>Urgency</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaCheckCircle style={iconStyle}/> <span>Status</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaEye style={iconStyle}/> <span>Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentRequests.map((request) => (
                        <tr key={request.id} style={{...tableRowHover, backgroundColor: '#2C3E50'}}>
                          <td style={{ color: '#020202' }}>
                            <div>
                              <strong style={{ color: '#020202' }}>{request.pet?.petName}</strong>
                              <br />
                              <small style={{ color: '#020202' }}>{request.pet?.species} - {request.pet?.breed}</small>
                            </div>
                          </td>
                          <td style={{ color: '#020202', textAlign: 'center' }}>
                            <span className="badge bg-info" style={{ color: 'black' }}>{request.appointmentType}</span>
                          </td>
                          <td style={{ color: '#020202', textAlign: 'center' }}>
                            <div>
                              <strong style={{ color: '#020202' }}>{new Date(request.preferredDate).toLocaleDateString()}</strong>
                              <br />
                              <small style={{ color: '#020202' }}>{request.preferredTime}</small>
                            </div>
                          </td>
                          <td style={{ color: '#ffffff', textAlign: 'center' }}>
                            <span className={getUrgencyBadge(request.urgency)}>
                              {request.urgency}
                            </span>
                          </td>
                          <td style={{ color: '#ffffff', textAlign: 'center' }}>
                            <span className={getStatusBadge(request.status)}>
                              {request.status}
                            </span>
                          </td>
                          <td style={{ color: '#ffffff', textAlign: 'center' }}>
                            <button
                              className="btn btn-sm btn-outline-light"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetails(true);
                              }}
                              title="View Details"
                              style={{ color: '#000', borderColor: '#000' }}
                            >
                              <FaEye style={{ color: '#000' }} />
                            </button>
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

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="modal-header" style={{
                background: '#FFFFFF',
                borderBottom: '1px solid rgba(108, 117, 125, 0.1)',
                borderRadius: '20px 20px 0 0'
              }}>
                <h5 className="modal-title" style={{ color: '#2C3E50', fontWeight: '600' }}><FaClipboardList style={iconStyle}/> Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedRequest(null);
                  }}
                  style={{ color: '#2C3E50' }}
                ></button>
              </div>
              <div className="modal-body" style={{ background: '#FFFFFF', color: '#2C3E50' }}>
                {/* Request Details */}
                <div className="mb-4">
                  <h6 style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '1rem' }}><FaClipboardList style={iconStyle}/> Request Details:</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Pet:</strong> {selectedRequest.pet?.petName}</p>
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Type:</strong> {selectedRequest.appointmentType}</p>
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Urgency:</strong> {selectedRequest.urgency}</p>
                    </div>
                    <div className="col-md-6">
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Preferred Date:</strong> {new Date(selectedRequest.preferredDate).toLocaleDateString()}</p>
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Preferred Time:</strong> {selectedRequest.preferredTime}</p>
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Status:</strong> <span className={getStatusBadge(selectedRequest.status)}>{selectedRequest.status}</span></p>
                    </div>
                  </div>
                  <div style={{
                    background: '#F8F9FA',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginTop: '1rem'
                  }}>
                    <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Reason:</strong> {selectedRequest.reason}</p>
                    {selectedRequest.notes && (
                      <p style={{ color: '#6C757D', marginBottom: '0' }}><strong style={{ color: '#2C3E50' }}>Notes:</strong> {selectedRequest.notes}</p>
                    )}
                  </div>
                </div>

                {/* Veterinarian Response */}
                {selectedRequest.status !== 'pending' && (
                  <div className="mb-4">
                    <h6 style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '1rem' }}><FaCheckCircle style={iconStyle}/> Veterinarian Response:</h6>
                    <div style={{
                      background: '#E8F5E8',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #C3E6CB'
                    }}>
                      {selectedRequest.vetResponse ? (
                        <div>
                          <p style={{ color: '#155724', marginBottom: '0.5rem' }}><strong>Response:</strong> {selectedRequest.vetResponse}</p>
                          {selectedRequest.suggestedTime && (
                            <p style={{ color: '#155724', marginBottom: '0.5rem' }}><strong>Suggested Time:</strong> {selectedRequest.suggestedTime}</p>
                          )}
                          {selectedRequest.vetNotes && (
                            <p style={{ color: '#155724', marginBottom: '0' }}><strong>Notes:</strong> {selectedRequest.vetNotes}</p>
                          )}
                        </div>
                      ) : (
                        <p style={{ color: '#155724', marginBottom: '0' }}>No response from veterinarian yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{
                background: '#FFFFFF',
                borderTop: '1px solid rgba(108, 117, 125, 0.1)',
                borderRadius: '0 0 20px 20px'
              }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedRequest(null);
                  }}
                  style={{
                    background: '#6C757D',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAppointmentRequests; 