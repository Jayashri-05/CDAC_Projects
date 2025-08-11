package com.petadoption.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String petName;
    private String species;
    private String breed;
    private int age;
    private boolean adopted;
    
    // Additional fields for comprehensive pet information
    private String description;
    private String healthStatus;
    private String size;
    private String gender;
    private String color;
    private String specialNeeds;
    private Double adoptionFee;
    
    // Photo URLs (comma-separated for multiple photos)
    @Column(length = 1000)
    private String photoUrls;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    @JsonBackReference
    private Shelter shelter;

    public Pet() {}

    public Pet(String petName, String species, String breed, int age, boolean adopted, Shelter shelter) {
        this.petName = petName;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.adopted = adopted;
        this.shelter = shelter;
    }

    // Getters and Setters for existing fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public boolean isAdopted() { return adopted; }
    public void setAdopted(boolean adopted) { this.adopted = adopted; }

    public Shelter getShelter() { return shelter; }
    public void setShelter(Shelter shelter) { this.shelter = shelter; }

    // Getters and Setters for new fields
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

    public String getPhotoUrls() { return photoUrls; }
    public void setPhotoUrls(String photoUrls) { this.photoUrls = photoUrls; }
}
