import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'movie';

export const movieApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllMovies: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/movies`,
                params: {
                    sortBy: "status:asc",
                },
            }),
        }),
    }),
});

export const { useGetAllMoviesQuery } = movieApi;