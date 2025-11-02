package com.cinemeow.auth_service.client;

import com.cinemeow.auth_service.dto.request.SendMailRequest;
import com.cinemeow.auth_service.dto.response.BaseResponse;
import com.cinemeow.auth_service.dto.response.EmailResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "notification-service",
        url = "${app.services.notification-service}"
)
public interface NotificationClient {
    @PostMapping("/email/send")
    BaseResponse<EmailResponse> sendMail(@RequestBody SendMailRequest request);
}
