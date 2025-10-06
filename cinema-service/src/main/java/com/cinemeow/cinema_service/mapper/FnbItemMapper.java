package com.cinemeow.cinema_service.mapper;

import com.cinemeow.cinema_service.dto.request.FnbItemRequest;
import com.cinemeow.cinema_service.dto.response.FnbItemResponse;
import com.cinemeow.cinema_service.entity.FnbItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FnbItemMapper {
    @Mapping(target = "cinemaBrand", ignore = true)
    FnbItem toFnbItem(FnbItemRequest request);

    FnbItemResponse toFnbItemResponse(FnbItem fnbItem);

    @Mapping(target = "cinemaBrand", ignore = true)
    void updateFnbItem(@MappingTarget FnbItem item, FnbItemRequest request);
}
