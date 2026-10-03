import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {clearTokens, setTokens} from "../redux/slices/authSlice.js";
import {API_BASE_URL, API_PREFIX} from "./apiConfig.js";
import {toast} from "react-toastify";

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
        const state = api.getState();
        const refreshToken = state.auth.refreshToken;
        console.log('refreshToken', refreshToken);
        if (!refreshToken) {
            api.dispatch(clearTokens());
            return result;
        }

        toast.info('Token hết hạn, đang refresh...');

        try {
            const response = await fetch(`${API_BASE_URL}${API_PREFIX}/authentication/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: refreshToken }),
            });

            const refreshData = await response.json();
            console.log('refresh response', response)
            if (response.ok && refreshData) {
                toast.success('Refresh token thành công');
                console.log('refresh data: ', refreshData);
                api.dispatch(setTokens({accessToken: refreshData.data.accessToken, refreshToken: refreshData.data.refreshToken}));

                // Thử lại request ban đầu với token mới
                result = await baseQuery(args, api, extraOptions);
            } else {
                throw new Error('Refresh failed');
            }
        } catch (error) {
            console.log('refresh error', error);
            await callLogoutAPI(refreshToken, api);
        }
    }

    return result;
};

async function callLogoutAPI(refreshToken, api) {
    try {
        await fetch(`${API_BASE_URL}${API_PREFIX}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: refreshToken }),
        });
    } catch (logoutError) {
        console.error('Logout API error:', logoutError);
    } finally {
        api.dispatch(clearTokens());
        toast.error('Phiên đăng nhập đã hết hạn');
    }
}


export const rootApi = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery,
    endpoints: () => ({}),
});