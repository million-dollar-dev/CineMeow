import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import CircularProgressBar from "../components/CircularProgressBar.jsx";

const MovieDetail = () => {
    return (
        <div className="relative text-white overflow-hidden h-145" >
            <img className="absolute inset-0 brightness-[0.2]"
                 src="https://image.tmdb.org/t/p/original/sItIskd5xpiE64bBWYwZintkGf3.jpg" alt=""/>
            <div className="flex relative max-w-2xl mx-auto p-5 gap-6 lg:gap-8 py-10">
                <div className="flex-1">
                    <img src="https://image.tmdb.org/t/p/w500/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg" alt=""/>
                </div>
                <div className="flex-2 text-[1.2vw]">
                    <p className="font-bold mb-2 text-[2vw]">Test</p>
                    <div className="flex gap-4 items-center">
                        <span className="text-gray-400 border border-gray-400 p-1">G</span>
                        <p>2024-1-1</p>
                        <p>Trinh thám, Sci-Fi</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <CircularProgressBar percent={90} size={3.5} strokeWidth={0.3}/>
                        </div>
                        <button className="mr-1">
                            <FontAwesomeIcon icon={faPlay}/> Trailer
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="font-bold text-[1.3vw] mb-2">Overview</p>
                        <p>fjdslakfjdlafjldsakjfdkljalfjldksjfkldsjflskdsajflkdsa</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div>
                            <p className="font-bold">Director</p>
                            <p>Hoàng Tuấn</p>
                        </div>
                        <div>
                            <p className="font-bold">Casts</p>
                            <p>Hoàng Tuấn</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;