package com.cinemeow.common.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode implements BaseErrorCode {
    // --- System & Common Errors ---
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(403, "Access denied", HttpStatus.UNAUTHORIZED),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR(1002, "Validation failed", HttpStatus.BAD_REQUEST),
    DATA_INTEGRITY_VIOLATION(1011, "Request's data issue", HttpStatus.BAD_REQUEST),
    INVALID_JWT(1012, "Invalid Token", HttpStatus.UNAUTHORIZED),
    PARSE_ERROR(1013, "There's an issue in parsing", HttpStatus.BAD_REQUEST),

    // --- Movie Service ---
    MOVIE_NOT_FOUND(4041, "Movie not found", HttpStatus.NOT_FOUND),
    GENRE_NOT_FOUND(4042, "Genre not found", HttpStatus.NOT_FOUND),

    // --- Cinema & FnB Service ---
    BRAND_NOT_EXISTED(1001, "Brand not existed", HttpStatus.NOT_FOUND),
    CINEMA_NOT_EXISTED(1001, "Cinema not existed", HttpStatus.NOT_FOUND),
    ROOM_NOT_EXISTED(1004, "Room not existed", HttpStatus.NOT_FOUND),
    SEAT_NOT_EXISTED(10045, "Seat not existed", HttpStatus.NOT_FOUND),
    SEAT_NOT_AVAILABLE(10045, "Seat not available", HttpStatus.BAD_REQUEST),
    SEAT_NOT_LOCKED(10045, "Seat not lock", HttpStatus.BAD_REQUEST),
    FNB_ITEM_NOT_EXISTED(10045, "Item not existed", HttpStatus.NOT_FOUND),
    ROOM_CAPACITY_EXCEED(1011, "Cannot add more seats: capacity exceeded", HttpStatus.BAD_REQUEST),
    SEAT_UPDATE_FAILED(1013, "Update status fail", HttpStatus.BAD_REQUEST),

    // --- Showtime Service ---
    SHOWTIME_NOT_EXISTED(10045, "Showtime not existed", HttpStatus.NOT_FOUND),

    // --- Profile Service ---
    PROFILE_NOT_FOUND(1001, "Profile is not found", HttpStatus.NOT_FOUND),

    // --- Promotion Service ---
    PROMOTION_NOT_EXISTED(1001, "Promotion not existed", HttpStatus.NOT_FOUND)
    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
