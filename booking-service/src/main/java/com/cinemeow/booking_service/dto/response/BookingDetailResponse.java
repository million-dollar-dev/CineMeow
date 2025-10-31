package com.cinemeow.booking_service.dto.response;

import com.cinemeow.booking_service.entity.BookedFnbItem;
import com.cinemeow.booking_service.entity.BookedSeat;
import com.cinemeow.booking_service.entity.GuestInfo;
import com.cinemeow.booking_service.enums.BookingStatus;
import com.cinemeow.booking_service.enums.RoomType;
import jakarta.persistence.Embedded;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetailResponse {
    String id;

    String userId;

    String showtimeId;

    String movieTitle;

    String posterPath;

    String cinemaName;

    String roomName;

    RoomType roomType;

    String qrToken;

    String qrCodeUrl;

    LocalDateTime startTime;

    LocalDateTime endTime;

    BookingStatus status;

    BigDecimal totalPrice;

    BigDecimal discountAmount;

    BigDecimal finalPrice;

    String voucherCode;

    String paymentId;

    String paymentUrl;

    @Embedded
    GuestInfo guestInfo;

    List<BookedSeat> seats;

    List<BookedFnbItem> fnbItems;



    LocalDateTime createdAt;
}
