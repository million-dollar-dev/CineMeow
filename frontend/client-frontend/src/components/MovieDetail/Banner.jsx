import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faPlay, 
    faStar, 
    faTicket, 
    faClock, 
    faCalendarDays, 
    faLanguage, 
    faUserTie, 
    faUsers, 
    faChevronRight,
    faClapperboard,
    faFire,
    faShareNodes
} from "@fortawesome/free-solid-svg-icons";
import RatingCard from "../RatingCard.jsx";
import { toast } from "react-toastify";

const Banner = ({ movieInfo, onPlayTrailer, onScrollToShowtimes }) => {
    const [showAllOverview, setShowAllOverview] = useState(false);

    // Safely extract genres whether string, array of strings, or array of objects
    const formattedGenres = React.useMemo(() => {
        if (!movieInfo?.genres) return ["Hành động", "Kịch tính"];
        if (Array.isArray(movieInfo.genres)) {
            return movieInfo.genres.map(g => (typeof g === 'object' && g !== null ? g.name : String(g)));
        }
        if (typeof movieInfo.genres === 'string') {
            return movieInfo.genres.split(/[,·]/).map(s => s.trim()).filter(Boolean);
        }
        return ["Điện ảnh"];
    }, [movieInfo?.genres]);

    // Format score out of 10
    const score = movieInfo?.score || 9.2;
    const voteCount = movieInfo?.voteCount || "28.4K";
    const duration = movieInfo?.duration 
        ? (String(movieInfo.duration).includes("phút") ? movieInfo.duration : `${movieInfo.duration} phút`)
        : "125 phút";
    const releaseDate = movieInfo?.releaseDate || "Đang chiếu tại rạp";
    const rating = movieInfo?.rating || "T16";
    const formats = movieInfo?.format || movieInfo?.formats || "IMAX 2D • 2D Phụ đề";

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: movieInfo?.title || "CineMeow Cinema",
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Đã sao chép liên kết phim vào bộ nhớ tạm!", {
                theme: "dark",
                position: "bottom-right",
                autoClose: 2500,
            });
        }
    };

    return (
        <div className="relative w-full overflow-hidden bg-[#07070b] pt-24 sm:pt-28 pb-12 sm:pb-16 select-none border-b border-zinc-800/60">
            {/* 1. Backdrop Background Artwork with Smooth Fade */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                    src={movieInfo?.backdropPath || movieInfo?.posterPath}
                    alt={movieInfo?.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.12] saturate-[1.25] scale-105 transition-transform duration-1000"
                />

                {/* 2. RoPhim Dotted Halftone Texture Layer */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none z-[2] opacity-20 sm:opacity-25"
                    style={{
                        backgroundImage: "url('/images/dotted.png')",
                        backgroundRepeat: "repeat",
                    }}
                />

                {/* 3. Directional Vignette & Gradient Overlays */}
                <div className="absolute inset-y-0 left-0 w-full sm:w-[85%] md:w-[70%] lg:w-[60%] bg-gradient-to-r from-[#07070b] via-[#07070b]/90 via-35% md:via-45% to-transparent z-[1]" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#07070b] via-[#07070b]/80 to-transparent z-[1]" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07070b]/90 via-[#07070b]/50 to-transparent z-[1]" />
                <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#07070b]/60 to-transparent z-[1]" />

                {/* 4. Ambient Neon Glows */}
                <div className="absolute top-1/4 right-1/4 w-[480px] h-[480px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-1/3 left-1/4 w-[380px] h-[380px] bg-fuchsia-600/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            </div>

            {/* 2. Main Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
                    <Link to="/" className="hover:text-violet-400 transition-colors">
                        Trang chủ
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                    <Link to="/now-playing" className="hover:text-violet-400 transition-colors">
                        Phim đang chiếu
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                    <span className="text-zinc-200 font-medium truncate max-w-[200px] sm:max-w-xs">
                        {movieInfo?.title}
                    </span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* LEFT COLUMN: 3D Poster Showcase + Trailer Button */}
                    <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center sm:items-start">
                        <div className="relative group w-56 sm:w-64 md:w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-950/40 bg-zinc-900">
                            <img
                                src={movieInfo?.posterPath || movieInfo?.backdropPath}
                                alt={movieInfo?.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Status badge */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-rose-600/40">
                                    <FontAwesomeIcon icon={faFire} className="text-amber-300 text-[10px]" />
                                    <span>Đang Chiếu</span>
                                </span>
                            </div>

                            {/* Age Rating Card top-right */}
                            <div className="absolute top-3 right-3 z-10">
                                <RatingCard rating={rating} />
                            </div>

                            {/* Play Trailer Floating Overlay Button */}
                            <button
                                type="button"
                                onClick={() => onPlayTrailer && onPlayTrailer(movieInfo)}
                                className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex flex-col items-center justify-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
                                title="Bấm để xem trailer"
                            >
                                <div className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-xl shadow-violet-600/50 scale-90 group-hover:scale-100 transition-transform">
                                    <FontAwesomeIcon icon={faPlay} className="ml-1 text-lg" />
                                </div>
                                <span className="text-xs font-bold tracking-wider uppercase drop-shadow-md">
                                    Xem Trailer
                                </span>
                            </button>
                        </div>

                        {/* Quick Action below Poster on desktop */}
                        <div className="w-full max-w-[280px] mt-4 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onPlayTrailer && onPlayTrailer(movieInfo)}
                                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/40 text-xs font-bold text-zinc-200 hover:text-white transition-all shadow-sm cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faPlay} className="text-violet-400 text-xs" />
                                <span>Xem Trailer</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                title="Chia sẻ phim"
                            >
                                <FontAwesomeIcon icon={faShareNodes} className="text-xs" />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Rich Movie Metadata & Synopsis */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-4">
                        {/* 1. Meta Badges Bar */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <RatingCard rating={rating} />

                            {/* Score Card */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-[11px]" />
                                <span>{score} / 10</span>
                                <span className="text-zinc-500 font-normal text-[11px] hidden sm:inline">
                                    ({voteCount} đánh giá)
                                </span>
                            </div>

                            {/* Duration */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-semibold">
                                <FontAwesomeIcon icon={faClock} className="text-zinc-400 text-[11px]" />
                                <span>{duration}</span>
                            </span>

                            {/* Release Date */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-semibold">
                                <FontAwesomeIcon icon={faCalendarDays} className="text-zinc-400 text-[11px]" />
                                <span>{releaseDate}</span>
                            </span>

                            {/* Formats badge */}
                            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-violet-600/20 backdrop-blur-md border border-violet-500/40 text-violet-300 text-xs font-bold">
                                <FontAwesomeIcon icon={faClapperboard} className="text-[10px]" />
                                <span>{typeof formats === 'string' ? formats : formats.join(" • ")}</span>
                            </span>
                        </div>

                        {/* 2. Movie Titles */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                                {movieInfo?.title}
                            </h1>
                            {movieInfo?.originalTitle && (
                                <p className="text-sm sm:text-base text-violet-300/90 font-medium italic mt-1">
                                    {movieInfo.originalTitle}
                                </p>
                            )}
                        </div>

                        {/* 3. Genres Pills */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            {formattedGenres.map((genre, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium backdrop-blur-sm transition-colors"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* 4. Action Buttons Row (CTA) */}
                        <div className="flex flex-wrap items-center gap-3.5 pt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (onScrollToShowtimes) {
                                        onScrollToShowtimes();
                                    } else {
                                        document.getElementById("showtimes-section")?.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-violet-600/40 hover:shadow-violet-600/60 transition-all cursor-pointer active:scale-95"
                            >
                                <FontAwesomeIcon icon={faTicket} className="text-sm" />
                                <span>Đặt Vé Ngay</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onPlayTrailer && onPlayTrailer(movieInfo)}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95"
                            >
                                <FontAwesomeIcon icon={faPlay} className="text-violet-400 text-xs" />
                                <span>Xem Trailer</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm border border-zinc-800 transition-colors cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-xs" />
                                <span>Đánh giá ({voteCount})</span>
                            </button>
                        </div>

                        {/* 5. Movie Synopsis */}
                        {movieInfo?.overview && (
                            <div className="pt-2 text-zinc-300 text-sm leading-relaxed max-w-3xl">
                                <p className={showAllOverview ? "" : "line-clamp-3"}>
                                    {movieInfo.overview}
                                </p>
                                {movieInfo.overview.length > 180 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAllOverview(!showAllOverview)}
                                        className="text-violet-400 hover:text-violet-300 text-xs font-bold mt-1.5 cursor-pointer underline underline-offset-4"
                                    >
                                        {showAllOverview ? "Thu gọn ▲" : "Xem thêm ▼"}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* 6. Production & Cast Specs Table */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80 max-w-3xl text-xs">
                            <div className="space-y-1">
                                <div className="text-zinc-500 font-medium flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faUserTie} className="text-[10px]" />
                                    <span>Đạo diễn</span>
                                </div>
                                <p className="text-zinc-200 font-semibold truncate">
                                    {movieInfo?.director || "Đang cập nhật"}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="text-zinc-500 font-medium flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                                    <span>Diễn viên</span>
                                </div>
                                <p className="text-zinc-200 font-semibold truncate" title={movieInfo?.actors || movieInfo?.cast}>
                                    {movieInfo?.actors || movieInfo?.cast || "Nhiều diễn viên"}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="text-zinc-500 font-medium flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faLanguage} className="text-[10px]" />
                                    <span>Ngôn ngữ</span>
                                </div>
                                <p className="text-zinc-200 font-semibold truncate">
                                    {movieInfo?.language || "Phụ đề tiếng Việt"}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="text-zinc-500 font-medium flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faClapperboard} className="text-[10px]" />
                                    <span>Định dạng</span>
                                </div>
                                <p className="text-zinc-200 font-semibold truncate">
                                    {typeof formats === 'string' ? formats : formats[0] || "2D • IMAX"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;