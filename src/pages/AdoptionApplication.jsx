import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { showSuccessToast, showErrorToast, showWarningToast } from '../utils/toast.jsx';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaPaw, FaHome, FaEdit, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import axios from '../api/axios';

const AdoptionApplication = () => {
  const navigate = useNavigate();
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    aadharNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    occupation: "",
    annualIncome: "",
    experienceWithPets: "",
    reasonForAdoption: "",
    livingSituation: "",
    otherPets: "",
    childrenInHome: "",
    timeAtHome: "",
    emergencyContact: "",
    emergencyPhone: ""
  });

  useEffect(() => {
    fetchPetDetails();
  }, [petId]);

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/pets/${petId}`);
      if (response.ok) {
        const petData = await response.json();
        setPet(petData);
      } else {
        setPet({
          id: petId,
          petName: "Max",
          species: "Dog",
          breed: "Golden Retriever",
          age: 3,
          description: "Friendly and energetic dog looking for an active family"
        });
      }
    } catch (error) {
      console.error('Error fetching pet details:', error);
      setPet({
        id: petId,
        petName: "Max",
        species: "Dog",
        breed: "Golden Retriever",
        age: 3,
        description: "Friendly and energetic dog looking for an active family"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAadhar = (aadhar) => {
    const cleanAadhar = aadhar.replace(/[\s-]/g, '');
    return /^\d{12}$/.test(cleanAadhar);
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return /^\d{10}$/.test(cleanPhone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAadhar(formData.aadharNumber)) {
      showErrorToast('Please enter a valid 12-digit Aadhar number');
      return;
    }

    if (!validatePhone(formData.phoneNumber)) {
      showErrorToast('Please enter a valid 10-digit phone number');
      return;
    }

    if (!validatePhone(formData.emergencyPhone)) {
      showErrorToast('Please enter a valid 10-digit emergency phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Check if token exists
      if (!token) {
        showErrorToast('Please log in to submit an adoption application.');
        navigate('/login');
        return;
      }

      console.log('Token:', token); // Debug log
      console.log('User ID:', localStorage.getItem('userId')); // Debug log

      const applicationData = {
        petId: parseInt(petId),
        ...formData
      };
      
      console.log('Application data:', applicationData); // Debug log

      // First, test authentication
      console.log('Testing authentication...');
      const authTestResponse = await fetch('http://localhost:8080/api/adoption-requests/test-auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Auth test response status:', authTestResponse.status);
      if (authTestResponse.ok) {
        const authTestData = await authTestResponse.json();
        console.log('Auth test data:', authTestData);
      } else {
        const authTestError = await authTestResponse.text();
        console.log('Auth test error:', authTestError);
      }

      console.log('Making request to:', 'http://localhost:8080/api/adoption-requests');
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      
      const response = await fetch('http://localhost:8080/api/adoption-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        showSuccessToast('Adoption application submitted successfully! Your application will be reviewed by the shelter.');
        navigate('/dashboard/user');
      } else {
        let errorMessage = 'Failed to submit application';
        
        if (response.status === 403) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (response.status === 400) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || 'Invalid request data';
          } catch (parseError) {
            errorMessage = 'Invalid request data';
          }
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || 'Server error occurred';
          } catch (parseError) {
            errorMessage = 'Server error occurred';
          }
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      showErrorToast(`Failed to submit application: ${error.message}`);
      
      // If it's an authentication error, redirect to login
      if (error.message.includes('Authentication failed')) {
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle = {
    borderRadius: '24px',
    backgroundColor: 'white',
    padding: '2rem',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    border: '1px solid #dee2e6'
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        <div className="container text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: '#fff',
          color: '#111',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh' }}>
          <div style={{ background: '#fff', color: '#111', borderRadius: '24px', boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.08)', padding: '2rem', maxWidth: '900px', width: '100%' }}>
            <form onSubmit={handleSubmit}>
              <h2 className="fw-bold display-5" style={{ color: '#111' }}>
                <FaPaw className="me-3" style={{ color: '#2C3E50' }} />
                Adoption Application
              </h2>
              <p className="fs-5" style={{ color: '#111' }}>Apply to adopt {pet?.petName}</p>

                            <div className="section-divider"></div>
                            
                            <h5 className="mb-3" style={{ color: '#111' }}>
                                <FaPaw className="me-2" style={{ color: '#2C3E50' }} />
                                Pet Information
                            </h5>
                            <div className="mb-4 p-3 bg-light rounded">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>Name:</strong> {pet?.petName}</p>
                                        <p><strong>Species:</strong> {pet?.species}</p>
                                        <p><strong>Breed:</strong> {pet?.breed}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Age:</strong> {pet?.age} years old</p>
                                        <p><strong>Description:</strong> {pet?.description}</p>
                                    </div>
                                </div>
                            </div>

                                {/* Personal Information */}
                                <div className="mb-4">
                                    <h5 className="mb-3" style={{ color: '#111' }}>
                                        <FaUser className="me-2" style={{ color: '#2C3E50' }} />
                                        Personal Information
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Full Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Email *</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Phone Number *</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                placeholder="10-digit number"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Aadhar Number *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="aadharNumber"
                                                value={formData.aadharNumber}
                                                onChange={handleInputChange}
                                                placeholder="12-digit Aadhar"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="mb-4">
                                    <h5 className="mb-3" style={{ color: '#111' }}>
                                        <FaHome className="me-2" style={{ color: '#2C3E50' }} />
                                        Address Information
                                    </h5>
                                    <div className="mb-3">
                                        <label className="form-label">Complete Address *</label>
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">City *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">State *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">ZIP Code *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Information */}
                                <div className="mb-4">
                                    <h5 className="mb-3" style={{ color: '#111' }}>
                                        <FaFileAlt className="me-2" style={{ color: '#2C3E50' }} />
                                        Financial Information
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Occupation *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Annual Income *</label>
                                            <select
                                                className="form-select"
                                                name="annualIncome"
                                                value={formData.annualIncome}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Income Range</option>
                                                <option value="Below 3 Lakhs">Below 3 Lakhs</option>
                                                <option value="3-5 Lakhs">3-5 Lakhs</option>
                                                <option value="5-8 Lakhs">5-8 Lakhs</option>
                                                <option value="8-12 Lakhs">8-12 Lakhs</option>
                                                <option value="Above 12 Lakhs">Above 12 Lakhs</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Pet Experience */}
                                <div className="mb-4">
                                    <h5 className="mb-3" style={{ color: '#111' }}>
                                        <FaPaw className="me-2" style={{ color: '#2C3E50' }} />
                                        Pet Experience
                                    </h5>
                                    <div className="mb-3">
                                        <label className="form-label">Experience with Pets *</label>
                                        <select
                                            className="form-select"
                                            name="experienceWithPets"
                                            value={formData.experienceWithPets}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Experience Level</option>
                                            <option value="No Experience">No Experience</option>
                                            <option value="Some Experience">Some Experience</option>
                                            <option value="Experienced">Experienced</option>
                                            <option value="Very Experienced">Very Experienced</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Reason for Adoption *</label>
                                        <textarea
                                            className="form-control"
                                            name="reasonForAdoption"
                                            value={formData.reasonForAdoption}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Please explain why you want to adopt this pet..."
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Living Situation */}
                                <div className="mb-4">
                                    <h5 className="mb-3" style={{ color: '#111' }}>
                                        <FaHome className="me-2" style={{ color: '#2C3E50' }} />
                                        Living Situation
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Living Situation *</label>
                                            <select
                                                className="form-select"
                                                name="livingSituation"
                                                value={formData.livingSituation}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Living Situation</option>
                                                <option value="Own House">Own House</option>
                                                <option value="Rented House">Rented House</option>
                                                <option value="Apartment">Apartment</option>
                                                <option value="With Family">With Family</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Other Pets in Home</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="otherPets"
                                                value={formData.otherPets}
                                                onChange={handleInputChange}
                                                placeholder="List any existing pets"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Children in Home</label>
                                            <select
                                                className="form-select"
                                                name="childrenInHome"
                                                value={formData.childrenInHome}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select</option>
                                                <option value="No Children">No Children</option>
                                                <option value="Young Children (0-5)">Young Children (0-5)</option>
                                                <option value="School Age (6-12)">School Age (6-12)</option>
                                                <option value="Teenagers (13-18)">Teenagers (13-18)</option>
                                                <option value="Adult Children">Adult Children</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Time Spent at Home *</label>
                                            <select
                                                className="form-select"
                                                name="timeAtHome"
                                                value={formData.timeAtHome}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="Most of the day">Most of the day</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Evenings only">Evenings only</option>
                                                <option value="Weekends only">Weekends only</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div className="mb-4">
                                    <h5 className="mb-3" style={{ color: '#111' }}>
                                        <FaPhone className="me-2" style={{ color: '#2C3E50' }} />
                                        Emergency Contact
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Emergency Contact Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="emergencyContact"
                                                value={formData.emergencyContact}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Emergency Contact Phone *</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="emergencyPhone"
                                                value={formData.emergencyPhone}
                                                onChange={handleInputChange}
                                                placeholder="10-digit number"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-lg px-5"
                                        style={{
                                            background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                                            color: '#2C3E50',
                                            border: 'none',
                                            fontWeight: 600,
                                            borderRadius: '30px',
                                            boxShadow: '0 4px 15px rgba(244, 185, 66, 0.3)',
                                            transition: 'all 0.3s',
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Adoption Application'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
    </>
  );
};

export default AdoptionApplication;
