import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import RatingCard from "../RatingCard.jsx";

const Movie = (props) => {
    const {data: {backdrop_path, title, release_date, overview, poster_path}} = props;
    return (
        <>
            <img
                className="aspect-video brightness-50 transition-opacity duration-700 w-full object-cover"
                src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
                alt={title}
                loading="lazy"
            />

            <div className="absolute bottom-[30%]  flex gap-6 left-30 text-white z-10">
                {/* Poster */}
                <div className="hidden sm:w-56 sm:block md:w-68 md:block shrink-0">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                        alt={title}
                        className="w-full rounded-xl shadow-2xl"
                    />
                </div>


                <div className="flex flex-col justify-start max-w-full sm:max-w-[700px]">
                    <RatingCard rating={"PG12"} />
                    <p className="font-bold text-xl sm:text-[2.5vw] mb-2 sm:mb-3">{title}</p>

                    <div className="mb-2">
                        <p className="text-sm sm:text-base">{release_date}</p>
                    </div>

                    <div className="hidden sm:block text-sm sm:text-base mt-3">
                        <p className="font-bold mb-1">Overview</p>
                        <p className="line-clamp-3 sm:line-clamp-4">{overview}</p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button className="bg-white text-black py-2 px-4 rounded text-sm sm:text-base">
                            <FontAwesomeIcon icon={faPlay} /> Trailer
                        </button>
                        <button className="bg-slate-300/35 py-2 px-4 rounded text-sm sm:text-base">Mua vé</button>
                    </div>
                </div>
            </div>

        </>

    );
};

export default Movie;