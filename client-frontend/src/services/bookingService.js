import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'booking';

export const bookingApi = rootApi.injectEndpoints({
    tagTypes: ["Pricing"],
    endpoints: (builder) => ({
        getAllPriceByBrand: builder.query({
            query: (brandId) => ({
                url: `${CONTEXT_PATH}/pricing/brand/${brandId}`,
            }),
            transformResponse: (response) => response.data,
        }),

        getBooking: builder.query({
            query: (bookingId) => ({
                url: `${CONTEXT_PATH}/bookings/${bookingId}`,
            }),
            transformResponse: (response) => response.data,
        }),

        createBooking: builder.mutation({
            query: (payload) => ({
                url: `${CONTEXT_PATH}/bookings`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useGetAllPriceByBrandQuery,
    useCreateBookingMutation,
    useGetBookingQuery,
} = bookingApi;