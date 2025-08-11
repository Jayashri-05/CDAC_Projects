import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import API from '../api/axios';
import './BlogSection.css';

// Fallback blogs in case API fails
const fallbackBlogs = [
	{
		title: "Tips for First-Time Pet Owners",
		description:
			"Essential guide for new pet parents covering everything from feeding schedules to creating a safe home environment.",
		author: "Dr. Sarah Johnson",
		date: "15 Dec, 2024",
		image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop",
	},
	{
		title: "Understanding Pet Behavior and Training",
		description:
			"Learn how to communicate effectively with your pet and establish positive behavioral patterns from day one.",
		author: "Mark Thompson",
		date: "12 Dec, 2024",
		image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=250&fit=crop",
	},
	{
		title: "Creating the Perfect Pet-Friendly Home",
		description:
			"Transform your living space into a safe, comfortable haven that both you and your furry friend will love.",
		author: "Lisa Chen",
		date: "10 Dec, 2024",
		image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=250&fit=crop",
	},
];

const BlogItem = ({ blog }) => {
	const handleImageError = (e) => {
		console.log("[DEBUG] Image failed to load:", e.target.src);
		console.log("[DEBUG] Original image URL:", blog.image);
		e.target.src = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop";
	};

	const handleImageLoad = (e) => {
		console.log("[DEBUG] Image loaded successfully:", e.target.src);
	};

	return (
		<article className="blog-card">
			<div className="blog-image-container">
				<img 
					src={blog.image} 
					alt={blog.title} 
					className="blog-image" 
					onError={handleImageError}
					onLoad={handleImageLoad}
				/>
			</div>
			<div className="blog-content">
				<h4 className="blog-title">{blog.title}</h4>
				<div className="blog-meta">
					<span className="blog-author">
						By{" "}
						<a href="#!" className="author-link">
							{blog.author}
						</a>
					</span>
					<span className="blog-date">{blog.date}</span>
				</div>
				<p className="blog-description">{blog.description}</p>
			</div>
		</article>
	);
};

BlogItem.propTypes = {
	blog: PropTypes.object.isRequired,
};

const BlogSection = () => {
	const [blogs, setBlogs] = useState(fallbackBlogs);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				setLoading(true);
				const response = await API.get("/blogs/all");
				if (response.data && response.data.length > 0) {
					console.log("[DEBUG] Raw blog data from API:", response.data);
					
					// Transform API data to match our blog format
					const transformedBlogs = response.data.map(blog => {
						let imageUrl;
						if (blog.image) {
							if (blog.image.startsWith('/uploads/')) {
								// Extract filename from path and use the new image serving endpoint
								const filename = blog.image.split('/').pop();
								imageUrl = `http://localhost:8080/api/blogs/image/${filename}`;
							} else {
								imageUrl = blog.image;
							}
						} else {
							imageUrl = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop";
						}
						
						console.log("[DEBUG] Blog:", blog.title, "Original image:", blog.image, "Final image URL:", imageUrl);
						
						return {
							title: blog.title,
							description: blog.description || blog.content?.substring(0, 150) + "...",
							author: blog.author?.username || blog.author?.firstName + " " + blog.author?.lastName || "Veterinarian",
							date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							}) : "Recent",
							image: imageUrl
						};
					});
					
					console.log("[DEBUG] Transformed blogs:", transformedBlogs);
					setBlogs(transformedBlogs);
				}
			} catch (err) {
				console.error("Error fetching blogs:", err);
				setError("Failed to load blog posts");
				// Keep fallback blogs
			} finally {
				setLoading(false);
			}
		};

		fetchBlogs();
	}, []);

	return (
		<section className="blog-section">
			<Container>
				<Row className="justify-content-center">
					<Col lg={8} className="text-center">
						<h2 className="blog-section-heading">
							Pet Care Tips & Stories
						</h2>
						<p className="blog-section-subheading">
							Discover helpful guides, heartwarming adoption stories, and expert advice 
							to help you provide the best care for your furry companions.
						</p>
						{/* <Button className="blog-view-all-btn">
							View All Articles
						</Button> */}
					</Col>
				</Row>
				{loading && (
					<Row className="justify-content-center">
						<Col className="text-center">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</Col>
					</Row>
				)}
				{error && (
					<Row className="justify-content-center">
						<Col className="text-center">
							<p className="text-muted">{error}</p>
						</Col>
					</Row>
				)}
				<Row className="blog-grid">
					{blogs.map((blog, i) => (
						<Col xs={12} md={6} lg={4} className="blog-col" key={i}>
							<BlogItem blog={blog} />
						</Col>
					))}
				</Row>
			</Container>
		</section>
	);
};

export default BlogSection;
