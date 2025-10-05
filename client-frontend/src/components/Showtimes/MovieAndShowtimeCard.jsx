import React from 'react';
import RatingCard from "../RatingCard.jsx";
import TimeSelector from "../MovieDetail/TimeSelector.jsx";

const MovieAndShowtimeCard = () => {
    return (
        <div
            className="flex items-center gap-[1vw] py-[1vw] px-[1.4vw] border-t border-[#2a2a2a]
      hover:bg-[#1a1a1a] transition-all duration-300 group cursor-pointer"
        >
            {/* Poster phim */}
            <div className="relative w-[6.5vw] flex-shrink-0 rounded-lg overflow-hidden shadow-[0_0_8px_rgba(0,0,0,0.3)] group-hover:scale-[1.03] transition-transform duration-300">
                <img
                    src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg"
                    alt="Poster phim"
                    className="w-full h-full object-cover rounded-md"
                />
                {/* Index nổi bật */}
                <p
                    className="absolute bottom-[0.3vw] left-[0.4vw] font-extrabold text-[1.2vw] italic
          text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.7)] bg-black/40 px-[0.4vw] rounded"
                >
                    7
                </p>
            </div>

            {/* Thông tin phim */}
            <div className="flex flex-col gap-[0.4vw] flex-1">
                <div className="flex items-center gap-[0.6vw]">
                    <RatingCard rating={"13+"} />
                    <p
                        className="font-semibold text-[1vw] text-white leading-tight group-hover:text-[#7f5af0] transition-colors duration-300"
                    >
                        Bộ Tứ Siêu Đẳng: Bước Đi Đầu Tiên
                    </p>
                </div>

                <p className="text-gray-400 text-[0.8vw] font-light leading-tight">
                    Khoa học viễn tưởng, Phiêu lưu
                </p>

                {/* Giờ chiếu */}
                <div
                    className="grid grid-cols-5 gap-[0.4vw] mt-[0.6vw]"
                >
                    <TimeSelector startTime="2025-10-04T09:00:00" endTime="2025-10-04T11:00:00" showtimeId="1" />
                    <TimeSelector startTime="2025-10-04T12:00:00" endTime="2025-10-04T14:00:00" showtimeId="2" />
                    <TimeSelector startTime="2025-10-04T15:00:00" endTime="2025-10-04T17:00:00" showtimeId="3" />
                    <TimeSelector startTime="2025-10-04T18:00:00" endTime="2025-10-04T20:00:00" showtimeId="4" />
                    <TimeSelector startTime="2025-10-04T21:00:00" endTime="2025-10-04T23:00:00" showtimeId="5" />
                </div>
            </div>
        </div>
    );
};



export default MovieAndShowtimeCard;