package com.petadoption.controller;

import com.petadoption.model.Shelter;
import com.petadoption.service.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelters")
@CrossOrigin(origins = "*")
public class ShelterController {

    @Autowired
    private ShelterService shelterService;

    @GetMapping
    public List<Shelter> getAllShelters() {
        return shelterService.getAllShelters();
    }

    @GetMapping("/{id}")
    public Shelter getShelterById(@PathVariable Long id) {
        return shelterService.getShelterById(id);
    }

    @PostMapping
    public Shelter createShelter(@RequestBody Shelter shelter) {
        return shelterService.createShelter(shelter);
    }

    @PutMapping("/{id}")
    public Shelter updateShelter(@PathVariable Long id, @RequestBody Shelter shelter) {
        return shelterService.updateShelter(id, shelter);
    }

    @DeleteMapping("/{id}")
    public void deleteShelter(@PathVariable Long id) {
        shelterService.deleteShelter(id);
    }
}
