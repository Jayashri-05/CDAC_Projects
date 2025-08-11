import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaHospitalAlt, FaClipboardList, FaDog, FaCheckCircle, FaCalendarAlt, FaEye, FaPaw } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserHealthRecords = () => {
  const navigate = useNavigate();
  const [healthRecords, setHealthRecords] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      
      // Get user's adopted pets
      const adoptedResponse = await API.get(`/adoption-requests/user/${userId}`);
      const adoptedPetsData = adoptedResponse.data.filter(request => request.status === 'approved');
      setAdoptedPets(adoptedPetsData.map(request => request.pet));
      
      // Get all health records
      const healthResponse = await API.get("/health-records");
      const allRecords = healthResponse.data;
      
      // Filter records for user's adopted pets
      const userPetIds = adoptedPetsData.map(request => request.pet.id);
      const userRecords = allRecords.filter(record => 
        record.pet && userPetIds.includes(record.pet.id)
      );
      
      setHealthRecords(userRecords);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load health records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-success',
      completed: 'bg-secondary',
      followup: 'bg-warning'
    };
    return `badge ${statusColors[status] || 'bg-secondary'}`;
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
      value: healthRecords.length,
      label: 'Total Records',
      description: 'All health records'
    },
    {
      color: '#fff',
      icon: <FaDog />,
      value: adoptedPets.length,
      label: 'Adopted Pets',
      description: 'Your adopted pets'
    },
    {
      color: '#fff',
      icon: <FaCheckCircle />,
      value: healthRecords.filter(record => record.status === 'active').length,
      label: 'Active Records',
      description: 'Current treatments'
    },
    {
      color: '#fff',
      icon: <FaCalendarAlt />,
      value: healthRecords.filter(record => record.status === 'followup').length,
      label: 'Follow-up Needed',
      description: 'Pending follow-ups'
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
            onClick={fetchUserData}
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
                <FaHospitalAlt style={iconStyle}/> My Pets' Health Records
              </h1>
              <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>View health records and medical history for your adopted pets</p>
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

          {/* Health Records Table */}
          <div className="card shadow-lg" style={cardStyle}>
            <div className="card-header d-flex align-items-center justify-content-between rounded-top px-4 py-3" style={{
              background: '#2C3E50',
              color: '#ffffff'
            }}>
              <h5 className="mb-0 fw-bold fs-4 letter-spacing-1"><FaHospitalAlt style={iconStyle}/> Health Records ({healthRecords.length})</h5>
            </div>
            <div className="card-body p-0" style={cardBodyStyle}>
              {healthRecords.length === 0 ? (
                <div className="text-center py-5">
                  <h5 style={{ color: '#555879' }}>No health records found</h5>
                  <p style={{ color: '#555879' }}>
                    {adoptedPets.length === 0 
                      ? "You don't have any adopted pets yet. Adopt a pet first to see their health records."
                      : "No health records have been created for your pets yet."
                    }
                  </p>
                  {adoptedPets.length === 0 && (
                    <button 
                      className="btn px-4 py-2 rounded-3 fw-bold"
                      style={{ 
                        background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)',
                        color: '#F4EBD3',
                        border: 'none'
                      }}
                      onClick={() => navigate("/all-pets")}
                    >
                      <FaDog style={{ marginRight: 8 }} /> Browse Available Pets
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead style={{
                      background: '#2C3E50',
                      color: '#ffffff'
                    }}>
                      <tr>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaPaw style={iconStyle}/> <span>Pet</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaHospitalAlt style={iconStyle}/> <span>Diagnosis</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaClipboardList style={iconStyle}/> <span>Treatment</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaCalendarAlt style={iconStyle}/> <span>Date</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaCheckCircle style={iconStyle}/> <span>Status</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaEye style={iconStyle}/> <span>Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthRecords.map((record) => (
                        <tr key={record.id} style={{...tableRowHover, backgroundColor: '#2C3E50'}}>
                          <td style={{ color: '#020202' }}>
                            <div>
                              <strong style={{ color: '#020202' }}>{record.pet?.petName}</strong>
                              <br />
                              <small style={{ color: '#020202' }}>{record.pet?.species} - {record.pet?.breed}</small>
                            </div>
                          </td>
                          <td style={{ color: '#020202', textAlign: 'center' }}>
                            <span className="text-truncate d-inline-block" style={{ maxWidth: '200px', color: '#020202' }}>
                              {record.diagnosis}
                            </span>
                          </td>
                          <td style={{ color: '#020202', textAlign: 'center' }}>
                            <span className="text-truncate d-inline-block" style={{ maxWidth: '200px', color: '#020202' }}>
                              {record.treatment}
                            </span>
                          </td>
                          <td style={{ color: '#020202', textAlign: 'center' }}>
                            <div>
                              <strong style={{ color: '#020202' }}>{new Date(record.date).toLocaleDateString()}</strong>
                            </div>
                          </td>
                          <td style={{ color: '#ffffff', textAlign: 'center' }}>
                            <span className={getStatusBadge(record.status)}>
                              {record.status || 'active'}
                            </span>
                          </td>
                          <td style={{ color: '#ffffff', textAlign: 'center' }}>
                            <button
                              className="btn btn-sm btn-outline-light"
                              onClick={() => {
                                setSelectedRecord(record);
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

      {/* Health Record Details Modal */}
      {showDetails && selectedRecord && (
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
                <h5 className="modal-title" style={{ color: '#2C3E50', fontWeight: '600' }}><FaHospitalAlt style={iconStyle}/> Health Record Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedRecord(null);
                  }}
                  style={{ color: '#2C3E50' }}
                ></button>
              </div>
              <div className="modal-body" style={{ background: '#FFFFFF', color: '#2C3E50' }}>
                {/* Pet Information */}
                <div className="mb-4">
                  <h6 style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '1rem' }}><FaPaw style={iconStyle}/> Pet Information:</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Pet Name:</strong> {selectedRecord.pet?.petName}</p>
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Species:</strong> {selectedRecord.pet?.species}</p>
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Breed:</strong> {selectedRecord.pet?.breed}</p>
                    </div>
                    <div className="col-md-6">
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Record Date:</strong> {new Date(selectedRecord.date).toLocaleDateString()}</p>
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Status:</strong> <span className={getStatusBadge(selectedRecord.status)}>{selectedRecord.status || 'active'}</span></p>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="mb-4">
                  <h6 style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '1rem' }}><FaHospitalAlt style={iconStyle}/> Medical Information:</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Diagnosis:</strong></p>
                      <div style={{ 
                        background: 'rgba(108, 117, 125, 0.05)', 
                        border: '1px solid rgba(108, 117, 125, 0.1)',
                        borderRadius: '8px',
                        padding: '1rem',
                        borderLeft: '3px solid #F4B942'
                      }}>
                        <p style={{ color: '#2C3E50', margin: '0' }}>{selectedRecord.diagnosis}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p style={{ color: '#6C757D', marginBottom: '0.5rem' }}><strong style={{ color: '#2C3E50' }}>Treatment:</strong></p>
                      <div style={{ 
                        background: 'rgba(108, 117, 125, 0.05)', 
                        border: '1px solid rgba(108, 117, 125, 0.1)',
                        borderRadius: '8px',
                        padding: '1rem',
                        borderLeft: '3px solid #28A745'
                      }}>
                        <p style={{ color: '#2C3E50', margin: '0' }}>{selectedRecord.treatment}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedRecord.medications && (
                  <div className="mb-4">
                    <h6 style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '1rem' }}><FaClipboardList style={iconStyle}/> Medications:</h6>
                    <div style={{ 
                      background: 'rgba(108, 117, 125, 0.05)', 
                      border: '1px solid rgba(108, 117, 125, 0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                      borderLeft: '3px solid #FFC107'
                    }}>
                      <p style={{ color: '#2C3E50', margin: '0' }}>{selectedRecord.medications}</p>
                    </div>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div className="mb-4">
                    <h6 style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '1rem' }}><FaClipboardList style={iconStyle}/> Veterinarian Notes:</h6>
                    <div style={{ 
                      background: 'rgba(108, 117, 125, 0.05)', 
                      border: '1px solid rgba(108, 117, 125, 0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                      borderLeft: '3px solid #6C757D'
                    }}>
                      <p style={{ color: '#2C3E50', margin: '0' }}>{selectedRecord.notes}</p>
                    </div>
                  </div>
                )}

                {selectedRecord.followUpDate && (
                  <div className="mb-4">
                    <h6 style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '1rem' }}><FaCalendarAlt style={iconStyle}/> Follow-up Information:</h6>
                    <div style={{ 
                      background: 'rgba(108, 117, 125, 0.05)', 
                      border: '1px solid rgba(108, 117, 125, 0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                      borderLeft: '3px solid #007BFF'
                    }}>
                      <p style={{ color: '#2C3E50', margin: '0' }}><strong style={{ color: '#2C3E50' }}>Follow-up Date:</strong> {selectedRecord.followUpDate}</p>
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
                    setSelectedRecord(null);
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

export default UserHealthRecords; 