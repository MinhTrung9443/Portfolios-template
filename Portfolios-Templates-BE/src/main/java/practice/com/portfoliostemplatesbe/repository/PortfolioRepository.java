package practice.com.portfoliostemplatesbe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import practice.com.portfoliostemplatesbe.model.Portfolio;

import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends MongoRepository<Portfolio, String> {
    List<Portfolio> findByUserId(String userId);
    Optional<Portfolio> findByIdAndUserId(String id, String userId);
}
