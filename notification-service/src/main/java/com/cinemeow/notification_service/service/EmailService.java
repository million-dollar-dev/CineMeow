package com.cinemeow.notification_service.service;

import com.cinemeow.notification_service.dto.request.SendMailRequest;
import com.cinemeow.notification_service.dto.response.EmailResponse;

public interface EmailService {
    EmailResponse sendMail(SendMailRequest request);
}
