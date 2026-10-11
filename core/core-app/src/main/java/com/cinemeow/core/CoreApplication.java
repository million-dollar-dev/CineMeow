package com.cinemeow.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.FullyQualifiedAnnotationBeanNameGenerator;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Unified Spring Boot Modular Monolith Application Runner
 * Consolidates Cinema, Movie, Profile, Promotion, and Showtime services into a single JVM runtime process.
 */
@SpringBootApplication(
        scanBasePackages = "com.cinemeow",
        nameGenerator = FullyQualifiedAnnotationBeanNameGenerator.class
)
@EntityScan(basePackages = "com.cinemeow")
@EnableJpaRepositories(basePackages = "com.cinemeow")
@EnableFeignClients(basePackages = "com.cinemeow")
public class CoreApplication {

    public static void main(String[] args) {
        new SpringApplicationBuilder(CoreApplication.class)
                .beanNameGenerator(new FullyQualifiedAnnotationBeanNameGenerator())
                .run(args);
    }
}
