package com.cinemeow.auth_service.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse <T> {
    @Builder.Default
    String status = "Success";
    @Builder.Default
    int code = 1000;
    T data;
    String message;
    @Builder.Default
    LocalDateTime timestamp = LocalDateTime.now();
}
