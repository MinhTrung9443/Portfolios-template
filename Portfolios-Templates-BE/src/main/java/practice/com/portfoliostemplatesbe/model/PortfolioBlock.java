package practice.com.portfoliostemplatesbe.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioBlock {
    private String id;
    private String templateId;
    private Map<String, Object> data;
}
