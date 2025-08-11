import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaClipboardList } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const VetHealthRecords = () => {
  const navigate = useNavigate();
  const [healthRecords, setHealthRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    petId: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    notes: "",
    followUpDate: "",
    status: "active"
  });

  useEffect(() => {
    fetchHealthRecords();
    fetchPets();
  }, []);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      const response = await API.get("/health-records");
      setHealthRecords(response.data);
    } catch (err) {
      console.error("Error fetching health records:", err);
      setError("Failed to load health records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await API.get("/pets");
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const populateFormWithExistingRecord = (record) => {
    if (record) {
      // Populate form with existing record data
      setFormData({
        petId: record.petId?.toString() || "",
        diagnosis: record.diagnosis || "",
        treatment: record.treatment || "",
        medications: record.medications || "",
        notes: record.notes || "",
        followUpDate: record.followUpDate || "",
        status: record.status || "active"
      });
    } else {
      // Reset form for new records
      setFormData({
        petId: "",
        diagnosis: "",
        treatment: "",
        medications: "",
        notes: "",
        followUpDate: "",
        status: "active"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.petId || !formData.diagnosis || !formData.treatment) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const recordData = {
        petId: parseInt(formData.petId),
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        medications: formData.medications,
        notes: formData.notes,
        followUpDate: formData.followUpDate,
        status: formData.status
      };

      console.log("[DEBUG] Submitting health record with data:", recordData);

      let response;
      if (selectedRecord) {
        // Update existing record
        response = await API.put(`/health-records/${selectedRecord.id}`, recordData);
      } else {
        // Create new record
        response = await API.post("/health-records", recordData);
      }
      
      if (response.status === 201 || response.status === 200) {
        const action = selectedRecord ? 'updated' : 'created';
        alert(`Health record ${action} successfully!`);
        setShowForm(false);
        setSelectedRecord(null);
        setFormData({
          petId: "",
          diagnosis: "",
          treatment: "",
          medications: "",
          notes: "",
          followUpDate: "",
          status: "active"
        });
        fetchHealthRecords();
      }
    } catch (err) {
      console.error("Error creating/updating health record:", err);
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
        alert(`Failed to ${selectedRecord ? 'update' : 'create'} health record: ${errorMessage}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert(`Failed to ${selectedRecord ? 'update' : 'create'} health record: No response from server. Please check your connection.`);
      } else {
        console.error("Request setup error:", err.message);
        alert(`Failed to ${selectedRecord ? 'update' : 'create'} health record. Please try again.`);
      }
    }
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.petName : "Unknown Pet";
  };

  const getPetSpecies = (petId) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.species : "";
  };

  const cardStyle = {
    borderRadius: '20px',
    background: '#FFFFFF',
    padding: '2rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(108, 117, 125, 0.1)'
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
      <style>
        {`
          .table-hover tbody tr:hover {
            background-color: rgba(108, 117, 125, 0.05) !important;
            color: #2C3E50 !important;
          }
          .table {
            background-color: #FFFFFF !important;
            color: #2C3E50 !important;
          }
          .table td, .table th {
            background-color: #FFFFFF !important;
            border-color: rgba(108, 117, 125, 0.1) !important;
          }
        `}
      </style>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: '#F8F9FA',
        padding: '2rem'
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold" style={{ color: '#2C3E50' }}><FaClipboardList style={{ marginRight: 10, verticalAlign: 'middle' }} /> Health Records</h2>
              <p className="text-muted">View patient health records and medical history</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {showForm && (
            <div style={cardStyle} className="mb-4">
              <h4 className="mb-3" style={{ color: '#2C3E50' }}>
                {selectedRecord ? '✏️ Edit Health Record' : '📝 Add New Health Record'}
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                      Select Patient *
                    </label>
                    <select
                      className="form-select"
                      name="petId"
                      value={formData.petId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose a pet...</option>
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.petName} ({pet.species})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                      Status
                    </label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    Diagnosis *
                  </label>
                  <textarea
                    className="form-control"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Enter the diagnosis..."
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    Treatment *
                  </label>
                  <textarea
                    className="form-control"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe the treatment provided..."
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                      Medications
                    </label>
                    <textarea
                      className="form-control"
                      name="medications"
                      value={formData.medications}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="List medications prescribed..."
                    ></textarea>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="followUpDate"
                      value={formData.followUpDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    Additional Notes
                  </label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any additional notes or observations..."
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedRecord(null);
                    }}
                    style={{
                      background: '#6C757D',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      background: '#2C3E50',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px'
                    }}
                  >
                    {selectedRecord ? '💾 Update Record' : '📝 Create Record'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={cardStyle}>
            <h4 className="mb-3" style={{ color: '#2C3E50' }}>Health Records ({healthRecords.length})</h4>
            
            {healthRecords.length === 0 ? (
              <div className="text-center py-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}><FaClipboardList /></div>
                <h5 style={{ color: '#2C3E50' }}>No health records found</h5>
                <p className="text-muted">Start by adding a new health record for a patient</p>
              </div>
            ) : (
              <div className="table-responsive" style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid rgba(108, 117, 125, 0.1)'
              }}>
                <table className="table" style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(108, 117, 125, 0.1)',
                  color: '#2C3E50'
                }}>
                  <thead>
                    <tr style={{ 
                      color: '#2C3E50',
                      background: 'rgba(108, 117, 125, 0.05)',
                      borderBottom: '2px solid rgba(108, 117, 125, 0.1)'
                    }}>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: '600', textAlign: 'center', borderRight: '1px solid rgba(108, 117, 125, 0.1)' }}>Patient</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: '600', textAlign: 'center', borderRight: '1px solid rgba(108, 117, 125, 0.1)' }}>Diagnosis</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: '600', textAlign: 'center', borderRight: '1px solid rgba(108, 117, 125, 0.1)' }}>Treatment</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: '600', textAlign: 'center', borderRight: '1px solid rgba(108, 117, 125, 0.1)' }}>Status</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: '600', textAlign: 'center', borderRight: '1px solid rgba(108, 117, 125, 0.1)' }}>Follow-up</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthRecords.map((record) => (
                      <tr key={record.id} style={{ 
                        backgroundColor: '#FFFFFF',
                        borderBottom: '1px solid rgba(108, 117, 125, 0.1)'
                      }}>
                        <td style={{ 
                          padding: '1rem 0.75rem', 
                          verticalAlign: 'middle',
                          borderRight: '1px solid rgba(108, 117, 125, 0.1)',
                          textAlign: 'center'
                        }}>
                          <div>
                            <strong style={{ color: '#2C3E50' }}>{getPetName(record.petId)}</strong>
                            <br />
                            <small style={{ color: '#6C757D' }}>{getPetSpecies(record.petId)}</small>
                          </div>
                        </td>
                        <td style={{ 
                          padding: '1rem 0.75rem', 
                          verticalAlign: 'middle',
                          borderRight: '1px solid rgba(108, 117, 125, 0.1)',
                          textAlign: 'center'
                        }}>
                          <div style={{ maxWidth: '200px', color: '#2C3E50' }}>
                            {record.diagnosis}
                          </div>
                        </td>
                        <td style={{ 
                          padding: '1rem 0.75rem', 
                          verticalAlign: 'middle',
                          borderRight: '1px solid rgba(108, 117, 125, 0.1)',
                          textAlign: 'center'
                        }}>
                          <div style={{ maxWidth: '200px', color: '#2C3E50' }}>
                            {record.treatment}
                          </div>
                        </td>
                        <td style={{ 
                          padding: '1rem 0.75rem', 
                          verticalAlign: 'middle',
                          borderRight: '1px solid rgba(108, 117, 125, 0.1)',
                          textAlign: 'center'
                        }}>
                          <span className={`badge ${
                            record.status === 'active' ? 'bg-success' :
                            record.status === 'resolved' ? 'bg-secondary' :
                            'bg-warning'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td style={{ 
                          padding: '1rem 0.75rem', 
                          verticalAlign: 'middle',
                          borderRight: '1px solid rgba(108, 117, 125, 0.1)',
                          textAlign: 'center'
                        }}>
                          {record.followUpDate ? (
                            <span style={{ color: '#2C3E50' }}>{new Date(record.followUpDate).toLocaleDateString()}</span>
                          ) : (
                            <span style={{ color: '#6C757D' }}>Not scheduled</span>
                          )}
                        </td>
                        <td style={{ 
                          padding: '1rem 0.75rem', 
                          verticalAlign: 'middle',
                          textAlign: 'center'
                        }}>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedRecord(record);
                              populateFormWithExistingRecord(record);
                              setShowForm(true);
                            }}
                            style={{
                              borderRadius: '8px',
                              borderWidth: '2px',
                              fontWeight: '600'
                            }}
                          >
                            <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard/vet")}
              style={{
                background: '#6C757D',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px'
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VetHealthRecords; 