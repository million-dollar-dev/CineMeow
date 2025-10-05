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

        introspect: builder.mutation({
            query: ({ token }) => ({
                url: `${CONTEXT_PATH}/auth/introspect`,
                method: "POST",
                body: { token },
            }),
        }),
    }),
});

export const { useLoginMutation, useIntrospectMutation } = authApi;