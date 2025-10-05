import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";
import RatingCard from "../RatingCard.jsx";

const MiniCardList = ({movie, index}) => {
    return (
        <div>
            <div className="flex gap-[0.4vw] py-[1.6vw] border-b-1 items-center">
                <div className="mr-[1vw] max-w-1/4">
                    <div className="relative">
                        <img src={movie?.posterPath} alt={movie?.title}
                             className="border-gray-900 rounded-md border-1"/>
                        <p className="absolute bottom-1 left-1 font-extrabold text-[2vw] italic">{index + 1}</p>
                    </div>
                </div>
                <div className="flex gap-[0.4vw] flex-col">
                    <div className="flex gap-1 items-center">
                        <div>
                            <RatingCard rating={movie?.rating} />
                        </div>
                        <CircularProgressBar
                            percent={Math.round(6.9 * 10)}
                            strokeColor='green'
                        size={2.4}/>
                    </div>

                    <p className="font-bold text-[1vw]">{movie?.title}</p>
                    <p className="font-light text-[0.8vw] text-gray-300">
                        {movie?.genres.map((g) => g.name).join(" · ")}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default MiniCardList;