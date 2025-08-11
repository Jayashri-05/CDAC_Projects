import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Col, Container, Row } from "react-bootstrap";
import {
	faFacebookF,
	faLinkedinIn,
	faTwitter,
	faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import PropTypes from "prop-types";
import { 
	FaHeart, 
	FaHandshake, 
	FaShieldAlt, 
	FaStar,
	FaPaw,
	FaHome,
	FaHospital,
	FaEdit,
	FaUserMd,
	FaUsers,
	FaClipboardList,
	FaDog,
	FaCat,
	FaBirthdayCake,
	FaBone
} from "react-icons/fa";
import './AboutUs.css';

const teamMembers = [
	{
		picture: "/images/n.jpg",
		fullName: "Neha Kore",
		designation: "Backend Developer",
		bio: "Crafts efficient and scalable server-side solutions to power seamless user experiences.",
		socialLinks: [
			
			{ icon: faLinkedinIn, href: "https://www.linkedin.com/in/neha-kore-438111185/" },
			
			{ icon: faGithub, href: "https://github.com/nehakore23" },
		],
	},
	{
		picture: "/images/kg.png",
		fullName: "Kaustubh Gade",
		designation: "Project Lead",
		bio: "Ensures timely project delivery while aligning the team with business goals and innovation.",
		socialLinks: [
			
			{ icon: faLinkedinIn, href: "www.linkedin.com/in/kaustubh-gade-72b4a4317" },
			
			{ icon: faGithub, href: " https://github.com/Kaustubh5591" },
		],
	},
	{
		picture: "/images/j.jpg",
		fullName: "Jayashree Dadmal",
		designation: "Backend Developer",
		bio: "Subscribe Easy Tutorials Youtube Channel watch more videos",
		socialLinks: [
			
			{ icon: faLinkedinIn, href: "https://www.linkedin.com/in/jayashri-dadmal-412055354" },
			
			{ icon: faGithub, href: " https://github.com/Jayashri-05/CDAC_Projects" },
		],
	},
	{
		picture: "/images/kp.jpeg",
		fullName: "Krutika Patil",
		designation: "Frontend Developer",
		bio: "Subscribe Easy Tutorials Youtube Channel watch more videos",
		socialLinks: [
			
			{ icon: faLinkedinIn, href: "https://www.linkedin.com/in/krutika-patil-669659262" },
			
			{ icon: faGithub, href: "https://github.com/KRUTIIIII" },
		],
	},
	{
		picture: "/images/r.jpg",
		fullName: "Rima Kolhe",
		designation: "Software developer",
		bio: "Leading our technical initiatives and development team",
		socialLinks: [
			
			{ icon: faLinkedinIn, href: "https://www.linkedin.com/in/rima-kolhe-5b0a811b0" },
			
			{ icon: faGithub, href: "https://github.com/rima582000?tab=repositories" },
		],
	},
];

const TeamMemberItem = ({ member }) => (
	<div className="ezy__team2-item mt-4 hover-lift-shadow glassmorphism-background rounded-xl border-accent subtle-gradient-card">
		<div className="member-image-container">
			<img
				src={member.picture}
				alt={member.fullName}
				className="img-fluid rounded-xl member-image"
				width={230}
			/>
			<div className="image-overlay-name-slide">
				<h4>{member.fullName}</h4>
				<p>{member.designation}</p>
			</div>
		</div>
		<div className="ezy__team2-content px-3 py-4 px-xl-4">
			<h4 className="mb-2">{member.fullName}</h4>
			<h6>{member.designation}</h6>
			<p className="opacity-50 mb-0">{member.bio}</p>
			<div className="ezy__team2-social-links mt-4">
				{member.socialLinks.map((link, i) => (
					<a href={link.href} className={classNames({ "ms-3": i })} key={i}>
						<FontAwesomeIcon icon={link.icon} />
					</a>
				))}
			</div>
		</div>
	</div>
);

TeamMemberItem.propTypes = {
	member: PropTypes.object.isRequired,
};

const TeamMember2 = () => {
	return (
		<section className="ezy__team2 light">
			<Container>
				<Row className="justify-content-center mb-4 mb-md-5">
					<Col lg={6} xl={5} className="text-center">
						<h2 className="ezy__team2-heading mb-3">Our Experts Team</h2>
						<p className="ezy__team2-sub-heading mb-0">
							Assumenda non repellendus distinctio nihil dicta sapiente,
							quibusdam maiores, illum at qui.
						</p>
					</Col>
				</Row>
				<Row className="text-center justify-content-center team-members-row">
					{teamMembers.map((member, i) => (
						<Col xs={12} sm={6} md={4} lg={3} xl={2.4} key={i} className="mb-4 team-member-col">
							<TeamMemberItem member={member} />
						</Col>
					))}
				</Row>
			</Container>
		</section>
	);
};

export default function AboutUs() {
    return (
        <>
        <div className="about-us-page fullwidth-page">
            {/* Carousel Start */}
            <div className="pet-carousel-container">
                <div className="pet-carousel carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="carousel-slide slide-1">
                                <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202008/coronadogindia.jpeg?size=690:388" alt="Pet Adoption" className="carousel-image" />
                                <div className="carousel-overlay">
                                    <div className="carousel-caption custom-caption">
                                        <h3>Find Your Perfect Companion</h3>
                                        <p>Discover loving pets waiting for their forever homes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="carousel-slide slide-2">
                                <img src="https://en-media.thebetterindia.com/uploads/2019/12/Doggo.jpg" alt="Pet Care" className="carousel-image" />
                                <div className="carousel-overlay">
                                    <div className="carousel-caption custom-caption">
                                        <h3>Professional Veterinary Care</h3>
                                        <p>Expert health monitoring and care for all adopted pets</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="carousel-slide slide-3">
                                <img src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80" alt="Pet Support" className="carousel-image" />
                                <div className="carousel-overlay">
                                    <div className="carousel-caption custom-caption">
                                        <h3>Supporting Animal Shelters</h3>
                                        <p>Helping shelters find loving homes for their animals</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target=".pet-carousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target=".pet-carousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target=".pet-carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target=".pet-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target=".pet-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                </div>
            </div>
            {/* Carousel End */}
            <div className="about-us-container">
                <div className="hero-section">
                    <h1 className="hero-title">About AdoptoCare</h1>
                    <p className="hero-subtitle">Connecting loving homes with pets in need</p>
                </div>
                
                <div className="content-section">
                    <div className="mission-section">
                        <h2 className="section-title">Our Mission</h2>
                        <p className="section-text">
                            At AdoptoCare, we believe every pet deserves a loving home. Our mission is to create 
                            a seamless platform that connects compassionate individuals with pets in need of adoption, 
                            while providing comprehensive support for shelters, veterinarians, and pet owners.
                        </p>
                    </div>
                    
                    <div className="values-section">
                        <h2 className="section-title">Our Values</h2>
                        <div className="values-grid">
                            <div className="value-card">
                                <div className="value-icon">
                                    <FaHeart size={48} color="#e74c3c" />
                                </div>
                                <h3>Compassion</h3>
                                <p>We treat every pet and person with kindness and understanding</p>
                            </div>
                            <div className="value-card">
                                <div className="value-icon">
                                    <FaHandshake size={48} color="#3498db" />
                                </div>
                                <h3>Community</h3>
                                <p>Building strong connections between pet lovers and shelters</p>
                            </div>
                            <div className="value-card">
                                <div className="value-icon">
                                    <FaShieldAlt size={48} color="#f39c12" />
                                </div>
                                <h3>Safety</h3>
                                <p>Ensuring the well-being of all pets and adopters</p>
                            </div>
                            <div className="value-card">
                                <div className="value-icon">
                                    <FaStar size={48} color="#f1c40f" />
                                </div>
                                <h3>Excellence</h3>
                                <p>Providing the best possible service and support</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="story-section">
                        <h2 className="section-title">Our Story</h2>
                        <p className="section-text">
                            AdoptoCare was born from a simple idea: making pet adoption easier and more accessible 
                            for everyone. We understand the challenges that shelters face in finding homes for 
                            their animals, and we know how overwhelming it can be for potential adopters to find 
                            the perfect companion.
                        </p>
                        <p className="section-text">
                            Our platform brings together shelters, veterinarians, and pet lovers in one 
                            comprehensive ecosystem. We provide tools for managing pet profiles, adoption 
                            applications, health records, and more - all designed to make the adoption process 
                            smooth and successful.
                        </p>
                    </div>
                    
                    <div className="team-section">
                        <TeamMember2 />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
} 