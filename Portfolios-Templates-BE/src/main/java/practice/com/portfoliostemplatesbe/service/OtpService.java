package practice.com.portfoliostemplatesbe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisOtpService redisOtpService;

    @Value("${otp.expiration}")
    private long otpExpiration;

    private static final String OTP_CHARS = "0123456789";
    private static final int OTP_LENGTH = 6;

    public String generateOtp(String email) {
        redisOtpService.deleteOtp(email);

        String otpCode = generateRandomOtp();

        redisOtpService.storeOtp(email, otpCode, Duration.ofSeconds(otpExpiration));

        return otpCode;
    }

    public boolean verifyOtp(String email, String otpCode) {
        if (!redisOtpService.verifyOtp(email, otpCode)) {
            return false;
        }

        redisOtpService.deleteOtp(email);

        return true;
    }

    private String generateRandomOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder(OTP_LENGTH);

        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(OTP_CHARS.charAt(random.nextInt(OTP_CHARS.length())));
        }

        return otp.toString();
    }
}
