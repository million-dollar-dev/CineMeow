package com.cinemeow.booking_service.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    BRAND_NOT_EXISTED(1001, "Brand not existed", HttpStatus.NOT_FOUND),
    CINEMA_NOT_EXISTED(1001, "Cinema not existed", HttpStatus.NOT_FOUND),
    ROOM_NOT_EXISTED(1004, "Room not existed", HttpStatus.NOT_FOUND),
    BOOKING_NOT_EXISTED(1004, "Booking not existed", HttpStatus.NOT_FOUND),
    SEAT_NOT_EXISTED(1005, "Seat not existed", HttpStatus.NOT_FOUND),
    ROOM_CAPACITY_EXCEED(1006, "Cannot add more seats: capacity exceeded", HttpStatus.BAD_REQUEST),
    SHOWTIME_NOT_AVAILABLE(1007, "Showtime not available", HttpStatus.BAD_REQUEST),
    INVALID_SEAT(1008, "Invalid Seat", HttpStatus.BAD_REQUEST),
    TICKET_PRICE_NOT_EXISTED(1001, "Ticket Price not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(403, "Access denied", HttpStatus.UNAUTHORIZED)
    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
