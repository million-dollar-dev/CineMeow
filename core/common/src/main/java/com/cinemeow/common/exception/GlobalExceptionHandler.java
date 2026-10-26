package com.cinemeow.common.exception;

import com.cinemeow.common.dto.response.BaseResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<BaseResponse<?>> handleUncaughtException(Exception exception) {
        log.error("Unhandled exception caught: ", exception);
        BaseResponse<?> baseResponse = BaseResponse.builder()
                .status("Error")
                .message(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage() + " - " + exception.getMessage())
                .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(baseResponse);
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<BaseResponse<?>> handlingAppException(AppException exception) {
        BaseErrorCode errorCode = exception.getErrorCode();
        BaseResponse<?> baseResponse = BaseResponse.builder()
                .status("Error")
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(baseResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Map<String, String>>> handlingValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        BaseResponse<Map<String, String>> baseResponse = BaseResponse.<Map<String, String>>builder()
                .status("Error")
                .code(400)
                .message("Validation failed")
                .data(errors)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(baseResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<BaseResponse<?>> handlingAccessDenied(AccessDeniedException exception) {
        BaseResponse<?> baseResponse = BaseResponse.builder()
                .status("Error")
                .message(ErrorCode.UNAUTHENTICATED.getMessage())
                .code(ErrorCode.UNAUTHENTICATED.getCode())
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(baseResponse);
    }
}
