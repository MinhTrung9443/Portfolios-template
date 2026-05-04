package practice.com.portfoliostemplatesbe.config;

import io.lettuce.core.RedisURI;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.util.StringUtils;

@Configuration
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory(RedisProperties redisProperties) {
        if (StringUtils.hasText(redisProperties.getUrl())) {
            RedisURI uri = RedisURI.create(redisProperties.getUrl().trim());
            RedisStandaloneConfiguration standalone =
                    new RedisStandaloneConfiguration(uri.getHost(), uri.getPort());
            if (StringUtils.hasText(uri.getUsername())) {
                standalone.setUsername(uri.getUsername());
            }
            char[] pwd = uri.getPassword();
            if (pwd != null && pwd.length > 0) {
                standalone.setPassword(RedisPassword.of(new String(pwd)));
            }

            LettuceClientConfiguration.LettuceClientConfigurationBuilder uriClient =
                    LettuceClientConfiguration.builder();
            if (uri.isSsl()) {
                uriClient.useSsl();
            }
            return new LettuceConnectionFactory(standalone, uriClient.build());
        }

        RedisStandaloneConfiguration standalone =
                new RedisStandaloneConfiguration(redisProperties.getHost(), redisProperties.getPort());
        if (StringUtils.hasText(redisProperties.getUsername())) {
            standalone.setUsername(redisProperties.getUsername());
        }
        if (StringUtils.hasText(redisProperties.getPassword())) {
            standalone.setPassword(RedisPassword.of(redisProperties.getPassword()));
        }

        LettuceClientConfiguration.LettuceClientConfigurationBuilder clientBuilder =
                LettuceClientConfiguration.builder();
        if (redisProperties.getSsl().isEnabled()) {
            clientBuilder.useSsl();
        }

        return new LettuceConnectionFactory(standalone, clientBuilder.build());
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }
}
