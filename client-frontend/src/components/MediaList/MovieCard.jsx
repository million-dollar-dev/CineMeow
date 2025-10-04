import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";
import {Link} from "react-router-dom";
import RatingCard from "../RatingCard.jsx";
import ButtonPlay from "../utils/ButtonPlay.jsx";

const MovieCard = ({item}) => {
    return (
        <Link to={`/movie/${item.id}`}>
            <div className="border border-slate-600 rounded-lg relative group overflow-hidden bg-black">
                <div className="relative">
                    <div className="absolute inset-2 z-2">
                        <RatingCard rating={item?.rating} />
                    </div>
                    <div>
                        <ButtonPlay />
                    </div>
                    <img
                        className="rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                        src={item?.posterPath}
                        alt=""
                    />
                </div>
                <div className="px-4 py-2 relative -top-[30px]">
                    <CircularProgressBar
                        percent={Math.round(item.vote_average * 10)}
                        strokeColor={
                            item.vote_average > 7.5
                                ? 'green'
                                : item.vote_average > 5
                                    ? 'orange'
                                    : 'red'
                        }
                    />
                    <p className="font-bold mt-2 truncate">{item?.title}</p>
                    <p className="text-gray-300">{item?.releaseDate}</p>
                </div>
            </div>

        </Link>
    );
};

export default MovieCard;