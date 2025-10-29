package com.cinemeow.payment_service.config;

import com.paypal.base.rest.APIContext;
import jakarta.servlet.Filter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaypalConfig {
    @Value("${payment.paypal.client-id}")
    String clientId;

    @Value("${payment.paypal.client-secret}")
    String clientSecret;

    @Value("${payment.paypal.mode}")
    String mode;

    @Bean
    public APIContext apiContext() {
        return new APIContext(clientId, clientSecret, mode);
    }

    @Bean
    public FilterRegistrationBean<Filter> ngrokBypassFilter() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter((request, response, chain) -> {
            ((HttpServletResponse) response).setHeader("ngrok-skip-browser-warning", "true");
            chain.doFilter(request, response);
        });
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }


}
