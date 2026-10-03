package com.cinemeow.promotion_service.entity;

import com.cinemeow.promotion_service.enums.ConditionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "promotion_conditions")
public class PromotionCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", nullable = false)
    Promotion promotion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ConditionType type;

    @Column(nullable = false)
    String value; // Ví dụ: "COUPLE", "3D", "CGV", "WEEKEND", "VIETTELPAY"
}

