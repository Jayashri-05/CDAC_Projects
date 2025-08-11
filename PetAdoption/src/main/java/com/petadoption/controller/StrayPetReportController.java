package com.petadoption.controller;

import com.petadoption.model.StrayPetReport;
import com.petadoption.model.User;
import com.petadoption.service.StrayPetReportService;
import com.petadoption.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stray-pet-reports")
@CrossOrigin(origins = "*")
public class StrayPetReportController {

    @Autowired
    private StrayPetReportService strayPetReportService;

    @Autowired
    private UserService userService;

    @GetMapping("/photo/{filename}")
    public ResponseEntity<Resource> getPhoto(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/stray-pets/" + filename);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createReport(
            @RequestParam("petType") String petType,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam("state") String state,
            @RequestParam("zipCode") String zipCode,
            @RequestParam(value = "contactPhone", required = false) String contactPhone,
            @RequestParam("urgency") String urgency,
            @RequestParam(value = "additionalNotes", required = false) String additionalNotes,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {

        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User currentUser = userService.findByUsername(username);

            // Create report object
            StrayPetReport report = new StrayPetReport();
            report.setReporter(currentUser);
            report.setPetType(petType);
            report.setDescription(description);
            report.setLocation(location);
            report.setAddress(address);
            report.setCity(city);
            report.setState(state);
            report.setZipCode(zipCode);
            report.setContactPhone(contactPhone);
            report.setUrgency(urgency);
            report.setAdditionalNotes(additionalNotes);

            // Save report with photo
            StrayPetReport savedReport = strayPetReportService.createReport(report, photo);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Stray pet report created successfully");
            response.put("report", savedReport);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create stray pet report: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllReports() {
        try {
            List<StrayPetReport> reports = strayPetReportService.getAllReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch reports: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getReportsByCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User currentUser = userService.findByUsername(username);

            List<StrayPetReport> reports = strayPetReportService.getReportsByUser(currentUser.getId());
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user reports: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        try {
            StrayPetReport report = strayPetReportService.getReportById(id);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch report: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            StrayPetReport updatedReport = strayPetReportService.updateReportStatus(id, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Report status updated successfully");
            response.put("report", updatedReport);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update report status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        try {
            strayPetReportService.deleteReport(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Report deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete report: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getReportsByStatus(@PathVariable String status) {
        try {
            List<StrayPetReport> reports = strayPetReportService.getReportsByStatus(status);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch reports by status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/urgency/{urgency}")
    public ResponseEntity<?> getReportsByUrgency(@PathVariable String urgency) {
        try {
            List<StrayPetReport> reports = strayPetReportService.getReportsByUrgency(urgency);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch reports by urgency: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 