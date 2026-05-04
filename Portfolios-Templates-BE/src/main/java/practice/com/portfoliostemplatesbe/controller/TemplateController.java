package practice.com.portfoliostemplatesbe.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import practice.com.portfoliostemplatesbe.dto.ApiResponse;
import practice.com.portfoliostemplatesbe.model.Template;
import practice.com.portfoliostemplatesbe.service.TemplateService;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Template>>> getAllTemplates() {
        return ResponseEntity.ok(templateService.getAllTemplates());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Template>>> getTemplatesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(templateService.getTemplatesByCategory(category));
    }

    @GetMapping("/type/{componentType}")
    public ResponseEntity<ApiResponse<List<Template>>> getTemplatesByComponentType(@PathVariable String componentType) {
        return ResponseEntity.ok(templateService.getTemplatesByComponentType(componentType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Template>> getTemplateById(@PathVariable String id) {
        return ResponseEntity.ok(templateService.getTemplateById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Template>> createTemplate(@RequestBody Template template) {
        return ResponseEntity.ok(templateService.createTemplate(template));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Template>> updateTemplate(@PathVariable String id, @RequestBody Template template) {
        return ResponseEntity.ok(templateService.updateTemplate(id, template));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable String id) {
        return ResponseEntity.ok(templateService.deleteTemplate(id));
    }

    @PostMapping("/reorder")
    public ResponseEntity<ApiResponse<List<Template>>> reorderTemplates(@RequestBody List<String> templateIds) {
        return ResponseEntity.ok(templateService.reorderTemplates(templateIds));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<Template>>> getTemplatesByIds(@RequestBody List<String> ids) {
        return ResponseEntity.ok(templateService.getTemplatesByIds(ids));
    }
}
