package practice.com.portfoliostemplatesbe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTemplateRequest {
    private String name;
    private String description;
    private String category;
    private String componentType;
    private Map<String, Object> defaultConfig;
    private List<String> requiredFields;
    private Integer position;
    private Map<String, Object> styles;
    private Boolean isDefault;
    private String thumbnailUrl;
}
