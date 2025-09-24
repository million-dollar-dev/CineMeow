package com.cinemeow.cinema_service.dto.response;

import com.cinemeow.cinema_service.entity.Room;
import com.cinemeow.cinema_service.entity.Seat;
import com.cinemeow.cinema_service.enums.SeatStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatMapResponse {
    String roomId;

    String roomName;

    Integer rows;

    Integer columns;

    List<SeatResponse> seats;

    public static SeatMapResponse from(Room room) {
        List<SeatResponse> seats = room.getSeats().stream()
                .filter(aSeat -> aSeat.getStatus() != SeatStatus.DELETED)
                .map(seat -> SeatResponse.builder()
                        .id(seat.getId())
                        .rowIndex(seat.getRowIndex())
                        .colIndex(seat.getColIndex())
                        .type(seat.getType())
                        .status(seat.getStatus())
                        .build())

                .toList();

        int rows = room.getSeats().stream()
                .mapToInt(Seat::getRowIndex)
                .max()
                .orElse(0);

        int columns = room.getSeats().stream()
                .mapToInt(Seat::getColIndex)
                .max()
                .orElse(0);

        return SeatMapResponse.builder()
                .roomId(room.getId())
                .roomName(room.getName())
                .rows(rows)
                .columns(columns)
                .seats(seats)
                .build();
    }
}
