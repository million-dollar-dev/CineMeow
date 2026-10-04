import React from "react";

const PaginateIndicator = ({ movies, activeMovieId, setActiveMovieId }) => {
    return (
        <div className="absolute right-4 sm:right-8 md:right-12 bottom-6 sm:bottom-10 z-20">
            <ul className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {movies.map((movie, idx) => {
                    const isActive = movie.id === activeMovieId;
                    return (
                        <li
                            key={movie.id}
                            className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                                isActive
                                    ? "w-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-md shadow-violet-500/50"
                                    : "w-2 bg-zinc-600 hover:bg-zinc-400"
                            }`}
                            onClick={() => setActiveMovieId(movie.id)}
                            title={movie.title}
                            aria-label={`Slide ${idx + 1}`}
                        />
                    );
                })}
            </ul>
        </div>
    );
};

export default PaginateIndicator;