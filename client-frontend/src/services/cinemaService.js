import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'cinema';

export const brandApi = rootApi.injectEndpoints({
    tagTypes: ["Cinemas", "Rooms"],
    endpoints: (builder) => ({
        getAllCinemas: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/cinemas`,
            }),
            providesTags: ["Cinemas"],
        }),

        getRooms: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/cinemas/${id}/rooms`,
            }),
            providesTags: (result, error, id) => [{ type: "Rooms", id }],
        }),

        getSeatMap: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/rooms/${id}/seats`,
            }),
            providesTags: (result, error, id) => [{ type: "SeatMap", id }],
        }),
    }),
});

export const {
    useGetAllCinemasQuery,
    useGetRoomsQuery,
    useGetSeatMapQuery,
} = brandApi;