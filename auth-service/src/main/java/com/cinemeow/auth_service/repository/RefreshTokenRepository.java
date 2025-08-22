package com.cinemeow.auth_service.repository;

import com.cinemeow.auth_service.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<RefreshToken, String> {}
