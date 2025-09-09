import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'movie';

export const genreApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGenres: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/genres`,
            }),
        }),
    }),
});

export const { useGetAllGenresQuery } = genreApi;