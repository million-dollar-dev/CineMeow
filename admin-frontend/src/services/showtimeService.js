import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'showtime';

export const showtimeApi = rootApi.injectEndpoints({
    tagTypes: ["Showtimes"],
    endpoints: (builder) => ({
        getAllShowtimes: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/showtimes`,
            }),
            providesTags: ["Showtimes"],
        }),

        createShowtime: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/showtimes`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Showtimes"],
        }),

        updateShowtime: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/showtimes/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["Showtimes"],
        }),
    }),
});

export const {
    useGetAllShowtimesQuery,
    useCreateShowtimeMutation,
    useUpdateShowtimeMutation,
} = showtimeApi;