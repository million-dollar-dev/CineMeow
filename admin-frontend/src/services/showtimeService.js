import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'showtime';

export const showtimeApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllShowtimes: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/showtimes`,
            }),
        }),

        createShowtime: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/showtimes`,
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const {
    useGetAllShowtimesQuery,
    useCreateShowtimeMutation,
} = showtimeApi;