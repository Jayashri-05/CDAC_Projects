import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHospitalAlt, FaExclamationTriangle, FaClipboardList } from "react-icons/fa";

const UserAppointmentRequest = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    petId: "",
    appointmentType: "checkup",
    preferredDate: "",
    preferredTime: "",
    reason: "",
    notes: "",
    urgency: "medium",
    isEmergency: false
  });

  useEffect(() => {
    fetchUserPets();
  }, []);

  const fetchUserPets = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const numericUserId = parseInt(userId);
      
      console.log("[DEBUG] Fetching pets for user ID:", userId, "Numeric:", numericUserId);
      
      // Get user's adopted pets
      const response = await API.get(`/adoption-requests/user/${numericUserId}`);
      console.log("[DEBUG] Raw adoption requests response:", response.data);
      
      const adoptedPets = response.data.filter(request => request.status === 'approved');
      console.log("[DEBUG] Approved adoption requests:", adoptedPets);
      
      // Extract pet information from approved adoption requests
      const userPets = adoptedPets.map(request => request.pet);
      console.log("[DEBUG] User's adopted pets:", userPets);
      
      setPets(userPets);
      
      if (userPets.length === 0) {
        setError("You don't have any adopted pets. Please adopt a pet first before requesting veterinary appointments.");
      } else {
        console.log("[DEBUG] Successfully loaded", userPets.length, "adopted pets");
      }
    } catch (err) {
      console.error("Error fetching user pets:", err);
      setError("Failed to load your adopted pets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.petId || !formData.preferredDate || !formData.preferredTime || !formData.reason) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const requestData = {
        userId: parseInt(userId),
        petId: parseInt(formData.petId),
        appointmentType: formData.appointmentType,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        reason: formData.reason,
        notes: formData.notes,
        urgency: formData.urgency,
        isEmergency: formData.isEmergency
      };

      console.log("[DEBUG] Submitting appointment request with data:", requestData);
      console.log("[DEBUG] User ID from localStorage:", userId);
      console.log("[DEBUG] Token present:", !!localStorage.getItem("token"));

      const response = await API.post("/appointment-requests", requestData);
      
      console.log("[DEBUG] Appointment request response:", response);
      
      if (response.status === 201 || response.status === 200) {
        alert("Appointment request submitted successfully! A veterinarian will review your request and get back to you.");
        navigate("/dashboard/user");
      }
    } catch (err) {
      console.error("Error submitting appointment request:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      });
      
      if (err.response) {
        console.error("Error response:", err.response.data);
        const errorMessage = err.response.data?.error || err.response.data?.message || 'Please try again.';
        alert(`Failed to submit appointment request: ${errorMessage}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("Failed to submit appointment request: No response from server. Please check your connection.");
      } else {
        console.error("Request setup error:", err.message);
        alert("Failed to submit appointment request. Please try again.");
      }
    }
  };

  const cardStyle = {
    borderRadius: '20px',
    background: '#FFFFFF',
    padding: '2rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(85, 88, 121, 0.1)'
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
            <div className="col-lg-8">
              <div style={cardStyle}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#2C3E50' }}><FaHospitalAlt style={{ marginRight: 8, verticalAlign: 'middle' }} />Request Veterinary Appointment</h2>
                  <p className="text-muted">Submit a request for a veterinary appointment. A veterinarian will review your request and respond with available times.</p>
                </div>

                                 {error && (
                   <div className="alert alert-warning" role="alert">
                     {error}
                     {pets.length === 0 && (
                       <div className="mt-2">
                         <a href="/all-pets" className="btn btn-sm btn-primary">
                           Browse Available Pets
                         </a>
                       </div>
                     )}
                   </div>
                 )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        Select Your Pet *
                      </label>
                                             <select
                         className="form-select"
                         name="petId"
                         value={formData.petId}
                         onChange={handleInputChange}
                         required
                         disabled={pets.length === 0}
                       >
                         <option value="">
                           {pets.length === 0 ? "No adopted pets available" : "Choose your pet..."}
                         </option>
                         {pets.map((pet) => (
                           <option key={pet.id} value={pet.id}>
                             {pet.petName} ({pet.species} - {pet.breed})
                           </option>
                         ))}
                       </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        Appointment Type *
                      </label>
                      <select
                        className="form-select"
                        name="appointmentType"
                        value={formData.appointmentType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="checkup">Regular Checkup</option>
                        <option value="vaccination">Vaccination</option>
                        <option value="surgery">Surgery</option>
                        <option value="emergency">Emergency</option>
                        <option value="consultation">Consultation</option>
                        <option value="followup">Follow-up</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold" style={{ color: '#555879' }}>
                        Preferred Time *
                      </label>
                      <select
                        className="form-select"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select time...</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#555879' }}>
                      Urgency Level
                    </label>
                    <select
                      className="form-select"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                    >
                      <option value="low">Low - Routine checkup</option>
                      <option value="medium">Medium - Standard appointment</option>
                      <option value="high">High - Urgent care needed</option>
                      <option value="emergency">Emergency - Immediate attention required</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isEmergency"
                        id="isEmergency"
                        checked={formData.isEmergency}
                        onChange={handleInputChange}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <label className="form-check-label fw-bold" htmlFor="isEmergency" style={{ color: '#555879' }}>
                        <FaExclamationTriangle style={{ color: '#E74C3C', marginRight: 6, verticalAlign: 'middle' }} /> This is an Emergency Case
                      </label>
                      <div className="form-text text-muted">
                        Check this box if your pet needs immediate medical attention. Emergency cases will be prioritized and shown in the emergency section of the veterinarian dashboard.
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#555879' }}>
                      Reason for Visit *
                    </label>
                    <textarea
                      className="form-control"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Describe the reason for the appointment..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#555879' }}>
                      Additional Notes
                    </label>
                    <textarea
                      className="form-control"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Any additional information about your pet's condition or special requirements..."
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/dashboard/user")}
                      style={{
                        background: '#98A1BC',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 20px'
                      }}
                    >
                      ← Back to Dashboard
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                        color: '#2C3E50',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        boxShadow: '0 4px 15px rgba(244, 185, 66, 0.3)'
                      }}
                    >
                      <FaClipboardList style={{ marginRight: 8, verticalAlign: 'middle' }} /> Submit Request
                    </button>
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

export default UserAppointmentRequest; 