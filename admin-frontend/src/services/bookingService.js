import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'booking';

export const brandApi = rootApi.injectEndpoints({
    tagTypes: ["Pricing"],
    endpoints: (builder) => ({
        getAllPriceByBrand: builder.query({
            query: (brandId) => ({
                url: `${CONTEXT_PATH}/pricing/brand/${brandId}`,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Pricing"],
        }),

        updatePricing: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/pricing/${id}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Pricing"],
        }),
    }),
});

export const {
    useGetAllPriceByBrandQuery,
    useUpdatePricingMutation,
} = brandApi;