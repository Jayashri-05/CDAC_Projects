import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaHospitalAlt, FaUser, FaPaw, FaStethoscope, FaPills, FaCalendarAlt, FaEdit, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const SendHealthRecord = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [adopters, setAdopters] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [adopter, setAdopter] = useState("");
  const [formData, setFormData] = useState({
    diagnosis: "",
    treatment: "",
    medications: "",
    notes: "",
    followUpDate: "",
    status: "active"
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const petsResponse = await API.get("/pets");
      setPets(petsResponse.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load pets");
      setLoading(false);
    }
  };

  // When a pet is selected, fetch its adopter
  useEffect(() => {
    if (selectedPet) {
      fetchAdopterForPet(selectedPet);
    } else {
      setAdopter("");
    }
  }, [selectedPet]);

  const fetchAdopterForPet = async (petId) => {
    try {
      // This assumes an endpoint exists to get the adopter for a pet
      const res = await API.get(`/pets/${petId}/adopter`);
      setAdopter(res.data?.adopterName || res.data?.email || "");
    } catch (err) {
      setAdopter("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedPet || !formData.diagnosis || !formData.treatment) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      const recordData = {
        petId: parseInt(selectedPet),
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        medications: formData.medications,
        notes: formData.notes,
        followUpDate: formData.followUpDate,
        status: formData.status
      };
      await API.post("/health-records", recordData);
      setSuccess("Health record sent to adopter successfully!");
      setFormData({
        diagnosis: "",
        treatment: "",
        medications: "",
        notes: "",
        followUpDate: "",
        status: "active"
      });
      setSelectedPet("");
      setAdopter("");
    } catch (err) {
      setError("Failed to send health record. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: '100vh', padding: '2rem' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div style={{ background: '#fff', color: '#111', border: '1px solid #eee', boxShadow: '0 8px 25px rgba(0,0,0,0.08)', zIndex: 2, borderRadius: '16px', padding: '2rem', width: '100%' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="mb-2" style={{ color: '#2C3E50' }}>
                    <FaHospitalAlt style={{ marginRight: 8, verticalAlign: 'middle' }} /> Send Health Record to Adopter
                  </h2>
                  <p className="text-muted">Create and send health records to pet adopters</p>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/dashboard/vet")}
                  style={{
                    background: '#98A1BC',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 16px'
                  }}
                >
                  <FaArrowLeft style={{ marginRight: 6, verticalAlign: 'middle' }} /> Back to Dashboard
                </button>
              </div>
              
              {success && <div className="alert alert-success" style={{ color: '#111', background: '#e9ffe9', borderColor: '#b2f2b2' }}>{success}</div>}
              {error && <div className="alert alert-danger" style={{ color: '#111', background: '#ffe9e9', borderColor: '#f2b2b2' }}>{error}</div>}
              
              <form onSubmit={handleSubmit} style={{ color: '#111', background: '#fff' }}>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    <FaPaw style={{ marginRight: 6, verticalAlign: 'middle' }} /> Select Pet *
                  </label>
                  <select
                    className="form-select"
                    value={selectedPet}
                    onChange={e => setSelectedPet(e.target.value)}
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
                
                {adopter && (
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                      <FaUser style={{ marginRight: 6, verticalAlign: 'middle' }} /> Adopter
                    </label>
                    <input className="form-control" value={adopter} disabled />
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    <FaStethoscope style={{ marginRight: 6, verticalAlign: 'middle' }} /> Diagnosis *
                  </label>
                  <textarea
                    className="form-control"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    rows="2"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    <FaHospitalAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Treatment *
                  </label>
                  <textarea
                    className="form-control"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    <FaPills style={{ marginRight: 6, verticalAlign: 'middle' }} /> Medications
                  </label>
                  <textarea
                    className="form-control"
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
                    rows="2"
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    <FaCalendarAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Follow-up Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                    <FaEdit style={{ marginRight: 6, verticalAlign: 'middle' }} /> Additional Notes
                  </label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                  ></textarea>
                </div>
                
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/dashboard/vet")}
                    style={{
                      background: '#98A1BC',
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
                      background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      color: '#2C3E50',
                      fontWeight: '600'
                    }}
                  >
                    <FaPaperPlane style={{ marginRight: 6, verticalAlign: 'middle' }} /> Send Health Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendHealthRecord;
