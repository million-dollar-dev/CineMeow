package com.cinemeow.auth_service.config;

import com.cinemeow.auth_service.entity.Role;
import com.cinemeow.auth_service.entity.User;
import com.cinemeow.auth_service.enums.RoleEnum;
import com.cinemeow.auth_service.repository.PermissionRepository;
import com.cinemeow.auth_service.repository.RoleRepository;
import com.cinemeow.auth_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    UserRepository userRepository;
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;

    PasswordEncoder passwordEncoder;

    @Value("${app.admin-info.username}")
    @NonFinal
    String usernameAdmin;

    @Value("${app.admin-info.password}")
    @NonFinal
    String passwordAdmin;

    @Bean
    @ConditionalOnProperty(name = "app.init-data", havingValue = "true", matchIfMissing = false)
    public ApplicationRunner initDataRunner() {
        return args -> {
            // Tạo role USER nếu chưa tồn tại
            roleRepository.findByName(RoleEnum.USER.toString())
                    .ifPresentOrElse(role -> log.info("Role USER already exists"), () -> {
                        Role normalUserRole = Role.builder()
                                .name(RoleEnum.USER.toString())
                                .build();
                        roleRepository.save(normalUserRole);
                        log.info("✅ Created Role: USER");
                    });

            // Tạo role ADMIN nếu chưa tồn tại
            roleRepository.findByName(RoleEnum.ADMIN.toString())
                    .ifPresentOrElse(role -> log.info("Role ADMIN already exists"), () -> {
                        Role adminRole = Role.builder()
                                .name(RoleEnum.ADMIN.toString())
                                .build();
                        roleRepository.save(adminRole);
                        log.info("✅ Created Role: ADMIN");
                    });

            userRepository.findByUsername(usernameAdmin)
                    .ifPresentOrElse(user -> log.info("Admin user already exists"), () -> {
                        User adminUser = User.builder()
                                .username(usernameAdmin)
                                .active(true)
                                .password(passwordEncoder.encode(passwordAdmin))
                                .build();
                        roleRepository.findByName(RoleEnum.ADMIN.toString()).ifPresent(adminUser.getRoles()::add);
                        userRepository.save(adminUser);
                        log.warn("✅ Admin user has been created with default password: {}, please change it.", passwordAdmin);
                    });
        };
    }


}
