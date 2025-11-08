package com.cinemeow.booking_service.entity;

import com.cinemeow.booking_service.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "user_id")
    String userId;

    @Column(name = "showtime_id", nullable = false)
    String showtimeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    BookingStatus status;

    @Column(name = "total_price")
    BigDecimal totalPrice;

    @Column(name = "discount_amount")
    BigDecimal discountAmount;

    @Column(name = "final_price")
    BigDecimal finalPrice;

    @Column(name = "voucher_code")
    String voucherCode;

    @Column(name = "payment_id")
    String paymentId;

    @Embedded
    GuestInfo guestInfo;

    @Builder.Default
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    List<BookedSeat> seats = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    List<BookedFnbItem> fnbItems = new ArrayList<>();

    @Lob
    @Column(name = "qr_token")
    String qrToken;

    @Lob
    @Column(name = "qr_code_url")
    String qrCodeUrl;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;
}
