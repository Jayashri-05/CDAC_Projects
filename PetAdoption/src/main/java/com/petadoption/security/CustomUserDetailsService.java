package com.petadoption.security;

import com.petadoption.model.User;
import com.petadoption.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("[DEBUG] CustomUserDetailsService: Attempting to load user by email: " + email);
        
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
            
            System.out.println("[DEBUG] CustomUserDetailsService: User found - ID: " + user.getId() + 
                             ", Email: " + user.getEmail() + 
                             ", Username: " + user.getUsername() + 
                             ", Role: " + user.getRole() + 
                             ", Approved: " + user.isApproved());
            
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole())))
                    .build();
        } catch (UsernameNotFoundException e) {
            System.out.println("[DEBUG] CustomUserDetailsService: User not found with email: " + email);
            throw e;
        } catch (Exception e) {
            System.out.println("[DEBUG] CustomUserDetailsService: Error loading user: " + e.getMessage());
            throw e;
        }
    }
}