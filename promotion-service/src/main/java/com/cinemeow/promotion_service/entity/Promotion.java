package com.cinemeow.promotion_service.entity;

import com.cinemeow.promotion_service.enums.PromotionStatus;
import com.cinemeow.promotion_service.enums.PromotionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, unique = true)
    String code;

    String name;

    String description;

    @Enumerated(EnumType.STRING)
    PromotionType type;

    @Column(nullable = false)
    BigDecimal value;

    BigDecimal minOrderValue;

    Integer usageLimit;
    Integer usedCount;

    LocalDateTime startDate;
    LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    PromotionStatus status;

    boolean forGuest;
    boolean applyFnb;
    boolean applyTicket;

    @OneToMany(
            mappedBy = "promotion",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER)
    List<PromotionCondition> conditions = new ArrayList<>();

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;
}
