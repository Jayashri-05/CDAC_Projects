package com.petadoption.controller;

import com.petadoption.model.ContactMessage;
import com.petadoption.service.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactMessageController {
    
    @Autowired
    private ContactMessageService contactMessageService;
    
    // Public endpoint for submitting contact form
    @PostMapping("/submit")
    public ResponseEntity<?> submitContactForm(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String email = request.get("email");
            String subject = request.get("subject");
            String message = request.get("message");
            
            if (name == null || email == null || subject == null || message == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
            }
            
            ContactMessage contactMessage = new ContactMessage(name, email, subject, message);
            ContactMessage savedMessage = contactMessageService.createMessage(contactMessage);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contact message submitted successfully");
            response.put("id", savedMessage.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to submit message: " + e.getMessage()));
        }
    }
    
    // Admin endpoints (protected by role-based access)
    
    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        System.out.println("[DEBUG] ContactMessageController: getAllMessages endpoint called");
        List<ContactMessage> messages = contactMessageService.getAllMessages();
        System.out.println("[DEBUG] ContactMessageController: Found " + messages.size() + " messages");
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/messages/unread")
    public ResponseEntity<List<ContactMessage>> getUnreadMessages() {
        List<ContactMessage> messages = contactMessageService.getUnreadMessages();
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/messages/{id}")
    public ResponseEntity<ContactMessage> getMessageById(@PathVariable Long id) {
        try {
            ContactMessage message = contactMessageService.getMessageById(id);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/messages/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        try {
            ContactMessage message = contactMessageService.markAsRead(id);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/messages/{id}/respond")
    public ResponseEntity<?> respondToMessage(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String response = request.get("response");
            if (response == null || response.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Response is required"));
            }
            
            ContactMessage message = contactMessageService.respondToMessage(id, response);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to respond: " + e.getMessage()));
        }
    }
    
    @GetMapping("/messages/count/unread")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = contactMessageService.getUnreadCount();
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
    
    @GetMapping("/messages/email/{email}")
    public ResponseEntity<List<ContactMessage>> getMessagesByEmail(@PathVariable String email) {
        List<ContactMessage> messages = contactMessageService.getMessagesByEmail(email);
        return ResponseEntity.ok(messages);
    }
} 