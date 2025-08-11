import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Announcements from "../components/Announcements";
import Navbar from "../components/Navbar";
import AnimalCarousel from "../components/AnimalCarousel";
import HeroSlider from "../components/HeroSlider";
import BlogSection from "../components/BlogSection";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const navigate = useNavigate();

  // Add fullwidth class to root element when component mounts
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.classList.add('fullwidth-page');
    }
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      if (rootElement) {
        rootElement.classList.remove('fullwidth-page');
      }
    };
  }, []);

  const heroStyle = {
    background: '#000000',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.05)',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2
  };

  const cardStyle = {
    background: 'rgba(128, 128, 128, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  };

  const buttonStyle = {
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    fontWeight: '500',
    letterSpacing: '0.5px',
    borderRadius: '4px',
    border: '1px solid rgba(128, 128, 128, 0.3)',
    background: 'rgba(128, 128, 128, 0.1)',
    color: '#333333'
  };

  const sectionStyle = {
    padding: '80px 0',
    background: '#ffffff',
    color: '#000000',
    width: '100vw'
  };

  const featureIconStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    margin: '0 auto 1.5rem',
    background: '#000000',
    color: 'white',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
  };



  const footerStyle = {
    background: 'rgba(128, 128, 128, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    padding: '3rem 0',
    color: '#ffffff'
  };



  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Navbar */}
      

      {/* Hero Slider Section */}
      <HeroSlider />
      
      {/* Announcements Section */}
      <div style={{ 
        padding: '60px 0', 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderTop: '1px solid #e9ecef',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12">
              <Announcements />
            </div>
          </div>
        </div>
      </div>

      {/* Animal Carousel Section */}
      <AnimalCarousel />

      {/* Features Section */}
      <div style={sectionStyle}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3" style={{ color: '#000000' }}>
                Why Choose Our Platform?
              </h2>
              <p className="lead text-muted fs-4">
                Comprehensive pet adoption services designed for both adopters and shelters
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'rgba(128, 128, 128, 0.25)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(128, 128, 128, 0.15)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="card-body text-center p-5">
                  <div style={featureIconStyle}>🏠</div>
                  <h3 className="card-title fw-bold mb-3 h4" style={{ color: '#ffffff' }}>
                    Verified Pet Listings
                  </h3>
                  <p className="card-text text-white-50 fs-6" style={{ lineHeight: '1.6' }}>
                    Browse carefully vetted pets from trusted shelters. Each listing includes 
                    comprehensive health information and behavioral assessments.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'rgba(128, 128, 128, 0.25)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(128, 128, 128, 0.15)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="card-body text-center p-5">
                  <div style={featureIconStyle}>💉</div>
                  <h3 className="card-title fw-bold mb-3 h4" style={{ color: '#ffffff' }}>
                    Professional Veterinary Network
                  </h3>
                  <p className="card-text text-white-50 fs-6" style={{ lineHeight: '1.6' }}>
                    Connect with certified veterinarians for comprehensive health checks, 
                    vaccinations, and ongoing care for your adopted pets.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'rgba(128, 128, 128, 0.25)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(128, 128, 128, 0.15)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="card-body text-center p-5">
                  <div style={featureIconStyle}>🏥</div>
                  <h3 className="card-title fw-bold mb-3 h4" style={{ color: '#ffffff' }}>
                    Shelter Management System
                  </h3>
                  <p className="card-text text-white-50 fs-6" style={{ lineHeight: '1.6' }}>
                    Advanced tools for shelters to manage pet listings, adoption applications, 
                    and maintain comprehensive health records efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ ...sectionStyle, background: '#f8f9fa' }}>
        <div className="container-fluid">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="h2 fw-bold text-black mb-2">500+</div>
              <div className="text-black">Pets Adopted</div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="h2 fw-bold text-black mb-2">50+</div>
              <div className="text-black">Partner Shelters</div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="h2 fw-bold text-black mb-2">25+</div>
              <div className="text-black">Veterinarians</div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="h2 fw-bold text-black mb-2">1000+</div>
              <div className="text-black">Happy Families</div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <BlogSection />

      {/* Footer CTA */}
      {/* Remove old footer and add new Footer */}
      
    </div>
  );
}
