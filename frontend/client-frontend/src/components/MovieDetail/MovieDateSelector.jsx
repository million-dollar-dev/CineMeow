import React from "react";
import dayjs from "dayjs";

const MovieDateSelector = ({ day, date, handleClick, isSelected }) => {
    // Parse date intelligently whether ISO string "2026-10-04" or formatted "MM/DD" or "DD/MM"
    let dayNumber = "";
    let monthLabel = "";

    if (typeof date === "string") {
        if (date.includes("-")) {
            const parsed = dayjs(date);
            dayNumber = parsed.format("DD");
            monthLabel = `Thg ${parsed.format("M")}`;
        } else if (date.includes("/")) {
            const parsed = dayjs(date, "MM/DD").isValid() ? dayjs(date, "MM/DD") : dayjs();
            dayNumber = parsed.format("DD");
            monthLabel = `Thg ${parsed.format("M")}`;
        } else {
            dayNumber = date;
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-full flex flex-col items-center justify-between py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl transition-all duration-200 cursor-pointer select-none border relative overflow-hidden group
            ${isSelected
                ? "bg-gradient-to-b from-[#7f5af0] to-[#5933d6] border-violet-400 text-white shadow-[0_0_18px_rgba(127,90,240,0.5)] ring-1 ring-violet-300/40"
                : "bg-[#18181f] border-zinc-800 text-zinc-400 hover:bg-[#22222b] hover:border-zinc-700 hover:text-zinc-200"
            }
        `}
        >
            {/* Top Weekday */}
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate max-w-full ${
                isSelected ? "text-violet-100" : "text-zinc-400 group-hover:text-zinc-300"
            }`}>
                {day}
            </span>

            {/* Prominent Day Number */}
            <span className={`font-black text-lg sm:text-2xl md:text-3xl leading-none my-1 tracking-tight ${
                isSelected ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" : "text-zinc-100 group-hover:text-white"
            }`}>
                {dayNumber}
            </span>

            {/* Bottom Month */}
            <span className={`text-[9px] sm:text-[11px] font-semibold tracking-tight ${
                isSelected ? "text-violet-200" : "text-zinc-500 group-hover:text-zinc-400"
            }`}>
                {monthLabel}
            </span>

            {/* Active Top Highlight Bar */}
            {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/70" />
            )}
        </button>
    );
};

export default MovieDateSelector;
