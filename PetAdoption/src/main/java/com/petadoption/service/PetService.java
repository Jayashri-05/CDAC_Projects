package com.petadoption.service;

import com.petadoption.model.Pet;
import java.util.List;
import java.util.Map;

public interface PetService {
    List<Pet> getAllPets();
    Pet getPetById(Long id);
    Pet createPet(Pet pet);
    Pet updatePet(Long id, Pet pet);
    void deletePet(Long id);
    void forceDeletePet(Long id);
    List<Pet> getPetsByShelterId(Long shelterId);
    Map<String, Object> checkPetDeletability(Long id);
}
