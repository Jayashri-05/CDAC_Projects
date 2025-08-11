package com.petadoption.security;

import com.petadoption.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    // Generate JWT Token
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())  // use email or username
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // Extract username (email) from JWT
    public String extractUsername(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();
            String subject = claims.getSubject();
            System.out.println("[DEBUG] JWT Service: Extracted subject from token: " + subject);
            return subject;
        } catch (Exception e) {
            System.out.println("[DEBUG] JWT Service: Error extracting username from token: " + e.getMessage());
            throw e;
        }
    }

    // Validate JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            System.out.println("[DEBUG] JWT Service: Token validation successful");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("[DEBUG] JWT Service: Token validation failed: " + e.getMessage());
            return false;  // token expired or tampered
        }
    }
}
