package practice.com.portfoliostemplatesbe.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import practice.com.portfoliostemplatesbe.dto.*;
import practice.com.portfoliostemplatesbe.security.JwtTokenProvider;
import practice.com.portfoliostemplatesbe.service.AuthCookieService;
import practice.com.portfoliostemplatesbe.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthCookieService authCookieService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<JwtResponse>> verifyOtp(
            @RequestBody VerifyOtpRequest request,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok(authService.verifyOtp(request, response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok(authService.login(request, response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        String cookieToken = authCookieService.readRefreshTokenFromCookie(httpRequest);
        String bodyToken = request != null ? request.getRefreshToken() : null;
        String effectiveRefreshToken = (cookieToken != null && !cookieToken.isBlank()) ? cookieToken : bodyToken;
        return ResponseEntity.ok(authService.refreshToken(effectiveRefreshToken, response));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return ResponseEntity.ok(authService.resendOtp(email));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletResponse response
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            authCookieService.clearRefreshTokenCookie(response);
            return ResponseEntity.ok(ApiResponse.success("Logout successful"));
        }
        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateTokenType(token, "access")) {
            authCookieService.clearRefreshTokenCookie(response);
            return ResponseEntity.ok(ApiResponse.success("Logout successful"));
        }
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(authService.logout(userId, token, response));
    }
}
