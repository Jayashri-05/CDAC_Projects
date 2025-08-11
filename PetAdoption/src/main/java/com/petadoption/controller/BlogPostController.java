package com.petadoption.controller;

import com.petadoption.model.BlogPost;
import com.petadoption.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;

    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createPost(@RequestParam("title") String title,
                                       @RequestParam("description") String description,
                                       @RequestParam("content") String content,
                                       @RequestParam(value = "image", required = false) MultipartFile image,
                                       @PathVariable Long userId) {
        try {
            System.out.println("[DEBUG] Creating blog post with title: " + title);
            System.out.println("[DEBUG] User ID: " + userId);
            System.out.println("[DEBUG] Image present: " + (image != null && !image.isEmpty()));
            
            // Validate required fields
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            if (description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Description is required");
            }
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Content is required");
            }
            
            BlogPost blogPost = new BlogPost();
            blogPost.setTitle(title.trim());
            blogPost.setDescription(description.trim());
            blogPost.setContent(content.trim());
            
            // Handle image upload
            if (image != null && !image.isEmpty()) {
                try {
                                    String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                String uploadDir = "uploads/blog-images/";
                
                // Create directory if it doesn't exist
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    boolean created = dir.mkdirs();
                    System.out.println("[DEBUG] Directory created: " + created);
                }
                
                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, image.getBytes());
                
                // Store the file path in the database
                blogPost.setImage("/uploads/blog-images/" + fileName);
                System.out.println("[DEBUG] Image saved to: " + blogPost.getImage());
                System.out.println("[DEBUG] Full file path: " + filePath.toAbsolutePath());
                System.out.println("[DEBUG] File exists after save: " + Files.exists(filePath));
                System.out.println("[DEBUG] File size: " + Files.size(filePath) + " bytes");
                System.out.println("[DEBUG] Expected URL: http://localhost:8080" + blogPost.getImage());
                } catch (IOException e) {
                    System.out.println("[DEBUG] Error saving image: " + e.getMessage());
                    e.printStackTrace();
                    return ResponseEntity.badRequest().body("Error saving image: " + e.getMessage());
                }
            } else {
                // Use default image
                blogPost.setImage("https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop");
                System.out.println("[DEBUG] Using default image");
            }
            
            BlogPost createdPost = blogPostService.createPost(blogPost, userId);
            System.out.println("[DEBUG] Blog post created successfully with ID: " + createdPost.getId());
            return ResponseEntity.ok(createdPost);
            
        } catch (Exception e) {
            System.out.println("[DEBUG] Error creating blog post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating blog post: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<BlogPost> getAllPosts() {
        return blogPostService.getAllPosts();
    }

    @GetMapping("/user/{userId}")
    public List<BlogPost> getUserPosts(@PathVariable Long userId) {
        return blogPostService.getPostsByUser(userId);
    }

    @DeleteMapping("/{blogId}")
    public ResponseEntity<?> deleteBlogPost(@PathVariable Long blogId) {
        try {
            System.out.println("[DEBUG] Attempting to delete blog post with ID: " + blogId);
            blogPostService.deletePost(blogId);
            System.out.println("[DEBUG] Blog post deleted successfully");
            return ResponseEntity.ok("Blog post deleted successfully");
        } catch (Exception e) {
            System.out.println("[DEBUG] Error deleting blog post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error deleting blog post: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        try {
            System.out.println("[DEBUG] Test endpoint called");
            return ResponseEntity.ok("Blog controller is working!");
        } catch (Exception e) {
            System.out.println("[DEBUG] Test endpoint error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/auth-test")
    public ResponseEntity<?> authTestEndpoint() {
        try {
            System.out.println("[DEBUG] Auth test endpoint called");
            return ResponseEntity.ok("Authentication is working!");
        } catch (Exception e) {
            System.out.println("[DEBUG] Auth test endpoint error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test-image")
    public ResponseEntity<?> testImageEndpoint() {
        try {
            System.out.println("[DEBUG] Test image endpoint called");
            // Check if uploads directory exists
            File uploadsDir = new File("uploads/blog-images/");
            if (uploadsDir.exists()) {
                File[] files = uploadsDir.listFiles();
                StringBuilder result = new StringBuilder();
                result.append("Uploads directory exists with ").append(files != null ? files.length : 0).append(" files\n");
                result.append("Directory path: ").append(uploadsDir.getAbsolutePath()).append("\n");
                
                if (files != null) {
                    for (File file : files) {
                        result.append("File: ").append(file.getName())
                              .append(" (Size: ").append(file.length()).append(" bytes)")
                              .append(" (URL: /api/blogs/image/").append(file.getName()).append(")\n");
                    }
                }
                
                return ResponseEntity.ok(result.toString());
            } else {
                return ResponseEntity.ok("Uploads directory does not exist at: " + uploadsDir.getAbsolutePath());
            }
        } catch (Exception e) {
            System.out.println("[DEBUG] Test image endpoint error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            // Decode URL-encoded filename
            String decodedFilename = java.net.URLDecoder.decode(filename, "UTF-8");
            System.out.println("[DEBUG] Original filename: " + filename);
            System.out.println("[DEBUG] Decoded filename: " + decodedFilename);
            
            Path filePath = Paths.get("uploads/blog-images/" + decodedFilename);
            System.out.println("[DEBUG] Full file path: " + filePath.toAbsolutePath());
            
            Resource resource = new UrlResource(filePath.toUri());
            System.out.println("[DEBUG] Resource exists: " + resource.exists());
            System.out.println("[DEBUG] Resource is readable: " + resource.isReadable());
            
            if (resource.exists() && resource.isReadable()) {
                System.out.println("[DEBUG] Image found and readable: " + decodedFilename);
                System.out.println("[DEBUG] File size: " + resource.contentLength() + " bytes");
                
                // Detect content type based on file extension
                String contentType = "image/jpeg"; // default
                if (decodedFilename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (decodedFilename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (decodedFilename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
            } else {
                System.out.println("[DEBUG] Image not found or not readable: " + decodedFilename);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("[DEBUG] Error serving image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}
