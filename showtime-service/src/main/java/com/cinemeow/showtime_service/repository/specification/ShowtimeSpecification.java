package com.cinemeow.showtime_service.repository.specification;

import com.cinemeow.showtime_service.entity.Showtime;
import com.cinemeow.showtime_service.enums.ShowtimeStatus;
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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class ShowtimeSpecification implements Specification<Showtime> {
    SpecSearchCriteria criteria;

    @Override
    public Predicate toPredicate(
            @NotNull final Root<Showtime> root,
            @NotNull final CriteriaQuery<?> query,
            @NotNull final CriteriaBuilder builder
    ) {
        String key = criteria.getKey();
        Object value = criteria.getValue();

        if ("status".equalsIgnoreCase(key)) {
            try {
                ShowtimeStatus status = ShowtimeStatus.valueOf(value.toString().toUpperCase());
                return switch (criteria.getOperation()) {
                    case EQUALITY -> builder.equal(root.get(key), status);
                    case NEGATION -> builder.notEqual(root.get(key), status);
                    default -> builder.conjunction();
                };
            } catch (IllegalArgumentException ex) {
                return builder.disjunction();
            }
        }

        if ("startTime".equalsIgnoreCase(key)) {
            LocalDateTime dateTime;
            try {
                dateTime = LocalDateTime.parse(value.toString());
            } catch (Exception ex) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                dateTime = LocalDateTime.parse(value.toString(), formatter);
            }

            return switch (criteria.getOperation()) {
                case EQUALITY -> builder.equal(root.get(key), dateTime);
                case GREATER_THAN -> builder.greaterThan(root.get(key), dateTime);
                case LESS_THAN -> builder.lessThan(root.get(key), dateTime);
                default -> builder.conjunction();
            };
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
