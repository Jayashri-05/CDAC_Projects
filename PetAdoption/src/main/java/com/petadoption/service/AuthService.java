package com.petadoption.service;

import com.petadoption.dto.ForgotPasswordRequest;
import com.petadoption.dto.LoginRequest;
import com.petadoption.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> register(RegisterRequest request);
    ResponseEntity<?> login(LoginRequest request);
    ResponseEntity<?> forgotPassword(ForgotPasswordRequest request);
}
