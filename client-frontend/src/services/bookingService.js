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
        }),

    }),
});

export const {
    useGetAllPriceByBrandQuery,
} = brandApi;