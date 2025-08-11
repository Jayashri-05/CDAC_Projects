package com.petadoption.repository;

import com.petadoption.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    List<Announcement> findByActiveOrderByCreatedAtDesc(boolean active);
    
    List<Announcement> findByTypeAndActiveOrderByCreatedAtDesc(String type, boolean active);
    
    List<Announcement> findByCreatedByIdOrderByCreatedAtDesc(Long createdById);
} 