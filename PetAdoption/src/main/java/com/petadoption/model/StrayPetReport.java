package com.petadoption.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class StrayPetReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User reporter;

    private String petType; // dog, cat, bird, rabbit, other
    private String description;
    private String location; // e.g., "Near Central Park"
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String contactPhone;
    private String urgency; // low, medium, high
    private String additionalNotes;
    private String photoUrl; // URL to stored photo
    private String status; // pending, in_progress, resolved, closed
    private LocalDateTime timestamp;
    private LocalDateTime updatedAt;

    // Constructors
    public StrayPetReport() {}

    public StrayPetReport(Long id, User reporter, String petType, String description, String location,
                         String address, String city, String state, String zipCode, String contactPhone,
                         String urgency, String additionalNotes, String photoUrl, String status,
                         LocalDateTime timestamp, LocalDateTime updatedAt) {
        this.id = id;
        this.reporter = reporter;
        this.petType = petType;
        this.description = description;
        this.location = location;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.contactPhone = contactPhone;
        this.urgency = urgency;
        this.additionalNotes = additionalNotes;
        this.photoUrl = photoUrl;
        this.status = status;
        this.timestamp = timestamp;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "pending";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public String getPetType() {
        return petType;
    }

    public void setPetType(String petType) {
        this.petType = petType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 