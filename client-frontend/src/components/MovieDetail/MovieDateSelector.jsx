import React from "react";
import dayjs from "dayjs";

const MovieDateSelector = ({day, date, handleClick, isSelected}) => {
    return (
        <button
            onClick={handleClick}
            className={`flex flex-col items-center justify-center px-[1vw] py-[0.8vw] w-[7vw] rounded-xl transition-all duration-300 shadow-sm
            ${isSelected
                ? "bg-gradient-to-br from-[#7f5af0] to-[#9f7bff] text-white shadow-[0_0_10px_rgba(127,90,240,0.5)] scale-105"
                : "bg-[#1e1e1e] text-[#b8b8b8] hover:bg-[#252525] hover:text-[#d8c6ff]"
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
