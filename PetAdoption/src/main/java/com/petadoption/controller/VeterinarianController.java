package com.petadoption.controller;

import com.petadoption.model.Veterinarian;
import com.petadoption.service.VeterinarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veterinarians")
@CrossOrigin(origins = "http://localhost:3000")
public class VeterinarianController {

    @Autowired
    private VeterinarianService veterinarianService;

    @PostMapping("/register")
    public Veterinarian register(@RequestBody Veterinarian vet) {
        return veterinarianService.registerVeterinarian(vet);
    }

    @GetMapping
    public List<Veterinarian> getAll() {
        return veterinarianService.getAllVeterinarians();
    }

    @GetMapping("/{id}")
    public Veterinarian getById(@PathVariable Long id) {
        return veterinarianService.getVeterinarianById(id);
    }

    @PutMapping("/{id}")
    public Veterinarian update(@PathVariable Long id, @RequestBody Veterinarian updatedVet) {
        return veterinarianService.updateVeterinarian(id, updatedVet);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        veterinarianService.deleteVeterinarian(id);
    }
}
