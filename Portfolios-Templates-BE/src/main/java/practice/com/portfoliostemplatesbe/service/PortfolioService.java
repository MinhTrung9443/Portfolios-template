package practice.com.portfoliostemplatesbe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import practice.com.portfoliostemplatesbe.dto.ApiResponse;
import practice.com.portfoliostemplatesbe.dto.PortfolioDto;
import practice.com.portfoliostemplatesbe.dto.PublicPortfolioViewDto;
import practice.com.portfoliostemplatesbe.model.Portfolio;
import practice.com.portfoliostemplatesbe.model.User;
import practice.com.portfoliostemplatesbe.repository.PortfolioRepository;
import practice.com.portfoliostemplatesbe.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    public ApiResponse<List<PortfolioDto>> getPortfolios(String userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

        List<PortfolioDto> dtos = portfolios.stream()
                .map(this::healLegacyIfNeeded)
                .map(this::toDto)
                .toList();

        return ApiResponse.success(dtos);
    }

    public ApiResponse<PortfolioDto> getPortfolioById(String userId, String portfolioId) {
        Optional<Portfolio> portfolioOpt = portfolioRepository.findByIdAndUserId(portfolioId, userId);

        if (portfolioOpt.isEmpty()) {
            return ApiResponse.error("Portfolio not found");
        }

        Portfolio portfolio = healLegacyIfNeeded(portfolioOpt.get());
        return ApiResponse.success(toDto(portfolio));
    }

    public ApiResponse<PortfolioDto> createPortfolio(String userId, PortfolioDto request) {
        Portfolio portfolio = Portfolio.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .themeKey(deriveThemeForWrite(request.getThemeKey()))
                .blocks(request.getBlocks() != null ? request.getBlocks() : new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        portfolio.normalizeForPersistence(true);

        portfolio = portfolioRepository.save(portfolio);

        updateUserPortfolios(userId, portfolio.getId());

        return ApiResponse.success("Portfolio created", toDto(portfolio));
    }

    public ApiResponse<PortfolioDto> updatePortfolio(String userId, String portfolioId, PortfolioDto request) {
        Optional<Portfolio> portfolioOpt = portfolioRepository.findByIdAndUserId(portfolioId, userId);

        if (portfolioOpt.isEmpty()) {
            return ApiResponse.error("Portfolio not found");
        }

        Portfolio portfolio = portfolioOpt.get();

        if (request.getTitle() != null) {
            portfolio.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            portfolio.setDescription(request.getDescription());
        }
        if (request.getThemeKey() != null) {
            portfolio.setThemeKey(deriveThemeForWrite(request.getThemeKey()));
        }
        if (request.getBlocks() != null) {
            portfolio.setBlocks(request.getBlocks());
        }

        portfolio.normalizeForPersistence(true);
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolio = portfolioRepository.save(portfolio);

        return ApiResponse.success("Portfolio updated", toDto(portfolio));
    }

    public ApiResponse<String> deletePortfolio(String userId, String portfolioId) {
        Optional<Portfolio> portfolioOpt = portfolioRepository.findByIdAndUserId(portfolioId, userId);

        if (portfolioOpt.isEmpty()) {
            return ApiResponse.error("Portfolio not found");
        }

        portfolioRepository.delete(portfolioOpt.get());

        return ApiResponse.success("Portfolio deleted");
    }

    /**
     * Public read-only aggregate for recruiter / share links (portfolio id doubles as shared id until slugs ship).
     */
    public ApiResponse<PublicPortfolioViewDto> getPublicPortfolioView(String portfolioId) {
        Optional<Portfolio> opt = portfolioRepository.findById(portfolioId);
        if (opt.isEmpty()) {
            return ApiResponse.error("Portfolio not found");
        }

        Portfolio portfolio = healLegacyIfNeeded(opt.get());
        Optional<User> userOpt = userRepository.findById(portfolio.getUserId());

        PublicPortfolioViewDto.OwnerPublicSnippet owner = userOpt.map(u ->
                PublicPortfolioViewDto.OwnerPublicSnippet.builder()
                        .fullName(stripBlank(u.getFullName()))
                        .bio(stripBlank(u.getBio()))
                        .avatarUrl(stripBlank(u.getAvatarUrl()))
                        .build()
        ).orElse(PublicPortfolioViewDto.OwnerPublicSnippet.builder().build());

        PublicPortfolioViewDto dto = PublicPortfolioViewDto.builder()
                .owner(owner)
                .portfolioId(portfolio.getId())
                .title(stripBlank(portfolio.getTitle()))
                .description(stripBlank(portfolio.getDescription()))
                .themeKey(deriveThemeForRead(portfolio.getThemeKey()))
                .blocks(portfolio.getBlocks() != null
                        ? List.copyOf(portfolio.getBlocks())
                        : List.of())
                .build();

        return ApiResponse.success(dto);
    }

    private static String stripBlank(String value) {
        return StringUtils.hasText(value) ? value.strip() : null;
    }

    /** First read of BSON-only legacy portfolios migrates to blocks + strips superseded keys. */
    private Portfolio healLegacyIfNeeded(Portfolio portfolio) {
        if (!shouldHealLegacyPortfolio(portfolio)) {
            return portfolio;
        }
        portfolio.normalizeForPersistence(true);
        return portfolioRepository.save(portfolio);
    }

    private boolean shouldHealLegacyPortfolio(Portfolio p) {
        if (p.getBlocks() != null && !p.getBlocks().isEmpty()) {
            return false;
        }
        if (StringUtils.hasText(p.getSelectedTemplate())) {
            return true;
        }
        return p.getTemplateOrder() != null && !p.getTemplateOrder().isEmpty()
                && p.getTemplateData() != null && !p.getTemplateData().isEmpty();
    }

    private void updateUserPortfolios(String userId, String portfolioId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.getPortfolioIds().add(portfolioId);
            userRepository.save(user);
        });
    }

    private PortfolioDto toDto(Portfolio portfolio) {
        return PortfolioDto.builder()
                .id(portfolio.getId())
                .userId(portfolio.getUserId())
                .title(portfolio.getTitle())
                .description(portfolio.getDescription())
                .themeKey(deriveThemeForRead(portfolio.getThemeKey()))
                .blocks(
                        portfolio.getBlocks() != null
                                ? new ArrayList<>(portfolio.getBlocks())
                                : List.of())
                .build();
    }

    private static String deriveThemeForRead(String themeKey) {
        return StringUtils.hasText(themeKey) ? themeKey.strip() : "default";
    }

    private static String deriveThemeForWrite(String themeKey) {
        return StringUtils.hasText(themeKey) ? themeKey.strip() : "default";
    }
}
