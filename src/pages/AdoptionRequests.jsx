import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaCheck, FaTimes, FaArrowLeft, FaClipboardList } from "react-icons/fa";
import './AdoptionRequests.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdoptionRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      
      console.log('[DEBUG] Fetching adoption requests for user:', userId, 'role:', role);
      
      // Only shelters can access adoption requests
      if (role !== 'shelter') {
        console.log('[DEBUG] User is not a shelter, redirecting...');
        navigate('/dashboard/user');
        return;
      }
      
      // Fetch all adoption requests for shelter to filter
      const endpoint = 'http://localhost:8080/api/adoption-requests';
      
      console.log('[DEBUG] Using endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('[DEBUG] Response status:', response.status);
      console.log('[DEBUG] Response ok:', response.ok);

      if (response.ok) {
        let data = await response.json();
        console.log('[DEBUG] Received data:', data);
        
        // Filter requests to only show requests for this shelter's pets
        try {
          // Fetch the shelter's pets
          const petsResponse = await fetch('http://localhost:8080/api/pets/my-pets?userId=' + userId, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (petsResponse.ok) {
            const shelterPets = await petsResponse.json();
            const shelterPetIds = shelterPets.map(pet => pet.id);
            
            console.log('[DEBUG] Shelter pets:', shelterPets);
            console.log('[DEBUG] Shelter pet IDs:', shelterPetIds);
            console.log('[DEBUG] All adoption requests before filtering:', data);
            
            // Filter requests to only show requests for this shelter's pets
            data = data.filter(request => {
              const isShelterPet = shelterPetIds.includes(request.pet.id);
              console.log('[DEBUG] Request pet ID:', request.pet.id, 'isShelterPet:', isShelterPet);
              return isShelterPet;
            });
            
            console.log('[DEBUG] Filtered data for shelter:', data.length, 'requests');
          }
        } catch (error) {
          console.error('[DEBUG] Error fetching shelter pets:', error);
        }
        
        setRequests(data);
      } else {
        const errorText = await response.text();
        console.log('[DEBUG] Error response:', errorText);
        // For demo purposes, using mock data
        setRequests([
          {
            id: 1,
            pet: {
              id: 1,
              petName: "Max",
              species: "Dog",
              breed: "Golden Retriever",
              age: 3
            },
            adopter: {
              id: 1,
              fullName: "John Smith",
              email: "john@example.com",
              phoneNumber: "9876543210"
            },
            fullName: "John Smith",
            email: "john@example.com",
            phoneNumber: "9876543210",
            aadharNumber: "123456789012",
            address: "123 Main St, New York, NY 10001",
            occupation: "Software Engineer",
            annualIncome: "8-12 Lakhs",
            experienceWithPets: "Experienced",
            reasonForAdoption: "I love dogs and have experience with Golden Retrievers. I have a large yard and plenty of time to spend with Max.",
            livingSituation: "Own house with yard",
            otherPets: "None",
            childrenInHome: "No children",
            timeAtHome: "Most of the day",
            emergencyContact: "Jane Smith",
            emergencyPhone: "9876543211",
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
            adopter: {
              id: 2,
              fullName: "Sarah Johnson",
              email: "sarah@example.com",
              phoneNumber: "9876543212"
            },
            fullName: "Sarah Johnson",
            email: "sarah@example.com",
            phoneNumber: "9876543212",
            aadharNumber: "123456789013",
            address: "456 Oak Ave, New York, NY 10002",
            occupation: "Teacher",
            annualIncome: "5-8 Lakhs",
            experienceWithPets: "Some experience",
            reasonForAdoption: "I've always wanted a cat and Luna seems perfect for my apartment lifestyle.",
            livingSituation: "Apartment/Condo",
            otherPets: "None",
            childrenInHome: "No children",
            timeAtHome: "Evenings and weekends",
            emergencyContact: "Mike Johnson",
            emergencyPhone: "9876543213",
            status: "approved",
            applicationDate: "2024-01-14T15:45:00Z"
          }
        ]);
      }
            } catch (error) {
          console.error('Error fetching adoption requests:', error);
          console.log('[DEBUG] Using mock data due to error');
          // For demo purposes, using mock data
          setRequests([
            {
              id: 1,
              pet: {
                id: 1,
                petName: "Max",
                species: "Dog",
                breed: "Golden Retriever",
                age: 3
              },
              adopter: {
                id: 1,
                fullName: "John Smith",
                email: "john@example.com",
                phoneNumber: "9876543210"
              },
              fullName: "John Smith",
              email: "john@example.com",
              phoneNumber: "9876543210",
              aadharNumber: "123456789012",
              address: "123 Main St, New York, NY 10001",
              occupation: "Software Engineer",
              annualIncome: "8-12 Lakhs",
              experienceWithPets: "Experienced",
              reasonForAdoption: "I love dogs and have experience with Golden Retrievers. I have a large yard and plenty of time to spend with Max.",
              livingSituation: "Own house with yard",
              otherPets: "None",
              childrenInHome: "No children",
              timeAtHome: "Most of the day",
              emergencyContact: "Jane Smith",
              emergencyPhone: "9876543211",
              status: "pending",
              applicationDate: "2024-01-15T10:30:00Z"
            }
          ]);
        } finally {
          setLoading(false);
        }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/adoption-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setRequests(prev => prev.map(request => 
          request.id === requestId ? { ...request, status: newStatus } : request
        ));
        
        // If approved, update pet status to adopted
        if (newStatus === 'approved') {
          // Update pet status in the backend
          try {
            await fetch(`http://localhost:8080/api/pets/${requests.find(r => r.id === requestId).pet.id}/adopt`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
          } catch (error) {
            console.error('Error updating pet status:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getStatusColor = (status) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status ? status.toLowerCase() : '';
    switch (normalizedStatus) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    // Normalize status to lowercase for comparison
    const normalizedStatus = request.status ? request.status.toLowerCase() : '';
    return normalizedStatus === filter;
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
            <p className="loading-text">Loading adoption requests...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="adoption-requests-container">
        <div className="container">
          {/* Header */}
          <div className="adoption-requests-header">
            <h2 className="adoption-requests-title"><FaClipboardList style={{ marginRight: 10, verticalAlign: 'middle' }} /> Adoption Requests</h2>
            <p className="adoption-requests-subtitle">
              Review and manage all pet adoption applications for your shelter
            </p>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <div className="filter-card">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="filter-label">Filter by status:</span>
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
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                      >
                        Pending
                      </button>
                      <button
                        type="button"
                        className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                        onClick={() => setFilter('approved')}
                      >
                        Approved
                      </button>
                      <button
                        type="button"
                        className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setFilter('rejected')}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="row">
            <div className="col-12">
              {filteredRequests.length === 0 ? (
                <div className="no-requests-found">
                  <h4>No requests found</h4>
                  <p>There are no adoption requests matching your filter.</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="request-header">
                          <div>
                            <h5 className="request-title">
                              Adoption Request #{request.id} - {request.pet.petName}
                            </h5>
                            <p className="request-subtitle">
                              Applicant: {request.fullName} | Applied on {formatDate(request.applicationDate)}
                            </p>
                          </div>
                          <div className="text-end">
                            <span className={`status-badge ${getStatusColor(request.status)}`}>
                              {request.status ? request.status.toUpperCase() : 'UNKNOWN'}
                            </span>
                          </div>
                        </div>

                        <div className="request-details">
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <div className="detail-section">
                                <div className="detail-section-title">Pet Information:</div>
                                <div className="detail-item">{request.pet.petName} - {request.pet.breed}</div>
                                <div className="detail-item">{request.pet.species}, {request.pet.age} years old</div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="detail-section">
                                <div className="detail-section-title">Contact Information:</div>
                                <div className="detail-item">{request.email}</div>
                                <div className="detail-item">{request.phoneNumber}</div>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6">
                              <div className="detail-section">
                                <div className="detail-section-title">Personal Details:</div>
                                <div className="detail-item"><strong>Aadhar:</strong> {request.aadharNumber}</div>
                                <div className="detail-item"><strong>Occupation:</strong> {request.occupation}</div>
                                <div className="detail-item"><strong>Income:</strong> {request.annualIncome}</div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="detail-section">
                                <div className="detail-section-title">Living Situation:</div>
                                <div className="detail-item">{request.livingSituation}</div>
                                <div className="detail-item"><strong>Other pets:</strong> {request.otherPets || 'None'}</div>
                                <div className="detail-item"><strong>Children:</strong> {request.childrenInHome}</div>
                              </div>
                            </div>
                          </div>

                          <div className="detail-section">
                            <div className="detail-section-title">Reason for Adoption:</div>
                            <div className="detail-item">{request.reasonForAdoption}</div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6">
                              <div className="detail-section">
                                <div className="detail-section-title">Address:</div>
                                <div className="detail-item">{request.address}</div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="detail-section">
                                <div className="detail-section-title">Emergency Contact:</div>
                                <div className="detail-item">{request.emergencyContact}</div>
                                <div className="detail-item">{request.emergencyPhone}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="action-buttons">
                          {request.status && request.status.toLowerCase() === 'pending' && (
                            <>
                              <button
                                type="button"
                                className="action-btn btn-approve"
                                onClick={() => handleStatusUpdate(request.id, 'approved')}
                              >
                                <FaCheck style={{ marginRight: 6, verticalAlign: 'middle' }} /> Approve
                              </button>
                              <button
                                type="button"
                                className="action-btn btn-reject"
                                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                              >
                                <FaTimes style={{ marginRight: 6, verticalAlign: 'middle' }} /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Back to Dashboard */}
            <div className="back-to-dashboard">
              <button 
                className="btn-back-dashboard"
                onClick={() => navigate('/dashboard/shelter')}
              >
                <FaArrowLeft style={{ marginRight: 6, verticalAlign: 'middle' }} /> Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdoptionRequests; 