import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";

const MiniCardList = () => {
    return (
        <div>
            <div className="flex gap-[0.4vw] py-[1.6vw] border-b-1">
                <div className="mr-[1vw] max-w-1/4">
                    <div className="relative">
                        <img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg" alt=""
                             className="border-gray-900 rounded-2xl border-1"/>
                        <p className="absolute bottom-2 left-2 font-extrabold text-[2vw] italic">1</p>
                    </div>
                </div>
                <div className="flex gap-[0.4vw] flex-col">
                    <p className="font-bold text-[1.2vw]">Superman</p>
                    <p className="font-light text-[1vw] text-gray-300">Khoa học viễn tưởng, hành động</p>
                    <CircularProgressBar
                        percent={Math.round(6.9 * 10)}
                        strokeColor='green'/>
                </div>

            </div>
        </div>
    );
};

export default MiniCardList;