import React from 'react';

const TestCarousel = () => {
  return (
    <div style={{ padding: '60px 0', background: '#f8f9fa' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-3" style={{ color: '#2C3E50' }}>
            Test Component
          </h2>
          <p className="lead fs-4 mb-5" style={{ color: '#6c757d' }}>
            This is a test to see if the component renders
          </p>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Test Pet 1</h5>
                <p className="card-text">This is a test pet card.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCarousel; 