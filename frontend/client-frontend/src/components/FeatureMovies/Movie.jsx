import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import RatingCard from "../RatingCard.jsx";

const Movie = (props) => {
    const {data: {backdropPath, title, releaseDate, overview, posterPath, rating}} = props;
    return (
        <>
            <div
                className="absolute inset-0 bg-center bg-cover opacity-20 blur-[50px]"
                style={{ backgroundImage: `url(${backdropPath})` }}
            />

            <img
                className="aspect-video brightness-50 transition-opacity duration-700 w-full object-cover
               [mask-image:linear-gradient(90deg,transparent_10px,rgba(0,0,0,.2)_15%,black_40%,black_80%,transparent_99%)]
               [mask-repeat:no-repeat] [mask-size:cover] [mask-position:center]
               [-webkit-mask-image:linear-gradient(90deg,transparent_10px,rgba(0,0,0,.2)_15%,black_40%,black_80%,transparent_99%)]"
                src={backdropPath}
                alt={title}
                loading="lazy"
            />

            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1900px] h-full
                   [mask-image:linear-gradient(0deg,transparent_0,black_20%,black_80%,transparent)]
                   [-webkit-mask-image:linear-gradient(0deg,transparent_0,black_20%,black_80%,transparent)]"
            ></div>

            {/* Overlay chấm bi */}
            <div className="absolute inset-0 bg-[url('/img/dotted.png')] opacity-20 pointer-events-none"></div>

            <div className="absolute bottom-[30%]  flex gap-6 left-30 text-white z-10">
                {/* Poster */}
                <div className="hidden sm:w-56 sm:block md:w-68 md:block shrink-0">
                    <img
                        src={posterPath}
                        alt={title}
                        className="w-full rounded-xl shadow-2xl"
                    />
                </div>


                <div className="flex flex-col justify-start max-w-full sm:max-w-[700px]">
                    <RatingCard rating={rating} />
                    <p className="font-bold text-xl sm:text-[2.5vw] mb-2 sm:mb-3">{title}</p>

                    <div className="mb-2">
                        <p className="text-sm sm:text-base">{releaseDate}</p>
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