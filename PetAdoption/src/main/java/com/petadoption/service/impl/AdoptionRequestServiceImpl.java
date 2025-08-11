package com.petadoption.service.impl;

import com.petadoption.model.AdoptionRequest;
import com.petadoption.repository.AdoptionRequestRepository;
import com.petadoption.service.AdoptionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionRequestServiceImpl implements AdoptionRequestService {

    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;

    @Override
    public List<AdoptionRequest> getAllRequests() {
        List<AdoptionRequest> requests = adoptionRequestRepository.findAll();
        System.out.println("[DEBUG] AdoptionRequestService: Found " + requests.size() + " adoption requests");
        for (AdoptionRequest request : requests) {
            System.out.println("[DEBUG] AdoptionRequestService: Request ID: " + request.getId() + 
                             ", Pet: " + (request.getPet() != null ? request.getPet().getPetName() : "null") + 
                             ", Status: " + request.getStatus() + 
                             ", Adopter: " + (request.getAdopter() != null ? request.getAdopter().getFullName() : "null"));
        }
        return requests;
    }

    @Override
    public AdoptionRequest getRequestById(Long id) {
        return adoptionRequestRepository.findById(id).orElse(null);
    }

    @Override
    public AdoptionRequest createRequest(AdoptionRequest request) {
        request.setStatus("pending");
        System.out.println("[DEBUG] AdoptionRequestService: Creating adoption request");
        System.out.println("[DEBUG] AdoptionRequestService: Pet ID: " + (request.getPet() != null ? request.getPet().getId() : "null"));
        System.out.println("[DEBUG] AdoptionRequestService: Adopter ID: " + (request.getAdopter() != null ? request.getAdopter().getId() : "null"));
        System.out.println("[DEBUG] AdoptionRequestService: Status: " + request.getStatus());
        
        AdoptionRequest savedRequest = adoptionRequestRepository.save(request);
        System.out.println("[DEBUG] AdoptionRequestService: Saved request with ID: " + savedRequest.getId());
        return savedRequest;
    }

    @Override
    public AdoptionRequest updateRequestStatus(Long id, String status) {
        Optional<AdoptionRequest> existing = adoptionRequestRepository.findById(id);
        if (existing.isPresent()) {
            AdoptionRequest req = existing.get();
            req.setStatus(status);
            return adoptionRequestRepository.save(req);
        }
        return null;
    }

    @Override
    public void deleteRequest(Long id) {
        adoptionRequestRepository.deleteById(id);
    }

    @Override
    public List<AdoptionRequest> getRequestsByUser(Long userId) {
        System.out.println("[DEBUG] AdoptionRequestService: Getting requests for user ID: " + userId);
        List<AdoptionRequest> requests = adoptionRequestRepository.findByAdopterIdOrderByApplicationDateDesc(userId);
        System.out.println("[DEBUG] AdoptionRequestService: Found " + requests.size() + " requests for user " + userId);
        
        for (AdoptionRequest request : requests) {
            System.out.println("[DEBUG] AdoptionRequestService: Request ID: " + request.getId() + 
                             ", Pet: " + (request.getPet() != null ? request.getPet().getPetName() : "null") + 
                             ", Status: " + request.getStatus() + 
                             ", Adopter: " + (request.getAdopter() != null ? request.getAdopter().getFullName() : "null"));
        }
        
        return requests;
    }

    @Override
    public List<AdoptionRequest> getRequestsByStatus(String status) {
        return adoptionRequestRepository.findByStatusOrderByApplicationDateDesc(status);
    }

    @Override
    public List<AdoptionRequest> getRequestsByUserAndPet(Long userId, Long petId) {
        return adoptionRequestRepository.findByAdopterIdAndPetId(userId, petId);
    }
}
