import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { FaClipboardList, FaEdit, FaTrash, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const VetManageBlogPosts = ({ darkMode, setDarkMode }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      console.log('[DEBUG] Fetching blogs for user ID:', userId);
      console.log('[DEBUG] Token present:', !!token);
      
      const response = await API.get(`/blogs/user/${userId}`);
      console.log('[DEBUG] Blogs response:', response.data);
      setBlogs(response.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(`Failed to load blog posts: ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;

    try {
      setDeleteLoading(true);
      await API.delete(`/blogs/${selectedBlog.id}`);
      
      // Remove the deleted blog from the list
      setBlogs(blogs.filter(blog => blog.id !== selectedBlog.id));
      setShowDeleteModal(false);
      setSelectedBlog(null);
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog post');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop";
    }
    
    if (imagePath.startsWith('/uploads/')) {
      const filename = imagePath.split('/').pop();
      return `http://localhost:8080/api/blogs/image/${filename}`;
    }
    
    return imagePath;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border" style={{ color: '#2C3E50' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: '#F8F9FA',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        <Container>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold" style={{ color: '#2C3E50' }}>
                  <FaClipboardList style={{ marginRight: 8, verticalAlign: 'middle' }} /> Manage Blog Posts
                </h2>
                <p className="text-muted">View and manage your published blog posts</p>
              </div>
              <Link to="/dashboard/vet">
                <Button 
                  variant="outline-secondary"
                  style={{ 
                    borderColor: '#98A1BC',
                    color: '#98A1BC',
                    borderRadius: '10px',
                    padding: '8px 16px'
                  }}
                >
                  <FaArrowLeft style={{ marginRight: 6, verticalAlign: 'middle' }} /> Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {blogs.length === 0 ? (
            <Card className="text-center p-5" style={{ borderRadius: '20px' }}>
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '4rem', color: '#6C757D' }}>
                  <FaEdit />
                </div>
                <h4 style={{ color: '#2C3E50' }}>No Blog Posts Yet</h4>
                <p className="text-muted mb-4">You haven't created any blog posts yet. Start sharing your expertise!</p>
                <Link to="/dashboard/vet/create-blog">
                  <Button 
                    size="lg" 
                    style={{ 
                      background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
                      color: '#2C3E50',
                      border: 'none',
                      borderRadius: '15px',
                      fontWeight: '600'
                    }}
                  >
                    <FaEdit style={{ marginRight: 8, verticalAlign: 'middle' }} /> Create Your First Post
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {blogs.map((blog) => (
                <Col key={blog.id} lg={6} xl={4}>
                  <Card 
                    className="h-100 shadow-sm" 
                    style={{ 
                      borderRadius: '20px',
                      border: 'none',
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ 
                      height: '200px', 
                      overflow: 'hidden',
                      borderTopLeftRadius: '20px',
                      borderTopRightRadius: '20px'
                    }}>
                      <img
                        src={getImageUrl(blog.image)}
                        alt={blog.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop";
                        }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <small className="text-muted">
                          {formatDate(blog.createdAt)}
                        </small>
                      </div>
                      <Card.Title 
                        className="fw-bold mb-2" 
                        style={{ 
                          color: '#2C3E50',
                          fontSize: '1.1rem',
                          lineHeight: '1.4'
                        }}
                      >
                        {blog.title}
                      </Card.Title>
                      <Card.Text 
                        className="text-muted mb-3 flex-grow-1"
                        style={{ fontSize: '0.9rem' }}
                      >
                        {blog.description || blog.content?.substring(0, 100) + '...'}
                      </Card.Text>
                      <div className="mt-auto">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(blog)}
                          style={{ 
                            borderRadius: '10px',
                            borderWidth: '2px',
                            fontWeight: 'bold'
                          }}
                        >
                          <FaTrash style={{ marginRight: 6, verticalAlign: 'middle' }} /> Delete Post
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
          <Modal.Title style={{ color: '#2C3E50' }}>
            <FaTrash style={{ marginRight: 8, verticalAlign: 'middle' }} /> Delete Blog Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>"{selectedBlog?.title}"</strong>?</p>
          <p className="text-muted small">This action cannot be undone. The post and its associated image will be permanently removed.</p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <FaSpinner className="spinner-border-sm me-2" style={{ animation: 'spin 1s linear infinite' }} />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash style={{ marginRight: 6, verticalAlign: 'middle' }} /> Delete Post
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VetManageBlogPosts; 