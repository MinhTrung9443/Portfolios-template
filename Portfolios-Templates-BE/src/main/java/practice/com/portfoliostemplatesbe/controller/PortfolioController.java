package practice.com.portfoliostemplatesbe.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import practice.com.portfoliostemplatesbe.dto.ApiResponse;
import practice.com.portfoliostemplatesbe.dto.PortfolioDto;
import practice.com.portfoliostemplatesbe.dto.PublicPortfolioViewDto;
import practice.com.portfoliostemplatesbe.service.PortfolioService;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {
    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<PortfolioDto>>> getPortfolios(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(portfolioService.getPortfolios(userId));
    }

    @GetMapping("/shared/{sharedId}")
    public ResponseEntity<ApiResponse<PublicPortfolioViewDto>> getSharedPortfolio(@PathVariable String sharedId) {
        return ResponseEntity.ok(portfolioService.getPublicPortfolioView(sharedId));
    }

    @GetMapping("/{portfolioId}")
    public ResponseEntity<ApiResponse<PortfolioDto>> getPortfolio(
            Authentication authentication,
            @PathVariable String portfolioId) {
        String userId = authentication.getName();
        return ResponseEntity.ok(portfolioService.getPortfolioById(userId, portfolioId));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PortfolioDto>> createPortfolio(
            Authentication authentication,
            @RequestBody PortfolioDto request) {
        String userId = authentication.getName();
        return ResponseEntity.ok(portfolioService.createPortfolio(userId, request));
    }

    @PutMapping("/{portfolioId}")
    public ResponseEntity<ApiResponse<PortfolioDto>> updatePortfolio(
            Authentication authentication,
            @PathVariable String portfolioId,
            @RequestBody PortfolioDto request) {
        String userId = authentication.getName();
        return ResponseEntity.ok(portfolioService.updatePortfolio(userId, portfolioId, request));
    }

    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<ApiResponse<String>> deletePortfolio(
            Authentication authentication,
            @PathVariable String portfolioId) {
        String userId = authentication.getName();
        return ResponseEntity.ok(portfolioService.deletePortfolio(userId, portfolioId));
    }
}
