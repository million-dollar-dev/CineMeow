import React from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const TimeSelector = ({ startTime, endTime, showtimeId }) => {
    const formattedStart = dayjs(startTime).format("HH:mm");
    const formattedEnd = dayjs(endTime).format("HH:mm");

    return (
        <Link to={`/showtimes/booking/${showtimeId}`} className="group">
            <button
                className="
          flex items-center justify-center gap-[0.3vw]
          bg-[#7f5af0] text-white
          rounded-xl px-[1vw] py-[0.5vw]
          text-[0.9vw] font-medium
          shadow-[0_0_6px_rgba(127,90,240,0.35)]
          transition-all duration-300 ease-out
          hover:bg-[#9f7bff] hover:shadow-[0_0_10px_rgba(127,90,240,0.6)]
          active:scale-95
        "
            >
                <span className="tracking-wide">{formattedStart}</span>
                <span className="text-gray-300">–</span>
                <span>{formattedEnd}</span>
            </button>
        </Link>
    );
};


export default TimeSelector;
