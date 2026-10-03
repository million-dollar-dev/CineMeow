package com.cinemeow.cinema_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "cinema_brands")
public class CinemaBrand {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "name", nullable = false, unique = true)
    String name;

    @Column(name = "description")
    String description;

    @Column(name = "logo_url")
    String logoUrl;

    @Column(name = "employee_count")
    int employeeCount;

    @Column(name = "background_url")
    String backgroundUrl;
}
