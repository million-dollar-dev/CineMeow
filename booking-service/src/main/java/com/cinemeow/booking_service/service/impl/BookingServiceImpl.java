package com.cinemeow.booking_service.service.impl;

import com.cinemeow.booking_service.client.CinemaClient;
import com.cinemeow.booking_service.client.ShowtimeClient;
import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.dto.request.FnbOrderRequest;
import com.cinemeow.booking_service.dto.response.BookingResponse;
import com.cinemeow.booking_service.dto.response.SeatResponse;
import com.cinemeow.booking_service.dto.response.ShowtimeResponse;
import com.cinemeow.booking_service.entity.Booking;
import com.cinemeow.booking_service.enums.BookingStatus;
import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.ShowtimeStatus;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import com.cinemeow.booking_service.mapper.BookingMapper;
import com.cinemeow.booking_service.repository.BookingRepository;
import com.cinemeow.booking_service.service.BookingService;
import com.cinemeow.booking_service.service.TicketPriceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingServiceImpl implements BookingService {
    BookingRepository bookingRepository;
    BookingMapper bookingMapper;

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

        BigDecimal totalPrice = getTicketPrice(request.getSeatIds(), showtime)
                .add(getFnbPrice(request.getFnbItems()));

        Booking booking = bookingMapper.toBooking(request);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING_PAYMENT);






        return null;
    }

    @Override
    public List<BookingResponse> getAll() {
        return List.of();
    }

    @Override
    public List<BookingResponse> getById(String id) {
        return List.of();
    }

    @Override
    public BookingResponse update(String id, BookingRequest bookingRequest) {
        return null;
    }

    @Override
    public void delete(String id) {

    }

    private BigDecimal getTicketPrice(List<Long> seatIds, ShowtimeResponse showtime) {
        return ticketPriceService.calculatePrice(seatIds, showtime.getBrandId(), showtime.getRoomType());
    }

    private BigDecimal getFnbPrice(List<FnbOrderRequest> fnbItems) {
        Map<String, Integer> items = new HashMap<>();
        for (FnbOrderRequest fnbItem : fnbItems) {
            items.put(fnbItem.getFnbItemId(), fnbItem.getQuantity());
        }
        return cinemaClient.calculate(items);
    }
}
