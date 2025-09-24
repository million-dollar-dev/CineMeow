package com.cinemeow.cinema_service.entity;

import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.enums.SeatType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "seats")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "row_index")
    int rowIndex;

    @Column(name = "column_index")
    int colIndex;

    @Enumerated(EnumType.STRING)
    SeatStatus status;

    @Enumerated(EnumType.STRING)
    SeatType type;

    @ManyToOne(fetch = FetchType.LAZY)
    Room room;
}
