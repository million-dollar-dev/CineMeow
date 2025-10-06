package com.cinemeow.cinema_service.entity;

import com.cinemeow.cinema_service.enums.FnbCategory;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "fnb_items")
public class FnbItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    CinemaBrand cinemaBrand;

    @Column(nullable = false, name = "name")
    String name;

    @Column(name = "description")
    String description;

    @Column(nullable = false, name = "image_url")
    String imageUrl;

    @Column(name = "available")
    boolean available;

    @Column(name = "price")
    BigDecimal price;

    @Column(nullable = false, name = "category")
    @Enumerated(EnumType.STRING)
    FnbCategory category;
}
