package com.petadoption.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Skip JWT processing for public endpoints
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        // Allow all methods for public endpoints
        if (requestURI.startsWith("/api/auth/")) {
            System.out.println("[DEBUG] JWT Filter: Allowing public access to: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        // For pets endpoints, allow GET requests without authentication, but require auth for POST/PUT/DELETE
        if (requestURI.startsWith("/api/pets")) {
            if (method.equals("GET")) {
                System.out.println("[DEBUG] JWT Filter: Allowing public GET access to: " + requestURI);
                filterChain.doFilter(request, response);
                return;
            } else {
                System.out.println("[DEBUG] JWT Filter: Processing authenticated pets request: " + requestURI + " with method: " + method);
                // Continue with JWT processing for authentication
            }
        }
        
        // For blog creation endpoints, allow authenticated requests
        if (requestURI.startsWith("/api/blogs/create/")) {
            System.out.println("[DEBUG] JWT Filter: Processing authenticated blog creation request: " + requestURI);
            // Continue with JWT processing for authentication
        }
        
        // For specific blog endpoints, allow GET requests without authentication
        if (requestURI.startsWith("/api/blogs/all") && method.equals("GET")) {
            System.out.println("[DEBUG] JWT Filter: Allowing public GET access to: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        if (requestURI.startsWith("/api/blogs/test") && method.equals("GET")) {
            System.out.println("[DEBUG] JWT Filter: Allowing public GET access to: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        if (requestURI.startsWith("/api/blogs/test-image") && method.equals("GET")) {
            System.out.println("[DEBUG] JWT Filter: Allowing public GET access to: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        if (requestURI.startsWith("/api/blogs/image/") && method.equals("GET")) {
            System.out.println("[DEBUG] JWT Filter: Allowing public GET access to: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        String jwt = null;
        String username = null;

        System.out.println("[DEBUG] JWT Filter: Processing request to: " + requestURI + " with method: " + method);
        System.out.println("[DEBUG] JWT Filter: Authorization header: " + (authHeader != null ? "Present" : "Missing"));
        if (authHeader != null) {
            System.out.println("[DEBUG] JWT Filter: Auth header starts with Bearer: " + authHeader.startsWith("Bearer "));
        }

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                username = jwtService.extractUsername(jwt);
                System.out.println("[DEBUG] JWT Filter: Extracted username: " + username);
            } catch (Exception e) {
                System.out.println("[DEBUG] JWT Filter: Invalid token - " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                System.out.println("[DEBUG] JWT Filter: Attempting to load user details for username: " + username);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("[DEBUG] JWT Filter: User details loaded successfully: " + userDetails.getUsername());
                
                if (jwtService.validateToken(jwt)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("[DEBUG] JWT Filter: Authentication successful for user: " + username);
                    System.out.println("[DEBUG] JWT Filter: Authorities: " + userDetails.getAuthorities());
                } else {
                    System.out.println("[DEBUG] JWT Filter: Token validation failed for user: " + username);
                }
            } catch (Exception e) {
                System.out.println("[DEBUG] JWT Filter: Error loading user details: " + e.getMessage());
                e.printStackTrace();
            }
        } else if (username == null) {
            System.out.println("[DEBUG] JWT Filter: No valid token found");
        }

        filterChain.doFilter(request, response);
    }
} 