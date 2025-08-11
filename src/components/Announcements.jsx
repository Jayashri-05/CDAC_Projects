import React, { useState, useEffect } from "react";
import API from "../api/axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await API.get("/announcements/public");
      setAnnouncements(response.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return '#2196F3';
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'danger':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'info':
        return '📢';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'danger':
        return '🚨';
      default:
        return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading announcements...</span>
        </div>
        <span className="ms-2 text-muted">Loading announcements...</span>
      </div>
    );
  }

  if (announcements.length === 0) {
    return null; // Don't show anything if no announcements
  }

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '1rem 0',
    borderBottom: '1px solid #e9ecef'
  };

  const headerTitleStyle = {
    color: '#2C3E50',
    fontSize: '1.75rem',
    fontWeight: '600',
    marginBottom: '0.5rem'
  };

  const headerSubtitleStyle = {
    color: '#6C757D',
    fontSize: '0.95rem'
  };

  const announcementStyle = {
    marginBottom: '1.5rem',
    padding: '0'
  };

  const titleStyle = (type) => {
    const color = getTypeColor(type);
    return {
      color: color,
      fontWeight: '600',
      fontSize: '1.1rem',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    };
  };

  const contentStyle = {
    color: '#2C3E50',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '0.5rem',
    marginLeft: '1.5rem'
  };

  const dateStyle = {
    color: '#6C757D',
    fontSize: '0.8rem',
    fontStyle: 'italic',
    marginLeft: '1.5rem'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h4 style={headerTitleStyle}>📢 Announcements</h4>
        <p style={headerSubtitleStyle}>Latest updates and important information</p>
      </div>

      {/* Announcements */}
      <div className="announcements-list">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            style={announcementStyle}
            className="announcement-item"
          >
            <div style={titleStyle(announcement.type)}>
              <span>{getIcon(announcement.type)}</span>
              <span>{announcement.title}</span>
            </div>
            <div style={contentStyle}>
              {announcement.content}
            </div>
            <div style={dateStyle}>
              📅 {formatDate(announcement.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements; 