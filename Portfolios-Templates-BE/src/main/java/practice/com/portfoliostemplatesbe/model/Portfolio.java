package practice.com.portfoliostemplatesbe.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "portfolios")
public class Portfolio {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private String themeKey;
    private List<PortfolioBlock> blocks;

    private String selectedTemplate;
    private Map<String, Object> templateData;
    private List<String> templateOrder;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** Prepare persisted document: migrate legacy fields, normalize ids, optionally drop superseded BSON. */
    public void normalizeForPersistence(boolean stripLegacyRows) {
        migrateLegacyBlocksIfNeeded();
        if (blocks == null) {
            blocks = new ArrayList<>();
        }
        ensureBlockIds();
        if (stripLegacyRows && hasModernBlocks()) {
            selectedTemplate = null;
            templateData = null;
            templateOrder = null;
        }
    }

    private void migrateLegacyBlocksIfNeeded() {
        if (blocks != null && !blocks.isEmpty()) {
            return;
        }
        List<PortfolioBlock> migrated = tryMigrateFromOrderedTemplateData();
        if (!migrated.isEmpty()) {
            blocks = migrated;
            return;
        }
        migrateSingleLegacyTemplateSelection();
    }

    private List<PortfolioBlock> tryMigrateFromOrderedTemplateData() {
        if (templateOrder == null || templateOrder.isEmpty() || templateData == null || templateData.isEmpty()) {
            return List.of();
        }
        List<PortfolioBlock> migrated = new ArrayList<>();
        for (String slotKey : templateOrder) {
            Object raw = templateData.get(slotKey);
            if (!(raw instanceof Map<?, ?> rm)) {
                continue;
            }
            Map<String, Object> m = mapFromRaw(rm);
            String tid = extractTemplateId(m);
            if (tid == null) {
                tid = selectedTemplate;
            }
            if (tid != null && !tid.isBlank()) {
                migrated.add(PortfolioBlock.builder()
                        .id(UUID.randomUUID().toString())
                        .templateId(tid.strip())
                        .data(copyDataWithoutTemplateFields(m))
                        .build());
            }
        }
        return migrated;
    }

    private void migrateSingleLegacyTemplateSelection() {
        if ((selectedTemplate == null || selectedTemplate.isBlank())) {
            if (blocks == null) {
                blocks = new ArrayList<>();
            }
            return;
        }
        Map<String, Object> data = templateData == null
                ? new LinkedHashMap<>()
                : new LinkedHashMap<>(templateData);

        PortfolioBlock block = PortfolioBlock.builder()
                .id(UUID.randomUUID().toString())
                .templateId(selectedTemplate.strip())
                .data(data)
                .build();
        blocks = new ArrayList<>(List.of(block));
    }

    private static Map<String, Object> mapFromRaw(Map<?, ?> rm) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (Map.Entry<?, ?> e : rm.entrySet()) {
            String k = Objects.toString(e.getKey(), null);
            if (k != null) {
                m.put(k, e.getValue());
            }
        }
        return m;
    }

    private static String extractTemplateId(Map<String, Object> m) {
        Object id = m.get("templateId");
        if (id == null) {
            id = m.get("_templateId");
        }
        return id != null ? id.toString().strip() : null;
    }

    private static Map<String, Object> copyDataWithoutTemplateFields(Map<String, Object> m) {
        Map<String, Object> copy = new LinkedHashMap<>(m);
        copy.remove("templateId");
        copy.remove("_templateId");
        return copy;
    }

    private void ensureBlockIds() {
        for (PortfolioBlock block : blocks) {
            if (block.getId() == null || block.getId().isBlank()) {
                block.setId(UUID.randomUUID().toString());
            }
            if (block.getData() == null) {
                block.setData(new LinkedHashMap<>());
            }
        }
    }

    private boolean hasModernBlocks() {
        return blocks != null && !blocks.isEmpty();
    }
}
