package com.petadoption.controller;

import com.petadoption.model.AppointmentRequest;
import com.petadoption.model.User;
import com.petadoption.model.Pet;
import com.petadoption.service.AppointmentRequestService;
import com.petadoption.service.UserService;
import com.petadoption.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointment-requests")
@CrossOrigin(origins = "*")
public class AppointmentRequestController {

    @Autowired
    private AppointmentRequestService appointmentRequestService;

    @Autowired
    private UserService userService;

    @Autowired
    private PetService petService;

    @GetMapping
    public List<AppointmentRequest> getAllAppointmentRequests() {
        List<AppointmentRequest> requests = appointmentRequestService.getAllAppointmentRequests();
        System.out.println("[DEBUG] AppointmentRequestController: Returning " + requests.size() + " appointment requests");
        for (AppointmentRequest request : requests) {
            System.out.println("[DEBUG] Request ID: " + request.getId() + ", isEmergency: " + request.getIsEmergency());
        }
        return requests;
    }

    @GetMapping("/user/{userId}")
    public List<AppointmentRequest> getAppointmentRequestsByUser(@PathVariable Long userId) {
        return appointmentRequestService.getAppointmentRequestsByUser(userId);
    }

    @GetMapping("/status/{status}")
    public List<AppointmentRequest> getAppointmentRequestsByStatus(@PathVariable String status) {
        return appointmentRequestService.getAppointmentRequestsByStatus(status);
    }

    @PostMapping
    public ResponseEntity<?> createAppointmentRequest(@RequestBody Map<String, Object> requestData) {
        System.out.println("[DEBUG] AppointmentRequestController: POST /appointment-requests endpoint called");
        System.out.println("[DEBUG] AppointmentRequestController: Request body: " + requestData);
        try {
            
            // Extract data from the request
            Long userId = Long.valueOf(requestData.get("userId").toString());
            Long petId = Long.valueOf(requestData.get("petId").toString());
            String appointmentType = (String) requestData.get("appointmentType");
            String preferredDate = (String) requestData.get("preferredDate");
            String preferredTime = (String) requestData.get("preferredTime");
            String reason = (String) requestData.get("reason");
            String notes = (String) requestData.get("notes");
                        String urgency = (String) requestData.get("urgency");
            Boolean isEmergency = (Boolean) requestData.get("isEmergency");
            
            // Validate required fields
            if (userId == null || petId == null || appointmentType == null ||
                preferredDate == null || preferredTime == null || reason == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }
            
            // Get User and Pet objects
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            Pet pet = petService.getPetById(petId);
            if (pet == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Pet not found"));
            }
            
            // Create AppointmentRequest object
            AppointmentRequest request = new AppointmentRequest();
            request.setUser(user);
            request.setPet(pet);
            request.setAppointmentType(appointmentType);
            
            // Parse the date string to LocalDate
            try {
                request.setPreferredDate(java.time.LocalDate.parse(preferredDate));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Please use YYYY-MM-DD format."));
            }
            
            request.setPreferredTime(preferredTime);
            request.setReason(reason);
            request.setNotes(notes);
            request.setUrgency(urgency);
            request.setIsEmergency(isEmergency != null ? isEmergency : false);
            
            AppointmentRequest createdRequest = appointmentRequestService.createAppointmentRequest(request);
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            System.out.println("[DEBUG] AppointmentRequestController: Error creating appointment request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create appointment request: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointmentRequest(@PathVariable Long id, @RequestBody AppointmentRequest request) {
        try {
            AppointmentRequest updatedRequest = appointmentRequestService.updateAppointmentRequest(id, request);
            if (updatedRequest != null) {
                return ResponseEntity.ok(updatedRequest);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update appointment request: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<?> respondToAppointmentRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> response) {
        try {
            String status = response.get("status");
            String vetResponse = response.get("vetResponse");
            String suggestedDate = response.get("suggestedDate");
            String suggestedTime = response.get("suggestedTime");
            String vetNotes = response.get("vetNotes");

            AppointmentRequest updatedRequest = appointmentRequestService.respondToAppointmentRequest(
                id, status, vetResponse, suggestedDate, suggestedTime, vetNotes);
            
            if (updatedRequest != null) {
                return ResponseEntity.ok(updatedRequest);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to respond to appointment request: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointmentRequest(@PathVariable Long id) {
        try {
            appointmentRequestService.deleteAppointmentRequest(id);
            return ResponseEntity.ok(Map.of("message", "Appointment request deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete appointment request: " + e.getMessage()));
        }
    }
    
    // Test endpoint to verify controller is accessible
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        System.out.println("[DEBUG] AppointmentRequestController: GET /test endpoint called");
        List<AppointmentRequest> requests = appointmentRequestService.getAllAppointmentRequests();
        System.out.println("[DEBUG] Total appointment requests: " + requests.size());
        
        Map<String, Object> response = Map.of(
            "message", "AppointmentRequestController is working",
            "totalRequests", requests.size(),
            "requestsWithEmergencyField", requests.stream().filter(req -> req.getIsEmergency() != null).count(),
            "emergencyRequests", requests.stream().filter(req -> Boolean.TRUE.equals(req.getIsEmergency())).count()
        );
        
        return ResponseEntity.ok(response);
    }
} 