package com.cinemeow.notification_service.service;

import java.util.Map;

public interface TemplateService {
    String buildEmailTemplate(String templateName, Map<String, Object> variables);
}
