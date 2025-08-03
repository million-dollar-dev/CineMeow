import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Banner from "../components/MovieDetail/Banner.jsx";
import ShowtimesList from "../components/MovieDetail/ShowtimesList.jsx";
import NowPlayingList from "../components/MovieDetail/NowPlayingList.jsx";
import ReviewList from "../components/MovieDetail/ReviewList.jsx";

const MovieDetail = () => {
    const {movieId} = useParams();
    const [movieInfo, setMovieInfo] = useState();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjYzZGE3N2NiMGM3MjBhYzA5YWEyNzUwM2U2NWRlZiIsIm5iZiI6MTc1MTA5NzczMC4xODcsInN1YiI6IjY4NWZhMTgyMzllNDRlYmMxZWRlYmM0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lkquOyV3pva_h3EMIUppdPCWuLRHj9D-j-Wo3IOZFHk",

            },
        }).then(async (res) => {
            const data = await res.json();
            console.log(data);
            setMovieInfo(data);
        }).catch((err) => {
            console.log(err);
        }).finally(() => setIsLoading(false));
    }, [movieId]);

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="bg-black">
            <Banner movieInfo={movieInfo}/>
            <div className="flex mx-auto max-w-screen-xl">
                <div className="flex-[2]">
                    <ShowtimesList />
                    <div className="border-t border-1 border-gray-light my-[3vw]"></div>
                    <ReviewList/>
                </div>
                <div className="flex-1">
                    <NowPlayingList/>
                </div>
            </div>

        </div>
    );
};

export default MovieDetail;