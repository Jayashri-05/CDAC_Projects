import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../api/axios';
import Navbar from '../components/Navbar';
import './AdminContactMessages.css';
import { FaEnvelope, FaInbox, FaEnvelopeOpen, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

export default function AdminContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages();
        fetchUnreadCount();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            console.log('[DEBUG] Fetching contact messages...');
            const response = await AuthAPI.get('/contact/messages');
            console.log('[DEBUG] Contact messages response:', response.data);
            setMessages(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            console.error('Error details:', err.response?.data);
            setError('Failed to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await AuthAPI.get('/contact/messages/count/unread');
            setUnreadCount(response.data.unreadCount);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await AuthAPI.put(`/contact/messages/${messageId}/read`);
            fetchMessages();
            fetchUnreadCount();
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const respondToMessage = async (messageId) => {
        if (!responseText.trim()) {
            alert('Please enter a response');
            return;
        }

        try {
            await AuthAPI.put(`/contact/messages/${messageId}/respond`, {
                response: responseText
            });
            setResponseText('');
            setSelectedMessage(null);
            fetchMessages();
            fetchUnreadCount();
        } catch (err) {
            console.error('Failed to respond:', err);
            alert('Failed to send response. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getFilteredMessages = () => {
        switch (filter) {
            case 'unread':
                return messages.filter(msg => !msg.isRead);
            case 'read':
                return messages.filter(msg => msg.isRead);
            default:
                return messages;
        }
    };

    const filteredMessages = getFilteredMessages();

    const stats = [
        {
            color: '#fff',
            icon: <FaInbox />,
            value: messages.length,
            label: 'Total Messages',
            description: 'All contact messages'
        },
        {
            color: '#fff',
            icon: <FaEnvelope />,
            value: unreadCount,
            label: 'Unread',
            description: 'Unread messages'
        },
        {
            color: '#fff',
            icon: <FaEnvelopeOpen />,
            value: messages.length - unreadCount,
            label: 'Read',
            description: 'Read messages'
        }
    ];

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="admin-contact-page">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading contact messages...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', width: '100vw', background: '#F8F9FA', padding: 0, boxSizing: 'border-box' }}>
                <div className="container-fluid px-4" style={{ paddingTop: '2.5rem' }}>
                    {/* Header */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                        <div>
                            <h1 className="fw-bold mb-2 letter-spacing-1 fs-2" style={{ letterSpacing: 1, color: '#2C3E50' }}>
                                <FaEnvelope style={{ marginRight: 6, verticalAlign: 'middle' }} /> Contact Messages
                            </h1>
                            <p className="mb-0 fs-5" style={{ color: '#6C757D' }}>View and manage all contact messages from database</p>
                        </div>
                        <button
                            className="btn px-4 py-2 rounded-3 shadow-sm fw-bold"
                            onClick={() => navigate('/dashboard/admin')}
                            style={{
                                letterSpacing: '1px',
                                background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                                color: '#FFFFFF',
                                border: 'none'
                            }}
                        >
                            <FaArrowLeft style={{ marginRight: 6, verticalAlign: 'middle' }} /> Back to Dashboard
                        </button>
                    </div>
                    {/* Stats Cards */}
                    <div className="row g-4 mb-4 flex-nowrap overflow-auto justify-content-center" style={{ marginLeft: 0, marginRight: 0 }}>
                        {stats.map((stat, idx) => (
                            <div className="col-md-2 col-8" key={stat.label} style={{ minWidth: 220, maxWidth: 220, flex: '0 0 220px' }}>
                                <div
                                    className="card shadow"
                                    style={{
                                        borderRadius: '20px',
                                        background: '#FFFFFF',
                                        border: '1px solid #e9ecef',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        padding: '2rem',
                                        minHeight: '180px',
                                        maxHeight: '220px',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        marginBottom: '1.5rem'
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '2.5rem',
                                            color: '#F4EBD3',
                                            background: 'linear-gradient(135deg, #555879 0%, #98A1BC 100%)',
                                            borderRadius: '16px',
                                            padding: '1rem',
                                            marginBottom: '1.5rem',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                            display: 'inline-block',
                                            width: 'fit-content',
                                            margin: '0 auto 1.5rem auto'
                                        }}
                                    >
                                        {stat.icon}
                                    </div>
                                    <h5 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: '500', color: '#fff', marginBottom: '0.5rem' }}>{stat.label}</h5>
                                    <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>{stat.value}</h3>
                                    <p style={{ fontSize: '0.875rem', color: '#fff', marginTop: '0.5rem', fontWeight: '400', lineHeight: '1.4', opacity: '0.8' }}>{stat.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="filter-section">
                        <button 
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                            style={filter === 'all' ? { background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)', color: '#2C3E50', border: 'none' } : {}}
                        >
                            All Messages
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilter('unread')}
                            style={filter === 'unread' ? { background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)', color: '#2C3E50', border: 'none' } : {}}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                            onClick={() => setFilter('read')}
                            style={filter === 'read' ? { background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)', color: '#2C3E50', border: 'none' } : {}}
                        >
                            Read
                        </button>
                    </div>

                    <div className="messages-container">
                        {filteredMessages.length === 0 ? (
                            <div className="no-messages">
                                <p>No messages found.</p>
                            </div>
                        ) : (
                            filteredMessages.map(message => (
                                <div 
                                    key={message.id} 
                                    className={`message-card ${!message.isRead ? 'unread' : ''}`}
                                    onClick={() => setSelectedMessage(message)}
                                >
                                    <div className="message-header">
                                        <div className="message-info">
                                            <h3>{message.name}</h3>
                                            <p className="email">{message.email}</p>
                                            <p className="subject">{message.subject}</p>
                                        </div>
                                        <div className="message-meta">
                                            <span className="date">{formatDate(message.createdAt)}</span>
                                            {message.adminResponse && <span className="responded-badge">Responded</span>}
                                        </div>
                                    </div>
                                    <div className="message-preview">
                                        {message.message.substring(0, 100)}...
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Message Detail Modal */}
                    {selectedMessage && (
                        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Message from {selectedMessage.name}</h2>
                                    <button 
                                        className="close-btn"
                                        onClick={() => setSelectedMessage(null)}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div className="modal-body">
                                    <div className="message-details">
                                        <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                                        <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                                        <p><strong>Date:</strong> {formatDate(selectedMessage.createdAt)}</p>
                                        <p><strong>Status:</strong> {selectedMessage.isRead ? 'Read' : 'Unread'}</p>
                                    </div>
                                    
                                    <div className="message-content">
                                        <h3>Message:</h3>
                                        <p>{selectedMessage.message}</p>
                                    </div>

                                    {selectedMessage.adminResponse && (
                                        <div className="admin-response">
                                            <h3>Your Response:</h3>
                                            <p>{selectedMessage.adminResponse}</p>
                                            <small>Responded on: {formatDate(selectedMessage.respondedAt)}</small>
                                        </div>
                                    )}

                                                                         {!selectedMessage.adminResponse && !selectedMessage.isRead && (
                                         <div className="response-section" style={{
                                             backgroundColor: 'white',
                                             padding: '20px',
                                             borderRadius: '8px',
                                             border: '1px solid #e0e0e0',
                                             marginTop: '20px'
                                         }}>
                                             <div className="response-actions">
                                                 <button 
                                                     className="mark-read-btn"
                                                     onClick={() => markAsRead(selectedMessage.id)}
                                                     style={{
                                                         background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                                                         color: '#2C3E50',
                                                         border: 'none',
                                                         padding: '10px 20px',
                                                         borderRadius: '4px',
                                                         cursor: 'pointer',
                                                         fontSize: '14px',
                                                         fontWeight: 600
                                                     }}
                                                 >
                                                     Mark as Read
                                                 </button>
                                             </div>
                                         </div>
                                     )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 