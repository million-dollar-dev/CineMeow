import React, { useState, useMemo } from "react";
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
    faTicket,
    faFire,
    faFilm,
    faChevronDown,
    faChevronUp,
    faXmark,
    faUsers,
    faAward,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";

import {
    MOVIE_REVIEWS_DATA,
    REVIEW_CATEGORIES,
    REVIEW_STATS,
} from "../data/reviewData.js";

// YouTube trailer embed IDs for top reviewed movies
const MOVIE_TRAILERS = {
    "dune-part-two": "Way9Dexny3w",
    "conan-million-dollar-star": "K84CjJ6Z6rI",
    "deadpool-and-wolverine": "73_1biulkYk",
    oppenheimer: "uYPbbksJxIg",
    "how-to-train-your-dragon-live-action": "unthV1mq9ll",
    "lat-mat-7-mot-dieu-uoc": "t6HIqrRAclM",
};

const TopReviewSection = ({
    title = "Bình Luận & Đánh Giá Nổi Bật",
    subtitle = "Những nhận xét chân thực, sắc sảo từ cộng đồng người xem và khán giả đã thưởng thức tại rạp.",
    initialCategory = "all",
    showStats = true,
    showTabs = true,
    defaultLimit = 3,
}) => {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTrailer, setActiveTrailer] = useState(null);

    // Track liked state per movie review card
    const [likedCards, setLikedCards] = useState({});

    const handleToggleLike = (movieId, initialLikes) => {
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

    // Filter reviews by selected category tab
    const filteredReviews = useMemo(() => {
        if (selectedCategory === "all") return MOVIE_REVIEWS_DATA;
        if (selectedCategory === "top-rated") {
            return MOVIE_REVIEWS_DATA.filter((item) => (item.rating || 0) >= 9.0);
        }
        if (selectedCategory === "now-playing") {
            return MOVIE_REVIEWS_DATA.filter(
                (item) => item.category === "now-playing" || item.isHot
            );
        }
        if (selectedCategory === "most-discussed") {
            return MOVIE_REVIEWS_DATA.filter(
                (item) =>
                    item.category === "most-discussed" ||
                    parseInt(item.commentsCount) >= 6
            );
        }
        return MOVIE_REVIEWS_DATA;
    }, [selectedCategory]);

    const displayedReviews = isExpanded
        ? filteredReviews
        : filteredReviews.slice(0, defaultLimit);

    return (
        <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-[#0a0a10] text-zinc-100 overflow-hidden border-t border-b border-zinc-900">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-10 right-10 w-[400px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(127,90,240,0.2)]">
                        <FontAwesomeIcon icon={faAward} className="text-amber-400 text-xs" />
                        <span>CỘNG ĐỒNG KHÁN GIẢ & CHUYÊN GIA</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        {title}
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Community Review Stats Bar */}
                {showStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
                                <FontAwesomeIcon icon={faStar} />
                            </div>
                            <div>
                                <p className="text-sm font-extrabold text-white leading-tight">
                                    {REVIEW_STATS.averageRating}
                                </p>
                                <p className="text-xs text-zinc-400">Đánh giá trung bình</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center font-bold text-base shrink-0">
                                <FontAwesomeIcon icon={faFilm} />
                            </div>
                            <div>
                                <p className="text-sm font-extrabold text-white leading-tight">
                                    {REVIEW_STATS.totalMovies}
                                </p>
                                <p className="text-xs text-zinc-400">Tác phẩm được chấm</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold text-base shrink-0">
                                <FontAwesomeIcon icon={faComment} />
                            </div>
                            <div>
                                <p className="text-sm font-extrabold text-white leading-tight">
                                    {REVIEW_STATS.totalComments}
                                </p>
                                <p className="text-xs text-zinc-400">Bình luận chân thực</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
                                <FontAwesomeIcon icon={faShieldHalved} />
                            </div>
                            <div>
                                <p className="text-sm font-extrabold text-white leading-tight">
                                    {REVIEW_STATS.verifiedReviewers}
                                </p>
                                <p className="text-xs text-zinc-400">Vé xem phim đã kiểm duyệt</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter Category Tabs */}
                {showTabs && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                        {REVIEW_CATEGORIES.map((tab) => {
                            const isActive = selectedCategory === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(tab.id);
                                        setIsExpanded(false);
                                    }}
                                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                                        isActive
                                            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-105"
                                            : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800"
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                    <span
                                        className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-zinc-800 text-zinc-400"
                                        }`}
                                    >
                                        {tab.id === "all"
                                            ? MOVIE_REVIEWS_DATA.length
                                            : tab.id === "top-rated"
                                            ? MOVIE_REVIEWS_DATA.filter((m) => m.rating >= 9.0).length
                                            : tab.id === "now-playing"
                                            ? MOVIE_REVIEWS_DATA.filter(
                                                  (m) => m.category === "now-playing" || m.isHot
                                              ).length
                                            : MOVIE_REVIEWS_DATA.filter(
                                                  (m) =>
                                                      m.category === "most-discussed" ||
                                                      parseInt(m.commentsCount) >= 6
                                              ).length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Review Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                                    {/* Movie Poster Backdrop Header */}
                                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-950">
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
                                                        MOVIE_TRAILERS[movie.id] ||
                                                        "Way9Dexny3w",
                                                })
                                            }
                                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-violet-600 hover:border-violet-500 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg group/play"
                                            title="Xem trailer"
                                        >
                                            <FontAwesomeIcon
                                                icon={faPlay}
                                                className="text-xs ml-0.5 group-hover/play:scale-110 transition-transform"
                                            />
                                        </button>

                                        {/* Top Badges */}
                                        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5">
                                            {movie.isHot && (
                                                <span className="px-2.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
                                                    <FontAwesomeIcon icon={faFire} className="text-amber-300" />
                                                    <span>HOT</span>
                                                </span>
                                            )}
                                            <span className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/10 text-zinc-300 text-[11px] font-medium">
                                                {movie.releaseYear || "2024"} • {movie.duration}
                                            </span>
                                        </div>

                                        {/* Bottom Information Overlay */}
                                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    to={reviewDetailUrl}
                                                    className="block font-black text-white text-base sm:text-lg truncate hover:text-violet-300 transition-colors"
                                                    title={movie.title}
                                                >
                                                    {movie.title}
                                                </Link>
                                                <p className="text-xs text-zinc-400 truncate">
                                                    {Array.isArray(movie.genres)
                                                        ? movie.genres.join(", ")
                                                        : movie.genres}
                                                </p>
                                            </div>

                                            {/* Score & Comments count */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="px-2.5 py-1 rounded-xl bg-violet-600 font-black text-white text-xs flex items-center gap-1 shadow-[0_0_12px_rgba(127,90,240,0.5)]">
                                                    <FontAwesomeIcon icon={faStar} className="text-amber-300 text-[10px]" />
                                                    <span>{movie.rating}</span>
                                                </div>
                                                <div className="px-2 py-1 rounded-xl bg-black/60 border border-white/10 text-zinc-300 text-xs flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faComment} className="text-[10px] text-zinc-400" />
                                                    <span>{movie.commentsCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Featured Review Content */}
                                    <div className="p-4 sm:p-5 space-y-4">
                                        {movie.featuredReview && (
                                            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/90 relative">
                                                {/* Decorative quote icon */}
                                                <FontAwesomeIcon
                                                    icon={faQuoteLeft}
                                                    className="absolute top-3 right-3 text-zinc-800 text-xl pointer-events-none"
                                                />

                                                {/* Reviewer info */}
                                                <div className="flex items-center gap-2.5 mb-2.5">
                                                    <img
                                                        src={movie.featuredReview.avatar}
                                                        alt={movie.featuredReview.user}
                                                        className="w-9 h-9 rounded-full object-cover border border-violet-500/40 shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-xs font-bold text-white truncate">
                                                                {movie.featuredReview.user}
                                                            </p>
                                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                                <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" />
                                                                <span>Vé thật</span>
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-zinc-400 truncate">
                                                            {movie.featuredReview.role} • {movie.featuredReview.time}
                                                        </p>
                                                    </div>

                                                    {/* Individual Score */}
                                                    <div className="shrink-0 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30">
                                                        {movie.featuredReview.score}/10
                                                    </div>
                                                </div>

                                                {/* Review quote body */}
                                                <p className="text-xs text-zinc-300 leading-relaxed italic line-clamp-3">
                                                    "{movie.featuredReview.content}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Recent community comments preview */}
                                        {movie.recentComments && movie.recentComments.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                                    <FontAwesomeIcon icon={faUsers} className="text-violet-400 text-xs" />
                                                    <span>Thảo luận mới nhất</span>
                                                </p>
                                                {movie.recentComments.slice(0, 1).map((cmt, cIdx) => (
                                                    <div
                                                        key={cIdx}
                                                        className="flex items-start gap-2 text-xs text-zinc-300 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/50"
                                                    >
                                                        <img
                                                            src={cmt.avatar}
                                                            alt={cmt.user}
                                                            className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <span className="font-semibold text-white mr-1.5">
                                                                {cmt.user}:
                                                            </span>
                                                            <span className="text-zinc-400 line-clamp-2">
                                                                {cmt.content}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Action Bar */}
                                <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                                    {/* Like button */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleLike(movie.id, movie.likesCount)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                            likeInfo.isLiked
                                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                                : "bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 border border-zinc-800"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className={`text-xs ${likeInfo.isLiked ? "scale-110" : ""}`}
                                        />
                                        <span>{totalLikes}</span>
                                    </button>

                                    {/* Links */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={movieBookingUrl}
                                            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1"
                                        >
                                            <FontAwesomeIcon icon={faTicket} className="text-violet-400 text-[10px]" />
                                            <span>Xem lịch</span>
                                        </Link>

                                        <Link
                                            to={reviewDetailUrl}
                                            className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/30 flex items-center gap-1 group/btn"
                                        >
                                            <span>Chi tiết</span>
                                            <FontAwesomeIcon
                                                icon={faArrowRight}
                                                className="text-[10px] group-hover/btn:translate-x-0.5 transition-transform"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Show More / Show Less Toggle Button */}
                {filteredReviews.length > defaultLimit && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold border border-zinc-700/80 hover:border-violet-500/60 shadow-lg transition-all cursor-pointer group"
                        >
                            <span>
                                {isExpanded
                                    ? `Thu gọn (hiện ${defaultLimit} phim)`
                                    : `Xem thêm ${filteredReviews.length - defaultLimit} phim có review nổi bật`}
                            </span>
                            <FontAwesomeIcon
                                icon={isExpanded ? faChevronUp : faChevronDown}
                                className="text-xs text-violet-400 group-hover:translate-y-0.5 transition-transform"
                            />
                        </button>

                        <Link
                            to="/reviews"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
                        >
                            <span>Xem Tất Cả Bài Phê Bình Điện Ảnh</span>
                            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </Link>
                    </div>
                )}
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
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
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

                        {/* Video Frame */}
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