package com.cinemeow.cinema_service.dto.response;

import com.cinemeow.cinema_service.entity.CinemaBrand;
import com.cinemeow.cinema_service.enums.FnbCategory;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FnbItemResponse {
    String id;

    CinemaBrand cinemaBrand;

    String name;

    String description;

    String imageUrl;

    boolean available;

    BigDecimal price;

    @Enumerated(EnumType.STRING)
    FnbCategory category;
}
