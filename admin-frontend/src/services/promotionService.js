import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'promotion';

export const brandApi = rootApi.injectEndpoints({
    tagTypes: ["Promotions"],
    endpoints: (builder) => ({
        getAllPromotions: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/promotions`,
            }),
            providesTags: ["Promotions"],
            transformResponse: (response) => response.data,
        }),

        createPromotion: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/promotions`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Promotions"],
        }),

        updatePromotion: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/promotions/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["Promotions"],
        }),
    }),
});

export const {
    useGetAllPromotionsQuery,
    useCreatePromotionMutation,
    useUpdatePromotionMutation
} = brandApi;