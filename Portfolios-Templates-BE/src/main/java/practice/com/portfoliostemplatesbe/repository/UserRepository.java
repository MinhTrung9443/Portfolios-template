package practice.com.portfoliostemplatesbe.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import practice.com.portfoliostemplatesbe.model.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
