package com.petadoption.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class CreatePetRequest {
    
    @NotBlank(message = "Pet name is required")
    private String petName;
    
    @NotBlank(message = "Species is required")
    private String species;
    
    @NotBlank(message = "Breed is required")
    private String breed;
    
    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be at least 0")
    @Max(value = 30, message = "Age cannot exceed 30")
    private Integer age;
    
    private String description;
    private String healthStatus;
    private String size;
    private String gender;
    private String color;
    private String specialNeeds;
    private Double adoptionFee;
    
    @NotNull(message = "Shelter ID is required")
    private Long shelterId;

    // Default constructor
    public CreatePetRequest() {}

    // Constructor with all fields
    public CreatePetRequest(String petName, String species, String breed, Integer age, 
                          String description, String healthStatus, String size, 
                          String gender, String color, String specialNeeds, 
                          Double adoptionFee, Long shelterId) {
        this.petName = petName;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.description = description;
        this.healthStatus = healthStatus;
        this.size = size;
        this.gender = gender;
        this.color = color;
        this.specialNeeds = specialNeeds;
        this.adoptionFee = adoptionFee;
        this.shelterId = shelterId;
    }

    // Getters and Setters
    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHealthStatus() { return healthStatus; }
    public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getSpecialNeeds() { return specialNeeds; }
    public void setSpecialNeeds(String specialNeeds) { this.specialNeeds = specialNeeds; }

    public Double getAdoptionFee() { return adoptionFee; }
    public void setAdoptionFee(Double adoptionFee) { this.adoptionFee = adoptionFee; }

    public Long getShelterId() { return shelterId; }
    public void setShelterId(Long shelterId) { this.shelterId = shelterId; }
} 