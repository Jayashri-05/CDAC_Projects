package com.petadoption.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "app_user") // Changed table name to avoid reserved keyword conflict
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    @JsonIgnore
    private String password;
    private String email;
    
    @JsonIgnore
    @Column(name = "original_password")
    private String originalPassword;
    private String role; // ADMIN, USER, SHELTER, VET

    private String fullName;
    private String phone;
    private String address;

    private boolean approved = false; // for admin approval
    private String status = "active"; // active, inactive

    // Constructors
    public User() {}

    public User(Long id, String username, String password, String email, String originalPassword, 
                String role, String fullName, String phone, String address, boolean approved, String status) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.originalPassword = originalPassword;
        this.role = role;
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
        this.approved = approved;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOriginalPassword() {
        return originalPassword;
    }

    public void setOriginalPassword(String originalPassword) {
        this.originalPassword = originalPassword;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
