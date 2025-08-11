import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaw, FaHeart, FaDog, FaCat } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const AnimalCarousel = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pets from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        console.log('Fetching pets from API...');
        const response = await axios.get('/pets/available');
        console.log('API Response:', response.data);
        if (response.data && Array.isArray(response.data)) {
          // Show all pets (adopted and not adopted), take first 8 for carousel
          const availablePets = response.data
            .slice(0, 8)
            .map(pet => ({
              id: pet.id,
              name: pet.petName,
              type: pet.species,
              breed: pet.breed,
              age: `${pet.age} years`,
              image: pet.photoUrls && pet.photoUrls.trim() !== '' 
                ? (pet.photoUrls.startsWith('http') 
                    ? pet.photoUrls.split(',')[0] 
                    : `http://localhost:8080/api/pets/images/${pet.photoUrls.split(',')[0]}`)
                : `https://via.placeholder.com/400x300/667eea/ffffff?text=${pet.species}`,
              description: pet.description || `${pet.species} looking for a loving home`,
              adopted: pet.adopted // keep adopted status
            }));
          setPets(availablePets);
        }
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load pets');
        // Fallback to sample data if API fails
        const fallbackPets = [
          {
            id: 1,
            name: "Buddy",
            type: "Dog",
            breed: "Golden Retriever",
            age: "2 years",
            image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face",
            description: "Friendly and energetic companion"
          },
          {
            id: 2,
            name: "Luna",
            type: "Cat",
            breed: "Persian",
            age: "1 year",
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=face",
            description: "Gentle and loving indoor cat"
          }
        ];
        console.log('Using fallback pets:', fallbackPets);
        setPets(fallbackPets);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    height: '100%'
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '15px 15px 0 0'
  };

  console.log('AnimalCarousel render - loading:', loading, 'error:', error, 'pets:', pets);
  
  // Add a click handler for pet cards that checks adoption status
  const handlePetCardClick = (pet) => {
    if (pet.adopted) {
      alert('This pet is already adopted!');
      return;
    }
    navigate(`/pet/${pet.id}`);
  };
  
  return (
    <div style={{ padding: '60px 0', background: '#f8f9fa' }}>
      <div className="container-fluid">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-5"
        >
          <h2 className="display-4 fw-bold mb-3" style={{ color: '#2C3E50' }}>
            <FaPaw className="me-3" />
            Meet Our Adorable Friends
            <FaPaw className="ms-3" />
          </h2>
          <p className="lead fs-4 mb-5" style={{ color: '#6c757d' }}>
            These loving animals are waiting for their forever homes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading adorable pets...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p className="text-muted">{error}</p>
              <p className="text-muted">Showing sample pets</p>
            </div>
          ) : (
            <div className="row g-4">
              {pets.filter(pet => !pet.adopted).map((pet, index) => (
                <div key={pet.id} className="col-lg-3 col-md-4 col-sm-6">
                  <motion.div
                    style={cardStyle}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      y: -10
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="animal-card"
                  >
                    <img 
                      src={pet.image} 
                      alt={pet.name}
                      style={imageStyle}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x300/667eea/ffffff?text=${pet.type}`;
                      }}
                    />
                    {pet.adopted && (
                      <div style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'linear-gradient(135deg, #6C757D 0%, #A0A0A0 100%)',
                        color: '#fff',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                      }}>
                        Adopted
                      </div>
                    )}
                    <div style={{ padding: '20px' }}>
                      <h4 className="fw-bold mb-2" style={{ color: '#333' }}>
                        {pet.name}
                      </h4>
                      <div className="mb-2">
                        <span 
                          className="badge me-2" 
                          style={{ 
                            background: '#007bff',
                            color: 'white',
                            fontSize: '0.8rem'
                          }}
                        >
                          {pet.type === 'Dog' ? <FaDog className="me-1" /> : <FaCat className="me-1" />}
                          {pet.type}
                        </span>
                        <span 
                          className="badge" 
                          style={{ 
                            background: '#e9ecef',
                            color: '#495057',
                            fontSize: '0.8rem'
                          }}
                        >
                          {pet.breed}
                        </span>
                      </div>
                      <p className="text-muted mb-2">
                        <strong>Age:</strong> {pet.age}
                      </p>
                      <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                        {pet.description}
                      </p>
                      <motion.button
                        className="btn w-100 fw-bold"
                        style={{
                          background: 'linear-gradient(135deg, #F4B942 0%, #F7C55A 100%)',
                          border: 'none',
                          color: 'black',
                          borderRadius: '8px',
                          padding: '10px',
                          boxShadow: '0 4px 15px rgba(244, 185, 66, 0.3)'
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 6px 20px rgba(244, 185, 66, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePetCardClick(pet)}
                      >
                        <FaHeart className="me-2" />
                        Learn More
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-5"
        >
          <motion.button
            className="btn btn-lg px-5 py-3 fw-bold"
            style={{
              background: 'linear-gradient(135deg, #F4B942 0%, #F7C55A 100%)',
              border: '2px solid #F4B942',
              color: 'black',
              borderRadius: '50px',
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(244, 185, 66, 0.3)'
            }}
            whileHover={{ 
              scale: 1.05,
              background: 'linear-gradient(135deg, #E6A532 0%, #F4B942 100%)',
              boxShadow: '0 6px 20px rgba(244, 185, 66, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/all-pets')}
          >
            <FaDog className="me-2" />
            View All Available Pets
            <FaCat className="ms-2" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimalCarousel;
