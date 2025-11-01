package com.cinemeow.notification_service.dto.request;

import com.cinemeow.notification_service.entity.Recipient;
import com.cinemeow.notification_service.entity.Sender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrevoEmailRequest {
    Sender sender;
    List<Recipient> to;
    String subject;
    String htmlContent;
}
