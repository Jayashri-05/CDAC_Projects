import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaClipboardList } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const VetPatients = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsResponse, healthResponse, appointmentsResponse] = await Promise.all([
        API.get("/pets"),
        API.get("/health-records"),
        API.get("/appointments")
      ]);
      
      setPets(petsResponse.data);
      setHealthRecords(healthResponse.data);
      setAppointments(appointmentsResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load patient data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getHealthRecordCount = (petId) => {
    return healthRecords.filter(record => record.petId === petId).length;
  };

  const getAppointmentCount = (petId) => {
    return appointments.filter(appointment => appointment.petId === petId).length;
  };

  const getLastAppointment = (petId) => {
    const petAppointments = appointments
      .filter(appointment => appointment.petId === petId)
      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    
    return petAppointments.length > 0 ? petAppointments[0] : null;
  };

  const getPetHealthStatus = (petId) => {
    const petRecords = healthRecords.filter(record => record.petId === petId);
    if (petRecords.length === 0) return "No Records";
    
    const activeRecords = petRecords.filter(record => record.status === 'active');
    if (activeRecords.length > 0) return "Under Treatment";
    
    return "Healthy";
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = filterSpecies === "" || pet.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  const cardStyle = {
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #F4EBD3 0%, #DED3C4 100%)',
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
          <div className="mb-4">
            <h2 className="fw-bold" style={{ color: '#2C3E50' }}>🐕 Patient Database</h2>
            <p className="text-muted">Browse and manage your patient information</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div style={cardStyle} className="text-center">
                <div className="mb-2" style={{ fontSize: '2rem' }}>🐾</div>
                <h4 style={{ color: '#555879' }}>{pets.length}</h4>
                <p className="text-muted mb-0">Total Patients</p>
              </div>
            </div>
            <div className="col-md-3">
              <div style={cardStyle} className="text-center">
                <div className="mb-2" style={{ fontSize: '2rem' }}><FaClipboardList /></div>
                <h4 style={{ color: '#555879' }}>{healthRecords.length}</h4>
                <p className="text-muted mb-0">Health Records</p>
              </div>
            </div>
            <div className="col-md-3">
              <div style={cardStyle} className="text-center">
                <div className="mb-2" style={{ fontSize: '2rem' }}>📅</div>
                <h4 style={{ color: '#555879' }}>{appointments.length}</h4>
                <p className="text-muted mb-0">Total Appointments</p>
              </div>
            </div>
            <div className="col-md-3">
              <div style={cardStyle} className="text-center">
                <div className="mb-2" style={{ fontSize: '2rem' }}>🏥</div>
                <h4 style={{ color: '#555879' }}>
                  {pets.filter(pet => getPetHealthStatus(pet.id) === 'Under Treatment').length}
                </h4>
                <p className="text-muted mb-0">Under Treatment</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={cardStyle} className="mb-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold" style={{ color: '#555879' }}>
                  Search Patients
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold" style={{ color: '#555879' }}>
                  Filter by Species
                </label>
                <select
                  className="form-select"
                  value={filterSpecies}
                  onChange={(e) => setFilterSpecies(e.target.value)}
                >
                  <option value="">All Species</option>
                  <option value="Dog">Dogs</option>
                  <option value="Cat">Cats</option>
                  <option value="Bird">Birds</option>
                  <option value="Rabbit">Rabbits</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patients List */}
          <div style={cardStyle}>
            <h4 className="mb-3" style={{ color: '#555879' }}>
              Patients ({filteredPets.length})
            </h4>
            
            {filteredPets.length === 0 ? (
              <div className="text-center py-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🐕</div>
                <h5 style={{ color: '#555879' }}>No patients found</h5>
                <p className="text-muted">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredPets.map((pet) => {
                  const lastAppointment = getLastAppointment(pet.id);
                  const healthStatus = getPetHealthStatus(pet.id);
                  
                  return (
                    <div key={pet.id} className="col-md-6 col-lg-4">
                      <div style={{
                        background: 'white',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(85, 88, 121, 0.1)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      onClick={() => navigate(`/dashboard/vet/patients/${pet.id}`)}
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: '#555879',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            marginRight: '1rem'
                          }}>
                            {pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐱' : '🐾'}
                          </div>
                          <div>
                            <h5 className="mb-0" style={{ color: '#555879' }}>{pet.petName}</h5>
                            <small className="text-muted">{pet.breed}</small>
                          </div>
                        </div>
                        
                        <div className="row text-center mb-3">
                          <div className="col-4">
                            <div className="fw-bold" style={{ color: '#555879' }}>{pet.age}</div>
                            <small className="text-muted">Years</small>
                          </div>
                          <div className="col-4">
                            <div className="fw-bold" style={{ color: '#555879' }}>
                              {getHealthRecordCount(pet.id)}
                            </div>
                            <small className="text-muted">Records</small>
                          </div>
                          <div className="col-4">
                            <div className="fw-bold" style={{ color: '#555879' }}>
                              {getAppointmentCount(pet.id)}
                            </div>
                            <small className="text-muted">Visits</small>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <span className={`badge ${
                            healthStatus === 'Under Treatment' ? 'bg-warning' :
                            healthStatus === 'Healthy' ? 'bg-success' :
                            'bg-secondary'
                          }`}>
                            {healthStatus}
                          </span>
                        </div>
                        
                        {lastAppointment && (
                          <div className="text-muted small">
                            Last visit: {new Date(lastAppointment.appointmentDate).toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="mt-3">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/vet/patients/${pet.id}/records`);
                            }}
                          >
                            <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Records
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/vet/schedule?petId=${pet.id}`);
                            }}
                          >
                            📅 Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard/vet")}
              style={{
                background: '#98A1BC',
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

export default VetPatients; 