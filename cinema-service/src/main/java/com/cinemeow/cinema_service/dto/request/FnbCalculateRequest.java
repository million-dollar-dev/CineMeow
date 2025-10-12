package com.cinemeow.cinema_service.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FnbCalculateRequest {

    @NotBlank(message = "Brand ID is required")
    String brandId;

    @NotEmpty(message = "At least one FNB item must be selected")
    List<SelectedFnbItem> items;

    @Data
    public static class SelectedFnbItem {
        @NotBlank(message = "FNB item ID is required")
        private String fnbItemId;

        @Min(value = 1, message = "Quantity must be at least 1")
        private int quantity;
    }
}

