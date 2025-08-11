package com.petadoption.service.impl;

import com.petadoption.model.Shelter;
import com.petadoption.repository.ShelterRepository;
import com.petadoption.service.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShelterServiceImpl implements ShelterService {

    @Autowired
    private ShelterRepository shelterRepository;

    @Override
    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

    @Override
    public Shelter getShelterById(Long id) {
        return shelterRepository.findById(id).orElse(null);
    }

    @Override
    public Shelter createShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    @Override
    public Shelter updateShelter(Long id, Shelter updatedShelter) {
        Shelter existingShelter = shelterRepository.findById(id).orElse(null);
        if (existingShelter != null) {
            existingShelter.setShelterName(updatedShelter.getShelterName());
            existingShelter.setEmail(updatedShelter.getEmail());
            existingShelter.setPhone(updatedShelter.getPhone());
            existingShelter.setAddress(updatedShelter.getAddress());
            return shelterRepository.save(existingShelter);
        } else {
            return null;
        }
    }

    @Override
    public void deleteShelter(Long id) {
        shelterRepository.deleteById(id);
    }
}
