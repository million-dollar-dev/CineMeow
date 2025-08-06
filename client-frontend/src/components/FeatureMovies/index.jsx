import React, {useEffect, useState} from 'react';
import PaginateIndicator from "./PaginateIndicator.jsx";
import Movie from "./Movie.jsx";

const FeatureMovies = () => {
    const [movies, setMovies] = useState([]);
    const [activeMovieId, setActiveMovieId] = React.useState();
    const [isFading, setIsFading] = useState(false);
    useEffect(() => {
        fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjYzZGE3N2NiMGM3MjBhYzA5YWEyNzUwM2U2NWRlZiIsIm5iZiI6MTc1MTA5NzczMC4xODcsInN1YiI6IjY4NWZhMTgyMzllNDRlYmMxZWRlYmM0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lkquOyV3pva_h3EMIUppdPCWuLRHj9D-j-Wo3IOZFHk",

            },
        }).then(async (res) => {
            const data = await res.json();
            const popularMovies = data.results.slice(0, 4);
            setActiveMovieId(popularMovies[0].id);
            setMovies(popularMovies);
        })
    }, []);

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