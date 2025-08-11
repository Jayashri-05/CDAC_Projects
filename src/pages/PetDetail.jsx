import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PublicAPI } from "../api/axios";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './PetDetail.css';

const PetDetail = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPetDetails();
  }, [petId]);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const response = await PublicAPI.get(`/pets/${petId}`);
      setPet(response.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch pet details:", err);
      setError("Failed to load pet details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptClick = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { 
        state: { 
          message: 'Please log in to adopt a pet.',
          redirectTo: `/adopt/${petId}`
        }
      });
      return;
    }
    navigate(`/adopt/${petId}`);
  };

  const getSizeColor = (size) => {
    switch (size) {
      case 'Small': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Large': return '#dc3545';
      case 'Extra Large': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pet-detail-page">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading pet details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !pet) {
    return (
      <>
        <Navbar />
        <div className="pet-detail-page">
          <div className="container mt-5">
            <div className="text-center">
              <h2>Pet Not Found</h2>
              <p>{error || "The pet you're looking for doesn't exist."}</p>
              <Link to="/pets" className="btn btn-primary">
                ← Back to All Pets
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pet-detail-page">
        <div className="container mt-4">
          <div className="row">
            {/* Back Button */}
            <div className="col-12 mb-3">
              <Link to="/gallery" className="btn btn-outline-secondary">
                ← Back to Gallery
              </Link>
            </div>

            {/* Pet Images */}
            <div className="col-lg-6 mb-4">
              <div className="card">
                <div className="card-body p-0">
                  {pet.photoUrls && pet.photoUrls.trim() !== '' ? (
                    <img 
                      src={`http://localhost:8080/api/pets/images/${pet.photoUrls.split(',')[0]}`}
                      alt={pet.petName}
                      className="img-fluid w-100"
                      style={{ height: '400px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h2 className="card-title mb-0">{pet.petName}</h2>
                    <span className={`badge ${pet.adopted ? 'bg-success' : 'bg-primary'}`}>
                      {pet.adopted ? 'Adopted' : 'Available'}
                    </span>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Species:</strong> {pet.species}</p>
                      <p><strong>Breed:</strong> {pet.breed}</p>
                      <p><strong>Age:</strong> {pet.age} years old</p>
                      <p><strong>Gender:</strong> {pet.gender}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Size:</strong> 
                        <span 
                          className="badge ms-2"
                          style={{ 
                            backgroundColor: getSizeColor(pet.size),
                            color: 'white'
                          }}
                        >
                          {pet.size}
                        </span>
                      </p>
                      <p><strong>Color:</strong> {pet.color}</p>
                      <p><strong>Adoption Fee:</strong> ${pet.adoptionFee}</p>
                      <p><strong>Health Status:</strong> 
                        <span className="badge bg-info text-dark ms-2">
                          {pet.healthStatus}
                        </span>
                      </p>
                    </div>
                  </div>

                  {pet.description && (
                    <div className="mb-4">
                      <h5>About {pet.petName}</h5>
                      <p className="text-muted">{pet.description}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    {!pet.adopted ? (
                      <button 
                        className="btn btn-success btn-lg"
                        onClick={handleAdoptClick}
                      >
                        🏠 Adopt {pet.petName}
                      </button>
                    ) : (
                      <div className="alert alert-info">
                        <strong>This pet has been adopted!</strong> Thank you for your interest.
                      </div>
                    )}
                    
                    <Link 
                      to="/gallery" 
                      className="btn btn-outline-primary"
                    >
                      Browse More Pets
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetDetail; 