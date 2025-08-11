package com.petadoption.service;

import com.petadoption.model.Announcement;
import java.util.List;

public interface AnnouncementService {
    
    List<Announcement> getAllAnnouncements();
    
    List<Announcement> getActiveAnnouncements();
    
    List<Announcement> getAnnouncementsByType(String type);
    
    List<Announcement> getAnnouncementsByCreator(Long creatorId);
    
    Announcement getAnnouncementById(Long id);
    
    Announcement createAnnouncement(Announcement announcement);
    
    Announcement updateAnnouncement(Long id, Announcement announcement);
    
    void deleteAnnouncement(Long id);
    
    void toggleAnnouncementStatus(Long id);
} 