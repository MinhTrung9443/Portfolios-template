package practice.com.portfoliostemplatesbe.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "templates")
public class Template {
    @Id
    private String id;
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
