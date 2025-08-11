import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";
import { FaPaw, FaDog, FaCat, FaDove, FaMouse, FaFish, FaPlus, FaTrash } from "react-icons/fa";
import './ShelterPets.css';
import Navbar from "../components/Navbar";

const ShelterPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [petsWithConstraints, setPetsWithConstraints] = useState(new Set());

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [pets, searchTerm, selectedSpecies, selectedSize, selectedStatus]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log("[DEBUG] fetchPets called");
      console.log("[DEBUG] Token:", token ? "Present" : "Missing");
      console.log("[DEBUG] UserId:", userId);
      
      if (!token || !userId) {
        setError("Authentication required. Please log in again.");
        return;
      }
      
      console.log("[DEBUG] Making API request to /pets/my-pets?userId=" + userId);
      const response = await API.get(`/pets/my-pets?userId=${userId}`);
      console.log("[DEBUG] API Response:", response);
      console.log("[DEBUG] Pets data:", response.data);
      console.log("[DEBUG] Number of pets:", response.data.length);
      
      setPets(response.data);
      setFilteredPets(response.data);
    } catch (err) {
      console.error("[DEBUG] Error in fetchPets:", err);
      console.error("[DEBUG] Error response:", err.response);
      console.error("[DEBUG] Error status:", err.response?.status);
      console.error("[DEBUG] Error data:", err.response?.data);
      
      if (err.response?.status === 403) {
        setError("Access denied. You may not have permission to view these pets.");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Network error. Unable to connect to the server.");
      } else {
        setError(`Failed to load pets: ${err.response?.data || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterPets = () => {
    let filtered = pets.filter(pet => {
      const matchesSearch = pet.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleEditPet = (petId) => {
    navigate(`/dashboard/shelter/edit-pet/${petId}`);
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet? This action cannot be undone and will also delete all related records (adoption requests, appointments, etc.).")) {
      try {
        const response = await API.delete(`/pets/${petId}`);
        fetchPets();
        
        // Check if response has a message
        if (response.data && response.data.message) {
          alert(response.data.message);
        } else {
          alert("Pet deleted successfully!");
        }
      } catch (err) {
        console.error("Delete pet error:", err);
        
        // Check if the error response has a specific message
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessage = err.response.data.error;
          
          // Provide more user-friendly error messages
          if (errorMessage.includes("foreign key constraint")) {
            alert("Cannot delete this pet because it has related records (appointments, adoption requests, etc.). The system will attempt to delete all related records and then delete the pet. Please try again.");
          } else {
            alert(`Error: ${errorMessage}`);
          }
        } else {
          alert("Failed to delete pet. Please try again.");
        }
      }
    }
  };

  const getStatusBadge = (adopted) => {
    return adopted ? 
      <span className="status-badge adopted-badge">Adopted</span> : 
      <span className="status-badge available-badge">Available</span>;
  };

  const getSpeciesIcon = (species) => {
    switch (species?.toLowerCase()) {
      case 'dog': return <FaDog />;
      case 'cat': return <FaCat />;
      case 'bird': return <FaDove />;
      case 'rabbit': return <FaMouse />;
      case 'hamster': return <FaMouse />;
      case 'fish': return <FaFish />;
      default: return <FaPaw />;
    }
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
        <div className="loading-container">
          <div className="text-center">
            <div className="spinner-border loading-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="loading-text">Loading your pets...</p>
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
            <h2 className="error-title">⚠️ Error</h2>
            <p className="error-message">{error}</p>
            <button className="btn-try-again" onClick={fetchPets}>
              🔄 Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="shelter-pets-container">
        <div className="container">
          {/* Header */}
          <div className="shelter-pets-header">
            <div>
              <h1 className="shelter-pets-title"><FaDog style={{ marginRight: 10, verticalAlign: 'middle' }} /> My Pets</h1>
              <p className="shelter-pets-subtitle">Manage your pet listings</p>
            </div>
            <div className="header-buttons">
              <button 
                className="btn-back-dashboard"
                onClick={() => navigate('/dashboard/shelter')}
              >
                ← Back to Dashboard
              </button>
              <button 
                className="btn-add-pet"
                onClick={() => navigate('/dashboard/shelter/add')}
              >
                <FaPlus style={{ marginRight: 6, verticalAlign: 'middle' }} /> Add New Pet
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="stat-card">
              <div className="stat-value">{pets.length}</div>
              <div className="stat-label">Total Pets</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
              <div className="stat-value">{pets.filter(p => !p.adopted).length}</div>
              <div className="stat-label">Available Pets</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
              <div className="stat-value">{pets.filter(p => p.adopted).length}</div>
              <div className="stat-label">Adopted Pets</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
              <div className="stat-value">{pets.filter(p => p.species === 'Dog').length}</div>
              <div className="stat-label">Dogs</div>
            </motion.div>
          </div>

          {/* Filter Card */}
          <div className="filter-card">
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
                  className="filter-input"
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
                  className="filter-input"
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
                  className="filter-input"
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
            <h5>Showing {filteredPets.length} of {pets.length} pets</h5>
          </div>

          {/* Pets Grid */}
          {filteredPets.length === 0 ? (
            <div className="no-pets-found">
              <h4>No pets found</h4>
              <p>Try adjusting your search criteria or add a new pet</p>
              <button 
                className="btn-add-pet"
                onClick={() => navigate('/dashboard/shelter/add')}
              >
                <FaPlus style={{ marginRight: 6, verticalAlign: 'middle' }} /> Add Your First Pet
              </button>
            </div>
          ) : (
            <div className="pets-grid">
              {filteredPets.map((pet, idx) => (
                <motion.div
                  key={pet.id}
                  className="pet-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Pet Image */}
                  <div className="pet-image-wrapper">
                    {pet.photoUrls && pet.photoUrls.trim() !== '' ? (
                      <img 
                        src={`http://localhost:8080/api/pets/images/${pet.photoUrls.split(',')[0]}`}
                        alt={pet.petName}
                        className="pet-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="pet-icon-fallback" style={{ display: pet.photoUrls && pet.photoUrls.trim() !== '' ? 'none' : 'flex' }}>
                      {getSpeciesIcon(pet.species)}
                    </div>
                  </div>
                  
                  {/* Pet Info */}
                  <div className="pet-info">
                    <div className="pet-info-header">
                      <h5 className="pet-name">{pet.petName}</h5>
                      {getStatusBadge(pet.adopted)}
                    </div>
                    
                    <div className="pet-details-compact">
                      <p className="pet-detail"><strong>Breed:</strong> {pet.breed}</p>
                      <p className="pet-detail"><strong>Age:</strong> {pet.age} years old</p>
                      <p className="pet-detail"><strong>Species:</strong> {pet.species}</p>
                      {pet.size && (
                        <p className="pet-detail"><strong>Size:</strong> <span className="size-badge" style={{ backgroundColor: getSizeColor(pet.size) }}>{pet.size}</span></p>
                      )}
                      {pet.adoptionFee && (
                        <p className="pet-detail"><strong>Fee:</strong> ₹{pet.adoptionFee}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeletePet(pet.id)}
                      title="Delete this pet"
                    >
                      <FaTrash style={{ marginRight: 6, verticalAlign: 'middle' }} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShelterPets; 