package com.cinemeow.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleUpdateRequest {
    @NotBlank(message = "Role's name must be not null")
    @Size(min = 3, max = 50, message = "Role's name must be between 3 and 50 characters")
    String name;
    List<String> permissions;
}
