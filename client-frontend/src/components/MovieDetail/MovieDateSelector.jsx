import React from "react";
import dayjs from "dayjs";

const MovieDateSelector = ({ day, date, handleClick, isSelected }) => {
    return (
        <button
            onClick={handleClick}
            className={`
                w-[7vw] h-[7vw] rounded-2xl p-[1vw]
                flex flex-col items-center justify-center gap-[0.4vw]
                border transition-all duration-300 shadow-md
                ${
                isSelected
                    ? "bg-[#7f5af0] border-[#a48afc] text-white shadow-[0_0_20px_rgba(127,90,240,0.6)] scale-105"
                    : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-[#7f5af0] hover:text-white hover:scale-105"
            }
            `}
        >
            <p className="text-[0.9vw] font-medium  uppercase">
                {day}
            </p>
            <p className="font-bold text-[1.2vw] tracking-wide">
                {dayjs(date, "MM/DD").format("DD/MM")}
            </p>
        </button>
    );
};

export default MovieDateSelector;
