package com.cinemeow.payment_service.entity;

import com.cinemeow.payment_service.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String bookingId;

    Double amount;

    @Enumerated(EnumType.STRING)
    PaymentMethod method;

    String status; // PENDING, SUCCESS, FAILED

    String transactionId;
}
