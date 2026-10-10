import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'cinema';

export const cinemaApi = rootApi.injectEndpoints({
    tagTypes: ["Cinemas", "Rooms"],
    endpoints: (builder) => ({
        getAllCinemas: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/cinemas`,
            }),
            transformResponse: (response) => response?.data ?? response,
            providesTags: ["Cinemas"],
        }),

        getRooms: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/cinemas/${id}/rooms`,
            }),
            transformResponse: (response) => response?.data ?? response,
        }),

        getSeatMap: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/rooms/${id}/seats`,
            }),
            transformResponse: (response) => response?.data ?? response,
        }),
    }),
});

export const {
    useGetAllCinemasQuery,
    useGetRoomsQuery,
    useGetSeatMapQuery,
} = cinemaApi;