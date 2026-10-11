package com.cinemeow.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Automatically applies the domain context path prefixes to each controller package
 * so that URLs match the original microservice paths:
 * - Cinema:    /cinema/**
 * - Movie:     /movie/**
 * - Profile:   /profile/**
 * - Promotion: /promotion/**
 * - Showtime:  /showtime/**
 */
@Configuration
public class CoreWebMvcConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.addPathPrefix("/cinema", c -> c.getPackageName().startsWith("com.cinemeow.cinema_service.controller"));
        configurer.addPathPrefix("/movie", c -> c.getPackageName().startsWith("com.cinemeow.movie_service.controller"));
        configurer.addPathPrefix("/profile", c -> c.getPackageName().startsWith("com.cinemeow.profile_service.controller"));
        configurer.addPathPrefix("/promotion", c -> c.getPackageName().startsWith("com.cinemeow.promotion_service.controller"));
        configurer.addPathPrefix("/showtime", c -> c.getPackageName().startsWith("com.cinemeow.showtime_service.controller"));
    }
}
