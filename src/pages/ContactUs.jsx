import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { PublicAPI } from '../api/axios';
import './ContactUs.css';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            // Send form data to backend
            const response = await PublicAPI.post('/contact/submit', formData);
            console.log('Form submitted successfully:', response.data);
            
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Reset the submitted state after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (err) {
            console.error('Failed to submit form:', err);
            setError(err.response?.data?.error || 'Failed to submit message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-us-page fullwidth-page">
            <div className="contact-us-container">
                <div className="hero-section">
                    <h1 className="hero-title">Contact Us</h1>
                    <p className="hero-subtitle">Get in touch with our team for any questions or support</p>
                </div>
                
                <div className="contact-content">
                    <div className="contact-info">
                        <h2 className="section-title">Get In Touch</h2>
                        <p className="section-text">
                            Have questions about pet adoption? Need help with your account? 
                            We're here to help! Reach out to us through any of the channels below.
                        </p>
                        
                        <div className="contact-methods">
                            <div className="contact-method">
                                <div className="method-icon">📧</div>
                                <div className="method-details">
                                    <h3>Email Us</h3>
                                    <p>adoptocare11@gmail.com</p>
                                </div>
                            </div>
                            
                            <div className="contact-method">
                                <div className="method-icon">📞</div>
                                <div className="method-details">
                                    <h3>Call Us</h3>
                                    <p>+91 9011548687</p>
                                    <p>Mon-Fri: 9AM-6PM</p>
                                </div>
                            </div>
                            
                            <div className="contact-method">
                                <div className="method-icon">📍</div>
                                <div className="method-details">
                                    <h3>Visit Us</h3>
                                    <p>123 Pet Care Street</p>
                                    <p>Animal City, AC 12345</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className="contact-form-section">
                        <h2 className="section-title">Send Us a Message</h2>
                        
                        {isSubmitted && (
                            <div className="success-message">
                                <div className="success-icon">✅</div>
                                <p>Thank you for your message! We'll get back to you soon.</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="error-message" style={{ 
                                background: '#f8d7da', 
                                border: '1px solid #f5c6cb', 
                                color: '#721c24', 
                                padding: '1rem', 
                                borderRadius: '8px', 
                                marginBottom: '1rem' 
                            }}>
                                {error}
                            </div>
                        )}
                        
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email address"
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="adoption">Adoption Questions</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Tell us how we can help you..."
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>
                            
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                <span className="btn-icon">
                                    {isSubmitting ? '⏳' : '📤'}
                                </span>
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className="faq-section">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>How do I adopt a pet?</h3>
                            <p>Browse our available pets, fill out an adoption application, and we'll connect you with the shelter to complete the process.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What are the adoption fees?</h3>
                            <p>Adoption fees vary by shelter and typically range from ₹50-₹300, covering vaccinations, spaying/neutering, and microchipping.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Can I return a pet if it doesn't work out?</h3>
                            <p>Yes, most shelters have return policies. Contact the shelter directly if you need to return an adopted pet.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How do I become a shelter partner?</h3>
                            <p>Contact us through the form above or email partnerships@adoptocare.com to learn about our shelter partnership program.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 