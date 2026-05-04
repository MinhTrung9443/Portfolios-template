package practice.com.portfoliostemplatesbe.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import practice.com.portfoliostemplatesbe.model.Template;
import practice.com.portfoliostemplatesbe.repository.TemplateRepository;

import java.util.*;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final TemplateRepository templateRepository;

    @Bean
    public CommandLineRunner initTemplates() {
        return args -> {
            if (templateRepository.count() == 0) {
                log.info("Initializing default templates...");
                List<Template> templates = createDefaultTemplates();
                templateRepository.saveAll(templates);
                log.info("Created {} default templates", templates.size());
            }
        };
    }

    private List<Template> createDefaultTemplates() {
        List<Template> templates = new ArrayList<>();

        // ========== PERSONAL INFO TEMPLATES ==========
        
        // Personal Info - Design 1: Simple Card
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Personal Info - Simple Card")
                .description("A clean, minimal card design showing basic personal information")
                .category("personal_info")
                .componentType("personal_info")
                .position(0)
                .isDefault(true)
                .defaultConfig(createPersonalInfoConfig("simple_card"))
                .requiredFields(Arrays.asList("fullName", "email"))
                .build());

        // Personal Info - Design 2: Profile with Photo
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Personal Info - Profile Photo")
                .description("Personal info with profile photo and social links")
                .category("personal_info")
                .componentType("personal_info")
                .position(1)
                .isDefault(true)
                .defaultConfig(createPersonalInfoConfig("profile_photo"))
                .requiredFields(Arrays.asList("fullName", "email", "avatar"))
                .build());

        // Personal Info - Design 3: Hero Banner
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Personal Info - Hero Banner")
                .description("Large hero banner style with name and tagline")
                .category("personal_info")
                .componentType("personal_info")
                .position(2)
                .isDefault(true)
                .defaultConfig(createPersonalInfoConfig("hero_banner"))
                .requiredFields(Arrays.asList("fullName", "tagline"))
                .build());

        // Personal Info - Design 4: Minimal List
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Personal Info - Minimal List")
                .description("Simple vertical list layout for contact info")
                .category("personal_info")
                .componentType("personal_info")
                .position(3)
                .isDefault(true)
                .defaultConfig(createPersonalInfoConfig("minimal_list"))
                .requiredFields(Arrays.asList("fullName", "email", "phone", "address"))
                .build());

        // ========== SKILLS TEMPLATES ==========

        // Skills - Design 1: Tag Cloud
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Skills - Tag Cloud")
                .description("Skills displayed as colorful tags")
                .category("skills")
                .componentType("skills")
                .position(4)
                .isDefault(true)
                .defaultConfig(createSkillsConfig("tag_cloud"))
                .requiredFields(Arrays.asList("skills"))
                .build());

        // Skills - Design 2: Progress Bars
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Skills - Progress Bars")
                .description("Skills with proficiency level progress bars")
                .category("skills")
                .componentType("skills")
                .position(5)
                .isDefault(true)
                .defaultConfig(createSkillsConfig("progress_bars"))
                .requiredFields(Arrays.asList("skills"))
                .build());

        // Skills - Design 3: Cards Grid
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Skills - Cards Grid")
                .description("Skill cards in a grid layout")
                .category("skills")
                .componentType("skills")
                .position(6)
                .isDefault(true)
                .defaultConfig(createSkillsConfig("cards_grid"))
                .requiredFields(Arrays.asList("skills"))
                .build());

        // Skills - Design 4: Category List
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Skills - Category List")
                .description("Skills grouped by category")
                .category("skills")
                .componentType("skills")
                .position(7)
                .isDefault(true)
                .defaultConfig(createSkillsConfig("category_list"))
                .requiredFields(Arrays.asList("skills"))
                .build());

        // ========== EXPERIENCE TEMPLATES ==========

        // Experience - Design 1: Timeline
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Experience - Timeline")
                .description("Work experience displayed as vertical timeline")
                .category("experience")
                .componentType("experience")
                .position(8)
                .isDefault(true)
                .defaultConfig(createExperienceConfig("timeline"))
                .requiredFields(Arrays.asList("company", "position", "startDate"))
                .build());

        // Experience - Design 2: Cards
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Experience - Cards")
                .description("Experience cards with company logos")
                .category("experience")
                .componentType("experience")
                .position(9)
                .isDefault(true)
                .defaultConfig(createExperienceConfig("cards"))
                .requiredFields(Arrays.asList("company", "position", "startDate"))
                .build());

        // Experience - Design 3: Minimal List
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Experience - Minimal List")
                .description("Simple list format for experience")
                .category("experience")
                .componentType("experience")
                .position(10)
                .isDefault(true)
                .defaultConfig(createExperienceConfig("minimal_list"))
                .requiredFields(Arrays.asList("company", "position", "startDate"))
                .build());

        // Experience - Design 4: Table
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Experience - Table")
                .description("Experience in table format")
                .category("experience")
                .componentType("experience")
                .position(11)
                .isDefault(true)
                .defaultConfig(createExperienceConfig("table"))
                .requiredFields(Arrays.asList("company", "position", "startDate", "endDate"))
                .build());

        // ========== EDUCATION TEMPLATES ==========

        // Education - Design 1: Timeline
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Education - Timeline")
                .description("Education history as timeline")
                .category("education")
                .componentType("education")
                .position(12)
                .isDefault(true)
                .defaultConfig(createEducationConfig("timeline"))
                .requiredFields(Arrays.asList("institution", "degree", "year"))
                .build());

        // Education - Design 2: Cards
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Education - Cards")
                .description("Education cards with institution branding")
                .category("education")
                .componentType("education")
                .position(13)
                .isDefault(true)
                .defaultConfig(createEducationConfig("cards"))
                .requiredFields(Arrays.asList("institution", "degree", "year"))
                .build());

        // Education - Design 3: Minimal List
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Education - Minimal")
                .description("Simple minimalist education list")
                .category("education")
                .componentType("education")
                .position(14)
                .isDefault(true)
                .defaultConfig(createEducationConfig("minimal"))
                .requiredFields(Arrays.asList("institution", "degree", "year"))
                .build());

        // ========== CERTIFICATES TEMPLATES ==========

        // Certificates - Design 1: Grid
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Certificates - Grid")
                .description("Certificates displayed in grid layout")
                .category("certificates")
                .componentType("certificates")
                .position(15)
                .isDefault(true)
                .defaultConfig(createCertificatesConfig("grid"))
                .requiredFields(Arrays.asList("name", "issuer", "date"))
                .build());

        // Certificates - Design 2: Badge
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Certificates - Badge")
                .description("Certificates as badge icons")
                .category("certificates")
                .componentType("certificates")
                .position(16)
                .isDefault(true)
                .defaultConfig(createCertificatesConfig("badge"))
                .requiredFields(Arrays.asList("name", "issuer"))
                .build());

        // Certificates - Design 3: Timeline
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Certificates - Timeline")
                .description("Certificates in chronological timeline")
                .category("certificates")
                .componentType("certificates")
                .position(17)
                .isDefault(true)
                .defaultConfig(createCertificatesConfig("timeline"))
                .requiredFields(Arrays.asList("name", "issuer", "date"))
                .build());

        // ========== PROJECTS TEMPLATES ==========

        // Projects - Design 1: Card Grid
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Projects - Card Grid")
                .description("Project cards with thumbnails")
                .category("projects")
                .componentType("projects")
                .position(18)
                .isDefault(true)
                .defaultConfig(createProjectsConfig("card_grid"))
                .requiredFields(Arrays.asList("name", "description"))
                .build());

        // Projects - Design 2: List
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Projects - List")
                .description("Projects in vertical list")
                .category("projects")
                .componentType("projects")
                .position(19)
                .isDefault(true)
                .defaultConfig(createProjectsConfig("list"))
                .requiredFields(Arrays.asList("name", "description"))
                .build());

        // Projects - Design 3: Masonry
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Projects - Masonry")
                .description("Projects in masonry layout")
                .category("projects")
                .componentType("projects")
                .position(20)
                .isDefault(true)
                .defaultConfig(createProjectsConfig("masonry"))
                .requiredFields(Arrays.asList("name", "description", "image"))
                .build());

        // ========== CONTACT TEMPLATES ==========

        // Contact - Design 1: Form
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Contact - Form")
                .description("Contact form with fields")
                .category("contact")
                .componentType("contact")
                .position(21)
                .isDefault(true)
                .defaultConfig(createContactConfig("form"))
                .requiredFields(Arrays.asList("email"))
                .build());

        // Contact - Design 2: Direct Info
        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Contact - Direct Info")
                .description("Direct contact information")
                .category("contact")
                .componentType("contact")
                .position(22)
                .isDefault(true)
                .defaultConfig(createContactConfig("direct_info"))
                .requiredFields(Arrays.asList("email", "phone"))
                .build());

        // ========== CHARTS / DATA VISUALIZATION ==========

        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Chart - Bar Comparison")
                .description("Grouped or stacked bar chart for skills, traffic, revenue, etc.")
                .category("charts")
                .componentType("chart_bar")
                .position(23)
                .isDefault(true)
                .defaultConfig(createChartsConfig("bar_vertical"))
                .requiredFields(Arrays.asList("title", "labels", "values"))
                .build());

        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Chart - Line Trend")
                .description("Line chart showing growth over time")
                .category("charts")
                .componentType("chart_line")
                .position(24)
                .isDefault(true)
                .defaultConfig(createChartsConfig("line_smooth"))
                .requiredFields(Arrays.asList("title", "labels", "series"))
                .build());

        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Chart - Donut")
                .description("Donut breakdown for percentages or allocations")
                .category("charts")
                .componentType("chart_donut")
                .position(25)
                .isDefault(true)
                .defaultConfig(createChartsConfig("donut"))
                .requiredFields(Arrays.asList("title", "segments"))
                .build());

        templates.add(Template.builder()
                .id(UUID.randomUUID().toString())
                .name("Stats - Metric Row")
                .description("Key numbers grid (experience years, shipped projects, response time)")
                .category("charts")
                .componentType("stats_row")
                .position(26)
                .isDefault(true)
                .defaultConfig(createChartsConfig("metrics_row"))
                .requiredFields(Arrays.asList("metrics"))
                .build());

        return templates;
    }

    private Map<String, Object> createChartsConfig(String style) {
        Map<String, Object> config = new HashMap<>();
        config.put("style", style);
        config.put("showLegend", true);
        config.put("showValues", true);
        config.put("animate", true);
        return config;
    }

    // Configuration helpers for each template type
    private Map<String, Object> createPersonalInfoConfig(String style) {
        Map<String, Object> config = new HashMap<>();
        config.put("style", style);
        config.put("showEmail", true);
        config.put("showPhone", true);
        config.put("showAddress", true);
        config.put("showSocialLinks", true);
        config.put("showBio", true);
        config.put("showCareerGoal", true);
        return config;
    }

    private Map<String, Object> createSkillsConfig(String style) {
        Map<String, Object> config = new HashMap<>();
        config.put("style", style);
        config.put("showLevel", true);
        config.put("levelType", "percentage"); // percentage or stars
        return config;
    }

    private Map<String, Object> createExperienceConfig(String style) {
        Map<String, Object> config = new HashMap<>();
        config.put("style", style);
        config.put("showCompanyLogo", true);
        config.put("showDuration", true);
        config.put("showDescription", true);
        return config;
    }

    private Map<String, Object> createEducationConfig(String style) {
        Map<String, Object> config = new HashMap<>();
        config.put("style", style);
        config.put("showInstitutionLogo", true);
        config.put("showGPA", true);
        config.put("showDescription", true);
        return config;
    }

    private Map<String, Object> createCertificatesConfig(String style) {
        Map<String, Object> config = new HashMap<>();
        config.put("style", style);
        config.put("showIssuerLogo", true);
        config.put("showExpiryDate", false);
        config.put("showCredentialId", true);
        return config;
    }

    private Map<String, Object> createProjectsConfig(String style) {
        Map<String, Object> config = new HashMap<>();
        config.put("style", style);
        config.put("showThumbnail", true);
        config.put("showTechnologies", true);
        config.put("showLinks", true);
        return config;
    }

    private Map<String, Object> createContactConfig(String style) {
        Map<String, Object> config = new HashMap<>();
        config.put("style", style);
        config.put("showEmail", true);
        config.put("showPhone", true);
        config.put("showSocialLinks", true);
        return config;
    }
}
