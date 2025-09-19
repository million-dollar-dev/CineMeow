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
    }),
});

export const {
    useGetAllCinemasQuery,
    useCreateCinemaMutation,
    useUpdateCinemaMutation,
    useGetRoomsQuery,
    useCreateRoomMutation,
    useUpdateRoomMutation
} = brandApi;