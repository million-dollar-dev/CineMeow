package com.cinemeow.showtime_service.client;

import com.cinemeow.showtime_service.dto.response.BaseResponse;
import com.cinemeow.showtime_service.dto.response.MovieResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "movie-service",
        url = "${app.services.movie-service}"
)
public interface MovieClient {
    @GetMapping("/movies/{id}")
    BaseResponse<MovieResponse> getById(@PathVariable String id);
}
