package com.cinemeow.notification_service.client;

import com.cinemeow.notification_service.dto.request.BrevoEmailRequest;
import com.cinemeow.notification_service.dto.response.EmailResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "brevo-client", url = "https://api.brevo.com")
public interface BrevoClient {
    @PostMapping(value = "/v3/smtp/email",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    EmailResponse sendMail(
            @RequestHeader("api-key") String apiKey,
            @RequestBody BrevoEmailRequest request);
}
