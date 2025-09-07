import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'movie';

export const genreApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGenres: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/genres`,
            }),
        }),

        introspect: builder.mutation({
            query: ({ token }) => ({
                url: `${CONTEXT_PATH}/auth/introspect`,
                method: "POST",
                body: { token },
            }),
        }),
    }),
});

export const { useGetAllGenresQuery } = genreApi;