import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PublicAPI } from "../api/axios";
import Navbar from "../components/Navbar";
import { FaPaw, FaHome, FaDog, FaCat, FaDove, FaCarrot, FaMouse, FaFish, FaExclamationTriangle, FaRedo, FaFlask, FaClipboardList, FaEye } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState(samplePets);
  const [filteredPets, setFilteredPets] = useState(samplePets);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Sample data for demonstration when backend is not available
  const samplePets = [
    {
      id: 1,
      petName: "Max",
      species: "Dog",
      breed: "Golden Retriever",
      age: 3,
      description: "Friendly and energetic dog looking for an active family. Max loves playing fetch and going on long walks.",
      size: "Large",
      adopted: false,
      photoUrls: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
      gender: "Male",
      color: "Golden",
      adoptionFee: 250,
      healthStatus: "Healthy"
    },
    {
      id: 2,
      petName: "Luna",
      species: "Cat",
      breed: "Persian",
      age: 2,
      description: "Calm and affectionate cat perfect for a quiet home. Luna enjoys sunbathing and gentle pets.",
      size: "Medium",
      adopted: false,
      photoUrls: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
      gender: "Female",
      color: "White",
      adoptionFee: 150,
      healthStatus: "Healthy"
    },
    {
      id: 3,
      petName: "Buddy",
      species: "Dog",
      breed: "Labrador",
      age: 1,
      description: "Playful puppy ready for training and lots of love. Buddy is great with kids and other pets.",
      size: "Large",
      adopted: false,
      photoUrls: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
      gender: "Male",
      color: "Yellow",
      adoptionFee: 300,
      healthStatus: "Healthy"
    },
    {
      id: 4,
      petName: "Whiskers",
      species: "Cat",
      breed: "Maine Coon",
      age: 4,
      description: "Gentle giant with a loving personality. Whiskers is perfect for families with children.",
      size: "Large",
      adopted: false,
      photoUrls: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop",
      gender: "Male",
      color: "Brown Tabby",
      adoptionFee: 200,
      healthStatus: "Healthy"
    },
    {
      id: 5,
      petName: "Bella",
      species: "Dog",
      breed: "Border Collie",
      age: 2,
      description: "Intelligent and active dog who loves learning new tricks. Bella needs an active family.",
      size: "Medium",
      adopted: false,
      photoUrls: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop",
      gender: "Female",
      color: "Black & White",
      adoptionFee: 275,
      healthStatus: "Healthy"
    },
    {
      id: 6,
      petName: "Mittens",
      species: "Cat",
      breed: "Siamese",
      age: 3,
      description: "Vocal and social cat who loves attention. Mittens would do best as an only pet.",
      size: "Medium",
      adopted: true,
      photoUrls: "https://images.unsplash.com/photo-1606214174585-fe31582cd316?w=400&h=300&fit=crop",
      gender: "Female",
      color: "Cream & Brown",
      adoptionFee: 175,
      healthStatus: "Healthy"
    }
  ];
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
      // Redirect to login page if not logged in
      navigate('/login', { 
        state: { 
          message: 'Please log in to adopt a pet. You will be redirected to the adoption form after successful login.',
          redirectTo: `/adopt/${petId}`
        }
      });
      return;
    }
    
    // Navigate to adoption form if logged in
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
      console.log("[DEBUG] Fetching available pets from API...");
      console.log("[DEBUG] Using PublicAPI for unauthenticated request");
      console.log("[DEBUG] PublicAPI baseURL:", PublicAPI.defaults.baseURL);
      
      const response = await PublicAPI.get("/pets/available");
      console.log("[DEBUG] API Response:", response);
      console.log("[DEBUG] Pets data:", response.data);
      console.log("[DEBUG] Number of available pets:", response.data.length);
      
      if (response.data && response.data.length > 0) {
        console.log("[DEBUG] First available pet:", response.data[0]);
      }
      
      setPets(response.data);
      setFilteredPets(response.data);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Failed to fetch available pets:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      console.error("Error message:", err.message);
      console.error("Error code:", err.code);
      
      if (err.response?.status === 403) {
        setError("Access denied. The backend server may not be running or the endpoint requires authentication. Please ensure the backend is running on http://localhost:8080");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Network error. Unable to connect to the backend server. Please ensure the backend is running on http://localhost:8080");
      } else {
        setError(`Failed to load available pets: ${err.response?.data || err.message}`);
      }
      // Use sample data when backend fails
      console.log("[DEBUG] Falling back to sample data");
      setPets(samplePets);
      setFilteredPets(samplePets);
      setError(""); // Clear error when using sample data
    } finally {
      setLoading(false);
    }
  };

  // Test function to check API connectivity
  const testAPI = async () => {
    try {
      console.log("[DEBUG] Testing API connectivity...");
      
      // Test the available pets endpoint
      const availableResponse = await PublicAPI.get("/pets/available");
      console.log("[DEBUG] Available pets endpoint response:", availableResponse.data);
      
      // Test the test endpoint
      const testResponse = await PublicAPI.get("/pets/test");
      console.log("[DEBUG] Test endpoint response:", testResponse.data);
      
      alert(`API Test Successful!\nAvailable pets: ${availableResponse.data.length} pets\nTest endpoint: ${testResponse.data.petCount} pets`);
    } catch (err) {
      console.error("[DEBUG] API test failed:", err);
      alert(`API Test Failed: ${err.message}`);
    }
  };

  const showSampleData = () => {
    setPets(samplePets);
    setFilteredPets(samplePets);
    setError("");
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
      <span className="badge bg-success">Adopted</span> : 
      <span className="badge bg-primary">Available</span>;
  };

  const getSpeciesIcon = (species) => {
    switch (species.toLowerCase()) {
      case 'dog': return <FaDog size={20} />;
      case 'cat': return <FaCat size={20} />;
      case 'bird': return <FaDove size={20} />;
      case 'rabbit': return <FaCarrot size={20} />;
      case 'hamster': return <FaMouse size={20} />;
      case 'fish': return <FaFish size={20} />;
      default: return <FaPaw size={20} />;
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

  const containerStyle = {
    minHeight: '100vh',
    width: '100vw',
    background: '#000000',
    padding: '2rem',
    boxSizing: 'border-box'
  };

  const cardStyle = {
    borderRadius: '8px',
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const buttonStyle = {
    borderRadius: '4px',
    fontWeight: 'bold',
    background: 'rgba(128, 128, 128, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    borderRadius: '4px'
  };

  if (error) {
    return (
      <div style={containerStyle}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                      <div className="text-center text-white">
              <div className="mb-4">
                <h2 className="mb-3">
                  <FaExclamationTriangle className="me-2" />
                  Connection Error
                </h2>
                <div style={cardStyle} className="mb-4">
                  <p className="mb-3 text-white">{error}</p>
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn" style={buttonStyle} onClick={fetchPets}>
                      <FaRedo className="me-1" />
                      Try Again
                    </button>
                    <button className="btn" style={{
                      ...buttonStyle,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }} onClick={testAPI}>
                      <FaFlask className="me-1" />
                      Test API Connection
                    </button>
                    <button className="btn" style={{
                      ...buttonStyle,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }} onClick={showSampleData}>
                      <FaClipboardList className="me-1" />
                      Show Sample Data
                    </button>
                  </div>
                </div>
                                <div style={cardStyle} className="p-3">
                  <h6 className="mb-2 text-white">Troubleshooting Tips:</h6>
                  <ul className="text-start small text-white-50">
                  <li>Make sure the backend server is running on http://localhost:8080</li>
                  <li>Check if the Spring Boot application started successfully</li>
                  <li>Verify that the database is accessible</li>
                  <li>Try refreshing the page or clicking "Try Again"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={containerStyle}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-white fw-bold display-4 mb-3">
          <FaPaw className="me-3" />
          All Pets
        </h1>
        <p className="text-white fs-5">Find your perfect companion from our loving pets</p>
        
        {loading && (
          <div className="text-center text-white mb-4">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading available pets...</p>
          </div>
        )}
        
        {/* Debug Info */}
        <div className="text-center text-white-50 mb-3">
          <small>
            Debug: Pets loaded: {pets.length}, Filtered: {filteredPets.length}, 
            Loading: {loading.toString()}, Error: {error ? "Yes" : "No"}
          </small>
        </div>
        <div className="d-flex justify-content-center gap-2">
          <button 
            className="btn btn-sm"
            style={buttonStyle}
            onClick={fetchPets}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Refresh Pets
              </>
            )}
          </button>
          <button 
            className="btn btn-sm"
            style={{
              ...buttonStyle,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            onClick={testAPI}
          >
            🧪 Test API
          </button>
          <button 
            className="btn btn-sm"
            style={{
              ...buttonStyle,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            onClick={showSampleData}
          >
                            <FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Show Sample
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={cardStyle} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-semibold text-white">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, breed, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold text-white">Species</label>
            <select
              className="form-select"
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              style={inputStyle}
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
            <label className="form-label fw-semibold text-white">Size</label>
            <select
              className="form-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold text-white">Status</label>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-white mb-3">
        <h5>Showing {filteredPets.length} of {pets.length} pets</h5>
        {pets.length === 0 && !loading && !error && (
          <div className="alert alert-info text-center">
            <h6>No pets available for adoption</h6>
            <p className="mb-0">Check back later for new pets!</p>
          </div>
        )}
      </div>

      {/* Pets Grid */}
      {filteredPets.length === 0 ? (
        <div className="text-center text-white">
          <h4>No pets found</h4>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="col-lg-4 col-md-6 col-sm-12">
              <div 
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Pet Image */}
                <div 
                  className="text-center mb-3"
                  style={{
                    height: '200px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {pet.photoUrls && pet.photoUrls.trim() !== '' ? (
                    <img 
                      src={`http://localhost:8080/api/pets/images/${pet.photoUrls.split(',')[0]}`}
                      alt={pet.petName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    style={{
                      display: pet.photoUrls && pet.photoUrls.trim() !== '' ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    {getSpeciesIcon(pet.species)}
                  </div>
                </div>

                {/* Pet Info */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-white mb-1">{pet.petName}</h5>
                    {getStatusBadge(pet.adopted)}
                  </div>
                  <p className="text-white-50 mb-1">
                    <strong>Breed:</strong> {pet.breed}
                  </p>
                  <p className="text-white-50 mb-1">
                    <strong>Age:</strong> {pet.age} years old
                  </p>
                  <p className="text-white-50 mb-1">
                    <strong>Species:</strong> {pet.species}
                  </p>
                  {pet.size && (
                    <p className="text-white-50 mb-1">
                      <strong>Size:</strong> 
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
                  )}
                  {pet.gender && pet.gender !== "Unknown" && (
                    <p className="text-white-50 mb-1">
                      <strong>Gender:</strong> {pet.gender}
                    </p>
                  )}
                  {pet.color && (
                    <p className="text-white-50 mb-1">
                      <strong>Color:</strong> {pet.color}
                    </p>
                  )}
                  {pet.adoptionFee && (
                    <p className="text-white-50 mb-1">
                      <strong>Adoption Fee:</strong> ${pet.adoptionFee}
                    </p>
                  )}
                </div>

                {/* Description Preview */}
                {pet.description && (
                  <div className="mb-3">
                    <p className="text-white-50 small" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {pet.description}
                    </p>
                  </div>
                )}

                {/* Health Status */}
                {pet.healthStatus && (
                  <div className="mb-3">
                    <span className="badge bg-info text-dark">
                      {pet.healthStatus}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="text-center">
                  <Link to={`/pet/${pet.id}`} style={{ textDecoration: 'none' }}>
                    <button className="btn btn-sm me-2" style={buttonStyle}>
                      View Details
                    </button>
                  </Link>
                  {!pet.adopted && (
                    <button 
                      className="btn btn-sm"
                      style={{
                        ...buttonStyle,
                        background: 'rgba(40, 167, 69, 0.2)',
                        border: '1px solid rgba(40, 167, 69, 0.5)'
                      }}
                      onClick={(e) => handleAdoptClick(e, pet.id)}
                    >
                      <FaHome className="me-1" />
                      Adopt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default AllPets; 