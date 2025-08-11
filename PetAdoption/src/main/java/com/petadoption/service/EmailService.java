package com.petadoption.service;

import com.petadoption.model.User;

public interface EmailService {
    void sendWelcomeEmail(User user);
    void sendEmail(String to, String subject, String content);
    void sendPasswordResetEmail(String email, String resetToken);
} 