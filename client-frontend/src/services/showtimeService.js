import { rootApi } from "./rootApi";

const CONTEXT_PATH = 'showtime';

export const showtimeApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllShowtimes: builder.query({
            query: () => ({
                url: `${CONTEXT_PATH}/showtimes`,
            }),
        }),

        getShowtime: builder.query({
            query: (id) => ({
                url: `${CONTEXT_PATH}/showtimes/${id}`,
            }),
            transformResponse: (response) => response.data,
        }),

        searchShowtimes: builder.query({
            query: ({ page = 0, size = 10, sort, filters = [] }) => {
                const params = new URLSearchParams();

                params.append("page", page);
                params.append("size", size);

                if (sort) {
                    // ví dụ: "duration,asc"
                    params.append("sort", sort);
                }

                filters.forEach((f) => params.append("filters", f));
                console.log('filter', params.toString());

                // const params = 'page=0&size=10&sort=startTime,asc&filters=movieId:"0723d8fc-d163-475d-ae9f-6d8c4ffa6a50",startTime>"2025-10-03T00:00:00"'
                // console.log(params.toString())
                return {
                    url: `${CONTEXT_PATH}/showtimes/search?${params.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useGetAllShowtimesQuery,
    useSearchShowtimesQuery,
    useGetShowtimeQuery,
} = showtimeApi;