package com.petadoption.service.impl;

import com.petadoption.dto.ForgotPasswordRequest;
import com.petadoption.dto.LoginRequest;
import com.petadoption.dto.RegisterRequest;
import com.petadoption.model.User;

import com.petadoption.repository.UserRepository;
import com.petadoption.security.JwtService;
import com.petadoption.service.AuthService;
import com.petadoption.service.EmailService;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;
    
    // AES encryption key (in production, this should be stored securely)
    private static final String SECRET_KEY = "PetAdoption2024!";
    private static final String ALGORITHM = "AES";

    @Override
    public ResponseEntity<?> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setOriginalPassword(encrypt(request.getPassword())); // Store encrypted original password
        user.setRole(request.getRole()); // Example: "USER", "ADMIN"
        user.setFullName(request.getFullName());

        User savedUser = userRepository.save(user);
        System.out.println("[DEBUG] User registered successfully: " + savedUser.getUsername() + " with ID: " + savedUser.getId());

        // Send welcome email
        try {
            emailService.sendWelcomeEmail(savedUser);
            System.out.println("[DEBUG] Welcome email sent to: " + savedUser.getEmail());
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send welcome email: " + e.getMessage());
            // Don't fail registration if email fails
        }

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok("Registration successful. Token: " + token);
    }

    @Override
    public ResponseEntity<?> login(LoginRequest request) {
        System.out.println("[DEBUG] Attempting login for: " + request.getEmail() + " | Password: " + request.getPassword());
        try {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
            System.out.println("[DEBUG] Authentication successful for: " + request.getEmail());
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new LoginResponse(token, user.getRole(), user.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }
    
    // Inner class for login response
    public static class LoginResponse {
        private String token;
        private String role;
        private Long userId;
        
        public LoginResponse(String token, String role, Long userId) {
            this.token = token;
            this.role = role;
            this.userId = userId;
        }
        
        public String getToken() { return token; }
        public String getRole() { return role; }
        public Long getUserId() { return userId; }
    }

    @Override
    public ResponseEntity<?> forgotPassword(ForgotPasswordRequest request) {
        try {
            System.out.println("[DEBUG] Forgot password request for email: " + request.getEmail());
            
            // Check if user exists
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);
            if (user == null) {
                System.out.println("[DEBUG] User not found for email: " + request.getEmail());
                return ResponseEntity.badRequest().body("If an account with this email exists, your password will be sent.");
            }
            
            // Get user's original password (decrypt if encrypted)
            String currentPassword = user.getOriginalPassword();
            if (currentPassword == null || currentPassword.isEmpty()) {
                // For existing users without original password, generate a new one
                String newPassword = generateNewPassword();
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setOriginalPassword(encrypt(newPassword)); // Store encrypted password
                userRepository.save(user);
                currentPassword = newPassword;
            } else {
                // Try to decrypt the stored password
                try {
                    currentPassword = decrypt(currentPassword);
                    System.out.println("[DEBUG] Successfully decrypted password for user: " + request.getEmail());
                } catch (Exception e) {
                    System.err.println("[ERROR] Failed to decrypt password, generating new one: " + e.getMessage());
                    // If decryption fails, generate a new password
                    String newPassword = generateNewPassword();
                    user.setPassword(passwordEncoder.encode(newPassword));
                    user.setOriginalPassword(encrypt(newPassword)); // Store encrypted password
                    userRepository.save(user);
                    currentPassword = newPassword;
                }
            }
            
            // Send current password email
            try {
                emailService.sendPasswordResetEmail(request.getEmail(), currentPassword);
                System.out.println("[DEBUG] Current password email sent to: " + request.getEmail());
            } catch (Exception e) {
                System.err.println("[ERROR] Failed to send password email: " + e.getMessage());
                return ResponseEntity.badRequest().body("Failed to send password email. Please try again.");
            }
            
            return ResponseEntity.ok("If an account with this email exists, your password has been sent.");
            
        } catch (Exception e) {
            System.err.println("[ERROR] Forgot password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("An error occurred while processing your request.");
        }
    }



    private String generateNewPassword() {
        // Generate a secure random password
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String special = "!@#$%^&*";
        
        StringBuilder password = new StringBuilder();
        java.util.Random random = new java.util.Random();
        
        // Ensure at least one character from each category
        password.append(uppercase.charAt(random.nextInt(uppercase.length())));
        password.append(lowercase.charAt(random.nextInt(lowercase.length())));
        password.append(numbers.charAt(random.nextInt(numbers.length())));
        password.append(special.charAt(random.nextInt(special.length())));
        
        // Add remaining characters
        String allChars = uppercase + lowercase + numbers + special;
        for (int i = 4; i < 12; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }
        
        // Shuffle the password
        String shuffledPassword = password.toString();
        char[] passwordArray = shuffledPassword.toCharArray();
        for (int i = passwordArray.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }
        
        return new String(passwordArray);
    }
    
    // AES Encryption method
    private String encrypt(String value) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(value.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            System.err.println("[ERROR] Encryption failed: " + e.getMessage());
            return value; // Return original value if encryption fails
        }
    }
    
    // AES Decryption method
    private String decrypt(String encryptedValue) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedValue));
            return new String(decryptedBytes);
        } catch (Exception e) {
            System.err.println("[ERROR] Decryption failed: " + e.getMessage());
            return encryptedValue; // Return encrypted value if decryption fails
        }
    }
}
