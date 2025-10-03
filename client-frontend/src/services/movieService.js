import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'movie';

export const movieApi = rootApi.injectEndpoints({
    tagTypes: ["Movies"],
    endpoints: (builder) => ({
        getAllMovies: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/movies/all`,
            }),
            providesTags: ["Movies"],
        }),
    }),
});

export const { useGetAllMoviesQuery } = movieApi;