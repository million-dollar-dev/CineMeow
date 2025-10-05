import React, {useEffect, useState} from 'react';
import PaginateIndicator from "./PaginateIndicator.jsx";
import Movie from "./Movie.jsx";
import {useSearchMoviesQuery} from "../../services/movieService.js";
import Loading from "../Loading.jsx";

const FeatureMovies = () => {
    const { data: movies = [], isError, error, isLoading } = useSearchMoviesQuery({
        page: 0,
        size: 4,
        sort: "releaseDate,desc",
        filters: ['status:"NOW_PLAYING"'],
    });

    const [activeMovieId, setActiveMovieId] = useState(null);
    const [isFading, setIsFading] = useState(false);

    // Sync activeMovieId khi movies thay đổi
    useEffect(() => {
        if (movies.length > 0 && !activeMovieId) {
            setActiveMovieId(movies[0].id);
        }
    }, [movies, activeMovieId]);

    const activeMovie = movies.find(m => m.id === activeMovieId);

    // Auto-slide
    useEffect(() => {
        if (movies.length === 0) return;

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

    // Preload ảnh
    useEffect(() => {
        if (movies.length === 0) return;

        const currentIndex = movies.findIndex(m => m.id === activeMovieId);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % movies.length;
        const nextMovie = movies[nextIndex];

        if (nextMovie?.backdropPath) new Image().src = nextMovie.backdropPath;
        if (nextMovie?.posterPath) new Image().src = nextMovie.posterPath;
    }, [activeMovieId, movies]);

    if (!activeMovie) return null;

    return (
        <div className="relative overflow-hidden min-h-[60vh] bg-black mb-[2vw]">
            {isLoading ? (<Loading />) : (
                <>
                    <div
                        className={`transition-opacity duration-500 ease-in-out ${
                            isFading ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        <Movie data={activeMovie} />
                    </div>

                    <PaginateIndicator
                        movies={movies}
                        activeMovieId={activeMovieId}
                        setActiveMovieId={setActiveMovieId}
                    />
                </>
            )}
        </div>
    );
};


export default FeatureMovies;