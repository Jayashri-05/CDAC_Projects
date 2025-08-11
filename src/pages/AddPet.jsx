import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaPaw, FaDog, FaBone, FaBirthdayCake, FaEdit, FaUpload, FaSave, FaTimes, FaVenusMars, FaPalette, FaRuler, FaPills, FaDollarSign, FaCamera, FaImage } from 'react-icons/fa';
import './AddPet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { showSuccessToast, showErrorToast } from '../utils/toast.jsx';

const AddPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    petName: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    healthStatus: "Healthy",
    size: "Medium",
    gender: "Unknown",
    color: "",
    specialNeeds: "",
    adoptionFee: ""
  });
  const [photos, setPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });
      photos.forEach((photo) => {
        formDataToSend.append(`photos`, photo);
      });
      const shelterId = localStorage.getItem("userId");
      if (shelterId) {
        formDataToSend.append("shelterId", shelterId);
      } else {
        throw new Error("User ID not found. Please log in again.");
      }
      const response = await API.post("/pets", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201 || response.status === 200) {
        showSuccessToast("Pet added successfully!");
        navigate("/dashboard/shelter/pets");
      }
    } catch (err) {
      showErrorToast(err.response?.data?.message || err.message || "Failed to add pet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-pet-container">
        <div className="container">
          {/* Header */}
          <div className="add-pet-header">
            <h1 className="add-pet-title">
              <FaDog className="me-3" />
              Add New Pet
            </h1>
            <p className="add-pet-subtitle">Help a pet find their forever home by adding them to our adoption platform</p>
          </div>

          {/* Form Card */}
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <div className="add-pet-card">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger alert-add-pet" role="alert">
                      <strong>Error:</strong> {error}
                      <br />
                      <small>Please check the browser console for more details.</small>
                    </div>
                  )}
                  <div className="row g-4">
                    {/* Basic Information */}
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <FaPaw className="me-2" />
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-add-pet"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                        placeholder="Enter pet's name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <FaBone className="me-2" />
                        Species *
                      </label>
                      <select
                        className="form-select form-select-add-pet"
                        name="species"
                        value={formData.species}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select species</option>
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
                      <label className="form-label form-label-add-pet">
                        <FaDog className="me-2" />
                        Breed *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-add-pet"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Golden Retriever, Persian"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <FaBirthdayCake className="me-2" />
                        Age (years) *
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-add-pet"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="0"
                        max="30"
                        placeholder="Enter age in years"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <FaVenusMars className="me-2" />
                        Gender
                      </label>
                      <select
                        className="form-select form-select-add-pet"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="Unknown">Unknown</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <FaPalette className="me-2" />
                        Color
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-add-pet"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="e.g., Brown, Black, White"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <FaRuler className="me-2" />
                        Size
                      </label>
                      <select
                        className="form-select form-select-add-pet"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                      >
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="Extra Large">Extra Large</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <FaPills className="me-2" />
                        Health Status
                      </label>
                      <select
                        className="form-select form-select-add-pet"
                        name="healthStatus"
                        value={formData.healthStatus}
                        onChange={handleChange}
                      >
                        <option value="Healthy">Healthy</option>
                        <option value="Under Treatment">Under Treatment</option>
                        <option value="Recovering">Recovering</option>
                        <option value="Special Care">Special Care</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <span className="me-2" style={{fontWeight: 'bold', fontSize: '1.2em'}}>₹</span>
                        Adoption Fee (₹)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-add-pet"
                        name="adoptionFee"
                        value={formData.adoptionFee}
                        onChange={handleChange}
                        min="0"
                        placeholder="Enter adoption fee in rupees"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label form-label-add-pet">
                        <FaEdit className="me-2" />
                        Special Needs
                      </label>
                      <textarea
                        className="form-control form-control-add-pet"
                        name="specialNeeds"
                        value={formData.specialNeeds}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Any special care requirements or medical needs"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label form-label-add-pet">
                        <FaEdit className="me-2" />
                        Description *
                      </label>
                      <textarea
                        className="form-control form-control-add-pet"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                        placeholder="Tell us about this pet's personality, behavior, likes, dislikes, and any other important information that would help potential adopters..."
                      />
                    </div>
                    {/* Photo Upload */}
                    <div className="col-md-6">
                      <label className="form-label form-label-add-pet">
                        <FaCamera className="me-2" />
                        Pet Photos
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-add-pet"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                      <div className="form-help-text">
                        You can upload multiple photos. Supported formats: JPG, PNG, GIF
                      </div>
                      {photos.length > 0 && (
                        <div className="mt-2">
                          <small className="text-muted">
                            {photos.length} photo(s) selected
                          </small>
                        </div>
                      )}
                    </div>
                    {/* Photo Preview */}
                    {photoPreview && (
                      <div className="col-md-6">
                        <label className="form-label form-label-add-pet">
                          <FaImage className="me-2" />
                          Photo Preview
                        </label>
                        <div className="photo-preview-container">
                          <img
                            src={photoPreview}
                            alt="Pet preview"
                            className="photo-preview"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="d-flex gap-3 justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => navigate("/dashboard/shelter")}
                    >
                      <FaTimes className="me-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Adding Pet...
                        </>
                      ) : (
                        "Add Pet"
                      )}
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

export default AddPet; 