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

        createMovie: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/movies`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Movies"],
        }),

        updateMovie: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/movies/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["Movies"],
        }),
    }),
});

export const { useGetAllMoviesQuery, useCreateMovieMutation, useUpdateMovieMutation } = movieApi;