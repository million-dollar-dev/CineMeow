import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'payment';

export const paymentApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        initPayment: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/payments/create`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useInitPaymentMutation,
} = paymentApi;