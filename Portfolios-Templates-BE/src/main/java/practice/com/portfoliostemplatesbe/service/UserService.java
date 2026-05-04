package practice.com.portfoliostemplatesbe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import practice.com.portfoliostemplatesbe.dto.ApiResponse;
import practice.com.portfoliostemplatesbe.dto.UpdateProfileRequest;
import practice.com.portfoliostemplatesbe.model.User;
import practice.com.portfoliostemplatesbe.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public ApiResponse<User> getProfile(String userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ApiResponse.error("User not found");
        }
        
        User userData = user.get();
        userData.setPassword(null);
        userData.setRefreshToken(null);
        
        return ApiResponse.success(userData);
    }

    public ApiResponse<User> updateProfile(String userId, UpdateProfileRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ApiResponse.error("User not found");
        }
        
        User user = userOpt.get();
        
        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        
        user.setPassword(null);
        user.setRefreshToken(null);
        
        return ApiResponse.success("Profile updated", user);
    }

    public ApiResponse<User> getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ApiResponse.error("User not found");
        }
        
        User userData = user.get();
        userData.setPassword(null);
        userData.setRefreshToken(null);
        
        return ApiResponse.success(userData);
    }
}
