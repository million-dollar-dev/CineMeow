package com.cinemeow.movie_service.exception;

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
    MOVIE_NOT_FOUND(4041, "Movie not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(403, "Access denied", HttpStatus.UNAUTHORIZED),
    DATA_INTEGRITY_VIOLATION(1011, "Request's data issue", HttpStatus.BAD_REQUEST),
    INVALID_JWT(1012, "Invalid Token", HttpStatus.UNAUTHORIZED),
    PARSE_ERROR(1013, "There's an issue in parsing", HttpStatus.BAD_REQUEST);
    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
