import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-main">
      {/* Social Media Section */}
      <section className="footer-social-section">
        <div className="footer-social-left">
          <span>Get connected with us on social networks:</span>
        </div>
        <div className="footer-social-icons">
          <a href="https://facebook.com" className="footer-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
          <a href="https://twitter.com" className="footer-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
          <a href="https://instagram.com" className="footer-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://linkedin.com" className="footer-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
          <a href="https://github.com" className="footer-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
        </div>
      </section>
      {/* Links Section */}
      <section className="footer-links-section">
        <div className="footer-links-container">
          <div className="footer-col company">
                            <h6 className="footer-title">AdoptoCare</h6>
            <hr className="footer-hr" />
            <p>
              AdoptoCare is dedicated to connecting loving homes with pets in need. We support shelters, veterinarians, and adopters for a better pet adoption experience.
            </p>
          </div>
          <div className="footer-col products">
            <h6 className="footer-title">Features</h6>
            <hr className="footer-hr" />
            <p>Browse Pets</p>
            <p>My Adoptions</p>
            <p>Shelter Dashboard</p>
            <p>Vet Dashboard</p>
          </div>
          <div className="footer-col useful">
            <h6 className="footer-title">Useful Links</h6>
            <hr className="footer-hr" />
            <p><a href="/about-us" className="footer-link">About Us</a></p>
            <p><a href="/contact-us" className="footer-link">Contact Us</a></p>
            <p><a href="/gallery" className="footer-link">Gallery</a></p>
            <p><a href="/register" className="footer-link">Register</a></p>
          </div>
          <div className="footer-col contact">
            <h6 className="footer-title">Contact</h6>
            <hr className="footer-hr" />
            <p><i className="fas fa-home footer-icon-inline"></i> Pune, Maharashtra, India</p>
                            <p><i className="fas fa-envelope footer-icon-inline"></i> adoptocare11@gmail.com</p>
            <p><i className="fas fa-phone footer-icon-inline"></i> +91 98765 43210</p>
          </div>
        </div>
      </section>
      {/* Copyright */}
      <div className="footer-copyright">
                    © {new Date().getFullYear()} AdoptoCare. All rights reserved.
      </div>
    </footer>
  );
} 