import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaEdit, FaArrowLeft, FaImage, FaEye, FaTimes, FaSpinner } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const VetCreateBlogPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      console.log("[DEBUG] Frontend: User ID:", userId);
      console.log("[DEBUG] Frontend: Token present:", !!token);
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('content', formData.content);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log("[DEBUG] Frontend: Sending request to /blogs/create/" + userId);
      console.log("[DEBUG] Frontend: FormData entries:", Array.from(formDataToSend.entries()));

      const response = await API.post(`/blogs/create/${userId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 200 || response.status === 201) {
        alert("Blog post created successfully!");
        navigate("/dashboard/vet");
      }
    } catch (err) {
      console.error("Error creating blog post:", err);
      
      // Show more specific error messages
      if (err.response && err.response.data) {
        setError(`Error: ${err.response.data}`);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("Failed to create blog post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    borderRadius: '20px',
    background: '#FFFFFF',
    padding: '2rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(108, 117, 125, 0.1)'
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: '#F8F9FA',
        padding: '2rem'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div style={cardStyle}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="fw-bold" style={{ color: '#2C3E50' }}>
                      <FaEdit style={{ marginRight: 8, verticalAlign: 'middle' }} /> Create Blog Post
                    </h2>
                    <p className="text-muted">Share your expertise and tips with pet owners</p>
                  </div>
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
                    <FaArrowLeft style={{ marginRight: 6, verticalAlign: 'middle' }} /> Back to Dashboard
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a compelling title for your blog post..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#555879' }}>
                      Short Description *
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Write a brief description that will appear on the homepage..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                      Content *
                    </label>
                    <textarea
                      className="form-control"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows="8"
                      placeholder="Write the full content of your blog post..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                      <FaImage style={{ marginRight: 6, verticalAlign: 'middle' }} /> Blog Image (Optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <small className="text-muted">
                      Supported formats: JPG, PNG, GIF. Max size: 5MB. If no image is provided, a default image will be used.
                    </small>
                    
                    {previewImage && (
                      <div className="mt-3">
                        <label className="form-label fw-bold" style={{ color: '#2C3E50' }}>
                          <FaEye style={{ marginRight: 6, verticalAlign: 'middle' }} /> Image Preview:
                        </label>
                        <div className="border rounded p-2" style={{ maxWidth: '300px' }}>
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                          />
                          <div className="mt-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={removeImage}
                            >
                              <FaTimes style={{ marginRight: 4, verticalAlign: 'middle' }} /> Remove Image
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        color: '#2C3E50',
                        fontWeight: '600'
                      }}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="spinner-border-sm me-2" style={{ animation: 'spin 1s linear infinite' }} />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaEdit style={{ marginRight: 6, verticalAlign: 'middle' }} /> Publish Post
                        </>
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

export default VetCreateBlogPost; 