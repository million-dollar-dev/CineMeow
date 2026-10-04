import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComment,
    faStar,
    faHeart,
    faPlay,
    faArrowRight,
    faShieldHalved,
    faQuoteLeft,
    faFire,
    faXmark,
    faTicket,
} from "@fortawesome/free-solid-svg-icons";

import { MOVIE_REVIEWS_DATA } from "../data/reviewData.js";

// YouTube trailer embed IDs for featured review movies
const MOVIE_TRAILERS = {
    "dune-part-two": "Way9Dexny3w",
    "conan-million-dollar-star": "K84CjJ6Z6rI",
    "deadpool-and-wolverine": "73_1biulkYk",
    oppenheimer: "uYPbbksJxIg",
};

const TopReviewSection = ({
    title = "Bình Luận & Đánh Giá Nổi Bật",
    limit = 3,
}) => {
    const [activeTrailer, setActiveTrailer] = useState(null);

    // Track liked state per card
    const [likedCards, setLikedCards] = useState({});

    const handleToggleLike = (movieId) => {
        setLikedCards((prev) => {
            const currentLiked = !!prev[movieId]?.isLiked;
            const currentDelta = prev[movieId]?.delta || 0;
            const nextLiked = !currentLiked;
            const nextDelta = nextLiked ? currentDelta + 1 : currentDelta - 1;

            return {
                ...prev,
                [movieId]: {
                    isLiked: nextLiked,
                    delta: nextDelta,
                },
            };
        });
    };

    // Take top 3 curated reviews to fit in 1 compact screen frame
    const displayedReviews = MOVIE_REVIEWS_DATA.slice(0, limit);

    return (
        <section className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-[#0a0a10] text-zinc-100 overflow-hidden border-t border-b border-zinc-900">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                {/* Header (Clean title without subtitle or filter buttons, with direct 'Xem tất cả' link) */}
                <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-zinc-800/80">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                        {title}
                    </h2>

                    <Link
                        to="/reviews"
                        className="text-xs sm:text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors shrink-0 group"
                    >
                        <span>Xem tất cả đánh giá</span>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-xs group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>

                {/* 3 Review Cards Grid (Fits perfectly in 1 viewport row) */}
                <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
                    {displayedReviews.map((movie) => {
                        const likeInfo = likedCards[movie.id] || { isLiked: false, delta: 0 };
                        const totalLikes = (movie.likesCount || 100) + likeInfo.delta;
                        const reviewDetailUrl = `/movies/${movie.movieId || movie.id}/review`;
                        const movieBookingUrl = `/movie/${movie.movieId || movie.id}`;

                        return (
                            <div
                                key={movie.id}
                                className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900/90 via-[#12111d] to-[#0c0b14] border border-zinc-800/80 hover:border-violet-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/20 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Movie Backdrop Header */}
                                    <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-zinc-950">
                                        <img
                                            src={movie.backdrop || movie.poster}
                                            alt={movie.title}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-75"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#12111d] via-[#12111d]/50 to-transparent" />

                                        {/* Play Trailer Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveTrailer({
                                                    title: movie.title,
                                                    trailerId:
                                                        MOVIE_TRAILERS[movie.id] || "Way9Dexny3w",
                                                })
                                            }
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-violet-600 hover:border-violet-500 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg group/play"
                                            title="Xem trailer"
                                        >
                                            <FontAwesomeIcon
                                                icon={faPlay}
                                                className="text-[10px] ml-0.5 group-hover/play:scale-110 transition-transform"
                                            />
                                        </button>

                                        {/* Top Badges */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            {movie.isHot && (
                                                <span className="px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                                                    <FontAwesomeIcon icon={faFire} className="text-amber-300 text-[9px]" />
                                                    <span>HOT</span>
                                                </span>
                                            )}
                                            <span className="px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-medium">
                                                {movie.releaseYear || "2024"} • {movie.duration}
                                            </span>
                                        </div>

                                        {/* Movie Title & Rating overlay */}
                                        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    to={reviewDetailUrl}
                                                    className="block font-black text-white text-sm sm:text-base truncate hover:text-violet-300 transition-colors"
                                                    title={movie.title}
                                                >
                                                    {movie.title}
                                                </Link>
                                                <p className="text-[11px] text-zinc-400 truncate">
                                                    {Array.isArray(movie.genres)
                                                        ? movie.genres.join(", ")
                                                        : movie.genres}
                                                </p>
                                            </div>

                                            {/* Score & Comments count */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <div className="px-2 py-0.5 rounded-lg bg-violet-600 font-black text-white text-[11px] flex items-center gap-1 shadow-md shadow-violet-600/40">
                                                    <FontAwesomeIcon icon={faStar} className="text-amber-300 text-[9px]" />
                                                    <span>{movie.rating}</span>
                                                </div>
                                                <div className="px-1.5 py-0.5 rounded-lg bg-black/60 border border-white/10 text-zinc-300 text-[10px] flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faComment} className="text-[9px] text-zinc-400" />
                                                    <span>{movie.commentsCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Featured Review Content (Bỏ phần bình luận mới nhất, giữ lại review trích dẫn nổi bật) */}
                                    <div className="p-3.5 space-y-3">
                                        {movie.featuredReview && (
                                            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/90 relative">
                                                <FontAwesomeIcon
                                                    icon={faQuoteLeft}
                                                    className="absolute top-2.5 right-2.5 text-zinc-800 text-lg pointer-events-none"
                                                />

                                                {/* Reviewer info */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <img
                                                        src={movie.featuredReview.avatar}
                                                        alt={movie.featuredReview.user}
                                                        className="w-7 h-7 rounded-full object-cover border border-violet-500/40 shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1">
                                                            <p className="text-xs font-bold text-white truncate">
                                                                {movie.featuredReview.user}
                                                            </p>
                                                            <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                                <FontAwesomeIcon icon={faShieldHalved} className="text-[8px]" />
                                                                <span>Vé thật</span>
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-zinc-400 truncate">
                                                            {movie.featuredReview.role} • {movie.featuredReview.time}
                                                        </p>
                                                    </div>

                                                    {/* Individual Score */}
                                                    <div className="shrink-0 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-extrabold text-[11px] border border-amber-500/30">
                                                        {movie.featuredReview.score}/10
                                                    </div>
                                                </div>

                                                {/* Review quote body */}
                                                <p className="text-xs text-zinc-300 leading-relaxed italic line-clamp-3">
                                                    "{movie.featuredReview.content}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Action Bar */}
                                <div className="px-3.5 pb-3.5 pt-1 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                                    {/* Like button */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleLike(movie.id)}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                            likeInfo.isLiked
                                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                                : "bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 border border-zinc-800"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className={`text-[11px] ${likeInfo.isLiked ? "scale-110" : ""}`}
                                        />
                                        <span>{totalLikes}</span>
                                    </button>

                                    {/* Action Links */}
                                    <div className="flex items-center gap-1.5">
                                        <Link
                                            to={movieBookingUrl}
                                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1"
                                        >
                                            <FontAwesomeIcon icon={faTicket} className="text-violet-400 text-[10px]" />
                                            <span>Xem lịch</span>
                                        </Link>

                                        <Link
                                            to={reviewDetailUrl}
                                            className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/30 flex items-center gap-1 group/btn"
                                        >
                                            <span>Chi tiết</span>
                                            <FontAwesomeIcon
                                                icon={faArrowRight}
                                                className="text-[9px] group-hover/btn:translate-x-0.5 transition-transform"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Embedded Trailer Modal */}
            {activeTrailer && (
                <div
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setActiveTrailer(null)}
                >
                    <div
                        className="relative w-full max-w-4xl bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/80">
                            <h3 className="font-bold text-white text-sm sm:text-base truncate">
                                Trailer: {activeTrailer.title}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setActiveTrailer(null)}
                                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                src={`https://www.youtube.com/embed/${activeTrailer.trailerId}?autoplay=1`}
                                title={activeTrailer.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TopReviewSection;