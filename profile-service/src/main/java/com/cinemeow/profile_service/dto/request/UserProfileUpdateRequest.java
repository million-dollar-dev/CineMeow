package com.cinemeow.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileUpdateRequest {
    @NotBlank(message = "User's id must be not blank")
    String email;

    @NotBlank(message = "Phone number must be not blank")
    String phoneNumber;
}
