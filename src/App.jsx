import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import Gallery from "./pages/Gallery";
import ContactUs from "./pages/ContactUs";
import AddPet from "./pages/AddPet";
import AllPets from "./pages/AllPets";
import AllPetsPage from "./pages/AllPetsPage";
import ShelterPets from "./pages/ShelterPets";
import EditPet from "./pages/EditPet";
import PetDetail from "./pages/PetDetail";

import ProtectedRoute from "./routes/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ShelterDashboard from "./pages/ShelterDashboard";
import VetDashboard from "./pages/VetDashboard";

import VetHealthRecords from "./pages/VetHealthRecords";
import VetPatients from "./pages/VetPatients";
import VetAppointmentRequests from "./pages/VetAppointmentRequests";
import VetEmergencyCases from "./pages/VetEmergencyCases";
import VetCreateBlogPost from "./pages/VetCreateBlogPost";
import VetManageBlogPosts from "./pages/VetManageBlogPosts";
import UserAppointmentRequest from "./pages/UserAppointmentRequest";
import UserAppointmentRequests from "./pages/UserAppointmentRequests";
import UserHealthRecords from "./pages/UserHealthRecords";
import StrayPetReport from "./pages/StrayPetReport";
import StrayPetReports from "./pages/StrayPetReports";
import AdoptionApplication from "./pages/AdoptionApplication";
import AdoptionRequests from "./pages/AdoptionRequests";
import MyAdoptedPets from "./pages/MyAdoptedPets";
import AdoptionApplicationDetails from "./pages/AdoptionApplicationDetails";
import ManageUsers from "./pages/ManageUsers";
import ManageShelters from "./pages/ManageShelters";
import ManageVets from "./pages/ManageVets";
import ManagePets from "./pages/ManagePets";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import ManageAnnouncements from "./pages/ManageAnnouncements";
import AdminContactMessages from "./pages/AdminContactMessages";
import SendHealthRecord from "./pages/SendHealthRecord";

import { AlertProvider } from "./context/AlertContext";
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import dark theme styles
import "./styles/darkTheme.css";

const DashboardRedirect = () => {
  const role = localStorage.getItem("role");
  switch (role) {
    case "admin":
      return <Navigate to="/dashboard/admin" />;
    case "user":
      return <Navigate to="/dashboard/user" />;
    case "shelter":
      return <Navigate to="/dashboard/shelter" />;
    case "vet":
      return <Navigate to="/dashboard/vet" />;
    default:
      return <Navigate to="/login" />;
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Persist dark mode in localStorage
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <AlertProvider>
      <Router>
        <div className={darkMode ? 'dark-mode' : ''}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999, marginTop: '60px' }}
          />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/register" element={<Register darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/about-us" element={<AboutUs darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/gallery" element={<Gallery darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/contact-us" element={<ContactUs darkMode={darkMode} setDarkMode={setDarkMode} />} />

          {/* Role-Based Dashboard Routes (No Shared Layout) */}
          <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/admin/manage-users" element={<ProtectedRoute requiredRole="admin"><ManageUsers darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/admin/manage-shelters" element={<ProtectedRoute requiredRole="admin"><ManageShelters darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/admin/manage-vets" element={<ProtectedRoute requiredRole="admin"><ManageVets darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/admin/manage-pets" element={<ProtectedRoute requiredRole="admin"><ManagePets darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/admin/create-announcement" element={<ProtectedRoute requiredRole="admin"><CreateAnnouncement darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/admin/manage-announcements" element={<ProtectedRoute requiredRole="admin"><ManageAnnouncements darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/admin/contact-messages" element={<ProtectedRoute requiredRole="admin"><AdminContactMessages darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/vet" element={<ProtectedRoute><VetDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />

          <Route path="/dashboard/vet/records" element={<ProtectedRoute><VetHealthRecords darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/vet/patients" element={<ProtectedRoute><VetPatients darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/vet/appointment-requests" element={<ProtectedRoute><VetAppointmentRequests darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/vet/emergency-cases" element={<ProtectedRoute><VetEmergencyCases darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/vet/create-blog" element={<ProtectedRoute><VetCreateBlogPost darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/vet/manage-blogs" element={<ProtectedRoute><VetManageBlogPosts darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/user/appointment-request" element={<ProtectedRoute><UserAppointmentRequest darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/user/appointment-requests" element={<ProtectedRoute><UserAppointmentRequests darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/user/health-records" element={<ProtectedRoute><UserHealthRecords darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/user" element={<ProtectedRoute><UserDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/shelter" element={<ProtectedRoute><ShelterDashboard darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/shelter/add" element={<ProtectedRoute><AddPet darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/pets" element={<AllPets darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/all-pets" element={<AllPetsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/pet/:petId" element={<PetDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/stray-pet-report" element={<ProtectedRoute><StrayPetReport darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/shelter/stray-reports" element={<ProtectedRoute><StrayPetReports darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/adopt/:petId" element={<ProtectedRoute><AdoptionApplication darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/my-adopted-pets" element={<ProtectedRoute><MyAdoptedPets darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/adoption-application/:applicationId" element={<ProtectedRoute><AdoptionApplicationDetails darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />

          <Route path="/dashboard/shelter/adoption-requests" element={<ProtectedRoute><AdoptionRequests darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/shelter/requests" element={<ProtectedRoute><AdoptionRequests darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/shelter/pets" element={<ProtectedRoute><ShelterPets darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/shelter/edit-pet/:petId" element={<ProtectedRoute><EditPet darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/shelter/health" element={<ProtectedRoute><VetHealthRecords darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          <Route path="/dashboard/vet/send-health-record" element={<ProtectedRoute><SendHealthRecord darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
          {/* Redirect to appropriate dashboard */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", marginTop: "4rem" }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
        <Footer />
        </div>
      </Router>
    </AlertProvider>
  );
}

export default App;
