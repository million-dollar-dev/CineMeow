package com.cinemeow.payment_service.client;


import com.cinemeow.payment_service.enums.BookingStatus;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "booking-service",
        url = "${app.services.booking-service}",
        path = "/bookings"
)
public interface BookingClient {
    @PutMapping("/{id}/status")
    void updateStatus(@PathVariable String id, @RequestBody BookingStatus status);

    @PutMapping("/{id}/payment")
    void updatePayment(@PathVariable String id, @RequestBody String paymentId);

    @PostMapping("/{id}/confirm")
    void confirmBooking(@PathVariable String id);
}
