package com.cinemeow.booking_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "booked_fnb_items")
public class BookedFnbItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    Booking booking;

    @Column(name = "fnb_item_id", nullable = false)
    String fnbItemId;

    @Column(name = "fnb_name")
    String fnbName;

    @Column(name = "quantity")
    int quantity;

    @Column(name = "unit_price")
    BigDecimal unitPrice;

    @Column(name = "total_price")
    BigDecimal totalPrice;
}

