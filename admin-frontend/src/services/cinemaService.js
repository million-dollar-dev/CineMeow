import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'cinema';

export const brandApi = rootApi.injectEndpoints({
    tagTypes: ["Cinemas", "Rooms", "FnBs"],
    endpoints: (builder) => ({
        getAllCinemas: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/cinemas`,
            }),
            providesTags: ["Cinemas"],
        }),

        createCinema: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/cinemas`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Cinemas"],
        }),

        updateCinema: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/cinemas/detail/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["Cinemas"],
        }),

        getRooms: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/cinemas/${id}/rooms`,
            }),
            providesTags: (result, error, id) => [{ type: "Rooms", id }],
        }),

        createRoom: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/rooms`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: (result, error, { cinemaId }) => [
                { type: "Rooms", id: cinemaId },
            ],
        }),

        updateRoom: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/rooms/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: (result, error, { cinemaId }) => [
                { type: "Rooms", id: cinemaId },
            ],
        }),

        getSeatMap: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/rooms/${id}/seats`,
            }),
            providesTags: (result, error, id) => [{ type: "SeatMap", id }],
        }),

        updateSeatMap: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/rooms/${id}/seats`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "SeatMap", id }],
        }),

        getAllFnBs: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/fnbs`,
            }),
            providesTags: ["FnBs"],
        }),

        createFnB: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/fnbs`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["FnBs"],
        }),

        updateFnB: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/fnbs/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["FnBs"],
        }),
    }),
});

export const {
    useGetAllCinemasQuery,
    useCreateCinemaMutation,
    useUpdateCinemaMutation,
    useGetRoomsQuery,
    useCreateRoomMutation,
    useUpdateRoomMutation,
    useGetSeatMapQuery,
    useUpdateSeatMapMutation,
    useCreateFnBMutation,
    useGetAllFnBsQuery,
    useUpdateFnBMutation,
} = brandApi;