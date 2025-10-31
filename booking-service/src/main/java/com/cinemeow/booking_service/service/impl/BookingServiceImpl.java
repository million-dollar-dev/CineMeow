package com.cinemeow.booking_service.service.impl;

import com.cinemeow.booking_service.client.CinemaClient;
import com.cinemeow.booking_service.client.PaymentClient;
import com.cinemeow.booking_service.client.ShowtimeClient;
import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.dto.request.FnbOrderRequest;
import com.cinemeow.booking_service.dto.request.InitPaymentRequest;
import com.cinemeow.booking_service.dto.response.BookingDetailResponse;
import com.cinemeow.booking_service.dto.response.BookingResponse;
import com.cinemeow.booking_service.dto.response.SeatResponse;
import com.cinemeow.booking_service.dto.response.ShowtimeResponse;
import com.cinemeow.booking_service.entity.BookedFnbItem;
import com.cinemeow.booking_service.entity.BookedSeat;
import com.cinemeow.booking_service.entity.Booking;
import com.cinemeow.booking_service.enums.BookingStatus;
import com.cinemeow.booking_service.enums.PaymentMethod;
import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.ShowtimeStatus;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import com.cinemeow.booking_service.mapper.BookingMapper;
import com.cinemeow.booking_service.repository.BookingRepository;
import com.cinemeow.booking_service.service.BookingService;
import com.cinemeow.booking_service.service.QrService;
import com.cinemeow.booking_service.service.TicketPriceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingServiceImpl implements BookingService {
    BookingRepository bookingRepository;
    BookingMapper bookingMapper;

    QrService qrService;
    TicketPriceService ticketPriceService;
    ShowtimeClient showtimeClient;
    CinemaClient cinemaClient;

    @Override
    public BookingResponse create(BookingRequest request) {
        ShowtimeResponse showtime = showtimeClient.getById(request.getShowtimeId()).getData();

        if (showtime.getStatus() != ShowtimeStatus.AVAILABLE)
            throw new AppException(ErrorCode.SHOWTIME_NOT_AVAILABLE);

        List<SeatResponse> seats = cinemaClient.checkAvailableSeats(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size())
            throw new AppException(ErrorCode.INVALID_SEAT);

        Booking booking = bookingMapper.toBooking(request);
        booking.setStatus(BookingStatus.PENDING_PAYMENT);

        seats.forEach(seat -> {
            BookedSeat bookedSeat = BookedSeat.builder()
                    .booking(booking)
                    .seatId(seat.getId())
                    .seatLabel(seat.getLabel())
                    .seatType(seat.getType())
                    .build();

            booking.getSeats().add(bookedSeat);
        });

        List<FnbOrderRequest> fnbItems = request.getFnbItems();
        fnbItems.forEach(item -> {
            BookedFnbItem bookedFnbItem = BookedFnbItem.builder()
                    .booking(booking)
                    .fnbItemId(item.getFnbItemId())
                    .fnbName(item.getName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getUnitPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build();
            booking.getFnbItems().add(bookedFnbItem);
        });



        bookingRepository.save(booking);

        BookingResponse response = bookingMapper.toBookingResponse(booking);

        return response;
    }

    @Override
    public List<BookingResponse> getAll() {
        return List.of();
    }

    @Override
    public BookingDetailResponse getById(String id) {
        var booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        String showtimeId = booking.getShowtimeId();
        ShowtimeResponse showtime = showtimeClient.getById(showtimeId).getData();
        var response = bookingMapper.toBookingDetailResponse(booking);
        response.setMovieTitle(showtime.getMovieTitle());
        response.setPosterPath(showtime.getPosterPath());
        response.setRoomName(showtime.getRoomName());
        response.setCinemaName(showtime.getCinemaName());
        response.setRoomType(showtime.getRoomType());
        response.setStartTime(showtime.getStartTime());
        response.setEndTime(showtime.getEndTime());
        return response;
    }

    @Override
    public BookingResponse update(String id, BookingRequest bookingRequest) {
        return null;
    }

    @Override
    public void delete(String id) {

    }

    @Override
    public void updateStatus(String id, BookingStatus status) {
        var booking =  bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        booking.setStatus(status);
        bookingRepository.save(booking);
    }

    @Override
    public void updatePaymentId(String bookingId, String paymentId) {
        var booking =  bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        booking.setPaymentId(paymentId);
        bookingRepository.save(booking);
    }

    @Override
    public void confirmBooking(String bookingId) {
        var booking =  bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        booking.setStatus(BookingStatus.PAID);

        String qrToken = qrService.generateQRCode(bookingId);
        String qrImageUrl = qrService.generateQrImage(qrToken);

        booking.setQrToken(qrToken);
        booking.setQrCodeUrl(qrImageUrl);

        bookingRepository.save(booking);

        List<Long> seatIds = booking.getSeats().stream()
                .map(s -> s.getSeatId())
                .toList();

        cinemaClient.confirmSeats(seatIds);
    }

}
