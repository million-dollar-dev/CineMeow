package com.cinemeow.movie_service.repository.specification;

import com.cinemeow.movie_service.entity.Movie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import static com.cinemeow.movie_service.repository.specification.SearchOperation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class MovieSpecificationBuilder {
    public final List<SpecSearchCriteria> params;

    public MovieSpecificationBuilder() {
        params = new ArrayList<>();
    }

    public MovieSpecificationBuilder with(final String key, final String operation, final Object value, final String prefix, final String suffix) {
        return with(null, key, operation, value, prefix, suffix);
    }

    public MovieSpecificationBuilder with(final String orPredicate, final String key, final String operation, final Object value, final String prefix, final String suffix) {
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

    public Specification<Movie> build() {
        if (params.isEmpty())
            return null;

        Specification<Movie> result = new MovieSpecification(params.get(0));

        for (int i = 1; i < params.size(); i++) {
            MovieSpecification spec = new MovieSpecification(params.get(i));
            result = params.get(i).isOrPredicate()
                    ? result.or(spec)
                    : result.and(spec);
        }
        return result;
    }


    public MovieSpecificationBuilder with(MovieSpecification spec) {
        params.add(spec.getCriteria());
        return this;
    }

    public MovieSpecificationBuilder with(SpecSearchCriteria criteria) {
        params.add(criteria);
        return this;
    }
}
