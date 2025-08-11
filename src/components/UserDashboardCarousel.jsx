import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const UserDashboardCarousel = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    fade: true,
    cssEase: 'linear',
    arrows: true
  };

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=400&fit=crop",
      title: "Welcome to Your Pet Journey",
      subtitle: "Your dashboard is your gateway to pet adoption",
      description: "Track your applications, manage your adopted pets, and stay connected with veterinary care.",
      buttonText: "Browse Pets",
      buttonAction: () => navigate("/all-pets")
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&h=400&fit=crop",
      title: "Your Adopted Companions",
      subtitle: "Keep track of your beloved pets",
      description: "View your adopted pets and manage their health records and appointments.",
      buttonText: "My Pets",
      buttonAction: () => navigate("/my-adopted-pets")
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&h=400&fit=crop",
      title: "Veterinary Care",
      subtitle: "Professional healthcare for your pets",
      description: "Request appointments with qualified veterinarians and track your pet's health.",
      buttonText: "Request Appointment",
      buttonAction: () => navigate("/dashboard/user/appointment-request")
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=400&fit=crop",
      title: "Help Stray Animals",
      subtitle: "Make a difference in your community",
      description: "Report stray pets in need and help them find shelter and care.",
      buttonText: "Report Stray Pet",
      buttonAction: () => navigate("/stray-pet-report")
    }
  ];

  const slideStyle = {
    position: 'relative',
    height: 'calc(100vh + 2rem)',
    minHeight: 'calc(100vh + 2rem)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '0',
    margin: '0',
    width: '100vw',
    marginTop: '-2rem'
  };

  const backgroundImageStyle = (image) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: 'calc(100vh + 2rem)',
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  });

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: 'calc(100vh + 2rem)',
    background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.8), rgba(0, 0, 0, 0.6))',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: 'white',
    maxWidth: '800px',
    padding: '0 40px'
  };

  const titleStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#FFFFFF',
    textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  };

  const subtitleStyle = {
    fontSize: '2rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    color: '#FFFFFF',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  };

  const descriptionStyle = {
    fontSize: '1.4rem',
    marginBottom: '3rem',
    color: '#FFFFFF',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    lineHeight: '1.6'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #F4B942 0%, #E6A532 100%)',
    color: '#2C3E50',
    border: 'none',
    padding: '18px 40px',
    borderRadius: '30px',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(244, 185, 66, 0.3)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  };

  return (
    <div style={{ 
      marginBottom: '3rem',
      padding: '0',
      margin: '0 -2rem',
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      marginTop: '-2rem'
    }}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={slide.id}>
            <div style={slideStyle}>
              <div style={backgroundImageStyle(slide.image)} />
              <div style={overlayStyle} />
              <div style={contentStyle}>
                <h2 style={titleStyle}>{slide.title}</h2>
                <h3 style={subtitleStyle}>{slide.subtitle}</h3>
                <p style={descriptionStyle}>{slide.description}</p>
                <button 
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(244, 185, 66, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(244, 185, 66, 0.3)';
                  }}
                  onClick={slide.buttonAction}
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default UserDashboardCarousel;
