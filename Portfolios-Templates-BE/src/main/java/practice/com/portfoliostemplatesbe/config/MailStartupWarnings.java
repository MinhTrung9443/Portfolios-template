package practice.com.portfoliostemplatesbe.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Cảnh báo khi thiếu cấu hình SMTP (đặc biệt trên server deploy).
 */
@Component
public class MailStartupWarnings implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(MailStartupWarnings.class);

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (!StringUtils.hasText(mailUsername) || !StringUtils.hasText(mailPassword)) {
            log.warn(
                    "Mail OTP is not configured: MAIL_USERNAME or MAIL_PASSWORD is empty. "
                            + "Set both in environment (App Password Gmail: 16 ký tự liền, không khoảng trắng).");
        }
    }
}
