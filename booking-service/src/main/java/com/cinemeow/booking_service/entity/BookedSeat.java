package com.cinemeow.booking_service.entity;

import com.cinemeow.booking_service.enums.SeatType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "booked_seats")
public class BookedSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    Booking booking;

    @Column(name = "seat_id", nullable = false)
    String seatId;

    @Column(name = "seat_label")
    String seatLabel;

    @Column(name = "seat_type")
    @Enumerated(EnumType.STRING)
    SeatType seatType;

    @Column(name = "price")
    BigDecimal price;
}

