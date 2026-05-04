package practice.com.portfoliostemplatesbe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisOtpService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String OTP_KEY_PREFIX = "otp:";

    public void storeOtp(String email, String otp, Duration ttl) {
        String otpKey = otpKey(email);
        redisTemplate.opsForValue().set(otpKey, otp, ttl);
        redisTemplate.expire(otpKey, ttl);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = (String) redisTemplate.opsForValue().get(otpKey(email));
        return storedOtp != null && storedOtp.equals(otp) && !isOtpExpired(email);
    }

    public boolean isOtpExpired(String email) {
        String otpKey = otpKey(email);
        return redisTemplate.hasKey(otpKey) && redisTemplate.getExpire(otpKey) < 0;
    }

    public void deleteOtp(String email) {
        String otpKey = otpKey(email);
        redisTemplate.delete(otpKey);
    }

    private static String otpKey(String email) {
        return OTP_KEY_PREFIX + email;
    }
}