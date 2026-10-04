import React, { useMemo } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faStar, faArrowRight, faClock } from "@fortawesome/free-solid-svg-icons";
import { useSearchMoviesQuery } from "../../services/movieService.js";
import { NOW_PLAYING_MOVIES } from "../NowPlaying/nowPlayingData.js";
import RatingCard from "../RatingCard.jsx";

const NowPlayingList = ({ currentMovieId }) => {
    const { data: apiMovies = [] } = useSearchMoviesQuery({
        page: 0,
        size: 10,
        sort: "releaseDate,desc",
        filters: ['status:"NOW_PLAYING"'],
    });

    const displayMovies = useMemo(() => {
        let list = [];
        if (Array.isArray(apiMovies) && apiMovies.length > 0) {
            list = apiMovies;
        } else {
            list = NOW_PLAYING_MOVIES;
        }

        // Filter out current movie if present and take top 5
        return list
            .filter((m) => String(m.id) !== String(currentMovieId))
            .slice(0, 5);
    }, [apiMovies, currentMovieId]);

    return (
        <div className="rounded-3xl bg-zinc-950/70 border border-zinc-800/80 p-5 backdrop-blur-md shadow-xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-4 rounded-full bg-gradient-to-b from-rose-500 to-amber-500" />
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faFire} className="text-amber-400 text-xs" />
                        <span>Phim Đang Chiếu Hot</span>
                    </h3>
                </div>

                <Link
                    to="/now-playing"
                    className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors"
                >
                    <span>Xem tất cả</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </Link>
            </div>

            {/* Movie List */}
            <div className="space-y-3">
                {displayMovies.map((movie, index) => {
                    const score = movie.score || 9.0;
                    const rating = movie.rating || "T16";
                    const poster = movie.posterPath || movie.poster;
                    const duration = movie.duration || "120 phút";

                    // Safely extract genres
                    let genreText = "Hành động";
                    if (Array.isArray(movie.genres)) {
                        genreText = movie.genres.map(g => typeof g === 'object' ? g.name : g).slice(0, 2).join(", ");
                    } else if (typeof movie.genres === 'string') {
                        genreText = movie.genres.split(/[,·]/).slice(0, 2).join(", ");
                    }

                    return (
                        <Link
                            key={movie.id}
                            to={`/movie/${movie.id}`}
                            className="group flex items-center gap-3.5 p-2 rounded-2xl hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800 transition-all duration-200"
                        >
                            {/* Poster Thumbnail + Rank */}
                            <div className="relative w-14 sm:w-16 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                                <img
                                    src={poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div className={`absolute top-1 left-1 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                                    index === 0
                                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-md shadow-amber-500/40"
                                        : index === 1
                                        ? "bg-gradient-to-br from-slate-200 to-slate-400 text-black shadow-md shadow-slate-300/30"
                                        : index === 2
                                        ? "bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100"
                                        : "bg-black/70 text-zinc-300"
                                }`}>
                                    {index + 1}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <RatingCard rating={rating} />
                                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} className="text-[9px]" />
                                        <span>{duration}</span>
                                    </span>
                                </div>

                                <h4 className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-violet-400 transition-colors truncate">
                                    {movie.title}
                                </h4>

                                <p className="text-[11px] text-zinc-500 truncate">
                                    {genreText}
                                </p>

                                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                                    <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                                    <span>{score}</span>
                                    <span className="text-zinc-600 font-normal">/ 10</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Promo Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-950/60 to-purple-950/40 border border-violet-500/30 text-xs">
                <div className="flex items-center gap-2 font-bold text-violet-300 mb-1">
                    <span>🎁 Ưu Đãi Thành Viên CineMeow</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Tích điểm đổi bắp nước và giảm tới 20% khi thanh toán bằng ví điện tử Momo / ZaloPay.
                </p>
            </div>
        </div>
    );
};

export default NowPlayingList;