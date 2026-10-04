import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faTicket,
    faStar,
    faClock,
    faCalendarDays,
    faFilm,
} from "@fortawesome/free-solid-svg-icons";
import RatingCard from "../RatingCard.jsx";

const Movie = ({ data, onPlayTrailer }) => {
    if (!data) return null;

    const {
        id,
        backdropPath,
        posterPath,
        title,
        originalTitle,
        releaseDate,
        overview,
        rating,
        score,
        duration,
        genres,
    } = data;

    const bookingUrl = `/movie/${id}`;

    return (
        <div className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] overflow-hidden bg-black flex items-center">
            {/* Blurred Atmospheric Background Glow */}
            <div
                className="absolute inset-0 bg-center bg-cover opacity-25 blur-3xl scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${backdropPath || posterPath})` }}
            />

            {/* Main Crisp Backdrop Image */}
            <img
                src={backdropPath || posterPath}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.45] transition-transform duration-1000 scale-100"
                loading="eager"
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0d] via-[#0a0a0d]/70 to-transparent" />

            {/* Dotted texture overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-20">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 max-w-4xl">
                    {/* Poster Thumbnail (Hidden on very small screens, visible on sm+) */}
                    <div className="hidden sm:block w-44 md:w-56 lg:w-64 shrink-0 rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-violet-950/60 group">
                        <img
                            src={posterPath || backdropPath}
                            alt={title}
                            className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Movie Information & Actions */}
                    <div className="flex-1 text-center md:text-left space-y-3.5">
                        {/* Badges line: Age Rating & Score */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                            <RatingCard rating={rating || "T13"} />

                            {score && (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                                    <FontAwesomeIcon icon={faStar} className="text-amber-400 text-[10px]" />
                                    <span>{score} Điểm</span>
                                </div>
                            )}

                            {genres && (
                                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-zinc-300 text-xs font-medium">
                                    {genres}
                                </span>
                            )}
                        </div>

                        {/* Movie Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2">
                            {title}
                        </h1>

                        {originalTitle && originalTitle !== title && (
                            <p className="text-xs sm:text-sm text-zinc-400 font-medium italic">
                                {originalTitle}
                            </p>
                        )}

                        {/* Metadata line */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-zinc-300">
                            {releaseDate && (
                                <span className="flex items-center gap-1.5 text-violet-300 font-semibold">
                                    <FontAwesomeIcon icon={faCalendarDays} className="text-violet-400 text-xs" />
                                    <span>Khởi chiếu: {releaseDate}</span>
                                </span>
                            )}
                            {duration && (
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faClock} className="text-zinc-400 text-xs" />
                                    <span>{duration}</span>
                                </span>
                            )}
                        </div>

                        {/* Synopsis */}
                        {overview && (
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3 max-w-2xl font-normal">
                                {overview}
                            </p>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                            {/* Trailer Button */}
                            <button
                                type="button"
                                onClick={() => onPlayTrailer && onPlayTrailer(data)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-black border border-white/30 text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95 group/btn"
                            >
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className="text-xs text-violet-400 group-hover/btn:text-violet-600 transition-colors"
                                />
                                <span>Xem Trailer</span>
                            </button>

                            {/* Book Ticket Button */}
                            <Link
                                to={bookingUrl}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-violet-600/40 hover:shadow-violet-600/60 transition-all cursor-pointer active:scale-95"
                            >
                                <FontAwesomeIcon icon={faTicket} className="text-xs" />
                                <span>Đặt Vé Ngay</span>
                            </Link>

                            <Link
                                to={bookingUrl}
                                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs sm:text-sm font-semibold transition-all"
                            >
                                <FontAwesomeIcon icon={faFilm} className="text-xs text-zinc-400" />
                                <span>Chi Tiết Phim</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movie;