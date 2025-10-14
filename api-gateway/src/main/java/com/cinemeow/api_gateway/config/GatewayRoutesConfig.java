package com.cinemeow.api_gateway.config;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GatewayRoutesConfig {

    @Value("${app.api-prefix}")
    String apiPrefix;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("authentication-service", r -> r
                        .path(apiPrefix + "/authentication/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8080"))

                .route("profile-service", r -> r
                        .path(apiPrefix + "/profile/users/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8081"))

                .route("movie-service", r -> r
                        .path(apiPrefix + "/movie/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8082"))

                .route("showtime-service", r -> r
                        .path(apiPrefix + "/showtime/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8083"))

                .route("cinema-service", r -> r
                        .path(apiPrefix + "/cinema/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8084"))

                .route("booking-service", r -> r
                        .path(apiPrefix + "/booking/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8085"))

                .route("payment-service", r -> r
                        .path(apiPrefix + "/payment/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8086"))

                .route("notification-service", r -> r
                        .path(apiPrefix + "/notification/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8087"))

                .route("promotion-service", r -> r
                        .path(apiPrefix + "/promotion/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8088"))

                .build();
    }
}

