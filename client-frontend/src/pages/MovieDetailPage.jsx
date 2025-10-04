import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Banner from "../components/MovieDetail/Banner.jsx";
import ShowtimesList from "../components/MovieDetail/ShowtimesList.jsx";
import NowPlayingList from "../components/MovieDetail/NowPlayingList.jsx";
import ReviewList from "../components/MovieDetail/ReviewList.jsx";
import {useGetMovieQuery} from "../services/movieService.js";
import {useSearchShowtimesQuery} from "../services/showtimeService.js";
import dayjs from "dayjs";

const MovieDetailPage = () => {
    const {movieId} = useParams();

    const {data: movie, isError, Error, isLoading} = useGetMovieQuery(movieId);

    const startDate = dayjs("2025-10-03T16:10:00");
    const { data: showtimesList = [],
        isError: isShowtimeError,
        error: showtimeError,
        isLoading: showtimeLoading,
    } = useSearchShowtimesQuery({
        page: 0,
        size: 10,
        sort: "startTime,asc",
        filters: [
            `movieId:"${movieId}"`,
            `startTime>"${startDate.format("YYYY-MM-DDTHH:mm:ss")}"`,
        ],
    });

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="bg-black">
            <Banner movieInfo={movie}/>
            <div className="flex mx-auto max-w-screen-xl">
                <div className="flex-[2]">
                    <ShowtimesList showtimes={showtimesList} />
                    <div className="border-t border-1 border-gray-light my-[3vw]"></div>
                    <ReviewList/>
                </div>
                <div className="flex-1">
                    <div className="">
                        <NowPlayingList/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MovieDetailPage;