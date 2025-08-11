import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaClipboardList, FaClock, FaCheckCircle, FaExclamationTriangle, FaEye, FaUserMd, FaCalendarAlt, FaUser, FaPaw } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const VetAppointmentRequests = () => {
  const navigate = useNavigate();
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseData, setResponseData] = useState({
    status: "approved",
    vetResponse: "",
    suggestedDate: "",
    suggestedTime: "",
    vetNotes: ""
  });

  useEffect(() => {
    fetchAppointmentRequests();
  }, []);

  const fetchAppointmentRequests = async () => {
    try {
      setLoading(true);
      const response = await API.get("/appointment-requests");
      setAppointmentRequests(response.data);
    } catch (err) {
      console.error("Error fetching appointment requests:", err);
      setError("Failed to load appointment requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    console.log("[DEBUG] Response form submitted");
    
    if (!responseData.status || !responseData.vetResponse) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await API.put(`/appointment-requests/${selectedRequest.id}/respond`, responseData);
      
      if (response.status === 200) {
        alert("Response submitted successfully!");
        setShowResponseForm(false);
        setSelectedRequest(null);
        setResponseData({
          status: "approved",
          vetResponse: "",
          suggestedDate: "",
          suggestedTime: "",
          vetNotes: ""
        });
        fetchAppointmentRequests();
        
        // Trigger dashboard refresh by setting a flag in localStorage
        localStorage.setItem('dashboardRefreshNeeded', 'true');
      }
    } catch (err) {
      console.error("Error submitting response:", err);
      alert("Failed to submit response. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("[DEBUG] Input changed:", name, value);
    setResponseData(prev => ({
      ...prev,
      [name]: value
    }));
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
      description: 'Urgent cases'
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
                <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Appointment Requests
              </h1>
              <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>Review and respond to user appointment requests</p>
            </div>
            <button
              className="btn px-4 py-2 rounded-3 shadow-sm fw-bold"
              onClick={() => navigate('/dashboard/vet')}
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

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

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

          {/* Appointment Requests Table */}
          <div className="card shadow-lg" style={{ borderRadius: '20px', background: '#FFFFFF', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(108, 117, 125, 0.1)', marginBottom: '2.5rem', transition: 'all 0.3s ease' }}>
            <div className="card-header d-flex align-items-center justify-content-between rounded-top px-4 py-3" style={{ background: '#2C3E50', color: '#ffffff' }}>
              <h5 className="mb-0 fw-bold fs-4 letter-spacing-1"><FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Appointment Requests ({appointmentRequests.length})</h5>
              <button
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold"
                onClick={fetchAppointmentRequests}
                title="Refresh"
                style={{ background: 'transparent', color: '#ffffff', border: '2px solid #ffffff' }}
              >
                &#x21bb; Refresh
              </button>
            </div>
            <div className="card-body p-0">
              {appointmentRequests.length === 0 ? (
                <div className="text-center py-5">
                  <FaClipboardList style={{ fontSize: '3rem', color: '#555879', marginBottom: '1rem' }} />
                  <h5 style={{ color: '#555879' }}>No appointment requests found</h5>
                  <p style={{ color: '#555879' }}>No appointment requests have been submitted yet.</p>
                  <button
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{ background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)', color: '#F4EBD3', border: 'none' }}
                    onClick={fetchAppointmentRequests}
                  >
                    &#x21bb; Refresh
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead style={{ background: '#2C3E50', color: '#ffffff' }}>
                      <tr>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaUser style={{ marginRight: 6, verticalAlign: 'middle' }} /> User</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaPaw style={{ marginRight: 6, verticalAlign: 'middle' }} /> Pet</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaCalendarAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Date</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaExclamationTriangle style={{ marginRight: 6, verticalAlign: 'middle' }} /> Urgency</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} /> Status</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaEye style={{ marginRight: 6, verticalAlign: 'middle' }} /> Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentRequests.map((request) => (
                        <tr key={request.id} style={{ background: '#fff' }}>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            {request.userName || 'N/A'}
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            {request.petName || 'N/A'}
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            {request.preferredDate || 'N/A'}
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <span className={getUrgencyBadge(request.urgency)}>
                              {request.urgency || 'N/A'}
                            </span>
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <span className={getStatusBadge(request.status)}>
                              {request.status || 'N/A'}
                            </span>
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowResponseForm(true);
                              }}
                            >
                              <FaEye style={{ marginRight: 4 }} /> View Details
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

      {/* Response Modal */}
      {showResponseForm && selectedRequest && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ borderRadius: '20px' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid rgba(108, 117, 125, 0.1)' }}>
                <h5 className="modal-title" style={{ color: '#2C3E50' }}>
                  <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Respond to Appointment Request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowResponseForm(false);
                    setSelectedRequest(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleResponseSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaUser style={{ marginRight: 6, verticalAlign: 'middle' }} /> User Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedRequest.userName || 'N/A'}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaPaw style={{ marginRight: 6, verticalAlign: 'middle' }} /> Pet Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedRequest.petName || 'N/A'}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaCalendarAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Preferred Date
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedRequest.preferredDate || 'N/A'}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaExclamationTriangle style={{ marginRight: 6, verticalAlign: 'middle' }} /> Urgency
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedRequest.urgency || 'N/A'}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#555879' }}>
                      <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> User's Request
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={selectedRequest.requestDetails || 'N/A'}
                      readOnly
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} /> Status <span className="text-danger">*</span>
                      </label>
                      <select
                        name="status"
                        className="form-select"
                        value={responseData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaCalendarAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Suggested Date
                      </label>
                      <input
                        type="date"
                        name="suggestedDate"
                        className="form-control"
                        value={responseData.suggestedDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#555879' }}>
                      <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Vet Response <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="vetResponse"
                      className="form-control"
                      rows="3"
                      value={responseData.vetResponse}
                      onChange={handleInputChange}
                      placeholder="Enter your response to the user..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#555879' }}>
                      <FaUserMd style={{ marginRight: 6, verticalAlign: 'middle' }} /> Vet Notes
                    </label>
                    <textarea
                      name="vetNotes"
                      className="form-control"
                      rows="2"
                      value={responseData.vetNotes}
                      onChange={handleInputChange}
                      placeholder="Additional notes (optional)..."
                    />
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid rgba(108, 117, 125, 0.1)' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowResponseForm(false);
                      setSelectedRequest(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{
                      background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                      color: '#FFFFFF',
                      border: 'none'
                    }}
                  >
                    Submit Response
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showResponseForm && (
        <div className="modal-backdrop fade show"></div>
      )}
    </>
  );
};

export default VetAppointmentRequests; 