package com.petadoption.repository;

import com.petadoption.model.StrayPetReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StrayPetReportRepository extends JpaRepository<StrayPetReport, Long> {
    
    List<StrayPetReport> findByReporterIdOrderByTimestampDesc(Long reporterId);
    
    List<StrayPetReport> findByStatusOrderByTimestampDesc(String status);
    
    List<StrayPetReport> findByUrgencyOrderByTimestampDesc(String urgency);
    
    List<StrayPetReport> findByStatusAndUrgencyOrderByTimestampDesc(String status, String urgency);
    
    List<StrayPetReport> findAllByOrderByTimestampDesc();
} 