package com.petadoption.service.impl;

import com.petadoption.model.BlogPost;
import com.petadoption.model.User;
import com.petadoption.repository.BlogPostRepository;
import com.petadoption.repository.UserRepository;
import com.petadoption.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

@Service
public class BlogPostServiceImpl implements BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public BlogPost createPost(BlogPost blogPost, Long userId) {
        try {
            System.out.println("[DEBUG] BlogPostService: Creating post for user ID: " + userId);
            
            User author = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            
            System.out.println("[DEBUG] BlogPostService: Found author: " + author.getUsername());

            blogPost.setAuthor(author);
            blogPost.setCreatedAt(LocalDateTime.now());
            
            System.out.println("[DEBUG] BlogPostService: About to save blog post with title: " + blogPost.getTitle());

            BlogPost savedPost = blogPostRepository.save(blogPost);
            System.out.println("[DEBUG] BlogPostService: Blog post saved successfully with ID: " + savedPost.getId());
            
            return savedPost;
        } catch (Exception e) {
            System.out.println("[DEBUG] BlogPostService: Error creating post: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    @Override
    public List<BlogPost> getPostsByUser(Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return blogPostRepository.findByAuthor(author);
    }

    @Override
    public void deletePost(Long blogId) {
        try {
            System.out.println("[DEBUG] BlogPostService: Attempting to delete post with ID: " + blogId);
            
            // Check if the blog post exists
            BlogPost blogPost = blogPostRepository.findById(blogId)
                    .orElseThrow(() -> new RuntimeException("Blog post not found with ID: " + blogId));
            
            System.out.println("[DEBUG] BlogPostService: Found blog post: " + blogPost.getTitle());
            
            // Delete the associated image file if it exists
            if (blogPost.getImage() != null && blogPost.getImage().startsWith("/uploads/")) {
                try {
                    String imagePath = blogPost.getImage().substring(1); // Remove leading slash
                    Path filePath = Paths.get(imagePath);
                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                        System.out.println("[DEBUG] BlogPostService: Deleted image file: " + filePath);
                    } else {
                        System.out.println("[DEBUG] BlogPostService: Image file not found: " + filePath);
                    }
                } catch (IOException e) {
                    System.out.println("[DEBUG] BlogPostService: Error deleting image file: " + e.getMessage());
                    // Continue with blog deletion even if image deletion fails
                }
            }
            
            // Delete the blog post from database
            blogPostRepository.delete(blogPost);
            System.out.println("[DEBUG] BlogPostService: Blog post deleted successfully");
            
        } catch (Exception e) {
            System.out.println("[DEBUG] BlogPostService: Error deleting post: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
