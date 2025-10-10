package com.cinemeow.booking_service.dto.response;

import com.cinemeow.booking_service.entity.BookedFnbItem;
import com.cinemeow.booking_service.entity.BookedSeat;
import com.cinemeow.booking_service.entity.GuestInfo;
import com.cinemeow.booking_service.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    String id;

    String userId;

    String showtimeId;

    BookingStatus status;

    BigDecimal totalPrice;

    BigDecimal discountAmount;

    BigDecimal finalPrice;

    String voucherCode;

    String paymentId;

    @Embedded
    GuestInfo guestInfo;

    List<BookedSeat> seats;

    List<BookedFnbItem> fnbItems;

    LocalDateTime createdAt;
}
