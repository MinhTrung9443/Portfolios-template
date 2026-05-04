package practice.com.portfoliostemplatesbe.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:}")
    private String mailFrom;

    @Value("${app.mail.log-otp:false}")
    private boolean logOtpForDebugging;

    public void sendOtpEmail(String email, String otp) {
        try {
            if (!StringUtils.hasText(mailFrom)) {
                throw new IllegalStateException("app.mail.from is not configured");
            }

            if (logOtpForDebugging) {
                logger.warn("[app.mail.log-otp=true] OTP for {} = {}", email, otp);
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your OTP for Portfolio Templates Verification");
            message.setText(otpEmailBody(otp));
            message.setFrom(mailFrom);

            mailSender.send(message);
            logger.info("OTP email sent via SMTP to={} from={}", email, mailFrom);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to: {}", email, e);
            String detail = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            throw new RuntimeException("Failed to send OTP email: " + detail, e);
        }
    }

    public void sendWelcomeEmail(String email, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Welcome to Portfolio Templates!");
            message.setText(
                    "Hello "
                            + name
                            + ",\n\nWelcome to Portfolio Templates! Your account has been verified successfully.\n\nStart building your portfolio today!");
            if (StringUtils.hasText(mailFrom)) {
                message.setFrom(mailFrom);
            }

            mailSender.send(message);
            logger.info("Welcome email sent to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", email, e);
        }
    }

    private static String otpEmailBody(String otp) {
        return "Your OTP code is: "
                + otp
                + "\n\nThis OTP will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.";
    }
}
