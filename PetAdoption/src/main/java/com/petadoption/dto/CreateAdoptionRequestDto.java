package com.petadoption.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateAdoptionRequestDto {
    
    @NotNull(message = "Pet ID is required")
    private Long petId;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
    
    @NotBlank(message = "Aadhar number is required")
    private String aadharNumber;
    
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String occupation;
    private String annualIncome;
    private String experienceWithPets;
    private String reasonForAdoption;
    private String livingSituation;
    private String otherPets;
    private String childrenInHome;
    private String timeAtHome;
    private String emergencyContact;
    private String emergencyPhone;
    
    // Constructors
    public CreateAdoptionRequestDto() {}
    
    // Getters and Setters
    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getAadharNumber() { return aadharNumber; }
    public void setAadharNumber(String aadharNumber) { this.aadharNumber = aadharNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    
    public String getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(String annualIncome) { this.annualIncome = annualIncome; }
    
    public String getExperienceWithPets() { return experienceWithPets; }
    public void setExperienceWithPets(String experienceWithPets) { this.experienceWithPets = experienceWithPets; }
    
    public String getReasonForAdoption() { return reasonForAdoption; }
    public void setReasonForAdoption(String reasonForAdoption) { this.reasonForAdoption = reasonForAdoption; }
    
    public String getLivingSituation() { return livingSituation; }
    public void setLivingSituation(String livingSituation) { this.livingSituation = livingSituation; }
    
    public String getOtherPets() { return otherPets; }
    public void setOtherPets(String otherPets) { this.otherPets = otherPets; }
    
    public String getChildrenInHome() { return childrenInHome; }
    public void setChildrenInHome(String childrenInHome) { this.childrenInHome = childrenInHome; }
    
    public String getTimeAtHome() { return timeAtHome; }
    public void setTimeAtHome(String timeAtHome) { this.timeAtHome = timeAtHome; }
    
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    
    public String getEmergencyPhone() { return emergencyPhone; }
    public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }
} 