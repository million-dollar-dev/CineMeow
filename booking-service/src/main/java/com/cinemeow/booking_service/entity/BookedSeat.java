package com.cinemeow.booking_service.entity;

import com.cinemeow.booking_service.enums.SeatType;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    Booking booking;

    @Column(name = "seat_id", nullable = false)
    Long seatId;

    @Column(name = "seat_label")
    String seatLabel;

    @Column(name = "seat_type")
    @Enumerated(EnumType.STRING)
    SeatType seatType;
}

