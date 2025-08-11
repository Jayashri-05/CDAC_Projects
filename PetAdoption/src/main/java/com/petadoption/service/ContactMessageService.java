package com.petadoption.service;

import com.petadoption.model.ContactMessage;
import java.util.List;

public interface ContactMessageService {
    
    ContactMessage createMessage(ContactMessage message);
    
    List<ContactMessage> getAllMessages();
    
    List<ContactMessage> getUnreadMessages();
    
    ContactMessage getMessageById(Long id);
    
    ContactMessage markAsRead(Long id);
    
    ContactMessage respondToMessage(Long id, String response);
    
    long getUnreadCount();
    
    List<ContactMessage> getMessagesByEmail(String email);
} 