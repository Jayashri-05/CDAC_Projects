import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeroSlider = () => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
    cssEase: 'linear'
  };

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=600&fit=crop",
      title: "Find Your Perfect Companion",
      subtitle: "Thousands of loving pets are waiting for their forever homes",
      description: "Browse through our extensive collection of dogs, cats, and other animals ready for adoption.",
      buttonText: "Start Adopting",
      buttonAction: () => navigate("/all-pets")
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&h=600&fit=crop",
      title: "Give Love, Get Love",
      subtitle: "Every pet deserves a loving family",
      description: "Join thousands of families who have found their perfect furry friend through our platform.",
      buttonText: "View Available Pets",
      buttonAction: () => navigate("/pets")
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=600&fit=crop",
      title: "Make a Difference Today",
      subtitle: "Your new best friend is just one click away",
      description: "Help us connect loving homes with pets in need. Start your adoption journey today.",
      buttonText: "Get Started",
      buttonAction: () => navigate("/register")
    }
  ];

  const slideStyle = {
    position: 'relative',
    height: '100vh',
    minHeight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  const backgroundImageStyle = (image) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    background: 'linear-gradient(45deg, rgba(244, 185, 66, 0.1), rgba(230, 165, 50, 0.1))',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: 'white',
    maxWidth: '800px',
    padding: '0 20px'
  };

  return (
    <div style={{ position: 'relative' }}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={slide.id}>
            <div style={slideStyle}>
              <div style={backgroundImageStyle(slide.image)}></div>
              <div style={overlayStyle}></div>
              
              <motion.div
                style={contentStyle}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h1
                  className="display-2 fw-bold mb-4 text-white"
                  style={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    lineHeight: '1.2'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {slide.title}
                </motion.h1>
                
                <motion.h2
                  className="h3 mb-4 text-white"
                  style={{ 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    fontWeight: '300'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {slide.subtitle}
                </motion.h2>
                
                <motion.p
                  className="lead mb-5 fs-4 text-white"
                  style={{ 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    maxWidth: '600px',
                    margin: '0 auto 2rem'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {slide.description}
                </motion.p>
                
                <motion.button
                  className="btn btn-lg px-5 py-3 fw-bold fs-5"
                  style={{
                    background: 'var(--color-primary)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50px',
                    boxShadow: '0 8px 25px rgba(244, 185, 66, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={slide.buttonAction}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 12px 35px rgba(244, 185, 66, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.background = 'var(--color-primary-dark)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(244, 185, 66, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.background = 'var(--color-primary)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(244, 185, 66, 0.3)';
                  }}
                >
                  {slide.buttonText} 🐾
                </motion.button>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>

      <style jsx>{`
        .slick-dots {
          bottom: 30px;
          z-index: 3;
        }
        
        .slick-dots li {
          margin: 0 5px;
        }
        
        .slick-dots li button:before {
          color: white;
          font-size: 14px;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        
        .slick-dots li.slick-active button:before {
          opacity: 1;
          color: #667eea;
          transform: scale(1.2);
        }
        
        .slick-dots li:hover button:before {
          opacity: 0.8;
          transform: scale(1.1);
        }
        
        .slick-prev,
        .slick-next {
          z-index: 3;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .slick-prev:hover,
        .slick-next:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        
        .slick-prev:before,
        .slick-next:before {
          color: white;
          font-size: 20px;
          opacity: 1;
        }
        
        .slick-prev {
          left: 30px;
        }
        
        .slick-next {
          right: 30px;
        }
        
        @media (max-width: 768px) {
          .slick-prev {
            left: 15px;
            width: 40px;
            height: 40px;
          }
          
          .slick-next {
            right: 15px;
            width: 40px;
            height: 40px;
          }
          
          .slick-prev:before,
          .slick-next:before {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
