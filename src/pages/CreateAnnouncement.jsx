import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import { useAlert } from "../context/AlertContext";
import { FaClipboardList } from "react-icons/fa";
import './ManageShelters.css';
import { showSuccessToast, showErrorToast } from '../utils/toast.jsx';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info",
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Submitting announcement data:", formData);
      const response = await API.post("/announcements", formData);
      console.log("Announcement created:", response.data);
      showSuccessToast("Announcement created successfully!");
      navigate("/dashboard/admin/manage-announcements");
    } catch (err) {
      console.error("Failed to create announcement:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage = err.response?.data?.error || "Failed to create announcement. Please try again.";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="manage-shelters-container">
        <div className="manage-shelters-content">
          {/* Header */}
          <div className="shelters-header">
            <div>
              <h1 className="shelters-title">📢 Create Announcement</h1>
              <p className="shelters-subtitle">Create a new announcement to display on the home page and user dashboard</p>
            </div>
            <button 
              className="back-dashboard-btn"
              onClick={() => navigate('/dashboard/admin')}
            >
              Back to Dashboard
            </button>
          </div>

          {/* Form Card */}
          <div className="shelters-main-card" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
            <div className="shelters-card-header">
              <h5 className="shelters-card-title"><FaClipboardList style={{ marginRight: 6, verticalAlign: 'middle' }} /> Announcement Details</h5>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-semibold" style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>📝 Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter announcement title"
                    style={{ 
                      border: '2px solid #e9ecef', 
                      borderRadius: '8px', 
                      padding: '0.75rem',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="form-label fw-semibold" style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>📄 Content *</label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows="5"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    placeholder="Enter announcement content"
                    style={{ 
                      border: '2px solid #e9ecef', 
                      borderRadius: '8px', 
                      padding: '0.75rem',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="type" className="form-label fw-semibold" style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>🏷️ Type *</label>
                  <select
                    className="form-select"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    style={{ 
                      border: '2px solid #e9ecef', 
                      borderRadius: '8px', 
                      padding: '0.75rem',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <option value="info">ℹ️ Info (Blue)</option>
                    <option value="success">✅ Success (Green)</option>
                    <option value="warning">⚠️ Warning (Yellow)</option>
                    <option value="danger">🚨 Danger (Red)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <div className="form-check" style={{ padding: '1rem', border: '2px solid #e9ecef', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      style={{ transform: 'scale(1.2)', marginRight: '0.75rem' }}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="active" style={{ color: '#2c3e50', fontSize: '1rem' }}>
                      ✅ Active (Show on home page and dashboard)
                    </label>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="back-dashboard-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>➕ Create Announcement</>
                    )}
                  </button>
                  <button
                    type="button"
                    className="action-btn edit"
                    onClick={() => navigate('/dashboard/admin/manage-announcements')}
                  >
                    Cancel
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

export default CreateAnnouncement; 