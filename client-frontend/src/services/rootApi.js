import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery(
        { baseUrl: import.meta.env.VITE_API_BASE_URL}),
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
            })
        }
    }
});

export const {useLoginMutation} = rootApi;