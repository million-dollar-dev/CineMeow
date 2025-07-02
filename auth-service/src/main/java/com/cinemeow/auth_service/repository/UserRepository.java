package com.cinemeow.auth_service.repository;

import com.cinemeow.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    @Query("select r.name from User u join u.roles r where u.id = :id")
    Set<String> getRolesById(@Param("id") String id);
}
