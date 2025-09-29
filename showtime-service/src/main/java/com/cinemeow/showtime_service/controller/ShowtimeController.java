package com.cinemeow.showtime_service.controller;

import com.cinemeow.showtime_service.dto.request.ShowtimeRequest;
import com.cinemeow.showtime_service.dto.response.BaseResponse;
import com.cinemeow.showtime_service.dto.response.ShowtimeResponse;
import com.cinemeow.showtime_service.service.ShowtimeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/showtimes")
@Slf4j
public class ShowtimeController {
    ShowtimeService showtimeService;

    @PostMapping
    public BaseResponse<ShowtimeResponse> create(@Valid @RequestBody ShowtimeRequest request) {
        return BaseResponse.<ShowtimeResponse>builder()
                .data(showtimeService.create(request))
                .build();
    }

    @GetMapping
    public BaseResponse<List<ShowtimeResponse>> getAll() {
        return BaseResponse.<List<ShowtimeResponse>>builder()
                .data(showtimeService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<ShowtimeResponse> getById(@PathVariable String id) {
        return BaseResponse.<ShowtimeResponse>builder()
                .data(showtimeService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public BaseResponse<ShowtimeResponse> updateById(
            @PathVariable String id,
            @Valid @RequestBody ShowtimeRequest request)
    {
        return BaseResponse.<ShowtimeResponse>builder()
                .data(showtimeService.updateById(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable String id) {
        showtimeService.delete(id);
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }
}
