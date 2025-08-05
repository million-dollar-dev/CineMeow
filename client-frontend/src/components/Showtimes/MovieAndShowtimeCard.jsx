import React from 'react';
import RatingCard from "../RatingCard.jsx";
import TimeSelector from "../MovieDetail/TimeSelector.jsx";

const MovieAndShowtimeCard = () => {
    return (
        <div className="flex border-t py-[1.6vw] items-center">
            <div className="mr-[1vw] max-w-1/7">
                <div className="relative">
                    <img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg" alt=""
                         className="border-gray-900 rounded-md border-1"/>
                    <p className="absolute bottom-1 left-1 font-extrabold text-[2vw] italic">7</p>
                </div>
            </div>
            <div className="flex-col gap-[0.8vw]">
                <RatingCard rating={"13+"} />
                <p className="font-bold text-[1.2vw]">Bộ Tứ Siêu Đẳng: Bước Đi Đầu Tiên</p>
                <p className="text-gray-light text-[1vw] font-light">Khoa Học Viễn Tưởng, Phiêu Lưu</p>
                <div className="pb-[1vw] pt-[1vw] grid grid-cols-5 justify-items-start w-full">
                    <TimeSelector/>
                    <TimeSelector/>
                    <TimeSelector/>
                    <TimeSelector/>
                    <TimeSelector/>
                    <TimeSelector/>
                    <TimeSelector/>
                </div>
            </div>

        </div>
    );
};

export default MovieAndShowtimeCard;