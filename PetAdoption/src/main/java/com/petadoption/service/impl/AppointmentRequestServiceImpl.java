package com.petadoption.service.impl;

import com.petadoption.model.AppointmentRequest;
import com.petadoption.model.User;
import com.petadoption.model.Pet;
import com.petadoption.repository.AppointmentRequestRepository;
import com.petadoption.repository.UserRepository;
import com.petadoption.repository.PetRepository;
import com.petadoption.service.AppointmentRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentRequestServiceImpl implements AppointmentRequestService {

    @Autowired
    private AppointmentRequestRepository appointmentRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Override
    public List<AppointmentRequest> getAllAppointmentRequests() {
        return appointmentRequestRepository.findAll();
    }

    @Override
    public List<AppointmentRequest> getAppointmentRequestsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return appointmentRequestRepository.findByUserOrderByRequestDateDesc(user.get());
        }
        return List.of();
    }

    @Override
    public List<AppointmentRequest> getAppointmentRequestsByStatus(String status) {
        return appointmentRequestRepository.findByStatusOrderByRequestDateDesc(status);
    }

    @Override
    public AppointmentRequest createAppointmentRequest(AppointmentRequest request) {
        // Set the request date
        request.setRequestDate(LocalDateTime.now());
        request.setStatus("pending");
        return appointmentRequestRepository.save(request);
    }

    @Override
    public AppointmentRequest updateAppointmentRequest(Long id, AppointmentRequest request) {
        Optional<AppointmentRequest> existingRequest = appointmentRequestRepository.findById(id);
        if (existingRequest.isPresent()) {
            AppointmentRequest existing = existingRequest.get();
            existing.setAppointmentType(request.getAppointmentType());
            existing.setPreferredDate(request.getPreferredDate());
            existing.setPreferredTime(request.getPreferredTime());
            existing.setReason(request.getReason());
            existing.setNotes(request.getNotes());
            existing.setUrgency(request.getUrgency());
            return appointmentRequestRepository.save(existing);
        }
        return null;
    }

    @Override
    public AppointmentRequest respondToAppointmentRequest(Long id, String status, String vetResponse, String suggestedDate, String suggestedTime, String vetNotes) {
        Optional<AppointmentRequest> existingRequest = appointmentRequestRepository.findById(id);
        if (existingRequest.isPresent()) {
            AppointmentRequest request = existingRequest.get();
            request.setStatus(status);
            request.setVetResponse(vetResponse);
            request.setSuggestedDate(suggestedDate);
            request.setSuggestedTime(suggestedTime);
            request.setVetNotes(vetNotes);
            request.setResponseDate(LocalDateTime.now());
            return appointmentRequestRepository.save(request);
        }
        return null;
    }

    @Override
    public void deleteAppointmentRequest(Long id) {
        appointmentRequestRepository.deleteById(id);
    }
} 