package com.cinemeow.notification_service.dto.request;

import com.cinemeow.notification_service.entity.Recipient;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMailRequest {
    Recipient to;
    String subject;
    String templateName;
    Map<String, Object> data;
}
