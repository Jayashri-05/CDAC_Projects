import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageShelters.css';
import { FaPaw, FaDog, FaCat, FaHome, FaCheckCircle, FaTimesCircle, FaUserCheck } from "react-icons/fa";

const ManagePets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await API.get("/pets");
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load pets from database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPet = (petId) => {
    navigate(`/dashboard/admin/edit-pet/${petId}`);
  };

  const handleViewPet = (petId) => {
    navigate(`/pet/${petId}`);
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet? This action cannot be undone.")) {
      try {
        const response = await API.delete(`/pets/${petId}`);
        
        // Check if response has a message
        if (response.data && response.data.message) {
          alert(response.data.message);
        } else {
          alert("Pet deleted successfully!");
        }
        
        // Refresh the pets list
        fetchPets();
      } catch (err) {
        console.error("Failed to delete pet:", err);
        
        // Check if the error response has a specific message
        if (err.response && err.response.data && err.response.data.error) {
          alert(err.response.data.error);
        } else {
          alert("Failed to delete pet. Please try again.");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3 className="error-title">Error</h3>
          <p className="error-message">{error}</p>
          <button className="refresh-btn" onClick={fetchPets}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      color: '#fff',
      icon: <FaPaw />,
      value: pets.length,
      label: 'Total Pets',
      description: 'All pets in the database'
    },
    {
      color: '#fff',
      icon: <FaCheckCircle />,
      value: pets.filter(p => !p.adopted).length,
      label: 'Available',
      description: 'Available for adoption'
    },
    {
      color: '#fff',
      icon: <FaTimesCircle />,
      value: pets.filter(p => p.adopted).length,
      label: 'Adopted',
      description: 'Already adopted'
    },
    {
      color: '#fff',
      icon: <FaDog />,
      value: pets.filter(p => p.species === 'Dog').length,
      label: 'Dogs',
      description: 'Dog listings'
    },
    {
      color: '#fff',
      icon: <FaCat />,
      value: pets.filter(p => p.species === 'Cat').length,
      label: 'Cats',
      description: 'Cat listings'
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
                <FaPaw style={{ marginRight: 6, verticalAlign: 'middle' }} /> Manage Pets
              </h1>
              <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>View and manage all pet listings from database</p>
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
          {/* Pets Table */}
          <div className="card shadow-lg" style={{ borderRadius: '20px', background: '#FFFFFF', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(108, 117, 125, 0.1)', marginBottom: '2.5rem', transition: 'all 0.3s ease' }}>
            <div className="card-header d-flex align-items-center justify-content-between rounded-top px-4 py-3" style={{ background: '#2C3E50', color: '#ffffff' }}>
              <h5 className="mb-0 fw-bold fs-4 letter-spacing-1"><FaPaw style={{ marginRight: 6, verticalAlign: 'middle' }} /> Pets from Database ({pets.length})</h5>
              <button
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold"
                onClick={fetchPets}
                title="Refresh"
                style={{ background: 'transparent', color: '#ffffff', border: '2px solid #ffffff' }}
              >
                &#x21bb; Refresh
              </button>
            </div>
            <div className="card-body p-0">
              {pets.length === 0 ? (
                <div className="text-center py-5">
                  <h5 style={{ color: '#555879' }}>No pets found in database</h5>
                  <p style={{ color: '#555879' }}>The database might not have any pet listings or there's a connection issue</p>
                  <button
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{ background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)', color: '#F4EBD3', border: 'none' }}
                    onClick={fetchPets}
                  >
                    &#x21bb; Refresh
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead style={{ background: '#2C3E50', color: '#ffffff' }}>
                      <tr>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaPaw style={{ marginRight: 6, verticalAlign: 'middle' }} /> Pet</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaHome style={{ marginRight: 6, verticalAlign: 'middle' }} /> Species</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaUserCheck style={{ marginRight: 6, verticalAlign: 'middle' }} /> Age</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaHome style={{ marginRight: 6, verticalAlign: 'middle' }} /> Shelter</th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} /> Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pets.map((pet) => (
                        <tr key={pet.id} style={{ background: '#fff' }}>
                          <td style={{ color: '#111' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div
                                className="shelter-avatar"
                                style={{ width: '40px', height: '40px', fontSize: '1.5rem', marginRight: '1rem', background: '#FFD700', color: '#2C3E50', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
                              >
                                {pet.species === 'Dog' ? <FaDog /> : pet.species === 'Cat' ? <FaCat /> : <FaPaw />}
                              </div>
                              <div className="shelter-info">
                                <div className="shelter-name" style={{ color: '#111' }}>{pet.name}</div>
                                <div className="shelter-username" style={{ color: '#555' }}>{pet.breed}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <span className="status-badge approved" style={{ background: '#FFD700', color: '#2C3E50' }}>{pet.species}</span>
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>{pet.age} years</td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            {pet.shelter ? (
                              <span style={{ color: '#111' }}>{pet.shelter.name || pet.shelter.username}</span>
                            ) : (
                              <span className="shelter-username" style={{ color: '#555' }}>Unknown</span>
                            )}
                          </td>
                          <td style={{ color: '#111', textAlign: 'center' }}>
                            <span className={`status-badge ${pet.adopted ? 'active' : 'inactive'}`} style={{ background: pet.adopted ? '#28A745' : '#6C757D', color: '#fff' }}>
                              {pet.adopted ? 'Adopted' : 'Available'}
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

export default ManagePets;
