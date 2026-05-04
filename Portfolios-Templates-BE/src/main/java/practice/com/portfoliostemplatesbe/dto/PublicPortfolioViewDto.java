package practice.com.portfoliostemplatesbe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import practice.com.portfoliostemplatesbe.model.PortfolioBlock;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicPortfolioViewDto {

    private OwnerPublicSnippet owner;
    private String portfolioId;
    private String title;
    private String description;
    private String themeKey;
    private List<PortfolioBlock> blocks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerPublicSnippet {
        private String fullName;
        private String bio;
        private String avatarUrl;
    }
}
