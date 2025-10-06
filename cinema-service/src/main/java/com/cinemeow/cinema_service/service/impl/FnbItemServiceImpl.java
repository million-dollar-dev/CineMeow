package com.cinemeow.cinema_service.service.impl;

import com.cinemeow.cinema_service.dto.request.FnbItemRequest;
import com.cinemeow.cinema_service.dto.response.FnbItemResponse;
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

import java.util.List;
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
}
