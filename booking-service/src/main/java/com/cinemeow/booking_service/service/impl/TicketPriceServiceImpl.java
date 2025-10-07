package com.cinemeow.booking_service.service.impl;

import com.cinemeow.booking_service.client.CinemaClient;
import com.cinemeow.booking_service.dto.request.TicketPriceRequest;
import com.cinemeow.booking_service.dto.response.CinemaBrandResponse;
import com.cinemeow.booking_service.dto.response.TicketPriceResponse;
import com.cinemeow.booking_service.entity.TicketPrice;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import com.cinemeow.booking_service.mapper.TicketPriceMapper;
import com.cinemeow.booking_service.repository.TicketPriceRepository;
import com.cinemeow.booking_service.service.TicketPriceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TicketPriceServiceImpl implements TicketPriceService {
    TicketPriceRepository ticketPriceRepository;
    TicketPriceMapper ticketPriceMapper;
    CinemaClient cinemaClient;

    @Override
    public TicketPriceResponse create(TicketPriceRequest request) {
        var ticketPrice = ticketPriceMapper.toTicketPrice(request);
        ticketPriceRepository.save(ticketPrice);
        return enrichWithBrandInfo(ticketPrice);
    }

    @Override
    public List<TicketPriceResponse> getAll() {
        return ticketPriceRepository.findAll().stream()
                .map(s -> enrichWithBrandInfo(s))
                .toList();
    }

    @Override
    public TicketPriceResponse getById(String id) {
        var ticketPrice = ticketPriceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_PRICE_NOT_EXISTED));
        return enrichWithBrandInfo(ticketPrice);
    }

    @Override
    public TicketPriceResponse update(String id, TicketPriceRequest request) {
        var ticketPrice = ticketPriceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_PRICE_NOT_EXISTED));
        ticketPriceMapper.update(ticketPrice, request);
        return enrichWithBrandInfo(ticketPrice);
    }

    @Override
    public void delete(String id) {
        ticketPriceRepository.deleteById(id);
    }

    private TicketPriceResponse enrichWithBrandInfo(TicketPrice ticketPrice) {
        var response  = ticketPriceMapper.toTicketPriceResponse(ticketPrice);
        CinemaBrandResponse brand = cinemaClient.getBrandById(response.getBrandId()).getData();
        response.setBrandName(brand.getName());
        response.setLogoUrl(brand.getLogoUrl());
        return response;
    }
}
