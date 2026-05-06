package practice.com.portfoliostemplatesbe.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import practice.com.portfoliostemplatesbe.dto.*;
import practice.com.portfoliostemplatesbe.security.CustomUserDetailsService;
import practice.com.portfoliostemplatesbe.service.UserService;
import practice.com.portfoliostemplatesbe.service.S3Service;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CustomUserDetailsService userDetailsService;
    private final S3Service s3Service;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<?>> getProfile(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<?>> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        String userId = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<ApiResponse<?>> uploadAvatar(
            @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = s3Service.uploadFile(file);
            return ResponseEntity.ok(ApiResponse.success("Avatar uploaded successfully", Map.of("url", avatarUrl)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to upload avatar: " + e.getMessage()));
        }
    }
}
