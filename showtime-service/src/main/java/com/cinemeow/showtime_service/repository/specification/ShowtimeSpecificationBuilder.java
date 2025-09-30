package com.cinemeow.showtime_service.repository.specification;

import static com.cinemeow.showtime_service.repository.specification.SearchOperation.*;
import com.cinemeow.showtime_service.entity.Showtime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;



@Slf4j
public class ShowtimeSpecificationBuilder {
    public final List<SpecSearchCriteria> params;

    public ShowtimeSpecificationBuilder() {
        params = new ArrayList<>();
    }

    public ShowtimeSpecificationBuilder with(final String key, final String operation, final Object value, final String prefix, final String suffix) {
        return with(null, key, operation, value, prefix, suffix);
    }

    public ShowtimeSpecificationBuilder with(final String orPredicate, final String key, final String operation, final Object value, final String prefix, final String suffix) {
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

    public Specification<Showtime> build() {
        if (params.isEmpty())
            return null;

        Specification<Showtime> result = new ShowtimeSpecification(params.get(0));

        for (int i = 1; i < params.size(); i++) {
            ShowtimeSpecification spec = new ShowtimeSpecification(params.get(i));
            result = params.get(i).isOrPredicate()
                    ? result.or(spec)
                    : result.and(spec);
        }
        return result;
    }


    public ShowtimeSpecificationBuilder with(ShowtimeSpecification spec) {
        params.add(spec.getCriteria());
        return this;
    }

    public ShowtimeSpecificationBuilder with(SpecSearchCriteria criteria) {
        params.add(criteria);
        return this;
    }
}
