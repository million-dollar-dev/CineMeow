package com.cinemeow.auth_service.repository;

import com.cinemeow.auth_service.entity.ActiveToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActiveTokenRepository extends JpaRepository<ActiveToken, Long> {
    Optional<ActiveToken> findByToken(String token);
}
