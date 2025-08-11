package com.petadoption.service;

import com.petadoption.model.AppointmentRequest;

import java.util.List;

public interface AppointmentRequestService {
    List<AppointmentRequest> getAllAppointmentRequests();
    List<AppointmentRequest> getAppointmentRequestsByUser(Long userId);
    List<AppointmentRequest> getAppointmentRequestsByStatus(String status);
    AppointmentRequest createAppointmentRequest(AppointmentRequest request);
    AppointmentRequest updateAppointmentRequest(Long id, AppointmentRequest request);
    AppointmentRequest respondToAppointmentRequest(Long id, String status, String vetResponse, String suggestedDate, String suggestedTime, String vetNotes);
    void deleteAppointmentRequest(Long id);
} 