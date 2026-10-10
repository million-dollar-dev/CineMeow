import React from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const TimeSelector = ({ startTime, endTime, showtimeId, roomName, roomType }) => {
    const formattedStart = dayjs(startTime).format("HH:mm");
    const formattedEnd = dayjs(endTime).format("HH:mm");

    return (
        <Link
            to={`/showtimes/booking/${showtimeId}`}
            className="group relative flex flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-violet-500/30 bg-[#1e1a2e] hover:bg-[#7f5af0] text-zinc-100 hover:text-white transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(127,90,240,0.5)] active:scale-95 text-center min-w-[90px]"
        >
            <div className="flex items-center gap-1 font-bold text-xs sm:text-sm tracking-wide">
                <span>{formattedStart}</span>
                <span className="text-violet-300 group-hover:text-white/80 font-normal">~</span>
                <span className="text-zinc-300 group-hover:text-white/90 text-[11px] sm:text-xs font-medium">{formattedEnd}</span>
            </div>
            {(roomName || roomType) && (
                <span className="mt-0.5 text-[10px] text-zinc-400 group-hover:text-violet-200 truncate max-w-[80px]">
                    {roomName || roomType}
                </span>
            )}
        </Link>
    );
};

export default TimeSelector;
