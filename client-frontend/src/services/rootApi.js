import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: import.meta.env.VITE_API_BASE_URL,
            prepareHeaders: (headers, {getState}) => {
                const accessToken = getState().auth.accessToken;
                if (accessToken) {
                    headers.set('Authorization', `Bearer ${accessToken}`);
                }
            }
        }),
    endpoints: (builder) => {
        return {
            login: builder.mutation({
                query: ({username, password}) => {
                    return {
                        url: "/login",
                        body: {username, password},
                        method: "POST",
                    }
                }
            }),

            register: builder.mutation({
                query: ({username, email, password}) => {
                    return {
                        url: "/register",
                        body: {username, email, password},
                        method: "POST",
                    }
                }
            }),

            introspect: builder.mutation()
        }
    }
});

export const {useLoginMutation, useRegisterMutation} = rootApi;