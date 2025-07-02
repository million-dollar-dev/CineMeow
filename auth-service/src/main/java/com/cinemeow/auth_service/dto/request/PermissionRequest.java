package com.cinemeow.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionRequest {
    @NotBlank(message = "Permission's name must be not null")
    @Size(min = 3, max = 50, message = "Role's name must be between 3 and 50 characters")
    String name;

    @NotBlank(message = "Permission's description must be not null")
    @Size(min = 3, max = 255, message = "Role's description must be between 10 and 255 characters")
    String description;
}
