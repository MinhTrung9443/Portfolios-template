package practice.com.portfoliostemplatesbe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenRequest {
    /** Optional fallback when cookie is unavailable (Postman/testing). */
    private String refreshToken;
}
