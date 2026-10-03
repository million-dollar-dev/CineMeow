package com.cinemeow.cinema_service.controller;

import com.cinemeow.cinema_service.dto.request.CinemaBrandRequest;
import com.cinemeow.cinema_service.dto.response.BaseResponse;
import com.cinemeow.cinema_service.dto.response.CinemaBrandResponse;
import com.cinemeow.cinema_service.dto.response.FnbItemResponse;
import com.cinemeow.cinema_service.service.CinemaBrandService;
import com.cinemeow.cinema_service.service.FnbItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Cinema Brand Management", description = "APIs for managing cinema brands")
public class CinemaBrandController {
    CinemaBrandService cinemaBrandService;
    FnbItemService fnbItemService;

    @Operation(
            summary = "Create new cinema brand",
            description = "Tạo mới một thương hiệu rạp phim")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping
    public BaseResponse<CinemaBrandResponse> create(@Valid @RequestBody CinemaBrandRequest request) {
        return BaseResponse.<CinemaBrandResponse>builder()
                .data(cinemaBrandService.create(request))
                .build();
    }

    @Operation(summary = "Get all cinema brands", description = "Lấy danh sách tất cả thương hiệu rạp phim")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fetched successfully")
    })
    @GetMapping
    public BaseResponse<List<CinemaBrandResponse>> getAll() {
        return BaseResponse.<List<CinemaBrandResponse>>builder()
                .data(cinemaBrandService.getAll())
                .build();
    }

    @Operation(summary = "Get brand by id", description = "Lấy danh sách tất cả thương hiệu rạp phim")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fetched successfully")
    })
    @GetMapping("/{id}")
    public BaseResponse<CinemaBrandResponse> getById(@PathVariable String id) {
        return BaseResponse.<CinemaBrandResponse>builder()
                .data(cinemaBrandService.getById(id))
                .build();
    }

    @Operation(summary = "Update cinema brand by ID", description = "Cập nhật thông tin thương hiệu theo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Updated successfully"),
            @ApiResponse(responseCode = "404", description = "Brand not found")
    })
    @PutMapping("/{id}")
    public BaseResponse<CinemaBrandResponse> update(
            @PathVariable String id,
            @Valid @RequestBody CinemaBrandRequest request
    ) {
        return BaseResponse.<CinemaBrandResponse>builder()
                .data(cinemaBrandService.updateById(id, request))
                .build();
    }

    @Operation(summary = "Delete cinema brand by ID", description = "Xóa thương hiệu rạp phim theo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deleted successfully"),
    })
    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable String id) {
        cinemaBrandService.delete(id);
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }

    @GetMapping("/{id}/fnbs")
    public BaseResponse<List<FnbItemResponse>> getFnbs(@PathVariable String id) {
        return BaseResponse.<List<FnbItemResponse>>builder()
                .data(fnbItemService.getByBrandId(id))
                .build();
    }
}
