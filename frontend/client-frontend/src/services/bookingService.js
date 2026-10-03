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

        searchBooking: builder.query({
            query: ({ sort, filters = [] }) => {
                const params = new URLSearchParams();

                if (sort) {
                    // ví dụ: "duration,asc"
                    params.append("sort", sort);
                }

                filters.forEach((f) => params.append("filters", f));

                return {
                    url: `${CONTEXT_PATH}/bookings/search?${params.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data.content,
        }),
    }),
});

export const {
    useGetAllPriceByBrandQuery,
    useCreateBookingMutation,
    useGetBookingQuery,
    useSearchBookingQuery,
} = bookingApi;