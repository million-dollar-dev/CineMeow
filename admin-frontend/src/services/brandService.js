import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'cinema';

export const brandApi = rootApi.injectEndpoints({
    tagTypes: ["Brands"],
    endpoints: (builder) => ({
        getAllBrands: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/brands`,
            }),
            providesTags: ["Brands"],
        }),

        createBrand: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/brands`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Brands"],
        }),

        updateBrand: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `${CONTEXT_PATH}/brands/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["Brands"],
        }),
    }),
});

export const {
    useGetAllBrandsQuery,
    useCreateBrandMutation,
    useUpdateBrandMutation
} = brandApi;