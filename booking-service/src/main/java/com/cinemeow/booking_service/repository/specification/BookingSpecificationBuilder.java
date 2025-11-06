package com.cinemeow.booking_service.repository.specification;

import com.cinemeow.booking_service.entity.Booking;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

import static com.cinemeow.booking_service.repository.specification.SearchOperation.*;

@Slf4j
public class BookingSpecificationBuilder {
    public final List<SpecSearchCriteria> params;

    public BookingSpecificationBuilder() {
        params = new ArrayList<>();
    }

    public BookingSpecificationBuilder with(final String key, final String operation, final Object value, final String prefix, final String suffix) {
        return with(null, key, operation, value, prefix, suffix);
    }

    public BookingSpecificationBuilder with(final String orPredicate, final String key, final String operation, final Object value, final String prefix, final String suffix) {
        SearchOperation searchOperation = SearchOperation.getSimpleOperation(operation.charAt(0));
        if (searchOperation != null) {
            if (searchOperation == EQUALITY) { // the operation may be complex operation
                final boolean startWithAsterisk = prefix != null && prefix.contains(ZERO_OR_MORE_REGEX);
                final boolean endWithAsterisk = suffix != null && suffix.contains(ZERO_OR_MORE_REGEX);

                if (startWithAsterisk && endWithAsterisk) {
                    searchOperation = SearchOperation.CONTAINS;
                } else if (startWithAsterisk) {
                    searchOperation = ENDS_WITH;
                } else if (endWithAsterisk) {
                    searchOperation = STARTS_WITH;
                }
            }
            log.info("Search operation: {}", searchOperation);
            params.add(new SpecSearchCriteria(orPredicate, key, searchOperation, value));
        }
        return this;
    }

    public Specification<Booking> build() {
        if (params.isEmpty())
            return null;

        Specification<Booking> result = new BookingSpecification(params.get(0));

        for (int i = 1; i < params.size(); i++) {
            BookingSpecification spec = new BookingSpecification(params.get(i));
            result = params.get(i).isOrPredicate()
                    ? result.or(spec)
                    : result.and(spec);
        }
        return result;
    }


    public BookingSpecificationBuilder with(BookingSpecification spec) {
        params.add(spec.getCriteria());
        return this;
    }

    public BookingSpecificationBuilder with(SpecSearchCriteria criteria) {
        params.add(criteria);
        return this;
    }
}
