package com.petadoption.service.impl;

import com.petadoption.model.Veterinarian;
import com.petadoption.repository.VeterinarianRepository;
import com.petadoption.service.VeterinarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VeterinarianServiceImpl implements VeterinarianService {

    @Autowired
    private VeterinarianRepository veterinarianRepository;

    @Override
    public Veterinarian registerVeterinarian(Veterinarian vet) {
        return veterinarianRepository.save(vet);
    }

    @Override
    public List<Veterinarian> getAllVeterinarians() {
        return veterinarianRepository.findAll();
    }

    @Override
    public Veterinarian getVeterinarianById(Long id) {
        return veterinarianRepository.findById(id).orElse(null);
    }

    @Override
    public Veterinarian updateVeterinarian(Long id, Veterinarian updatedVet) {
        Optional<Veterinarian> optionalVet = veterinarianRepository.findById(id);
        if (optionalVet.isPresent()) {
            Veterinarian vet = optionalVet.get();
            vet.setName(updatedVet.getName());
            vet.setEmail(updatedVet.getEmail());
            vet.setSpecialization(updatedVet.getSpecialization());
            return veterinarianRepository.save(vet);
        }
        return null;
    }

    @Override
    public void deleteVeterinarian(Long id) {
        veterinarianRepository.deleteById(id);
    }
}
