import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Announcements from "../components/Announcements";
import Navbar from "../components/Navbar";
import UserDashboardCarousel from "../components/UserDashboardCarousel";
import API from "../api/axios";
import './UserDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaDog, FaHome, FaUserMd, FaClipboardList, FaHeartbeat, FaPaw, FaUser } from "react-icons/fa";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [availablePetsCount, setAvailablePetsCount] = useState(0);
  const [adoptedPetsCount, setAdoptedPetsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch available pets count and adopted pets count from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("[DEBUG] Fetching pet data...");
        
        // Fetch available pets
        const availableResponse = await API.get("/pets/available");
        const availableCount = availableResponse.data.length;
        setAvailablePetsCount(availableCount);
        
        // Fetch user's adopted pets
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        console.log("[DEBUG] UserDashboard - User ID:", userId, "Type:", typeof userId, "Token present:", !!token);
        
        // Ensure userId is a number
        const numericUserId = parseInt(userId);
        console.log("[DEBUG] UserDashboard - Numeric User ID:", numericUserId);
        
        const adoptedResponse = await API.get(`/adoption-requests/user/${numericUserId}`);
        console.log("[DEBUG] UserDashboard - Raw adoption response:", adoptedResponse.data);
        
        const adoptedCount = adoptedResponse.data.filter(request => request.status === 'approved').length;
        console.log("[DEBUG] UserDashboard - Adopted count:", adoptedCount);
        setAdoptedPetsCount(adoptedCount);
        
        console.log("[DEBUG] Available pets count:", availableCount);
        console.log("[DEBUG] Adopted pets count:", adoptedCount);
        setError("");
      } catch (err) {
        console.error("Failed to fetch pet data:", err);
        if (err.response && err.response.status === 401) {
          setError("Authentication error. Please log in again.");
          navigate("/login");
        } else if (err.response && err.response.status === 403) {
          setError("Access denied. Please check your permissions.");
        } else {
          setError("Failed to load pet data. Using default values.");
          setAvailablePetsCount(0);
          setAdoptedPetsCount(0);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "Available Pets",
      value: loading ? "Loading..." : `${availablePetsCount}`,
      icon: <FaDog />,
      color: "#0d6efd",
      change: "+10%",
      description: "Browse and adopt pets"
    },
    {
      label: "My Adopted Pets",
      value: loading ? "Loading..." : `${adoptedPetsCount}`,
      icon: <FaHome />,
      color: "#dc3545",
      change: "+2%",
      description: "View your adopted companions"
    },
    {
      label: "Vet Appointments",
      value: adoptedPetsCount > 0 ? "Request" : "0",
      icon: <FaUserMd />,
      color: adoptedPetsCount > 0 ? "#28a745" : "#6c757d",
      change: adoptedPetsCount > 0 ? "New" : "Adopt First",
      description: adoptedPetsCount > 0 ? "Request veterinary care" : "Adopt a pet first"
    },
    {
      label: "My Requests",
      value: "View",
      icon: <FaClipboardList />,
      color: "#17a2b8",
      change: "Status",
      description: "View appointment requests and responses"
    },
    {
      label: "Health Records",
      value: "View",
      icon: <FaHeartbeat />,
      color: "#6f42c1",
      change: "Medical",
      description: "View your pets' health records"
    },
    {
      label: "Report Stray Pet",
      value: "Submit",
      icon: <FaPaw />,
      color: "#fd7e14",
      change: "Help",
      description: "Help animals in need by reporting stray pets"
    }
  ];



  const handleCardClick = async (label) => {
    if (label === "Available Pets") {
      navigate("/all-pets");
    } else if (label === "My Adopted Pets") {
      navigate("/my-adopted-pets");
    } else if (label === "My Requests") {
      navigate("/dashboard/user/appointment-requests");
    } else if (label === "Health Records") {
      navigate("/dashboard/user/health-records");
    } else if (label === "Report Stray Pet") {
      navigate("/stray-pet-report");
    } else if (label === "Vet Appointments") {
              // Double-check adopted pets count before navigation
        try {
          const userId = localStorage.getItem("userId");
          const token = localStorage.getItem("token");
          console.log("[DEBUG] User ID:", userId, "Token present:", !!token);
          
          const numericUserId = parseInt(userId);
          const response = await API.get(`/adoption-requests/user/${numericUserId}`);
          const adoptedCount = response.data.filter(request => request.status === 'approved').length;
        
        console.log("[DEBUG] Current adopted pets count:", adoptedCount);
        
        if (adoptedCount > 0) {
          navigate("/dashboard/user/appointment-request");
        } else {
          alert("You need to adopt a pet first before requesting veterinary appointments. Please browse available pets and complete an adoption.");
          navigate("/all-pets");
        }
      } catch (err) {
        console.error("Error checking adopted pets:", err);
        if (err.response && err.response.status === 401) {
          alert("Authentication error. Please log in again.");
          navigate("/login");
        } else if (err.response && err.response.status === 403) {
          alert("Access denied. Please check your permissions.");
        } else {
          alert("Error checking your adopted pets. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-dashboard-container">
        <div className="user-dashboard-content">
          <div className="container">
            {/* Carousel Section */}
            <div className="dashboard-section">
              <UserDashboardCarousel />
            </div>

            {/* Stats Cards - 3x3 Grid Layout */}
            <div className="dashboard-section">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="row g-4">
                    {stats.map((stat, idx) => (
                      <div className="col-md-4" key={idx}>
                        <div
                          className="dashboard-card stats-card fade-in"
                          style={{ animationDelay: `${idx * 0.2}s` }}
                          onClick={() => handleCardClick(stat.label)}
                        >
                          <div 
                            className="stats-icon"
                            style={{
                              '--icon-color': stat.color,
                              '--icon-color-dark': stat.color + 'dd'
                            }}
                          >
                            {stat.icon}
                          </div>
                          <h5 className="stats-label">{stat.label}</h5>
                          <h3 className="stats-value">{stat.value}</h3>
                          <span className="stats-change">{stat.change}</span>
                          <p className="stats-description">{stat.description}</p>
                        </div>
                      </div>
                    ))}
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

export default UserDashboard;
