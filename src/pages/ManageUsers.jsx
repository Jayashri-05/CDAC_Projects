import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaUserShield, FaUserFriends, FaUserCheck, FaHome, FaUserMd } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageUsers = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users from database. Please try again.");
    } finally {
      setLoading(false);
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
            onClick={fetchUsers}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
  
  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1.2rem',
    boxShadow: '0 4px 15px rgba(44, 62, 80, 0.1)',
    border: '2px solid rgba(44, 62, 80, 0.1)',
  };
  
  const iconStyle = { marginRight: 6, verticalAlign: 'middle' };

  const stats = [
    {
      color: '#fff',
      icon: <FaUserFriends />,
      value: users.length,
      label: 'Total Users',
      description: 'All registered users'
    },
    {
      color: '#fff',
      icon: <FaUserShield />,
      value: users.filter(u => u.role === 'ADMIN').length,
      label: 'Admins',
      description: 'Administrative users'
    },
    {
      color: '#fff',
      icon: <FaUserCheck />,
      value: users.filter(u => u.role === 'USER').length,
      label: 'Regular Users',
      description: 'Standard user accounts'
    },
    {
      color: '#fff',
      icon: <FaHome />,
      value: users.filter(u => u.role === 'SHELTER').length,
      label: 'Shelters',
      description: 'Pet shelter accounts'
    },
    {
      color: '#fff',
      icon: <FaUserMd />,
      value: users.filter(u => u.role === 'VET').length,
      label: 'Veterinarians',
      description: 'Veterinary professionals'
    }
  ];

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={pageBg}>
        <div className="container-fluid px-4" style={{paddingTop: '2.5rem'}}>
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h1 className="fw-bold mb-2 letter-spacing-1 fs-2" style={{
                letterSpacing: 1,
                color: '#2C3E50'
              }}>
                <FaUser style={iconStyle}/> Manage Users
              </h1>
              <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>View and manage all user accounts from database</p>
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

          {/* Users Table */}
          <div className="card shadow-lg" style={cardStyle}>
            <div className="card-header d-flex align-items-center justify-content-between rounded-top px-4 py-3" style={{
              background: '#2C3E50',
              color: '#ffffff'
            }}>
              <h5 className="mb-0 fw-bold fs-4 letter-spacing-1"><FaUser style={iconStyle}/> Users from Database ({users.length})</h5>
              <button 
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold" 
                onClick={fetchUsers} 
                title="Refresh"
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: '2px solid #ffffff'
                }}
              >
                🔄 Refresh
              </button>
            </div>
            <div className="card-body p-0" style={cardBodyStyle}>
              {users.length === 0 ? (
                <div className="text-center py-5">
                  <h5 style={{ color: '#555879' }}>No users found in database</h5>
                  <p style={{ color: '#555879' }}>The database might be empty or there's a connection issue</p>
                  <button 
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)',
                      color: '#F4EBD3',
                      border: 'none'
                    }}
                    onClick={fetchUsers}
                  >
                    🔄 Refresh
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
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaUser style={iconStyle}/> <span>User</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaEnvelope style={iconStyle}/> <span>Email</span></th>
                        <th style={{ color: '#ffffff', textAlign: 'center' }}><FaUserShield style={iconStyle}/> <span>Role</span></th>
                      </tr>
                    </thead>
                    <tbody>
                                              {users.map((user) => (
                          <tr key={user.id} style={{...tableRowHover, backgroundColor: '#2C3E50'}} title={user.fullName || user.username}>
                          <td style={{ color: '#ffffff' }}>
                            <div className="d-flex align-items-center">
                              <div style={avatarStyle} className="shadow-sm">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <div className="fw-bold fs-6" style={{ color: '#020202' }}>{user.fullName || user.username}</div>
                                <small style={{ color: '#020202' }}>@{user.username}</small>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: '#020202', fontWeight: 500 }}>{user.email}</td>
                          <td style={{ color: '#ffffff' }}>
                            <span className="badge text-uppercase shadow-sm" style={{
                              background: user.role === 'ADMIN' ? '#DC3545' :
                              user.role === 'USER' ? '#2C3E50' :
                              user.role === 'SHELTER' ? '#28A745' :
                              user.role === 'VET' ? '#FFC107' : 
                              '#6C757D',
                              color: user.role === 'VET' ? '#2C3E50' : '#ffffff'
                            }}>
                              {user.role}
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

export default ManageUsers; 