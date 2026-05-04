package practice.com.portfoliostemplatesbe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import practice.com.portfoliostemplatesbe.dto.ApiResponse;
import practice.com.portfoliostemplatesbe.model.Template;
import practice.com.portfoliostemplatesbe.repository.TemplateRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;

    public ApiResponse<List<Template>> getAllTemplates() {
        List<Template> templates = templateRepository.findAll();
        return ApiResponse.success(templates);
    }

    public ApiResponse<List<Template>> getTemplatesByCategory(String category) {
        List<Template> templates = templateRepository.findByCategory(category);
        return ApiResponse.success(templates);
    }

    public ApiResponse<List<Template>> getTemplatesByComponentType(String componentType) {
        List<Template> templates = templateRepository.findByComponentType(componentType);
        return ApiResponse.success(templates);
    }

    public ApiResponse<Template> getTemplateById(String id) {
        return templateRepository.findById(id)
                .map(ApiResponse::success)
                .orElse(ApiResponse.error("Template not found"));
    }

    public ApiResponse<Template> createTemplate(Template template) {
        Template saved = templateRepository.save(template);
        return ApiResponse.success(saved);
    }

    public ApiResponse<Template> updateTemplate(String id, Template templateUpdate) {
        return templateRepository.findById(id)
                .map(existing -> {
                    if (templateUpdate.getName() != null) {
                        existing.setName(templateUpdate.getName());
                    }
                    if (templateUpdate.getDescription() != null) {
                        existing.setDescription(templateUpdate.getDescription());
                    }
                    if (templateUpdate.getCategory() != null) {
                        existing.setCategory(templateUpdate.getCategory());
                    }
                    if (templateUpdate.getComponentType() != null) {
                        existing.setComponentType(templateUpdate.getComponentType());
                    }
                    if (templateUpdate.getDefaultConfig() != null) {
                        existing.setDefaultConfig(templateUpdate.getDefaultConfig());
                    }
                    if (templateUpdate.getRequiredFields() != null) {
                        existing.setRequiredFields(templateUpdate.getRequiredFields());
                    }
                    if (templateUpdate.getPosition() != null) {
                        existing.setPosition(templateUpdate.getPosition());
                    }
                    if (templateUpdate.getStyles() != null) {
                        existing.setStyles(templateUpdate.getStyles());
                    }
                    if (templateUpdate.getIsDefault() != null) {
                        existing.setIsDefault(templateUpdate.getIsDefault());
                    }
                    if (templateUpdate.getThumbnailUrl() != null) {
                        existing.setThumbnailUrl(templateUpdate.getThumbnailUrl());
                    }
                    Template saved = templateRepository.save(existing);
                    return ApiResponse.success(saved);
                })
                .orElse(ApiResponse.error("Template not found"));
    }

    public ApiResponse<Void> deleteTemplate(String id) {
        return templateRepository.findById(id)
                .map(template -> {
                    templateRepository.delete(template);
                    return ApiResponse.<Void>success(null);
                })
                .orElse(ApiResponse.error("Template not found"));
    }

    public ApiResponse<List<Template>> getTemplatesByIds(List<String> ids) {
        List<Template> templates = new ArrayList<>();
        for (String id : ids) {
            Optional<Template> template = templateRepository.findById(id);
            template.ifPresent(templates::add);
        }
        return ApiResponse.success(templates);
    }

    public ApiResponse<List<Template>> reorderTemplates(List<String> orderedIds) {
        List<Template> templates = new ArrayList<>();
        for (int i = 0; i < orderedIds.size(); i++) {
            String id = orderedIds.get(i);
            Optional<Template> optTemplate = templateRepository.findById(id);
            if (optTemplate.isPresent()) {
                Template template = optTemplate.get();
                template.setPosition(i);
                templates.add(templateRepository.save(template));
            }
        }
        return ApiResponse.success(templates);
    }
}
