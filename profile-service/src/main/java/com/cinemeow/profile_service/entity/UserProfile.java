package com.cinemeow.profile_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "user_id", unique = true)
    String userId;

    @Column(name = "full_name")
    String fullName;

    @Column(name = "dob")
    LocalDate dob;

    @Column(name = "phone_number", unique = true)
    String phoneNumber;

    @Column(name = "email", unique = true)
    String email;

    @Column(name = "avatar_url")
    String avatarUrl;
}
