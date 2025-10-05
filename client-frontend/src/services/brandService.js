import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'cinema';

export const brandApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBrands: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/brands`,
            }),
            transformResponse: (response) => response.data,
        }),

        getBrand: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/brands/${id}`,
            }),
            transformResponse: (response) => response.data,
        }),

    }),
});

export const {
    useGetAllBrandsQuery,
    useGetBrandQuery,
} = brandApi;