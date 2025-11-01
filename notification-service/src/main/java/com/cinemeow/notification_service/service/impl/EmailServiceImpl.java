package com.cinemeow.notification_service.service.impl;

import com.cinemeow.notification_service.client.BrevoClient;
import com.cinemeow.notification_service.dto.request.BrevoEmailRequest;
import com.cinemeow.notification_service.dto.request.SendMailRequest;
import com.cinemeow.notification_service.dto.response.EmailResponse;
import com.cinemeow.notification_service.entity.Sender;
import com.cinemeow.notification_service.exception.AppException;
import com.cinemeow.notification_service.exception.ErrorCode;
import com.cinemeow.notification_service.service.EmailService;
import com.cinemeow.notification_service.service.TemplateService;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailServiceImpl implements EmailService {
    TemplateService templateService;
    BrevoClient  brevoClient;

    @NonFinal
    @Value("${brevo.sender-name}")
    String senderName;

    @NonFinal
    @Value("${brevo.sender-email}")
    String senderEmail;

    @NonFinal
    @Value("${brevo.api-key}")
    String apiKey;

    @Override
    public EmailResponse sendMail(SendMailRequest request) {
        String htmlContent = templateService.buildEmailTemplate(
                request.getTemplateName(), request.getData());

        BrevoEmailRequest brevoRequest = BrevoEmailRequest.builder()
                .sender(Sender.builder()
                        .name(senderName)
                        .email(senderEmail)
                        .build())
                .to(List.of(request.getTo()))
                .subject(request.getSubject())
                .htmlContent(htmlContent)
                .build();
        try {
            return brevoClient.sendMail(apiKey, brevoRequest);

        } catch (FeignException exception) {
            throw new AppException(ErrorCode.CANNOT_SEND_MAIL);
        }
    }
}
