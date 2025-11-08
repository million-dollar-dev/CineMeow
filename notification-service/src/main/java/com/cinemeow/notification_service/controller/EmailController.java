package com.cinemeow.notification_service.controller;

import com.cinemeow.notification_service.dto.request.SendMailRequest;
import com.cinemeow.notification_service.dto.response.BaseResponse;
import com.cinemeow.notification_service.dto.response.EmailResponse;
import com.cinemeow.notification_service.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailController {
    EmailService emailService;

    @PostMapping("/email/send")
    public BaseResponse<EmailResponse> sendMail(@RequestBody SendMailRequest request) {
        log.info("[Email data]: {}", request.getData());
        return BaseResponse.<EmailResponse>builder()
                .data(emailService.sendMail(request))
                .build();
    }
}
