package com.petadoption.service.impl;

import com.petadoption.model.StrayPetReport;
import com.petadoption.model.User;
import com.petadoption.repository.StrayPetReportRepository;
import com.petadoption.repository.UserRepository;
import com.petadoption.service.StrayPetReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class StrayPetReportServiceImpl implements StrayPetReportService {

    @Autowired
    private StrayPetReportRepository strayPetReportRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/stray-pets/";

    @Override
    public StrayPetReport createReport(StrayPetReport report, MultipartFile photo) {
        try {
            // Save photo if provided
            if (photo != null && !photo.isEmpty()) {
                String photoUrl = savePhoto(photo);
                report.setPhotoUrl(photoUrl);
            }

            return strayPetReportRepository.save(report);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create stray pet report", e);
        }
    }

    @Override
    public List<StrayPetReport> getAllReports() {
        return strayPetReportRepository.findAllByOrderByTimestampDesc();
    }

    @Override
    public List<StrayPetReport> getReportsByUser(Long userId) {
        return strayPetReportRepository.findByReporterIdOrderByTimestampDesc(userId);
    }

    @Override
    public List<StrayPetReport> getReportsByStatus(String status) {
        return strayPetReportRepository.findByStatusOrderByTimestampDesc(status);
    }

    @Override
    public List<StrayPetReport> getReportsByUrgency(String urgency) {
        return strayPetReportRepository.findByUrgencyOrderByTimestampDesc(urgency);
    }

    @Override
    public StrayPetReport getReportById(Long id) {
        return strayPetReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stray pet report not found"));
    }

    @Override
    public StrayPetReport updateReportStatus(Long id, String status) {
        StrayPetReport report = getReportById(id);
        report.setStatus(status);
        return strayPetReportRepository.save(report);
    }

    @Override
    public void deleteReport(Long id) {
        StrayPetReport report = getReportById(id);
        
        // Delete photo file if exists
        if (report.getPhotoUrl() != null) {
            try {
                // The photoUrl now contains just the filename
                Path photoPath = Paths.get(UPLOAD_DIR + report.getPhotoUrl());
                Files.deleteIfExists(photoPath);
            } catch (IOException e) {
                // Log error but don't fail the deletion
                System.err.println("Failed to delete photo file: " + e.getMessage());
            }
        }
        
        strayPetReportRepository.deleteById(id);
    }

    private String savePhoto(MultipartFile photo) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = photo.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(photo.getInputStream(), filePath);
        
        // Return just the filename for the new endpoint
        return filename;
    }
} 