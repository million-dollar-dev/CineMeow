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

    @Value("${app.services.authentication-service:http://localhost:8080}")
    String authUrl;

    @Value("${app.services.profile-service:http://localhost:8090}")
    String profileUrl;

    @Value("${app.services.movie-service:http://localhost:8090}")
    String movieUrl;

    @Value("${app.services.showtime-service:http://localhost:8090}")
    String showtimeUrl;

    @Value("${app.services.cinema-service:http://localhost:8090}")
    String cinemaUrl;

    @Value("${app.services.booking-service:http://localhost:8085}")
    String bookingUrl;

    @Value("${app.services.payment-service:http://localhost:8086}")
    String paymentUrl;

    @Value("${app.services.notification-service:http://localhost:8087}")
    String notificationUrl;

    @Value("${app.services.promotion-service:http://localhost:8090}")
    String promotionUrl;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("authentication-service", r -> r
                        .path(apiPrefix + "/authentication/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(authUrl))

                .route("profile-service", r -> r
                        .path(apiPrefix + "/profile/users/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(profileUrl))

                .route("movie-service", r -> r
                        .path(apiPrefix + "/movie/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(movieUrl))

                .route("showtime-service", r -> r
                        .path(apiPrefix + "/showtime/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(showtimeUrl))

                .route("cinema-service", r -> r
                        .path(apiPrefix + "/cinema/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(cinemaUrl))

                .route("booking-service", r -> r
                        .path(apiPrefix + "/booking/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(bookingUrl))

                .route("payment-service", r -> r
                        .path(apiPrefix + "/payment/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(paymentUrl))

                .route("notification-service", r -> r
                        .path(apiPrefix + "/notification/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(notificationUrl))

                .route("promotion-service", r -> r
                        .path(apiPrefix + "/promotion/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri(promotionUrl))

                .build();
    }
}

