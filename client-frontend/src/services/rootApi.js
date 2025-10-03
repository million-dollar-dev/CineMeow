import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {clearTokens} from "../redux/slices/authSlice.js";
import {API_BASE_URL, API_PREFIX} from "./apiConfig.js";

const baseQuery = fetchBaseQuery({
    baseUrl: `${API_BASE_URL}${API_PREFIX}`,
    prepareHeaders: (headers, {getState}) => {
        const accessToken = getState().auth.accessToken;
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return headers;
    }
});

const customBaseQuery = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = api.getState().auth.refreshToken;

        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: "/authentication/auth/refresh",
                    method: "POST",
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                // Update token
                console.log(refreshResult.data);
                // api.dispatch(setTokens(refreshResult.data));
                //
                // // Retry lại request ban đầu
                // result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(clearTokens());
            }
        }
    }
    return result;
};


export const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery,
    endpoints: () => ({}),
});