import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faPlay,
    faFire,
    faBell,
    faCheck,
    faHeart,
    faTicket,
    faClock,
    faFilm,
} from "@fortawesome/free-solid-svg-icons";
import RatingCard from "../RatingCard.jsx";

const CommingSoonMovieCard = ({ movie, onPlayTrailer, onToggleRemind, isReminded = false }) => {
    const [remindState, setRemindState] = useState(isReminded);

    const handleRemindClick = () => {
        const nextState = !remindState;
        setRemindState(nextState);
        if (onToggleRemind) {
            onToggleRemind(movie, nextState);
        }
    };

    return (
        <div className="group relative flex flex-col justify-between bg-[#12121e]/90 hover:bg-[#161626] rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/70 shadow-xl hover:shadow-[0_12px_35px_rgba(127,90,240,0.3)] transition-all duration-300">
            {/* Top Poster Container */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                {/* Age Rating Badge */}
                <div className="absolute top-2.5 left-2.5 z-20 shadow-md">
                    <RatingCard rating={movie.rating || "T13"} />
                </div>

                {/* Status Badges on Top Right */}
                <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end gap-1.5">
                    {movie.isPreSale && (
                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse">
                            <FontAwesomeIcon icon={faTicket} className="text-[9px]" />
                            <span>Mở Bán Sớm</span>
                        </div>
                    )}
                    {movie.daysLeft !== undefined && (
                        <div className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-violet-500/40 text-violet-300 text-[10px] font-bold shadow-sm">
                            <span>Còn {movie.daysLeft} ngày</span>
                        </div>
                    )}
                </div>

                {/* Formats at bottom of poster */}
                <div className="absolute bottom-2.5 left-2.5 z-20 flex flex-wrap gap-1 pointer-events-none">
                    {movie.formats?.slice(0, 2).map((fmt, idx) => (
                        <span
                            key={idx}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                                fmt.includes("IMAX")
                                    ? "bg-amber-500 text-zinc-950"
                                    : "bg-black/75 text-zinc-200 border border-white/20 backdrop-blur-sm"
                            }`}
                        >
                            {fmt}
                        </span>
                    ))}
                </div>

                {/* Poster Image */}
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.currentTarget.src =
                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                    }}
                />

                {/* Dark Vignette Overlay on Poster */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Hover Quick Action Overlay */}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-3 z-20 backdrop-blur-[1px]">
                    {movie.trailerUrl && (
                        <button
                            type="button"
                            onClick={() => onPlayTrailer(movie)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black border border-white/40 text-xs font-bold transition-all transform scale-90 group-hover:scale-100 cursor-pointer shadow-lg"
                        >
                            <FontAwesomeIcon icon={faPlay} className="text-xs text-violet-400 group-hover:text-violet-600" />
                            <span>Xem Trailer</span>
                        </button>
                    )}

                    <Link
                        to={`/movie/${movie.id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-900/50 transform scale-90 group-hover:scale-100 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faFilm} className="text-xs" />
                        <span>Thông Tin Chi Tiết</span>
                    </Link>
                </div>
            </div>

            {/* Movie Info & Action Footer */}
            <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-grow">
                <div>
                    {/* Movie Title */}
                    <Link
                        to={`/movie/${movie.id}`}
                        className="block font-bold text-sm sm:text-base text-white group-hover:text-violet-300 transition-colors line-clamp-1"
                        title={movie.title}
                    >
                        {movie.title}
                    </Link>

                    {/* Genres */}
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-medium">
                        {movie.genres}
                    </p>

                    {/* Premiere Date & Interest count */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2.5 pt-2.5 border-t border-white/5">
                        <span className="flex items-center gap-1.5 text-violet-300 font-semibold">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-violet-400 text-[10px]" />
                            <span>Khởi chiếu: {movie.releaseDate}</span>
                        </span>
                        {movie.wantToSeeCount && (
                            <span className="flex items-center gap-1 text-zinc-400">
                                <FontAwesomeIcon icon={faHeart} className="text-rose-400 text-[10px]" />
                                <span>{movie.wantToSeeCount}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-3.5">
                    {/* Trailer Button */}
                    <button
                        type="button"
                        onClick={() => onPlayTrailer(movie)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/5 text-xs font-semibold transition-all cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faPlay} className="text-[10px] text-violet-400" />
                        <span>Trailer</span>
                    </button>

                    {/* Pre-sale or Remind me button */}
                    {movie.isPreSale ? (
                        <Link
                            to={`/movie/${movie.id}`}
                            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-md shadow-violet-900/40 transition-all cursor-pointer active:scale-95"
                        >
                            <FontAwesomeIcon icon={faTicket} className="text-[10px]" />
                            <span>Mua vé sớm</span>
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={handleRemindClick}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                remindState
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                                    : "bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 hover:border-violet-500/70"
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={remindState ? faCheck : faBell}
                                className={`text-[10px] ${remindState ? "text-emerald-400" : "text-violet-400"}`}
                            />
                            <span>{remindState ? "Đã đặt nhắc" : "Nhắc tôi"}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommingSoonMovieCard;
