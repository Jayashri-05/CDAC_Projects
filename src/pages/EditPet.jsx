import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditPet.css';

const EditPet = () => {
  const navigate = useNavigate();
  const { petId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pet, setPet] = useState({
    petName: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    size: "",
    gender: "",
    color: "",
    adoptionFee: "",
    healthStatus: "",
    photoUrls: ""
  });

  useEffect(() => {
    fetchPet();
  }, [petId]);

  const fetchPet = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/pets/${petId}`);
      setPet(response.data);
    } catch (err) {
      console.error("Failed to fetch pet:", err);
      setError("Failed to load pet details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPet(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) {
      setError("You must be logged in to edit pets. Please log in again.");
      setSaving(false);
      return;
    }

    try {
      console.log("[DEBUG] Updating pet with data:", pet);
      console.log("[DEBUG] Token from localStorage:", token);
      console.log("[DEBUG] User ID from localStorage:", userId);
      
      const response = await API.put(`/pets/${petId}`, pet);
      console.log("[DEBUG] Update response:", response);
      
      alert("Pet updated successfully!");
      navigate("/dashboard/shelter/pets");
    } catch (err) {
      console.error("Failed to update pet:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      let errorMessage = "Failed to update pet. Please try again.";
      if (err.response?.data) {
        errorMessage = err.response.data;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Remove all inline styles - CSS file will handle styling

  if (loading) {
    return (
      <div className="edit-pet-container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading pet details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-pet-container">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>✏️ Edit Pet</h1>
            <p>Update pet information</p>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard/shelter/pets')}
          >
            ← Back to Pets
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Edit Pet Details</h4>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Basic Information */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="petName"
                        value={pet.petName || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Species *
                      </label>
                      <select
                        className="form-select"
                        name="species"
                        value={pet.species || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Species</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Hamster">Hamster</option>
                        <option value="Fish">Fish</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Breed *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="breed"
                        value={pet.breed || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Age (years) *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={pet.age || ""}
                        onChange={handleInputChange}
                        min="0"
                        max="30"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Size
                      </label>
                      <select
                        className="form-select"
                        name="size"
                        value={pet.size || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="Extra Large">Extra Large</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Gender
                      </label>
                      <select
                        className="form-select"
                        name="gender"
                        value={pet.gender || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Color
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="color"
                        value={pet.color || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., Brown, Black, White"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Adoption Fee ($)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="adoptionFee"
                        value={pet.adoptionFee || ""}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={pet.description || ""}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Describe the pet's personality, behavior, special needs, etc."
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Health Status
                      </label>
                      <select
                        className="form-select"
                        name="healthStatus"
                        value={pet.healthStatus || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Health Status</option>
                        <option value="Healthy">Healthy</option>
                        <option value="Under Treatment">Under Treatment</option>
                        <option value="Recovering">Recovering</option>
                        <option value="Special Needs">Special Needs</option>
                        <option value="Vaccinated">Vaccinated</option>
                        <option value="Spayed/Neutered">Spayed/Neutered</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Photo URLs
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="photoUrls"
                        value={pet.photoUrls || ""}
                        onChange={handleInputChange}
                        placeholder="Comma-separated image filenames"
                      />
                      <small>
                        Enter image filenames separated by commas
                      </small>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/dashboard/shelter/pets')}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPet; 