import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PublicAPI } from "../api/axios";
import Navbar from "../components/Navbar";
import './AllPetsPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllPetsPage = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Check if user is logged in
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return token && userId;
  };

  // Handle adopt button click
  const handleAdoptClick = (e, petId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isUserLoggedIn()) {
      navigate('/login', { 
        state: { 
          message: 'Please log in to adopt a pet. You will be redirected to the adoption form after successful login.',
          redirectTo: `/adopt/${petId}`
        }
      });
      return;
    }
    
    navigate(`/adopt/${petId}`);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [pets, searchTerm, selectedSpecies, selectedSize, selectedStatus]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      console.log("[DEBUG] Fetching all pets from API...");
      
      const response = await PublicAPI.get("/pets/available");
      console.log("[DEBUG] API Response:", response);
      console.log("[DEBUG] Pets data:", response.data);
      console.log("[DEBUG] Number of pets:", response.data.length);
      
      if (response.data && response.data.length > 0) {
        console.log("[DEBUG] First pet:", response.data[0]);
        setPets(response.data);
        setFilteredPets(response.data);
        setError("");
      } else {
        console.log("[DEBUG] No pets found in API");
        setPets([]);
        setFilteredPets([]);
        setError("");
      }
    } catch (err) {
      console.error("Failed to fetch pets:", err);
      setPets([]);
      setFilteredPets([]);
      setError("Failed to load pets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterPets = () => {
    let filtered = pets.filter(pet => {
      const matchesSearch = pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (pet.description && pet.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecies = !selectedSpecies || pet.species === selectedSpecies;
      const matchesSize = !selectedSize || pet.size === selectedSize;
      const matchesStatus = !selectedStatus || 
                           (selectedStatus === "Available" && !pet.adopted) ||
                           (selectedStatus === "Adopted" && pet.adopted);
      
      return matchesSearch && matchesSpecies && matchesSize && matchesStatus;
    });
    
    setFilteredPets(filtered);
  };

  const getStatusBadge = (adopted) => {
    return adopted ? 
      <span className="status-badge status-adopted">Adopted</span> : 
      <span className="status-badge status-available">Available</span>;
  };

  const getSpeciesIcon = (species) => {
    switch (species.toLowerCase()) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🐦';
      case 'rabbit': return '🐰';
      case 'hamster': return '🐹';
      case 'fish': return '🐠';
      default: return '🐾';
    }
  };

  const getSizeColor = (size) => {
    switch (size) {
      case 'Small': return 'size-small';
      case 'Medium': return 'size-medium';
      case 'Large': return 'size-large';
      case 'Extra Large': return 'size-extra-large';
      default: return 'size-small';
    }
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
            <p className="loading-text">Loading pets...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="all-pets-container">
        <div className="container">
          {/* Header */}
          <div className="all-pets-header">
            <h1 className="all-pets-title">🐾 All Available Pets</h1>
            <p className="all-pets-subtitle">Find your perfect companion from our loving pets</p>
          </div>

          {/* Filters */}
          <div className="filters-card">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="filter-label">Search</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search by name, breed, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="filter-label">Species</label>
                <select
                  className="filter-select"
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                >
                  <option value="">All Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Hamster">Hamster</option>
                  <option value="Fish">Fish</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="filter-label">Size</label>
                <select
                  className="filter-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">All Sizes</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Extra Large">Extra Large</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="filter-label">Status</label>
                <select
                  className="filter-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count">
            Showing {filteredPets.length} of {pets.length} pets
          </div>

          {/* Pets Grid */}
          {filteredPets.length === 0 ? (
            <div className="no-results">
              <h4>No pets found</h4>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredPets.map((pet) => (
                <div key={pet.id} className="col-lg-4 col-md-6 col-sm-12">
                  <div className="pet-card">
                    {/* Pet Image */}
                    <div className="pet-image-container">
                      {pet.photoUrls && pet.photoUrls.trim() !== '' ? (
                        <img 
                          src={pet.photoUrls.startsWith('http') ? pet.photoUrls : `http://localhost:8080/api/pets/images/${pet.photoUrls.split(',')[0]}`}
                          alt={pet.petName}
                          className="pet-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="pet-icon-placeholder">
                        {getSpeciesIcon(pet.species)}
                      </div>
                    </div>

                    {/* Pet Info */}
                    <div className="pet-card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="pet-title">{pet.petName}</h5>
                        {getStatusBadge(pet.adopted)}
                      </div>
                      <p className="pet-info">
                        <strong>Breed:</strong> {pet.breed}
                      </p>
                      <p className="pet-info">
                        <strong>Age:</strong> {pet.age} years old
                      </p>
                      <p className="pet-info">
                        <strong>Species:</strong> {pet.species}
                      </p>
                      {pet.size && (
                        <p className="pet-info">
                          <strong>Size:</strong> 
                          <span className={`size-badge ${getSizeColor(pet.size)}`}>
                            {pet.size}
                          </span>
                        </p>
                      )}
                      {pet.gender && pet.gender !== "Unknown" && (
                        <p className="pet-info">
                          <strong>Gender:</strong> {pet.gender}
                        </p>
                      )}
                      {pet.color && (
                        <p className="pet-info">
                          <strong>Color:</strong> {pet.color}
                        </p>
                      )}
                      {pet.adoptionFee && (
                        <p className="pet-info">
                          <strong>Adoption Fee:</strong> ${pet.adoptionFee}
                        </p>
                      )}
                    </div>

                    {/* Description Preview */}
                    {pet.description && (
                      <div className="pet-card-body pt-0">
                        <p className="pet-description">
                          {pet.description}
                        </p>
                      </div>
                    )}

                    {/* Health Status */}
                    {pet.healthStatus && (
                      <div className="pet-card-body pt-0">
                        <span className="health-badge">
                          {pet.healthStatus}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <Link to={`/pet/${pet.id}`} className="btn-view-details">
                        View Details
                      </Link>
                      {!pet.adopted && (
                        <button 
                          className="btn-adopt"
                          onClick={(e) => handleAdoptClick(e, pet.id)}
                        >
                          🏠 Adopt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to Dashboard */}
          <div className="back-to-dashboard">
            <Link to="/dashboard/user" className="btn-back">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPetsPage; 