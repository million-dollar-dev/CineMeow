package com.cinemeow.booking_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GuestInfo {
    @Column(name = "guest_name")
    String name;

    @Column(name = "guest_email")
    String email;

    @Column(name = "guest_phone")
    String phone;
}

