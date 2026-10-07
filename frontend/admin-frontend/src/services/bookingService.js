import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'booking';

export const bookingPricingApi = rootApi.injectEndpoints({
    tagTypes: ["Pricing"],
    endpoints: (builder) => ({
        getAllPriceByBrand: builder.query({
            query: (brandId) => ({
                url: `${CONTEXT_PATH}/pricing/brand/${brandId}`,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Pricing"],
        }),

        getAllPricing: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/pricing`,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Pricing"],
        }),

        createPricing: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/pricing`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Pricing"],
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

        deletePricing: builder.mutation({
            query: (id) => ({
                url: `${CONTEXT_PATH}/pricing/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Pricing"],
        }),
    }),
});

// Backward compatibility alias for any existing imports
export const brandApi = bookingPricingApi;

export const {
    useGetAllPriceByBrandQuery,
    useGetAllPricingQuery,
    useCreatePricingMutation,
    useUpdatePricingMutation,
    useDeletePricingMutation,
} = bookingPricingApi;