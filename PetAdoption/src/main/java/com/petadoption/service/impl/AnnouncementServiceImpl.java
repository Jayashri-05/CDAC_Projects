package com.petadoption.service.impl;

import com.petadoption.model.Announcement;
import com.petadoption.repository.AnnouncementRepository;
import com.petadoption.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    @Override
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }
    
    @Override
    public List<Announcement> getActiveAnnouncements() {
        return announcementRepository.findByActiveOrderByCreatedAtDesc(true);
    }
    
    @Override
    public List<Announcement> getAnnouncementsByType(String type) {
        return announcementRepository.findByTypeAndActiveOrderByCreatedAtDesc(type, true);
    }
    
    @Override
    public List<Announcement> getAnnouncementsByCreator(Long creatorId) {
        return announcementRepository.findByCreatedByIdOrderByCreatedAtDesc(creatorId);
    }
    
    @Override
    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id).orElse(null);
    }
    
    @Override
    public Announcement createAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }
    
    @Override
    public Announcement updateAnnouncement(Long id, Announcement announcementDetails) {
        Announcement announcement = announcementRepository.findById(id).orElse(null);
        if (announcement != null) {
            announcement.setTitle(announcementDetails.getTitle());
            announcement.setContent(announcementDetails.getContent());
            announcement.setType(announcementDetails.getType());
            announcement.setActive(announcementDetails.isActive());
            return announcementRepository.save(announcement);
        }
        return null;
    }
    
    @Override
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
    
    @Override
    public void toggleAnnouncementStatus(Long id) {
        Announcement announcement = announcementRepository.findById(id).orElse(null);
        if (announcement != null) {
            announcement.setActive(!announcement.isActive());
            announcementRepository.save(announcement);
        }
    }
} 