import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery(
        { baseUrl: "https://api.escuelajs.co/api/v1/auth" }),
    endpoints: (builder) => {
        return {
            login: builder.mutation({
                query: ({email, password}) => {
                    return {
                        url: "/login",
                        body: {email, password},
                        method: "POST",
                    }
                }
            })
        }
    }
});

export const {useLoginMutation} = rootApi;