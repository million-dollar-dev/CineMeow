import React, {useEffect, useState} from 'react';
import PaginateIndicator from "./PaginateIndicator.jsx";
import Movie from "./Movie.jsx";

const FeatureMovies = () => {
    const [movies, setMovies] = useState([]);
    const [activeMovieId, setActiveMovieId] = React.useState();
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
            setActiveMovieId(prevId => {
                const currentIndex = movies.findIndex(m => m.id === prevId);
                const nextIndex = (currentIndex + 1) % movies.length;
                return movies[nextIndex].id;
            });
        }, 4000);

        return () => clearInterval(interval); // clearInterval khi unmount
    }, [movies]);

    return (
        <div className="relative">
            {
                movies
                    .filter((movie) => movie.id === activeMovieId)
                    .map((movie) => (<Movie key={movie.id} data={movie}/>))
            }
            <PaginateIndicator movies={movies} activeMovieId={activeMovieId} setActiveMovieId={setActiveMovieId}/>
        </div>

    );
};

export default FeatureMovies;