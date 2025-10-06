package com.cinemeow.cinema_service.dto.request;

import com.cinemeow.cinema_service.entity.CinemaBrand;
import com.cinemeow.cinema_service.enums.FnbCategory;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FnbItemRequest {
    @NotBlank(message = "Brand id must not be blank")
    String brandId;

    @NotBlank(message = "Name must not be blank")
    String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    String description;

    @NotBlank(message = "Image's url must not be blank")
    String imageUrl;

    BigDecimal price;

    boolean available;

    @NotNull(message = "Category must not be null")
    FnbCategory category;
}
