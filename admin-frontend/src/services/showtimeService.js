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
    }),
});

export const {
    useGetAllShowtimesQuery,
    useCreateShowtimeMutation,
} = showtimeApi;