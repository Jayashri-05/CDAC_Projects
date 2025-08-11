package com.petadoption.service;

import com.petadoption.model.StrayPetReport;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StrayPetReportService {
    
    StrayPetReport createReport(StrayPetReport report, MultipartFile photo);
    
    List<StrayPetReport> getAllReports();
    
    List<StrayPetReport> getReportsByUser(Long userId);
    
    List<StrayPetReport> getReportsByStatus(String status);
    
    List<StrayPetReport> getReportsByUrgency(String urgency);
    
    StrayPetReport getReportById(Long id);
    
    StrayPetReport updateReportStatus(Long id, String status);
    
    void deleteReport(Long id);
} 