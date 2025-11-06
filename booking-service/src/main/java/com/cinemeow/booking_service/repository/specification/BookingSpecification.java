package com.cinemeow.booking_service.repository.specification;

import com.cinemeow.booking_service.entity.Booking;
import com.cinemeow.booking_service.enums.BookingStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.Specification;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class BookingSpecification implements Specification<Booking> {
    SpecSearchCriteria criteria;

    @Override
    public Predicate toPredicate(
            @NotNull final Root<Booking> root,
            @NotNull final CriteriaQuery<?> query,
            @NotNull final CriteriaBuilder builder
    ) {
        String key = criteria.getKey();
        Object value = criteria.getValue();

        if ("status".equalsIgnoreCase(key)) {
            try {
                BookingStatus status = BookingStatus.valueOf(value.toString().toUpperCase());
                return switch (criteria.getOperation()) {
                    case EQUALITY -> builder.equal(root.get(key), status);
                    case NEGATION -> builder.notEqual(root.get(key), status);
                    default -> builder.conjunction();
                };
            } catch (IllegalArgumentException ex) {
                return builder.disjunction();
            }
        }

        return switch (criteria.getOperation()) {
            case EQUALITY -> builder.equal(root.get(key), value);
            case NEGATION -> builder.notEqual(root.get(key), value);
            case GREATER_THAN -> builder.greaterThan(root.get(key), value.toString());
            case LESS_THAN -> builder.lessThan(root.get(key), value.toString());
            case LIKE -> builder.like(root.get(key), value.toString());
            case STARTS_WITH -> builder.like(root.get(key), value.toString() + "%");
            case ENDS_WITH -> builder.like(root.get(key), "%" + value.toString());
            case CONTAINS -> builder.like(root.get(key), "%" + value.toString() + "%");
        };
    }

}
