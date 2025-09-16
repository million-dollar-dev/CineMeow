import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'cinema';

export const roomApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRooms: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/rooms`,
            }),
        }),

        createRoom: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/rooms`,
                method: "POST",
                body: payload,
            }),
        }),

        updateRoom: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/rooms/${id}`,
                method: "PUT",
                body: payload,
            }),
        }),
    }),
});

export const { useGetAllRoomsQuery, useCreateRoomMutation, useUpdateRoomMutation } = roomApi;