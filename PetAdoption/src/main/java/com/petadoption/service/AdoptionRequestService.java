package com.petadoption.service;

import com.petadoption.model.AdoptionRequest;

import java.util.List;

public interface AdoptionRequestService {
    List<AdoptionRequest> getAllRequests();
    AdoptionRequest getRequestById(Long id);
    AdoptionRequest createRequest(AdoptionRequest request);
    AdoptionRequest updateRequestStatus(Long id, String status);
    void deleteRequest(Long id);
    
    // Additional methods
    List<AdoptionRequest> getRequestsByUser(Long userId);
    List<AdoptionRequest> getRequestsByStatus(String status);
    List<AdoptionRequest> getRequestsByUserAndPet(Long userId, Long petId);
}
