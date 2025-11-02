package com.cinemeow.auth_service.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Recipient {
    String name;

    String email;
}
