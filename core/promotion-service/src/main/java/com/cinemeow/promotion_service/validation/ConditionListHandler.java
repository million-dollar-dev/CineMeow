package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import com.cinemeow.promotion_service.entity.PromotionCondition;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@Order(8)
public class ConditionListHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        log.info("VoucherValidatorChain");
        for (PromotionCondition cond : promotion.getConditions()) {
            switch (cond.getType()) {
                case BRAND -> {
                    if (!cond.getValue().equalsIgnoreCase(request.getBrandName())) {
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Đơn hàng chỉ áp dụng cho thương hiệu: " + cond.getValue())
                                .build();
                    }
                }
                case SEAT_TYPE -> {
                    if (request.getSeats() == null)
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Vui lòng chọn ghế để kiểm tra điều kiện khuyến mãi")
                                .build();
                    boolean match = request.getSeats().stream()
                            .anyMatch(s -> s.getType().equals(cond.getValue()));
                    if (!match) {
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Đơn hàng chỉ áp dụng cho loại ghế: " + cond.getValue())
                                .build();
                    }
                }
                case ROOM_TYPE -> {
                    if (!cond.getValue().equals(request.getRoomType())) {
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Đơn hàng chỉ áp dụng cho loại phòng: " + cond.getValue())
                                .build();
                    }
                }
                case PAYMENT_METHOD -> {
                    if (request.getPaymentMethod() == null)
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Thiếu phương thức thanh toán để kiểm tra điều kiện khuyến mãi")
                                .build();
                    if (!cond.getValue().equalsIgnoreCase(request.getPaymentMethod())) {
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Đơn hàng chỉ áp dụng cho phương thức thanh toán: " + cond.getValue())
                                .build();
                    }
                }
                // Điều kiện theo ngày trong tuần
                case DAY_OF_WEEK -> {
                    LocalDateTime bookingTime = request.getBookingTime(); // bạn cần có field này trong request
                    if (bookingTime == null)
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Thiếu thời gian đặt vé để kiểm tra điều kiện khuyến mãi")
                                .build();

                    DayOfWeek currentDay = bookingTime.getDayOfWeek();
                    List<String> allowedDays = Arrays.stream(cond.getValue().split(","))
                            .map(String::trim)
                            .map(String::toUpperCase)
                            .toList();

                    if (!allowedDays.contains(currentDay.name())) {
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Khuyến mãi chỉ áp dụng vào các ngày: " + cond.getValue())
                                .build();
                    }
                }
                //Điều kiện theo khung giờ (ví dụ cond.value = "09:00-17:00")
                case TIME_RANGE -> {
                    LocalDateTime bookingTime = request.getBookingTime();
                    if (bookingTime == null)
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Thiếu thời gian đặt vé để kiểm tra khung giờ khuyến mãi")
                                .build();

                    try {
                        String[] parts = cond.getValue().split("-");
                        LocalTime start = LocalTime.parse(parts[0]);
                        LocalTime end = LocalTime.parse(parts[1]);
                        LocalTime now = bookingTime.toLocalTime();

                        boolean inRange = !now.isBefore(start) && !now.isAfter(end);

                        if (!inRange) {
                            return VoucherValidationResponse.builder()
                                    .valid(false)
                                    .message("Khuyến mãi chỉ áp dụng trong khung giờ " + cond.getValue())
                                    .build();
                        }
                    } catch (Exception e) {
                        return VoucherValidationResponse.builder()
                                .valid(false)
                                .message("Giá trị TIME_RANGE không hợp lệ: " + cond.getValue())
                                .build();
                    }
                }
            }
        }
        return next(promotion, request);
    }
}
