package com.cinemeow.booking_service.client;

import com.cinemeow.booking_service.dto.response.BaseResponse;
import com.cinemeow.booking_service.dto.response.CinemaBrandResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "cinema-service",
        url = "${app.services.cinema-service}"
)
public interface CinemaClient {
    @GetMapping("/brands/{id}")
    BaseResponse<CinemaBrandResponse> getBrandById(@PathVariable String id);
}
