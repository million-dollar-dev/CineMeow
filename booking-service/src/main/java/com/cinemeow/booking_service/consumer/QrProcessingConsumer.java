package com.cinemeow.booking_service.consumer;

import com.cinemeow.booking_service.entity.Booking;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import com.cinemeow.booking_service.repository.BookingRepository;
import com.cinemeow.booking_service.service.QrService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QrProcessingConsumer {
    BookingRepository bookingRepository;
    QrService qrService;
    RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = "qr.processing.queue")
    public void processQr(Booking booking) {
        log.info("[RabbitMQ] Received QR Message from Booking Queue: {}", booking.getId());
        String qrToken = qrService.generateQRCode(booking.getId());
        String qrImageUrl = qrService.generateQrImage(qrToken);

        booking.setQrToken(qrToken);
        booking.setQrCodeUrl(qrImageUrl);
        bookingRepository.save(booking);
    }
}
