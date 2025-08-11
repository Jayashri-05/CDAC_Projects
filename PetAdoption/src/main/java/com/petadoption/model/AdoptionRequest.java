package com.petadoption.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class AdoptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "adopter_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User adopter;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    @JsonIgnoreProperties({"shelter", "hibernateLazyInitializer", "handler"})
    private Pet pet;

    // Personal Information
    private String fullName;
    private String email;
    private String phoneNumber;
    private String aadharNumber;
    
    // Address Information
    private String address;
    private String city;
    private String state;
    private String zipCode;
    
    // Lifestyle Information
    private String occupation;
    private String annualIncome;
    private String experienceWithPets;
    private String reasonForAdoption;
    private String livingSituation;
    private String otherPets;
    private String childrenInHome;
    private String timeAtHome;
    
    // Emergency Contact
    private String emergencyContact;
    private String emergencyPhone;
    
    private String status; // pending, approved, rejected
    private LocalDateTime applicationDate;
    private LocalDateTime updatedAt;

    // Constructors
    public AdoptionRequest() {}

    public AdoptionRequest(Long id, User adopter, Pet pet, String fullName, String email, 
                          String phoneNumber, String aadharNumber, String address, String city, 
                          String state, String zipCode, String occupation, String annualIncome, 
                          String experienceWithPets, String reasonForAdoption, String livingSituation, 
                          String otherPets, String childrenInHome, String timeAtHome, 
                          String emergencyContact, String emergencyPhone, String status, 
                          LocalDateTime applicationDate, LocalDateTime updatedAt) {
        this.id = id;
        this.adopter = adopter;
        this.pet = pet;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.aadharNumber = aadharNumber;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.occupation = occupation;
        this.annualIncome = annualIncome;
        this.experienceWithPets = experienceWithPets;
        this.reasonForAdoption = reasonForAdoption;
        this.livingSituation = livingSituation;
        this.otherPets = otherPets;
        this.childrenInHome = childrenInHome;
        this.timeAtHome = timeAtHome;
        this.emergencyContact = emergencyContact;
        this.emergencyPhone = emergencyPhone;
        this.status = status;
        this.applicationDate = applicationDate;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        applicationDate = LocalDateTime.now();
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

    public User getAdopter() {
        return adopter;
    }

    public void setAdopter(User adopter) {
        this.adopter = adopter;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAadharNumber() {
        return aadharNumber;
    }

    public void setAadharNumber(String aadharNumber) {
        this.aadharNumber = aadharNumber;
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

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(String annualIncome) {
        this.annualIncome = annualIncome;
    }

    public String getExperienceWithPets() {
        return experienceWithPets;
    }

    public void setExperienceWithPets(String experienceWithPets) {
        this.experienceWithPets = experienceWithPets;
    }

    public String getReasonForAdoption() {
        return reasonForAdoption;
    }

    public void setReasonForAdoption(String reasonForAdoption) {
        this.reasonForAdoption = reasonForAdoption;
    }

    public String getLivingSituation() {
        return livingSituation;
    }

    public void setLivingSituation(String livingSituation) {
        this.livingSituation = livingSituation;
    }

    public String getOtherPets() {
        return otherPets;
    }

    public void setOtherPets(String otherPets) {
        this.otherPets = otherPets;
    }

    public String getChildrenInHome() {
        return childrenInHome;
    }

    public void setChildrenInHome(String childrenInHome) {
        this.childrenInHome = childrenInHome;
    }

    public String getTimeAtHome() {
        return timeAtHome;
    }

    public void setTimeAtHome(String timeAtHome) {
        this.timeAtHome = timeAtHome;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getEmergencyPhone() {
        return emergencyPhone;
    }

    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
