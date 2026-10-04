import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const CinemaCard = ({
    cinema,
    isSelected,
    onSelect,
    movieCount,
}) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(cinema)}
            className={`w-full text-left p-3 sm:p-3.5 rounded-xl transition-all duration-200 border cursor-pointer group flex items-start gap-3 relative overflow-hidden ${
                isSelected
                    ? "bg-gradient-to-r from-violet-950/40 via-[#1e1c28] to-[#18181c] border-violet-500 shadow-[0_0_20px_rgba(127,90,240,0.25)]"
                    : "bg-[#151518] border-zinc-800/80 hover:bg-[#1a1a20] hover:border-zinc-700"
            }`}
        >
            {/* Active Left Indicator Bar */}
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 to-violet-600" />
            )}

            {/* Brand Logo */}
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                isSelected ? "bg-white/10 ring-1 ring-violet-500/50" : "bg-black/40"
            }`}>
                <img
                    src={cinema.brand?.logoUrl || cinema.logoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"}
                    alt={cinema.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        e.currentTarget.src = "https://homepage.momocdn.net/next-js/_next/static/public/cinema/dexuat-icon.svg";
                    }}
                />
            </div>

            {/* Cinema Info */}
            <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className={`text-sm sm:text-base font-bold truncate transition-colors ${
                        isSelected ? "text-violet-300" : "text-zinc-100 group-hover:text-white"
                    }`}>
                        {cinema.name}
                    </h4>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-1 flex items-center gap-1 mb-1.5">
                    <FontAwesomeIcon icon={faLocationDot} className="text-zinc-500 text-[10px] flex-shrink-0" />
                    <span>{cinema.address}</span>
                </p>

                <div className="flex items-center gap-1.5 flex-wrap">
                    {cinema.city && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 font-medium">
                            {cinema.city}
                        </span>
                    )}
                    {movieCount !== undefined && movieCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-950/60 text-violet-300 font-medium border border-violet-800/30">
                            {movieCount} phim có suất
                        </span>
                    )}
                </div>
            </div>

            {/* Right Chevron */}
            <div className="self-center">
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-xs transition-transform duration-200 ${
                        isSelected ? "text-violet-400 translate-x-0.5" : "text-zinc-600 group-hover:text-zinc-400"
                    }`}
                />
            </div>
        </button>
    );
};

export default CinemaCard;
