import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";
import {Link} from "react-router-dom";

const MovieCard = ({item}) => {
    return (
        <Link to={`/movie/${item.id}`}>
            <div className="border border-slate-600 rounded-lg">
                <img
                    className="rounded-lg"
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt=""/>
                <div className="px-4 py-2 relative -top-[30px]">
                    <CircularProgressBar
                        percent={Math.round(item.vote_average * 10)}
                        strokeColor={item.vote_average > 7.5 ? 'green' : item.vote_average > 5 ? 'orange': 'red'} />
                    <p className="font-bold mt-2">{item.title}</p>
                    <p className="text-gray-300">{item.release_date}</p>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;