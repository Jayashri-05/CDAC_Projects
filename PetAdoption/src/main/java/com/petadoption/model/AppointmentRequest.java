package com.petadoption.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class AppointmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    @JsonIgnoreProperties({"shelter", "hibernateLazyInitializer", "handler"})
    private Pet pet;

    // Appointment details
    private String appointmentType; // checkup, vaccination, surgery, emergency, consultation, followup
    private LocalDate preferredDate;
    private String preferredTime;
    private String reason;
    private String notes;
    private String urgency; // low, medium, high, emergency
    private Boolean isEmergency; // true for emergency cases
    
    // Status tracking
    private String status; // pending, approved, rejected, completed
    private LocalDateTime requestDate;
    private LocalDateTime responseDate;
    
    // Veterinarian response
    private String vetResponse;
    private String suggestedDate;
    private String suggestedTime;
    private String vetNotes;

    // Constructors
    public AppointmentRequest() {}

    public AppointmentRequest(Long id, User user, Pet pet, String appointmentType, LocalDate preferredDate,
                            String preferredTime, String reason, String notes, String urgency, Boolean isEmergency,
                            String status, LocalDateTime requestDate, LocalDateTime responseDate, String vetResponse,
                            String suggestedDate, String suggestedTime, String vetNotes) {
        this.id = id;
        this.user = user;
        this.pet = pet;
        this.appointmentType = appointmentType;
        this.preferredDate = preferredDate;
        this.preferredTime = preferredTime;
        this.reason = reason;
        this.notes = notes;
        this.urgency = urgency;
        this.isEmergency = isEmergency;
        this.status = status;
        this.requestDate = requestDate;
        this.responseDate = responseDate;
        this.vetResponse = vetResponse;
        this.suggestedDate = suggestedDate;
        this.suggestedTime = suggestedTime;
        this.vetNotes = vetNotes;
    }

    @PrePersist
    protected void onCreate() {
        requestDate = LocalDateTime.now();
        if (status == null) {
            status = "pending";
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public String getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(String appointmentType) {
        this.appointmentType = appointmentType;
    }

    public LocalDate getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(LocalDate preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public Boolean getIsEmergency() {
        return isEmergency;
    }

    public void setIsEmergency(Boolean isEmergency) {
        this.isEmergency = isEmergency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getResponseDate() {
        return responseDate;
    }

    public void setResponseDate(LocalDateTime responseDate) {
        this.responseDate = responseDate;
    }

    public String getVetResponse() {
        return vetResponse;
    }

    public void setVetResponse(String vetResponse) {
        this.vetResponse = vetResponse;
    }

    public String getSuggestedDate() {
        return suggestedDate;
    }

    public void setSuggestedDate(String suggestedDate) {
        this.suggestedDate = suggestedDate;
    }

    public String getSuggestedTime() {
        return suggestedTime;
    }

    public void setSuggestedTime(String suggestedTime) {
        this.suggestedTime = suggestedTime;
    }

    public String getVetNotes() {
        return vetNotes;
    }

    public void setVetNotes(String vetNotes) {
        this.vetNotes = vetNotes;
    }
} 