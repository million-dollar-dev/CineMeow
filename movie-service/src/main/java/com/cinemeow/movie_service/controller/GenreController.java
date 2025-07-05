package com.cinemeow.movie_service.controller;

import com.cinemeow.movie_service.dto.request.GenreRequest;
import com.cinemeow.movie_service.dto.response.BaseResponse;
import com.cinemeow.movie_service.dto.response.GenreResponse;
import com.cinemeow.movie_service.service.GenreService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/genres")
public class GenreController {
    GenreService genreService;

    @PostMapping
    public BaseResponse<GenreResponse> create(@Valid @RequestBody GenreRequest request){
        return BaseResponse.<GenreResponse>builder()
                .data(genreService.create(request))
                .build();
    }

    @GetMapping
    public BaseResponse<List<GenreResponse>> getAll(){
        return BaseResponse.<List<GenreResponse>>builder()
                .data(genreService.getAll())
                .build();
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable Integer id){
        genreService.deleteById(id);
        return BaseResponse.<Void>builder()
                .message("Deleted Successfully!")
                .build();
    }
}
