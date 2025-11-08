package com.cinemeow.notification_service.consumer;

import com.cinemeow.notification_service.dto.request.SendMailRequest;
import com.cinemeow.notification_service.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailConsumer {
    EmailService emailService;

    @RabbitListener(queues = "email.sending.queue")
    public void sendEmail(SendMailRequest request) {
        emailService.sendMail(request);
    }
}
