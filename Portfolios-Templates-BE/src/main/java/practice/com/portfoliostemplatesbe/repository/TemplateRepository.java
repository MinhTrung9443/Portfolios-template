package practice.com.portfoliostemplatesbe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import practice.com.portfoliostemplatesbe.model.Template;

import java.util.List;

public interface TemplateRepository extends MongoRepository<Template, String> {
    List<Template> findByCategory(String category);
    List<Template> findByComponentType(String componentType);
}
