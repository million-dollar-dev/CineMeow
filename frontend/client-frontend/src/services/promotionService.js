import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'promotion';

export const promotionApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        validateVoucher: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/promotions/validate`,
                method: 'POST',
                body: payload,
            }),
            transformResponse: (response) => response.data,
        }),

    }),
});

export const {
    useValidateVoucherMutation,
} = promotionApi;