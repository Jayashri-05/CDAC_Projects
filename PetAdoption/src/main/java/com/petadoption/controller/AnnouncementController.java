package com.petadoption.controller;

import com.petadoption.model.Announcement;
import com.petadoption.model.User;
import com.petadoption.service.AnnouncementService;
import com.petadoption.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {
    
    @Autowired
    private AnnouncementService announcementService;
    
    @Autowired
    private UserService userService;
    
    // Public endpoint to get active announcements
    @GetMapping("/public")
    public ResponseEntity<List<Announcement>> getActiveAnnouncements() {
        List<Announcement> announcements = announcementService.getActiveAnnouncements();
        return ResponseEntity.ok(announcements);
    }
    
    // Admin endpoint to get all announcements
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(announcements);
    }
    
    // Get announcement by ID
    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable Long id) {
        Announcement announcement = announcementService.getAnnouncementById(id);
        if (announcement != null) {
            return ResponseEntity.ok(announcement);
        }
        return ResponseEntity.notFound().build();
    }
    
    // Create new announcement
    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        try {
            System.out.println("[DEBUG] ===== CREATE ANNOUNCEMENT CALLED =====");
            System.out.println("[DEBUG] Announcement data: " + announcement);
            
            // Temporarily skip user authentication for testing
            // TODO: Re-enable user authentication once JWT is working properly
            System.out.println("[DEBUG] Skipping user authentication for now");
            
            // Create announcement without user for testing
            Announcement createdAnnouncement = announcementService.createAnnouncement(announcement);
            System.out.println("[DEBUG] Created announcement: " + createdAnnouncement);
            return ResponseEntity.ok(createdAnnouncement);
        } catch (Exception e) {
            System.out.println("[DEBUG] Exception occurred: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create announcement: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Update announcement
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable Long id, @RequestBody Announcement announcementDetails) {
        try {
            Announcement updatedAnnouncement = announcementService.updateAnnouncement(id, announcementDetails);
            if (updatedAnnouncement != null) {
                return ResponseEntity.ok(updatedAnnouncement);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update announcement: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Announcement deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete announcement: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Toggle announcement status
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleAnnouncementStatus(@PathVariable Long id) {
        try {
            announcementService.toggleAnnouncementStatus(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Announcement status toggled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to toggle announcement status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 