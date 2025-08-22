import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {clearTokens} from "../redux/slices/authSlice.js";
import {persistor} from "../redux/store.js";

const baseQuery = fetchBaseQuery(
    {
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers, {getState}) => {
            const accessToken = getState().auth.accessToken;
            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`);
            }
        }
    });

const baseQueryWithForceLogout = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        api.dispatch(clearTokens());
        await persistor.purge();
        window.location.href = '/login';
    }
    return result;
}

export const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithForceLogout,
    endpoints:
        (builder) => {
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
})


export const {useLoginMutation, useRegisterMutation} = rootApi;