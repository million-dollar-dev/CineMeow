package com.cinemeow.booking_service.config;

import com.cinemeow.booking_service.client.CinemaClient;
import com.cinemeow.booking_service.dto.response.CinemaBrandResponse;
import com.cinemeow.booking_service.entity.TicketPrice;
import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.SeatType;
import com.cinemeow.booking_service.repository.TicketPriceRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PriceInitConfig {
    CinemaClient cinemaClient;
    TicketPriceRepository ticketPriceRepository;

    @NonFinal
    Long DEFAULT_PRICE = 100000L;

    @Bean
    public ApplicationRunner initDataRunner() {
        return args -> {
            List<CinemaBrandResponse> brands = cinemaClient.getAll().getData();

            if (brands.isEmpty()) {
                log.info("No cinema brands found");
                return;
            }

            List<RoomType> roomTypes = Arrays.asList(RoomType._2D, RoomType._3D, RoomType._IMAX, RoomType._4DX);
            List<SeatType> seatTypes = Arrays.asList(SeatType.NORMAL, SeatType.COUPLE);

            for (CinemaBrandResponse brand : brands) {
                for (RoomType roomType : roomTypes) {
                    for (SeatType seatType : seatTypes) {

                        boolean exists = ticketPriceRepository.existsByBrandIdAndRoomTypeAndSeatType(
                                brand.getId(), roomType, seatType
                        );

                        if (!exists) {
                            BigDecimal defaultPrice = BigDecimal.valueOf(DEFAULT_PRICE);

                            TicketPrice price = TicketPrice.builder()
                                    .brandId(brand.getId())
                                    .roomType(roomType)
                                    .seatType(seatType)
                                    .price(defaultPrice)
                                    .build();

                            ticketPriceRepository.save(price);

                            log.info("✅ Init price for brand %s: %s - %s = %s₫%n",
                                    brand.getName(), roomType, seatType, defaultPrice);
                        }
                    }
                }
            }

            log.info("Ticket price initialization completed!");
        };
    }


}
