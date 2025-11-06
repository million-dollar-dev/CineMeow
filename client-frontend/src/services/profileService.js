import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'profile';

export const profileApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/users/${id}`,
            }),
            transformResponse: (response) => response.data,
        }),

        updateProfile: builder.mutation({
            query: ({id, payload}) => ({
                url: `${CONTEXT_PATH}/users/${id}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation
} = profileApi;