import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import API from "../api/axios";
import { FaHome, FaPaw, FaClipboardList, FaPlus, FaUser, FaDog, FaCat } from "react-icons/fa";
import './ShelterDashboard.css';

const ShelterDashboard = () => {
  const [stats, setStats] = useState([
    { label: "Total Pets", value: "0", icon: <FaDog />, change: "+0", link: "/dashboard/shelter/pets" },
    { label: "Pending Adoption", value: "0", icon: <FaClipboardList />, change: "+0", link: "/dashboard/shelter/requests" },
    { label: "Stray Dog Response", value: "0", icon: <FaPaw />, change: "+0", link: "/dashboard/shelter/stray-reports" }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quickActions = [
    {
      title: "Add New Pet",
      description: "Add a new pet for adoption",
      icon: <FaPlus />,
      link: "/dashboard/shelter/add"
    }
  ];

  const [recentPets, setRecentPets] = useState([]);
  const [showRecent, setShowRecent] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        setError("Authentication required. Please log in again.");
        return;
      }

      console.log("[DEBUG] Fetching dashboard stats for user:", userId);
      
      // Fetch total pets count
      const petsResponse = await API.get(`/pets/my-pets?userId=${userId}`);
      const totalPets = petsResponse.data.length;
      
      // Fetch pending adoption requests for this shelter's pets
      let pendingAdoption = 0;
      try {
        const adoptionRequestsResponse = await API.get('/adoption-requests');
        const allRequests = adoptionRequestsResponse.data;
        
        // Get pet IDs that belong to this shelter
        const shelterPetIds = petsResponse.data.map(pet => pet.id);
        
        // Count pending requests for this shelter's pets
        pendingAdoption = allRequests.filter(request => 
          request.status === 'pending' && 
          shelterPetIds.includes(request.pet.id)
        ).length;
        
        console.log("[DEBUG] Shelter pet IDs:", shelterPetIds);
        console.log("[DEBUG] All adoption requests:", allRequests.length);
        console.log("[DEBUG] Pending adoption requests for shelter:", pendingAdoption);
      } catch (error) {
        console.error("[DEBUG] Error fetching adoption requests:", error);
        // Fallback to pets that are not adopted
        pendingAdoption = petsResponse.data.filter(pet => !pet.adopted).length;
      }
      
      // Fetch stray pet reports count
      const strayReportsResponse = await API.get('/stray-pet-reports');
      const strayReportsCount = strayReportsResponse.data.length;
      
      console.log("[DEBUG] Total pets:", totalPets);
      console.log("[DEBUG] Pending adoption:", pendingAdoption);
      console.log("[DEBUG] Stray reports:", strayReportsCount);
      
      // Set recent pets (show first 4 pets)
      const recentPetsData = petsResponse.data.slice(0, 4).map(pet => ({
        name: pet.petName,
        breed: pet.breed,
        status: pet.adopted ? "Adopted" : "Available",
        link: `/dashboard/shelter/pet/${pet.id}`
      }));
      
      setRecentPets(recentPetsData);
      
      setStats([
        { 
          label: "Total Pets", 
          value: totalPets.toString(), 
          icon: <FaDog />, 
          change: `+${totalPets}`, 
          link: "/dashboard/shelter/pets" 
        },
        { 
          label: "Pending Adoption", 
          value: pendingAdoption.toString(), 
          icon: <FaClipboardList />, 
          change: `+${pendingAdoption}`, 
          link: "/dashboard/shelter/requests" 
        },
        { 
          label: "Stray Dog Response", 
          value: strayReportsCount.toString(), 
          icon: <FaPaw />, 
          change: `+${strayReportsCount}`, 
          link: "/dashboard/shelter/stray-reports" 
        }
      ]);
      
      setError("");
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="shelter-dashboard-container">
        <div className="container">
          {/* Header */}
          <div className="shelter-dashboard-header">
            <h2 className="shelter-dashboard-title">
              <FaHome style={{ marginRight: 10, verticalAlign: 'middle' }} /> Shelter Management Dashboard
            </h2>
            <p className="shelter-dashboard-subtitle">Manage your pets, handle adoption requests, and help animals find homes.</p>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="alert-container">
              <div className="alert-danger" role="alert">
                {error}
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="spinner-border loading-spinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Loading dashboard statistics...</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
              >
                <Link to={stat.link} className="stat-card">
                  <div className="stats-icon">
                    {stat.icon}
                  </div>
                  <h5 className="stat-label">{stat.label}</h5>
                  <h3 className="stat-value">{stat.value}</h3>
                  <span className="stat-change">{stat.change}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions Grid */}
          <div className="quick-actions-grid">
            {quickActions.map((action, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                key={idx}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={action.link} className="quick-action-card">
                  <div className="quick-action-icon">{action.icon}</div>
                  <h5 className="quick-action-title">{action.title}</h5>
                  <p className="quick-action-description">{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Pets Section */}
          <div className="recent-pets-section">
            <div className="recent-pets-header" onClick={() => setShowRecent(!showRecent)}>
              <h4 className="recent-pets-title">
                <FaUser style={{ marginRight: 8, verticalAlign: 'middle' }} /> Recent Pets
              </h4>
              <span className={`recent-pets-icon ${showRecent ? 'expanded' : ''}`}>
                {showRecent ? '▼' : '▶'}
              </span>
            </div>
            {showRecent && (
              <ul className="recent-pets-list">
                {recentPets.map((pet, idx) => (
                  <li key={idx} className="recent-pet-item">
                    <div className="recent-pet-info">
                      <h6 className="recent-pet-name">{pet.name}</h6>
                      <p className="recent-pet-breed">{pet.breed}</p>
                    </div>
                    <span className={`recent-pet-status ${pet.status.toLowerCase()}`}>
                      {pet.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShelterDashboard;