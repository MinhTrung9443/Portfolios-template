package practice.com.portfoliostemplatesbe.service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import practice.com.portfoliostemplatesbe.dto.*;
import practice.com.portfoliostemplatesbe.model.User;
import practice.com.portfoliostemplatesbe.repository.UserRepository;
import practice.com.portfoliostemplatesbe.security.JwtTokenProvider;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTokenService redisTokenService;
    private final AuthCookieService authCookieService;
    private final OtpService otpService;
    private final EmailService emailService;

    @Transactional
    public ApiResponse<String> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .isVerified(false)
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        String otp = otpService.generateOtp(user.getEmail());
        emailService.sendOtpEmail(user.getEmail(), otp);

        return ApiResponse.success("Registration successful. Please verify OTP within 5 minutes.", user.getId());
    }
    @Transactional
    public ApiResponse<JwtResponse> verifyOtp(VerifyOtpRequest request, HttpServletResponse response) {
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            return  ApiResponse.error("Invalid OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("User not found");
        }

        user.setVerified(true);
        userRepository.save(user);

        JwtResponse jwtResponse = issueSessionTokens(user.getId(), response);
        return ApiResponse.success("Verification successful", jwtResponse);
    }
    @Transactional
    public ApiResponse<JwtResponse> login(LoginRequest request, HttpServletResponse response) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElse(null);

            if (user == null) {
                return ApiResponse.error("User not found");
            }

            if (!user.isVerified()) {
                return ApiResponse.error("Please verify your account first");
            }

            if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){

                return ApiResponse.error("Password wrong");
            }

            JwtResponse jwtResponse = issueSessionTokens(user.getId(), response);
            return ApiResponse.success("Login successful", jwtResponse);
        } catch (Exception e) {
            return ApiResponse.error("Invalid email or password");
        }
    }
    @Transactional
    public ApiResponse<JwtResponse> refreshToken(String refreshToken, HttpServletResponse response) {
        if (!StringUtils.hasText(refreshToken) || !jwtTokenProvider.validateTokenType(refreshToken, "refresh")) {
            return ApiResponse.error("Invalid refresh token");
        }

        String refreshJti = jwtTokenProvider.getTokenId(refreshToken);
        String userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !redisTokenService.isRefreshTokenActive(refreshJti, refreshToken)) {
            return ApiResponse.error("Invalid refresh token");
        }

        redisTokenService.revokeRefreshTokenByJti(userId, refreshJti);
        JwtResponse jwtResponse = issueSessionTokens(userId, response);
        return ApiResponse.success("Token refreshed", jwtResponse);
    }
    @Transactional
    public ApiResponse<String> resendOtp(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ApiResponse.error("Email not registered");
        }

        if (user.isVerified()) {
            return ApiResponse.error("Email already verified");
        }

        String otp = otpService.generateOtp(user.getEmail());
        emailService.sendOtpEmail(email, otp);

        return ApiResponse.success("OTP sent successfully");
    }
    @Transactional
    public ApiResponse<String> logout(String userId, String accessToken, HttpServletResponse response) {
        redisTokenService.revokeAllRefreshTokensForUser(userId);
        if (StringUtils.hasText(accessToken) && jwtTokenProvider.validateTokenType(accessToken, "access")) {
            String accessJti = jwtTokenProvider.getTokenId(accessToken);
            long ttl = jwtTokenProvider.getRemainingValidityMillis(accessToken);
            redisTokenService.blacklistAccessToken(accessJti, ttl);
        }
        authCookieService.clearRefreshTokenCookie(response);
        return ApiResponse.success("Logout successful");
    }

    private JwtResponse issueSessionTokens(String userId, HttpServletResponse response) {
        String accessToken = jwtTokenProvider.generateAccessToken(userId);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userId);
        String refreshJti = jwtTokenProvider.getTokenId(refreshToken);
        redisTokenService.storeRefreshToken(
                userId,
                refreshJti,
                refreshToken,
                Duration.ofMillis(jwtTokenProvider.getRefreshExpiration())
        );
        authCookieService.writeRefreshTokenCookie(response, refreshToken);
        return JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(null)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .build();
    }
}
