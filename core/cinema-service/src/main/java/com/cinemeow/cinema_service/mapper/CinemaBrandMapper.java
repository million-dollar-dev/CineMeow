package com.cinemeow.cinema_service.mapper;

import com.cinemeow.cinema_service.dto.request.CinemaBrandRequest;
import com.cinemeow.cinema_service.dto.response.CinemaBrandResponse;
import com.cinemeow.cinema_service.entity.CinemaBrand;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CinemaBrandMapper {
    CinemaBrand toCinemaBrand(CinemaBrandRequest request);
    CinemaBrandResponse toCinemaBrandResponse(CinemaBrand brand);
    void update(@MappingTarget CinemaBrand brand, CinemaBrandRequest request);
}
