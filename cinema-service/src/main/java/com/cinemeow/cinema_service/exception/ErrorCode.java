package com.cinemeow.cinema_service.exception;

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
    SEAT_NOT_EXISTED(10045, "Seat not existed", HttpStatus.NOT_FOUND),
    FNB_ITEM_NOT_EXISTED(10045, "Item not existed", HttpStatus.NOT_FOUND),
    ROOM_CAPACITY_EXCEED(1011, "Cannot add more seats: capacity exceeded", HttpStatus.BAD_REQUEST),
    SEAT_UPDATE_FAILED(1013, "Update status fail", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(403, "Access denied", HttpStatus.UNAUTHORIZED)
    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
