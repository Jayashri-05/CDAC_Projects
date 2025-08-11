import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import './MyAdoptedPets.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaDog, FaCat, FaPaw, FaClipboardList } from "react-icons/fa";

const MyAdoptedPets = () => {
  const navigate = useNavigate();
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Fetch adopted pets
      const adoptedResponse = await fetch(`http://localhost:8080/api/users/${userId}/adopted-pets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch adoption applications
      const applicationsResponse = await fetch(`http://localhost:8080/api/users/${userId}/adoption-applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (adoptedResponse.ok) {
        const adoptedData = await adoptedResponse.json();
        setAdoptedPets(adoptedData);
      } else {
        // Mock data for adopted pets
        setAdoptedPets([
          {
            id: 1,
            petName: "Luna",
            species: "Cat",
            breed: "Persian",
            age: 2,
            description: "Calm and affectionate cat perfect for a quiet home",
            adoptionDate: "2024-01-14T15:45:00Z",
            photoUrl: null
          }
        ]);
      }

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);
      } else {
        // Mock data for applications
        setApplications([
          {
            id: 1,
            pet: {
              id: 1,
              petName: "Max",
              species: "Dog",
              breed: "Golden Retriever",
              age: 3
            },
            status: "pending",
            applicationDate: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            pet: {
              id: 2,
              petName: "Luna",
              species: "Cat",
              breed: "Persian",
              age: 2
            },
            status: "approved",
            applicationDate: "2024-01-14T15:45:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="text-center">
            <div className="spinner-border loading-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="loading-text">Loading your adopted pets...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="my-adopted-pets-container">
        <div className="container">
          {/* Header */}
          <div className="my-adopted-pets-header">
            <h2 className="my-adopted-pets-title"><FaHome style={{ marginRight: 10, verticalAlign: 'middle' }} /> My Adopted Pets</h2>
            <p className="my-adopted-pets-subtitle">Your beloved companions and adoption applications</p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="btn-browse-pets"
              onClick={() => navigate('/all-pets')}
            >
              🐾 Browse More Pets
            </button>
            <button
              className="btn-back-dashboard"
              onClick={() => navigate('/dashboard/user')}
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Adopted Pets Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="section-card">
                <h4 className="section-title"><FaHome style={{ marginRight: 8, verticalAlign: 'middle' }} /> My Adopted Pets</h4>
                {adoptedPets.length === 0 ? (
                  <div className="empty-state">
                    <h5>No adopted pets yet</h5>
                    <p>Start your journey by browsing available pets!</p>
                    <button
                      className="btn-browse-empty"
                      onClick={() => navigate('/all-pets')}
                    >
                      Browse Pets
                    </button>
                  </div>
                ) : (
                  <div className="row">
                    {adoptedPets.map((pet) => (
                      <div key={pet.id} className="col-md-6 col-lg-4 mb-3">
                        <div className="pet-card">
                          <div className="pet-card-body">
                            <span className="pet-icon">
                              {pet.species === 'Dog' ? <FaDog /> : pet.species === 'Cat' ? <FaCat /> : <FaPaw />}
                            </span>
                            <h5 className="pet-name">{pet.petName}</h5>
                            <p className="pet-details">
                              {pet.breed} • {pet.age} years old
                            </p>
                            <p className="pet-description">{pet.description}</p>
                            <div className="mt-3">
                              {pet.adoptionDate && !isNaN(new Date(pet.adoptionDate).getTime()) && (
                                <span className="adoption-date-badge">
                                  Adopted on {formatDate(pet.adoptionDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Adoption Applications Section */}
          <div className="row">
            <div className="col-12">
              <div className="section-card">
                <h4 className="section-title"><FaClipboardList style={{ marginRight: 8, verticalAlign: 'middle' }} /> My Adoption Applications</h4>
                {applications.length === 0 ? (
                  <div className="empty-state">
                    <h5>No applications yet</h5>
                    <p>Apply for pet adoption to see your applications here!</p>
                  </div>
                ) : (
                  <div className="applications-table">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Pet</th>
                            <th>Species</th>
                            <th>Application Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((application) => (
                            <tr key={application.id}>
                              <td>
                                <div className="pet-name-cell">{application.pet.petName}</div>
                                <div className="pet-breed-cell">{application.pet.breed}</div>
                              </td>
                              <td>
                                <span className="species-badge">
                                  {application.pet.species}
                                </span>
                              </td>
                              <td>{formatDate(application.applicationDate)}</td>
                              <td>
                                <span className={`status-badge ${getStatusColor(application.status)}`}>
                                  {application.status.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn-view-details"
                                  onClick={() => navigate(`/adoption-application/${application.id}`)}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAdoptedPets; 