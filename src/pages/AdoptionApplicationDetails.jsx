import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaClipboardList } from "react-icons/fa";
import './AdoptionApplicationDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdoptionApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // For now, we'll use mock data since the backend endpoint might not exist
      // In a real implementation, you would fetch from: `/api/adoption-requests/${applicationId}`
      
      // Mock data - replace with actual API call
      const mockApplication = {
        id: applicationId,
        pet: {
          id: 1,
          petName: "Max",
          species: "Dog",
          breed: "Golden Retriever",
          age: 3,
          description: "Friendly and energetic dog looking for an active family",
          photoUrl: null
        },
        status: "pending",
        applicationDate: "2024-01-15T10:30:00Z",
        applicantName: "John Doe",
        applicantEmail: "john.doe@example.com",
        applicantPhone: "+1-555-0123",
        applicantAddress: "123 Main Street",
        applicantCity: "New York",
        applicantState: "NY",
        applicantZipCode: "10001",
        experienceWithPets: "I have experience with dogs and cats",
        livingSituation: "House with fenced yard",
        familyMembers: "2 adults, 1 child (age 8)",
        workSchedule: "9 AM - 5 PM, Monday to Friday",
        reasonForAdoption: "We want to provide a loving home for a pet in need",
        additionalNotes: "We are excited to welcome a new family member!",
        shelterResponse: "Thank you for your application. We are currently reviewing it and will contact you within 3-5 business days.",
        responseDate: "2024-01-16T14:20:00Z"
      };

      setApplication(mockApplication);
      setError("");
    } catch (error) {
      console.error('Error fetching application details:', error);
      setError("Failed to load application details. Please try again.");
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
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <p className="loading-text">Loading application details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <div className="text-center">
            <h3>Error</h3>
            <p>{error}</p>
            <button 
              className="btn-back"
              onClick={() => navigate('/my-adopted-pets')}
            >
              ← Back to My Adopted Pets
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!application) {
    return (
      <>
        <Navbar />
        <div className="not-found-container">
          <div className="text-center">
            <h3>Application Not Found</h3>
            <p>The requested application could not be found.</p>
            <button 
              className="btn-back"
              onClick={() => navigate('/my-adopted-pets')}
            >
              ← Back to My Adopted Pets
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="application-details-container">
        <div className="container">
          {/* Header */}
          <div className="application-details-header">
            <h1 className="application-details-title"><FaClipboardList style={{ marginRight: 10, verticalAlign: 'middle' }} /> Adoption Application Details</h1>
            <p className="application-details-subtitle">Application #{application.id}</p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="btn-back"
              onClick={() => navigate('/my-adopted-pets')}
            >
              ← Back to My Adopted Pets
            </button>
          </div>

          <div className="row">
            {/* Pet Information */}
            <div className="col-lg-4 mb-4">
              <div className="section-card">
                <h4 className="section-title">🐾 Pet Information</h4>
                <div className="pet-info">
                  <div className="pet-icon-large">
                    {application.pet.species === 'Dog' ? '🐕' : application.pet.species === 'Cat' ? '🐱' : '🐾'}
                  </div>
                  <h5 className="pet-name">{application.pet.petName}</h5>
                  <p className="pet-details">
                    <strong>Breed:</strong> {application.pet.breed}
                  </p>
                  <p className="pet-details">
                    <strong>Age:</strong> {application.pet.age} years old
                  </p>
                  <p className="pet-details">
                    <strong>Species:</strong> {application.pet.species}
                  </p>
                  {application.pet.description && (
                    <p className="pet-description">{application.pet.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Application Status */}
            <div className="col-lg-8 mb-4">
              <div className="section-card">
                <h4 className="section-title">📊 Application Status</h4>
                <div className="status-section">
                  <div className="status-info">
                    <p><strong>Status:</strong></p>
                    <span className={`status-badge ${getStatusColor(application.status)}`}>
                      {application.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="date-info">
                    <p><strong>Application Date:</strong> {formatDate(application.applicationDate)}</p>
                    {application.responseDate && (
                      <p><strong>Response Date:</strong> {formatDate(application.responseDate)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applicant Information */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="section-card">
                <h4 className="section-title">👤 Applicant Information</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Full Name:</label>
                      <p>{application.applicantName}</p>
                    </div>
                    <div className="info-group">
                      <label>Email:</label>
                      <p>{application.applicantEmail}</p>
                    </div>
                    <div className="info-group">
                      <label>Phone:</label>
                      <p>{application.applicantPhone}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Address:</label>
                      <p>{application.applicantAddress}</p>
                      <p>{application.applicantCity}, {application.applicantState} {application.applicantZipCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Questions */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="section-card">
                <h4 className="section-title">❓ Application Questions</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Experience with Pets:</label>
                      <p>{application.experienceWithPets}</p>
                    </div>
                    <div className="info-group">
                      <label>Living Situation:</label>
                      <p>{application.livingSituation}</p>
                    </div>
                    <div className="info-group">
                      <label>Family Members:</label>
                      <p>{application.familyMembers}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Work Schedule:</label>
                      <p>{application.workSchedule}</p>
                    </div>
                    <div className="info-group">
                      <label>Reason for Adoption:</label>
                      <p>{application.reasonForAdoption}</p>
                    </div>
                    {application.additionalNotes && (
                      <div className="info-group">
                        <label>Additional Notes:</label>
                        <p>{application.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shelter Response */}
          {application.shelterResponse && (
            <div className="row">
              <div className="col-12">
                <div className="section-card">
                  <h4 className="section-title">🏠 Shelter Response</h4>
                  <div className="shelter-response">
                    <p>{application.shelterResponse}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdoptionApplicationDetails; 