package com.cinemeow.booking_service.service;

import com.cinemeow.booking_service.dto.request.TicketPriceRequest;
import com.cinemeow.booking_service.dto.response.TicketPriceResponse;

import java.util.List;

public interface TicketPriceService {
    TicketPriceResponse create(TicketPriceRequest request);
    List<TicketPriceResponse> getAll();
    TicketPriceResponse getById(String id);
    TicketPriceResponse update(String id, TicketPriceRequest request);
    void delete(String id);
    List<TicketPriceResponse> getByBrandId(String brandId);
}
