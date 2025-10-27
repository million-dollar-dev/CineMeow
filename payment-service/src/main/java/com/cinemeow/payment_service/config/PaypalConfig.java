package com.cinemeow.payment_service.config;

import com.paypal.base.rest.APIContext;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
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

}
