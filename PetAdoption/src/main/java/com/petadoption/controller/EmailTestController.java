package com.petadoption.controller;

import com.petadoption.model.User;
import com.petadoption.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${spring.mail.password}")
    private String mailPassword;

    @PostMapping("/email")
    public ResponseEntity<?> testEmail(@RequestBody TestEmailRequest request) {
        try {
            System.out.println("[DEBUG] ===== EMAIL TEST STARTED =====");
            System.out.println("[DEBUG] Testing email functionality...");
            System.out.println("[DEBUG] Mail username: " + mailUsername);
            System.out.println("[DEBUG] Mail password length: " + (mailPassword != null ? mailPassword.length() : "null"));
            System.out.println("[DEBUG] Target email: " + request.getEmail());
            
            // Create a test user
            User testUser = new User();
            testUser.setEmail(request.getEmail());
            testUser.setUsername("testuser");
            testUser.setFullName("Test User");
            testUser.setRole("USER");
            
            System.out.println("[DEBUG] Created test user: " + testUser.getEmail());
            
            // Send welcome email
            emailService.sendWelcomeEmail(testUser);
            
            System.out.println("[DEBUG] ===== EMAIL TEST COMPLETED =====");
            return ResponseEntity.ok("Test email sent successfully to: " + request.getEmail());
        } catch (Exception e) {
            System.err.println("[ERROR] Test email failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Test email failed: " + e.getMessage());
        }
    }

    @GetMapping("/email-config")
    public ResponseEntity<?> getEmailConfig() {
        try {
            return ResponseEntity.ok(Map.of(
                "username", mailUsername,
                "passwordLength", mailPassword != null ? mailPassword.length() : 0,
                "host", "smtp.gmail.com",
                "port", 587
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get email config: " + e.getMessage());
        }
    }

    public static class TestEmailRequest {
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
} 