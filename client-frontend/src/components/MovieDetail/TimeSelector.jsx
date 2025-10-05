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
          flex items-center justify-center gap-[0.4vw]
          bg-[#7f5af0] text-white
          rounded-2xl px-[1.2vw] py-[0.6vw]
          text-[1vw] font-semibold
          shadow-[0_0_8px_rgba(127,90,240,0.4)]
          transition-all duration-300 ease-out
          hover:bg-[#9f7bff] hover:shadow-[0_0_14px_rgba(127,90,240,0.8)]
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
