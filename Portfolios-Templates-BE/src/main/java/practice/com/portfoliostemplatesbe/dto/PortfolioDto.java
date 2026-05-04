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
public class PortfolioDto {
    private String id;
    private String userId;
    private String title;
    private String description;
    private String themeKey;
    private List<PortfolioBlock> blocks;
}
