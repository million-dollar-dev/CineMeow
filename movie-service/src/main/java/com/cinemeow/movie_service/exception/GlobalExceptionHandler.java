package com.cinemeow.movie_service.exception;

import com.cinemeow.movie_service.dto.response.BaseResponse;
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
        BaseResponse<?> baseResponse = new BaseResponse<>();
        baseResponse.setStatus("Error");
        baseResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage()
                + " - " + exception.getMessage());
        baseResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(baseResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<BaseResponse> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        BaseResponse baseResponse = new BaseResponse();
        baseResponse.setStatus("Error");
        baseResponse.setCode(errorCode.getCode());
        baseResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode()).body(baseResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<BaseResponse> handlingValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        BaseResponse baseResponse = new BaseResponse<>();
        baseResponse.setStatus("Error");
        baseResponse.setCode(400);
        baseResponse.setData(errors);
        return ResponseEntity.status(400).body(baseResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<BaseResponse> handlingAccessDenied(AccessDeniedException exception) {
        BaseResponse baseResponse = new BaseResponse<>();
        baseResponse.setStatus("Error");
        baseResponse.setMessage(ErrorCode.UNAUTHENTICATED.getMessage());
        baseResponse.setCode(ErrorCode.UNAUTHENTICATED.getCode());
        return ResponseEntity.badRequest().body(baseResponse);
    }
}
