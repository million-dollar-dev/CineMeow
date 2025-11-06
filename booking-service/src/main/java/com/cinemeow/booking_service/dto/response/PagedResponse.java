package com.cinemeow.booking_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PagedResponse<T> {
    T content;
    int pageNo;
    int pageSize;
    long totalElements;
    int totalPages;
    boolean last;
}
