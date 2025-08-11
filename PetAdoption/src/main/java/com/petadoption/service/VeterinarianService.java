package com.petadoption.service;

import com.petadoption.model.Veterinarian;
import java.util.List;

public interface VeterinarianService {
    Veterinarian registerVeterinarian(Veterinarian vet);
    List<Veterinarian> getAllVeterinarians();
    Veterinarian getVeterinarianById(Long id);
    Veterinarian updateVeterinarian(Long id, Veterinarian updatedVet);
    void deleteVeterinarian(Long id);
}
