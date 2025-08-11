package com.petadoption.service;

import com.petadoption.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User createUser(User user);
    User updateUser(Long id, User user);
    void deleteUser(Long id);

    // ✅ Add these missing method signatures
    List<User> getUsersByRole(String role);
    User approveUser(Long id);
    User findByUsername(String username);
    User findByEmail(String email);
    User updateUserStatus(Long id, String status);
}
