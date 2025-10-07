package com.cinemeow.booking_service.entity;

import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.SeatType;
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
@Table(name = "ticket_prices")
public class TicketPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, name = "brand_Id")
    String brandId;

    @Enumerated(EnumType.STRING)
    SeatType seatType;

    @Enumerated(EnumType.STRING)
    RoomType roomType;

    @Column(nullable = false)
    BigDecimal price;
}
