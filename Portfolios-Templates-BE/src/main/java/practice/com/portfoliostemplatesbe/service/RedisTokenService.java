package practice.com.portfoliostemplatesbe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisTokenService {

    private static final String REFRESH_TOKEN_KEY_PREFIX = "auth:refresh:token:";
    private static final String USER_REFRESH_INDEX_PREFIX = "auth:refresh:user:";
    private static final String ACCESS_BLACKLIST_PREFIX = "auth:blacklist:access:";

    private final RedisTemplate<String, Object> redisTemplate;

    public void storeRefreshToken(String userId, String jti, String refreshToken, Duration ttl) {
        String tokenKey = refreshTokenKey(jti);
        String userIndexKey = userRefreshIndexKey(userId);
        redisTemplate.opsForValue().set(tokenKey, refreshToken, ttl);
        redisTemplate.opsForSet().add(userIndexKey, jti);
        redisTemplate.expire(userIndexKey, ttl);
    }

    public boolean isRefreshTokenActive(String jti, String refreshToken) {
        Object stored = redisTemplate.opsForValue().get(refreshTokenKey(jti));
        return stored != null && refreshToken.equals(stored.toString());
    }

    public void revokeRefreshTokenByJti(String userId, String jti) {
        redisTemplate.delete(refreshTokenKey(jti));
        redisTemplate.opsForSet().remove(userRefreshIndexKey(userId), jti);
    }

    public void revokeAllRefreshTokensForUser(String userId) {
        String userIndexKey = userRefreshIndexKey(userId);
        Set<Object> jtis = redisTemplate.opsForSet().members(userIndexKey);
        if (jtis != null) {
            for (Object jtiObj : jtis) {
                if (jtiObj != null) {
                    redisTemplate.delete(refreshTokenKey(jtiObj.toString()));
                }
            }
        }
        redisTemplate.delete(userIndexKey);
    }

    public void blacklistAccessToken(String accessJti, long ttlMillis) {
        if (ttlMillis <= 0) {
            return;
        }
        redisTemplate.opsForValue().set(
                accessBlacklistKey(accessJti),
                "1",
                ttlMillis,
                TimeUnit.MILLISECONDS
        );
    }

    public boolean isAccessTokenBlacklisted(String accessJti) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(accessBlacklistKey(accessJti)));
    }

    private static String refreshTokenKey(String jti) {
        return REFRESH_TOKEN_KEY_PREFIX + jti;
    }

    private static String userRefreshIndexKey(String userId) {
        return USER_REFRESH_INDEX_PREFIX + userId;
    }

    private static String accessBlacklistKey(String jti) {
        return ACCESS_BLACKLIST_PREFIX + jti;
    }
}
