package com.petadoption.controller;

import com.petadoption.model.AdoptionRequest;
import com.petadoption.model.Pet;
import com.petadoption.model.User;
import com.petadoption.dto.CreateAdoptionRequestDto;
import com.petadoption.service.AdoptionRequestService;
import com.petadoption.service.PetService;
import com.petadoption.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adoption-requests")
@CrossOrigin(origins = "*")
public class AdoptionRequestController {

    @Autowired
    private AdoptionRequestService adoptionRequestService;

    @Autowired
    private UserService userService;

    @Autowired
    private PetService petService;

    @PostMapping
    public ResponseEntity<?> createAdoptionRequest(@RequestBody CreateAdoptionRequestDto requestDto) {
        System.out.println("[DEBUG] POST /adoption-requests - Request received");
        System.out.println("[DEBUG] POST /adoption-requests - Request DTO: " + requestDto);
        
        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("[DEBUG] POST /adoption-requests - Authentication: " + authentication);
            System.out.println("[DEBUG] POST /adoption-requests - Authentication name: " + (authentication != null ? authentication.getName() : "null"));
            
            if (authentication == null || authentication.getName() == null || authentication.getName().equals("anonymousUser")) {
                System.out.println("[DEBUG] POST /adoption-requests - Authentication failed - returning 403");
                Map<String, String> error = new HashMap<>();
                error.put("error", "Authentication required");
                return ResponseEntity.status(403).body(error);
            }
            
            String username = authentication.getName();
            System.out.println("[DEBUG] AdoptionRequestController: Authentication name: " + username);
            
            // Try to find user by email first (since JWT uses email as subject)
            User currentUser = userService.findByEmail(username);
            if (currentUser == null) {
                // Fallback to username
                currentUser = userService.findByUsername(username);
            }
            
            System.out.println("[DEBUG] AdoptionRequestController: User found: " + (currentUser != null ? "Yes" : "No"));
            if (currentUser != null) {
                System.out.println("[DEBUG] AdoptionRequestController: User ID: " + currentUser.getId() + 
                                 ", Email: " + currentUser.getEmail() + 
                                 ", Username: " + currentUser.getUsername());
            }
            
            if (currentUser == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                return ResponseEntity.status(403).body(error);
            }

            // Get the pet
            Pet pet = petService.getPetById(requestDto.getPetId());
            if (pet == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Pet not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if pet is already adopted
            if (pet.isAdopted()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Pet is already adopted");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if user has already applied for this pet
            List<AdoptionRequest> existingRequests = adoptionRequestService.getRequestsByUserAndPet(currentUser.getId(), pet.getId());
            if (!existingRequests.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "You have already applied for this pet");
                return ResponseEntity.badRequest().body(error);
            }

            // Create the adoption request from DTO
            AdoptionRequest adoptionRequest = new AdoptionRequest();
            adoptionRequest.setAdopter(currentUser);
            adoptionRequest.setPet(pet);
            adoptionRequest.setFullName(requestDto.getFullName());
            adoptionRequest.setEmail(requestDto.getEmail());
            adoptionRequest.setPhoneNumber(requestDto.getPhoneNumber());
            adoptionRequest.setAadharNumber(requestDto.getAadharNumber());
            adoptionRequest.setAddress(requestDto.getAddress());
            adoptionRequest.setCity(requestDto.getCity());
            adoptionRequest.setState(requestDto.getState());
            adoptionRequest.setZipCode(requestDto.getZipCode());
            adoptionRequest.setOccupation(requestDto.getOccupation());
            adoptionRequest.setAnnualIncome(requestDto.getAnnualIncome());
            adoptionRequest.setExperienceWithPets(requestDto.getExperienceWithPets());
            adoptionRequest.setReasonForAdoption(requestDto.getReasonForAdoption());
            adoptionRequest.setLivingSituation(requestDto.getLivingSituation());
            adoptionRequest.setOtherPets(requestDto.getOtherPets());
            adoptionRequest.setChildrenInHome(requestDto.getChildrenInHome());
            adoptionRequest.setTimeAtHome(requestDto.getTimeAtHome());
            adoptionRequest.setEmergencyContact(requestDto.getEmergencyContact());
            adoptionRequest.setEmergencyPhone(requestDto.getEmergencyPhone());
            adoptionRequest.setStatus("pending");

            AdoptionRequest savedRequest = adoptionRequestService.createRequest(adoptionRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Adoption request created successfully");
            response.put("request", savedRequest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("[DEBUG] POST /adoption-requests - Exception occurred: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create adoption request: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        System.out.println("[DEBUG] GET /adoption-requests - Fetching all requests");
        try {
            List<AdoptionRequest> requests = adoptionRequestService.getAllRequests();
            System.out.println("[DEBUG] GET /adoption-requests - Found " + requests.size() + " requests");
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.out.println("[DEBUG] GET /adoption-requests - Exception: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch requests: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRequestsByUser(@PathVariable Long userId) {
        System.out.println("[DEBUG] AdoptionRequestController: Getting requests for user ID: " + userId);
        try {
            List<AdoptionRequest> requests = adoptionRequestService.getRequestsByUser(userId);
            System.out.println("[DEBUG] AdoptionRequestController: Returning " + requests.size() + " requests");
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.out.println("[DEBUG] AdoptionRequestController: Error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user requests: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        try {
            AdoptionRequest request = adoptionRequestService.getRequestById(id);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch request: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            AdoptionRequest updatedRequest = adoptionRequestService.updateRequestStatus(id, status);
            
            // If approved, update pet status to adopted
            if ("approved".equals(status)) {
                Pet pet = updatedRequest.getPet();
                // Double-check: only mark as adopted if not already adopted
                if (!pet.isAdopted()) {
                    pet.setAdopted(true);
                    petService.updatePet(pet.getId(), pet);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Request status updated successfully");
            response.put("request", updatedRequest);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update request status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            adoptionRequestService.deleteRequest(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Request deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete request: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getRequestsByStatus(@PathVariable String status) {
        try {
            List<AdoptionRequest> requests = adoptionRequestService.getRequestsByStatus(status);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch requests by status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Test endpoint to verify authentication
    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuthentication() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("[DEBUG] Test Auth - Authentication: " + authentication);
            System.out.println("[DEBUG] Test Auth - Authentication name: " + (authentication != null ? authentication.getName() : "null"));
            
            if (authentication == null || authentication.getName() == null || authentication.getName().equals("anonymousUser")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Authentication required");
                return ResponseEntity.status(403).body(error);
            }
            
            // Try to find the user in the database
            String username = authentication.getName();
            System.out.println("[DEBUG] Test Auth - Authentication name: " + username);
            
            // Try to find user by email first (since JWT uses email as subject)
            User user = userService.findByEmail(username);
            if (user == null) {
                // Fallback to username
                user = userService.findByUsername(username);
            }
            System.out.println("[DEBUG] Test Auth - User found in database: " + (user != null ? "Yes" : "No"));
            if (user != null) {
                System.out.println("[DEBUG] Test Auth - User ID: " + user.getId() + ", Email: " + user.getEmail() + ", Role: " + user.getRole());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Authentication successful");
            response.put("username", authentication.getName());
            response.put("authorities", authentication.getAuthorities());
            response.put("userExists", user != null);
            if (user != null) {
                response.put("userId", user.getId());
                response.put("userEmail", user.getEmail());
                response.put("userRole", user.getRole());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Test authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Debug endpoint to check users in database
    @GetMapping("/debug/users")
    public ResponseEntity<?> debugUsers() {
        try {
            List<User> allUsers = userService.getAllUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("totalUsers", allUsers.size());
            response.put("users", allUsers.stream().map(user -> {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("username", user.getUsername());
                userInfo.put("email", user.getEmail());
                userInfo.put("role", user.getRole());
                userInfo.put("approved", user.isApproved());
                return userInfo;
            }).collect(java.util.stream.Collectors.toList()));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get users: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Debug endpoint to check adoption request details
    @GetMapping("/debug/request/{id}")
    public ResponseEntity<?> debugRequest(@PathVariable Long id) {
        try {
            AdoptionRequest request = adoptionRequestService.getRequestById(id);
            if (request == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Request not found");
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("request", request);
            response.put("pet", request.getPet());
            response.put("adopter", request.getAdopter());
            response.put("petShelter", request.getPet() != null ? request.getPet().getShelter() : null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get request details: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Debug endpoint to test POST authentication
    @PostMapping("/debug/test-post")
    public ResponseEntity<?> debugTestPost(@RequestBody(required = false) Object requestBody) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("[DEBUG] POST /debug/test-post - Authentication: " + authentication);
            System.out.println("[DEBUG] POST /debug/test-post - Authentication name: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("[DEBUG] POST /debug/test-post - Request body: " + requestBody);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "POST test successful");
            response.put("authentication", authentication != null ? authentication.getName() : "null");
            response.put("requestBody", requestBody);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("[DEBUG] POST /debug/test-post - Exception: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "POST test failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
