package com.cinemeow.cinema_service.controller;

import com.cinemeow.cinema_service.dto.request.CinemaBrandRequest;
import com.cinemeow.cinema_service.dto.response.BaseResponse;
import com.cinemeow.cinema_service.dto.response.CinemaBrandResponse;
import com.cinemeow.cinema_service.service.CinemaBrandService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/brands")
public class CinemaBrandController {
    CinemaBrandService cinemaBrandService;

    @PostMapping
    public BaseResponse<CinemaBrandResponse> create(@Valid @RequestBody CinemaBrandRequest request) {
        return BaseResponse.<CinemaBrandResponse>builder()
                .data(cinemaBrandService.create(request))
                .build();
    }

    @GetMapping
    public BaseResponse<List<CinemaBrandResponse>> getAll() {
        return BaseResponse.<List<CinemaBrandResponse>>builder()
                .data(cinemaBrandService.getAll())
                .build();
    }

    @PutMapping("/{id}")
    public BaseResponse<CinemaBrandResponse> update(
            @PathVariable String id,
            @Valid @RequestBody CinemaBrandRequest request
    ) {
        return BaseResponse.<CinemaBrandResponse>builder()
                .data(cinemaBrandService.updateById(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable String id) {
        cinemaBrandService.delete(id);
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }
}
