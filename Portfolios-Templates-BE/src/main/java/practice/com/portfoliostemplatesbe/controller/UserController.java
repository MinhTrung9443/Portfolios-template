package practice.com.portfoliostemplatesbe.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import practice.com.portfoliostemplatesbe.dto.*;
import practice.com.portfoliostemplatesbe.security.CustomUserDetailsService;
import practice.com.portfoliostemplatesbe.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CustomUserDetailsService userDetailsService;

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
}
