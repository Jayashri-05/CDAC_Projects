import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaPaw, FaExclamationTriangle, FaMapMarkerAlt, FaPhone, FaCamera, FaEye, FaTimes, FaCheck, FaClipboardList } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const StrayPetReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    petType: "",
    description: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    contactPhone: "",
    urgency: "medium",
    additionalNotes: ""
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      if (photo) {
        submitData.append('photo', photo);
      }

      const userId = localStorage.getItem('userId');
      submitData.append('userId', userId);
      submitData.append('timestamp', new Date().toISOString());

      const response = await fetch('http://localhost:8080/api/stray-pet-reports', {
        method: 'POST',
        body: submitData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Stray pet report submitted successfully!');
        navigate('/dashboard/user');
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle = {
    borderRadius: '20px',
    background: '#FFFFFF',
    padding: '2rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(85, 88, 121, 0.1)'
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: '#F8F9FA',
        padding: '2rem'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <div style={cardStyle}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#2C3E50' }}><FaPaw style={{ marginRight: 8, verticalAlign: 'middle' }} />Report Stray Pet</h2>
                  <p className="text-muted">Help us locate and assist stray pets in your area. Your report will be reviewed and shared with local animal rescue organizations.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-4">

                    {/* Pet Type */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaPaw style={{ marginRight: 6, verticalAlign: 'middle' }} /> Pet Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="petType"
                        value={formData.petType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select pet type</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Urgency */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaExclamationTriangle style={{ marginRight: 6, verticalAlign: 'middle' }} /> Urgency Level
                      </label>
                      <select
                        className="form-select"
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                      >
                        <option value="low">Low - Pet appears healthy and safe</option>
                        <option value="medium">Medium - Pet needs attention soon</option>
                        <option value="high">High - Pet needs immediate help</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Describe the pet's appearance, behavior, and any visible injuries or health issues..."
                        required
                      ></textarea>
                    </div>

                    {/* Location */}
                    <div className="col-12">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaMapMarkerAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Location <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Near Central Park, Behind Walmart"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaMapMarkerAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Full Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter the complete street address"
                        required
                      />
                    </div>

                    {/* City, State, Zip */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaMapMarkerAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> City <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaMapMarkerAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> State <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaMapMarkerAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> ZIP Code <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Contact Phone */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaPhone style={{ marginRight: 6, verticalAlign: 'middle' }} /> Contact Phone
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        placeholder="Your phone number (optional)"
                      />
                    </div>

                    {/* Photo Upload */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaCamera style={{ marginRight: 6, verticalAlign: 'middle' }} /> Photo
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                      <small className="form-text text-muted">
                        <FaCamera style={{ marginRight: 4 }} /> Upload a photo of the pet if possible
                      </small>
                    </div>

                    {/* Photo Preview */}
                    {photoPreview && (
                      <div className="col-12">
                        <label className="form-label fw-bold" style={{ color: '#555879' }}>
                          <FaEye style={{ marginRight: 6, verticalAlign: 'middle' }} /> Photo Preview
                        </label>
                        <div className="text-center">
                          <img
                            src={photoPreview}
                            alt="Pet preview"
                            style={{
                              maxWidth: '300px',
                              maxHeight: '300px',
                              borderRadius: '16px',
                              border: '3px solid #e9ecef',
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    <div className="col-12">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Additional Notes
                      </label>
                      <textarea
                        className="form-control"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Any additional information that might help rescuers..."
                      ></textarea>
                    </div>

                    {/* Submit Buttons */}
                    <div className="col-12">
                      <div className="d-flex justify-content-between">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => navigate('/dashboard/user')}
                          style={{
                            background: '#98A1BC',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 20px'
                          }}
                        >
                          <FaTimes style={{ marginRight: 8, verticalAlign: 'middle' }} /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                          style={{
                            background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                            color: '#2C3E50',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            boxShadow: '0 4px 15px rgba(244, 185, 66, 0.3)'
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <FaCheck style={{ marginRight: 8, verticalAlign: 'middle' }} /> Submit Report
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StrayPetReport;
