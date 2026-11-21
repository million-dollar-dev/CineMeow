package com.cinemeow.booking_service.service.impl;

import com.cinemeow.booking_service.client.CinemaClient;
import com.cinemeow.booking_service.client.NotificationClient;
import com.cinemeow.booking_service.client.PaymentClient;
import com.cinemeow.booking_service.client.ShowtimeClient;
import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.dto.request.FnbOrderRequest;
import com.cinemeow.booking_service.dto.request.InitPaymentRequest;
import com.cinemeow.booking_service.dto.request.SendMailRequest;
import com.cinemeow.booking_service.dto.response.*;
import com.cinemeow.booking_service.entity.*;
import com.cinemeow.booking_service.enums.BookingStatus;
import com.cinemeow.booking_service.enums.PaymentMethod;
import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.SeatStatus;
import com.cinemeow.booking_service.enums.SeatType;
import com.cinemeow.booking_service.enums.ShowtimeStatus;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import com.cinemeow.booking_service.mapper.BookingMapper;
import com.cinemeow.booking_service.repository.BookedSeatRepository;
import com.cinemeow.booking_service.repository.BookingRepository;
import com.cinemeow.booking_service.repository.specification.BookingSpecificationBuilder;
import com.cinemeow.booking_service.service.BookingService;
import com.cinemeow.booking_service.service.QrService;
import com.cinemeow.booking_service.service.TicketPriceService;
import com.cinemeow.booking_service.validator.SeatGapValidator;
import com.cinemeow.booking_service.validator.SeatPosition;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingServiceImpl implements BookingService {
    BookingRepository bookingRepository;

    BookedSeatRepository bookedSeatRepository;

    BookingMapper bookingMapper;

    RabbitTemplate rabbitTemplate;

    ShowtimeClient showtimeClient;

    CinemaClient cinemaClient;
    
    SeatGapValidator seatGapValidator;

    @Override
    public List<ShowtimeSeatResponse> getShowtimeSeats(String showtimeId) {
        LocalDateTime expireThreshold = LocalDateTime.now().minusMinutes(10);
        List<BookedSeat> activeBookedSeats = bookedSeatRepository.findActiveBookedSeatsByShowtime(showtimeId, expireThreshold);

        Map<Long, ShowtimeSeatResponse> responseMap = new HashMap<>();
        for (BookedSeat bs : activeBookedSeats) {
            Booking booking = bs.getBooking();
            SeatStatus status = (booking.getStatus() == BookingStatus.PAID)
                    ? SeatStatus.BOOKED
                    : SeatStatus.LOCKED;

            LocalDateTime reservedUntil = (status == SeatStatus.LOCKED && booking.getCreatedAt() != null)
                    ? booking.getCreatedAt().plusMinutes(10)
                    : null;

            ShowtimeSeatResponse existing = responseMap.get(bs.getSeatId());
            if (existing == null || existing.getStatus() != SeatStatus.BOOKED) {
                responseMap.put(bs.getSeatId(), ShowtimeSeatResponse.builder()
                        .seatId(bs.getSeatId())
                        .label(bs.getSeatLabel())
                        .status(status)
                        .reservedUntil(reservedUntil)
                        .build());
            }
        }
        return new ArrayList<>(responseMap.values());
    }

    @Override
    public BookingResponse create(BookingRequest request) {
        ShowtimeResponse showtime = showtimeClient.getById(request.getShowtimeId()).getData();

        if (showtime == null || showtime.getStatus() != ShowtimeStatus.AVAILABLE)
            throw new AppException(ErrorCode.SHOWTIME_NOT_AVAILABLE);

        BaseResponse<SeatMapResponse> seatMapResponse = cinemaClient.getSeatMap(showtime.getRoomId());
        if (seatMapResponse == null || seatMapResponse.getData() == null || seatMapResponse.getData().getSeats() == null) {
            throw new AppException(ErrorCode.ROOM_NOT_EXISTED);
        }

        List<SeatResponse> roomSeats = seatMapResponse.getData().getSeats();
        Map<Long, SeatResponse> physicalSeatMap = roomSeats.stream()
                .collect(Collectors.toMap(SeatResponse::getId, s -> s));

        for (Long seatId : request.getSeatIds()) {
            SeatResponse seat = physicalSeatMap.get(seatId);
            if (seat == null || seat.getType() == SeatType.EMPTY) {
                throw new AppException(ErrorCode.INVALID_SEAT);
            }
        }

        LocalDateTime expireThreshold = LocalDateTime.now().minusMinutes(10);
        List<BookedSeat> activeBookedSeats = bookedSeatRepository.findActiveBookedSeatsByShowtime(request.getShowtimeId(), expireThreshold);
        Map<Long, SeatStatus> occupiedSeatMap = new HashMap<>();
        for (BookedSeat bs : activeBookedSeats) {
            SeatStatus status = (bs.getBooking().getStatus() == BookingStatus.PAID)
                    ? SeatStatus.BOOKED
                    : SeatStatus.LOCKED;
            occupiedSeatMap.put(bs.getSeatId(), status);
        }

        for (Long seatId : request.getSeatIds()) {
            if (occupiedSeatMap.containsKey(seatId)) {
                throw new AppException(ErrorCode.INVALID_SEAT, "Seat " + seatId + " is already reserved or booked");
            }
        }

        List<SeatPosition> roomPositions = roomSeats.stream()
                .map(s -> SeatPosition.builder()
                        .seatId(s.getId())
                        .label(s.getLabel())
                        .rowIndex(s.getRowIndex())
                        .colIndex(s.getColIndex())
                        .type(s.getType())
                        .status(occupiedSeatMap.getOrDefault(s.getId(), SeatStatus.AVAILABLE))
                        .build())
                .toList();

        seatGapValidator.validate(roomPositions, new HashSet<>(request.getSeatIds()));

        Booking booking = bookingMapper.toBooking(request);
        booking.setStatus(BookingStatus.PENDING_PAYMENT);

        for (Long seatId : request.getSeatIds()) {
            SeatResponse seat = physicalSeatMap.get(seatId);
            BookedSeat bookedSeat = BookedSeat.builder()
                    .booking(booking)
                    .seatId(seat.getId())
                    .seatLabel(seat.getLabel())
                    .seatType(seat.getType())
                    .build();

            booking.getSeats().add(bookedSeat);
        }

        List<FnbOrderRequest> fnbItems = request.getFnbItems();
        if (fnbItems != null) {
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
        }

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
        return toDetailResponse(booking);
    }

    @Override
    public PagedResponse<List<BookingDetailResponse>> searchBookings(Pageable pageable, String[] filters) {
        Page<Booking> bookingPage;
        log.info("Search params: {}", Arrays.toString(filters));
        if (filters != null && filters.length > 0) {
            BookingSpecificationBuilder builder = new BookingSpecificationBuilder();

            Pattern pattern = Pattern.compile("(\\w+?)([:<>~!])(\\p{Punct})(.*)(\\p{Punct})");
            for (String filter : filters) {
                Matcher matcher = pattern.matcher(filter);

                if (matcher.find()) {
                    String key = matcher.group(1);
                    String operation = matcher.group(2);
                    String prefix = matcher.group(3);
                    String value = matcher.group(4);
                    String suffix = matcher.group(5);
                    if (value.isEmpty()) {
                        log.warn("Empty value in filter: {}", filter);
                        continue;
                    }
                    builder.with(null, key, operation, value, prefix, suffix);
                } else {
                    log.warn("Invalid filter format: {}", filter);
                }
            }
            Specification<Booking> spec = builder.build();
            bookingPage = bookingRepository.findAll(spec, pageable);
        } else {
            bookingPage = bookingRepository.findAll(pageable);
        }

        List<BookingDetailResponse> bookingResponses = bookingPage.stream()
                .map(this::toDetailResponse)
                .toList();

        return PagedResponse.<List<BookingDetailResponse>>builder()
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .totalPages(bookingPage.getTotalPages())
                .content(bookingResponses)
                .build();
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
        var booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        booking.setStatus(status);
        bookingRepository.save(booking);
    }

    @Override
    public void updatePaymentId(String bookingId, String paymentId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        booking.setPaymentId(paymentId);
        bookingRepository.save(booking);
    }

    @Transactional
    @Override
    public void confirmBooking(String bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_EXISTED));
        booking.setStatus(BookingStatus.PAID);
        bookingRepository.save(booking);

        rabbitTemplate.convertAndSend(
                "booking.exchange",
                "qr.process",
                booking
        );

        sendEmailConfirm(bookingId);
    }

    private void sendEmailConfirm(String bookingId) {
        BookingDetailResponse booking = getById(bookingId);

        Recipient recipient = Recipient.builder()
                .email(booking.getGuestInfo().getEmail())
                .name(booking.getGuestInfo().getName())
                .build();

        Map<String, Object> data = new HashMap<>();
        data.put("posterPath",  booking.getPosterPath());
        data.put("movieTitle",  booking.getMovieTitle());
        data.put("cinemaName",  booking.getCinemaName());
        data.put("roomName",  booking.getRoomName());
        data.put("startTime",  booking.getStartTime());
        data.put("seats",  booking.getSeats()
                .stream()
                .map(s -> s.getSeatLabel())
                .collect(Collectors.joining(", ")));
        data.put("totalPrice",  booking.getFinalPrice());
        data.put("qrCodeUrl", booking.getQrCodeUrl());
        SendMailRequest sendMailRequest = SendMailRequest.builder()
                .to(recipient)
                .data(data)
                .subject("Booking Confirmation")
                .templateName("confirm-booking")
                .build();

        rabbitTemplate.convertAndSend(
                "notification.exchange",
                "email.send",
                sendMailRequest);

    }

    private BookingDetailResponse toDetailResponse(Booking booking) {
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
}
