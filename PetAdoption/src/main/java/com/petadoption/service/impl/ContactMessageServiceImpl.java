package com.petadoption.service.impl;

import com.petadoption.model.ContactMessage;
import com.petadoption.repository.ContactMessageRepository;
import com.petadoption.service.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactMessageServiceImpl implements ContactMessageService {
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;
    
    @Override
    public ContactMessage createMessage(ContactMessage message) {
        return contactMessageRepository.save(message);
    }
    
    @Override
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }
    
    @Override
    public List<ContactMessage> getUnreadMessages() {
        return contactMessageRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }
    
    @Override
    public ContactMessage getMessageById(Long id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact message not found with id: " + id));
    }
    
    @Override
    public ContactMessage markAsRead(Long id) {
        ContactMessage message = getMessageById(id);
        message.setIsRead(true);
        return contactMessageRepository.save(message);
    }
    
    @Override
    public ContactMessage respondToMessage(Long id, String response) {
        ContactMessage message = getMessageById(id);
        message.setAdminResponse(response);
        message.setRespondedAt(LocalDateTime.now());
        message.setIsRead(true);
        return contactMessageRepository.save(message);
    }
    
    @Override
    public long getUnreadCount() {
        return contactMessageRepository.countByIsReadFalse();
    }
    
    @Override
    public List<ContactMessage> getMessagesByEmail(String email) {
        return contactMessageRepository.findByEmailOrderByCreatedAtDesc(email);
    }
} 