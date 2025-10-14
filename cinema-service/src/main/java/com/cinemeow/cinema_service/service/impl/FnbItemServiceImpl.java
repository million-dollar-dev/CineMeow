package com.cinemeow.cinema_service.service.impl;

import com.cinemeow.cinema_service.dto.request.FnbCalculateRequest;
import com.cinemeow.cinema_service.dto.request.FnbItemRequest;
import com.cinemeow.cinema_service.dto.response.FnbCalculateResponse;
import com.cinemeow.cinema_service.dto.response.FnbItemResponse;
import com.cinemeow.cinema_service.entity.FnbItem;
import com.cinemeow.cinema_service.exception.AppException;
import com.cinemeow.cinema_service.exception.ErrorCode;
import com.cinemeow.cinema_service.mapper.FnbItemMapper;
import com.cinemeow.cinema_service.repository.CinemaBrandRepository;
import com.cinemeow.cinema_service.repository.FnbItemRepository;
import com.cinemeow.cinema_service.service.CinemaBrandService;
import com.cinemeow.cinema_service.service.FnbItemService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FnbItemServiceImpl implements FnbItemService {
    FnbItemMapper fnbItemMapper;
    FnbItemRepository fnbItemRepository;
    CinemaBrandRepository cinemaBrandRepository;

    @Override
    public FnbItemResponse creat(FnbItemRequest request) {
        var fnbItem = fnbItemMapper.toFnbItem(request);
        var brand = cinemaBrandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED));
        fnbItem.setCinemaBrand(brand);
        fnbItemRepository.save(fnbItem);
        return fnbItemMapper.toFnbItemResponse(fnbItem);
    }

    @Override
    public List<FnbItemResponse> getAll() {
        return fnbItemRepository.findAll().stream()
                .map(fnbItemMapper::toFnbItemResponse)
                .toList();
    }

    @Override
    public List<FnbItemResponse> getByBrandId(String brandId) {
        var brand = cinemaBrandRepository.findById(brandId)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED));
        return getAll().stream()
                .filter(s -> s.getCinemaBrand().getId().equals(brand.getId()))
                .toList();
    }

    @Override
    public FnbItemResponse getById(String id) {
        var  fnbItem = fnbItemRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FNB_ITEM_NOT_EXISTED));
        return fnbItemMapper.toFnbItemResponse(fnbItem);
    }

    @Override
    public FnbItemResponse updateById(String id, FnbItemRequest request) {
        var  fnbItem = fnbItemRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FNB_ITEM_NOT_EXISTED));
        var brand = cinemaBrandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED));
        fnbItemMapper.updateFnbItem(fnbItem, request);
        fnbItem.setCinemaBrand(brand);
        fnbItemRepository.save(fnbItem);
        return fnbItemMapper.toFnbItemResponse(fnbItem);
    }

    @Override
    public void deleteById(String id) {
        fnbItemRepository.deleteById(id);
    }

    @Override
    public FnbCalculateResponse calculate(FnbCalculateRequest request) {
        BigDecimal total = BigDecimal.ZERO;
        List<FnbCalculateResponse.ItemDetail> details = new ArrayList<>();

        for (FnbCalculateRequest.SelectedFnbItem item : request.getItems()) {
            FnbItem fnb = fnbItemRepository.findByIdAndBrandId(item.getFnbItemId(), request.getBrandId())
                    .orElseThrow(() -> new AppException(ErrorCode.FNB_ITEM_NOT_EXISTED));

            BigDecimal subtotal = fnb.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

            FnbCalculateResponse.ItemDetail detail = FnbCalculateResponse.ItemDetail
                    .builder()
                    .id(fnb.getId())
                    .name(fnb.getName())
                    .quantity(item.getQuantity())
                    .unitPrice(fnb.getPrice())
                    .subtotal(subtotal)
                    .build();

            details.add(detail);

            total = total.add(subtotal);
        }

        return FnbCalculateResponse.builder()
                .items(details)
                .totalPrice(total)
                .build();
    }

    @Override
    public BigDecimal calculate(Map<String, Integer> items) {
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (Map.Entry<String, Integer> entry : items.entrySet()) {
            var aItem = fnbItemRepository.findById(entry.getKey())
                    .orElseThrow(() -> new AppException(ErrorCode.FNB_ITEM_NOT_EXISTED));
            BigDecimal subtotal = aItem.getPrice().multiply(BigDecimal.valueOf(entry.getValue()));
            totalPrice = totalPrice.add(subtotal);
        }
        return totalPrice;
    }
}
