package com.cinemeow.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileRequest {
    @NotBlank(message = "User's id must be not blank")
    String userId;

    @NotBlank(message = "User's id must be not blank")
    String email;

    @NotBlank(message = "Phone number must be not blank")
    String phoneNumber;
}
