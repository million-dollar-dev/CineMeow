import React, {useEffect, useState} from 'react';
import PaginateIndicator from "./PaginateIndicator.jsx";
import Movie from "./Movie.jsx";
import {useGetAllMoviesQuery} from "../../services/movieService.js";

const FeatureMovies = () => {
    const [activeMovieId, setActiveMovieId] = React.useState();
    const [isFading, setIsFading] = useState(false);

    const { data: movieResponse, isError, error, isLoading } = useGetAllMoviesQuery();
    const movies = movieResponse?.data.slice(0, 4) || [];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setActiveMovieId(prevId => {
                    const currentIndex = movies.findIndex(m => m.id === prevId);
                    const nextIndex = (currentIndex + 1) % movies.length;
                    return movies[nextIndex].id;
                });
                setIsFading(false);
            }, 400);
        }, 5000);

        return () => clearInterval(interval);
    }, [movies]);

    const activeMovie = movies.find(m => m.id === activeMovieId);

    return (
        <div className="relative overflow-hidden min-h-[60vh] bg-black mb-[2vw]">
            <div
                className={`transition-opacity duration-500 ease-in-out ${
                    isFading ? 'opacity-0' : 'opacity-100'
                }`}
            >
                {activeMovie && <Movie data={activeMovie}/>}
            </div>

            <PaginateIndicator
                movies={movies}
                activeMovieId={activeMovieId}
                setActiveMovieId={setActiveMovieId}
            />
        </div>

    );
};

export default FeatureMovies;