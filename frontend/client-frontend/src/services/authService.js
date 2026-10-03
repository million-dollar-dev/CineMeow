import {rootApi} from "./rootApi.js";

const CONTEXT_PATH = 'authentication';

export const authApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ username, password }) => ({
                url: `${CONTEXT_PATH}/auth/login`,
                method: "POST",
                body: { username, password },
            }),
        }),

        register: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/users/register`,
                method: "POST",
                body: payload,
            }),
        }),

        introspect: builder.mutation({
            query: ({ token }) => ({
                url: `${CONTEXT_PATH}/auth/introspect`,
                method: "POST",
                body: { token },
            }),
        }),

        logout: builder.mutation({
            query: (token) => ({
                url: `${CONTEXT_PATH}/auth/logout`,
                method: "POST",
                body: { token },
            }),
            transformResponse: (response) => response.data,
        }),

        getMe: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/users/me`,
            }),
            transformResponse: (response) => response.data,
        }),

        verifyAccount: builder.mutation({
            query: (token) => ({
                url: `${CONTEXT_PATH}/auth/verify?token=${token}`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useIntrospectMutation,
    useVerifyAccountMutation,
    useRegisterMutation,
    useGetMeQuery,
    useLogoutMutation,
} = authApi;