import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'movie';

export const movieApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllMovies: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/movies/all`,
            }),
        }),

        getMovie: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/movies/${id}`,
            }),
            transformResponse: (response) => response.data,
        }),

        searchMovies: builder.query({
            query: ({ page = 0, size = 10, sort, filters = [] }) => {
                const params = new URLSearchParams();

                params.append("page", page);
                params.append("size", size);

                if (sort) {
                    // ví dụ: "duration,asc"
                    params.append("sort", sort);
                }

                filters.forEach((f) => params.append("filters", f));

                return {
                    url: `${CONTEXT_PATH}/movies/search?${params.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data.content,
        }),
    }),
});

export const {
    useGetAllMoviesQuery,
    useSearchMoviesQuery,
    useGetMovieQuery,
} = movieApi;