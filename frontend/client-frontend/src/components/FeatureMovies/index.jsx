import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faTicket,
    faStar,
    faClock,
    faCalendarDays,
    faChevronLeft,
    faChevronRight,
    faFire,
    faHeart,
    faCircleCheck,
    faFilm,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import RatingCard from "../RatingCard.jsx";
import { useSearchMoviesQuery } from "../../services/movieService.js";

// Curated & Verified Blockbusters for Hero Carousel (styled like rophim10.shop/phimhay)
const HERO_MOVIES = [
    {
        id: "dune-2",
        title: "Dune: Hành Tinh Cát - Phần Hai",
        originalTitle: "Dune: Part Two",
        releaseDate: "01/03/2026",
        rating: "T16",
        score: 9.6,
        duration: "166 phút",
        format: "IMAX 2D • Laser",
        genres: ["Khoa học viễn tưởng", "Phiêu lưu", "Hành động"],
        backdropPath: "https://image.tmdb.org/t/p/w1280/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
        overview: "Paul Atreides hợp lực cùng Chani và tộc người Fremen trong hành trình báo thù những kẻ đã hủy hoại gia tộc, đối mặt với sự giằng xé giữa tình yêu định mệnh và tương lai của vũ trụ.",
    },
    {
        id: "deadpool-wolverine",
        title: "Deadpool & Wolverine: Song Đấu Tối Thượng",
        originalTitle: "Deadpool & Wolverine",
        releaseDate: "26/07/2026",
        rating: "T18",
        score: 9.3,
        duration: "128 phút",
        format: "3D • Dolby Atmos",
        genres: ["Hành động", "Hài hước", "Viễn tưởng"],
        backdropPath: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
        overview: "Cặp bài trùng lầy lội tái xuất khi Cơ quan Quản lý Phương sai Thời gian lôi kéo Wade Wilson vào một sứ mệnh giải cứu đa vũ trụ cùng người đồng đội bất đắc dĩ Wolverine.",
    },
    {
        id: "gladiator-2",
        title: "Võ Sĩ Giác Đấu II",
        originalTitle: "Gladiator II",
        releaseDate: "15/11/2026",
        rating: "T18",
        score: 9.4,
        duration: "148 phút",
        format: "IMAX 2D • 4DX",
        genres: ["Hành động", "Lịch sử", "Sử thi"],
        backdropPath: "https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
        trailerUrl: "https://www.youtube.com/embed/4rgYUipGJNo",
        overview: "Tiếp nối thiên sử thi của đạo diễn Ridley Scott, Lucius bước vào Đấu trường La Mã khốc liệt để giành lại tự do và vinh quang cho người dân thành Rome.",
    },
    {
        id: "conan-million-dollar-star",
        title: "Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh",
        originalTitle: "Detective Conan: The Million-dollar Pentagram",
        releaseDate: "02/08/2026",
        rating: "P",
        score: 9.5,
        duration: "110 phút",
        format: "2D Lồng tiếng • Phụ đề",
        genres: ["Hoạt hình", "Trinh thám", "Hành động"],
        backdropPath: "https://image.tmdb.org/t/p/w1280/unthV1mq9llhEinIMPcCUImFodt.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
        trailerUrl: "https://www.youtube.com/embed/K84CjJ6Z6rI",
        overview: "Màn so tài mãn nhãn tại Hakodate giữa siêu đạo chích Kaito Kid, thám tử Heiji Hattori và Conan với cú twist chấn động về thân thế gia tộc Kuroba - Kudo.",
    },
    {
        id: "fantastic-four",
        title: "Bộ Tứ Siêu Đẳng: First Steps",
        originalTitle: "The Fantastic Four: First Steps",
        releaseDate: "25/07/2026",
        rating: "T13",
        score: 9.0,
        duration: "135 phút",
        format: "IMAX 3D • Dolby Atmos",
        genres: ["Khoa học viễn tưởng", "Hành động", "Phiêu lưu"],
        backdropPath: "https://image.tmdb.org/t/p/w1280/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg",
        trailerUrl: "https://www.youtube.com/embed/18QQWa3Wcx0",
        overview: "Gia đình siêu anh hùng đầu tiên của Marvel bước vào MCU trong bối cảnh retro-future thập niên 1960 chống lại hiểm họa nuốt chửng thế giới Galactus.",
    },
];

const FeatureMovies = ({ onPlayTrailer }) => {
    const { data: apiMovies = [] } = useSearchMoviesQuery({
        page: 0,
        size: 5,
        sort: "releaseDate,desc",
        filters: ['status:"NOW_PLAYING"'],
    });

    const movies = useMemo(() => {
        if (Array.isArray(apiMovies) && apiMovies.length > 0) {
            return apiMovies.map((m, idx) => {
                const fb = HERO_MOVIES[idx % HERO_MOVIES.length];
                return {
                    id: m.id || fb.id,
                    title: m.title || fb.title,
                    originalTitle: m.originalTitle || fb.originalTitle,
                    releaseDate: m.releaseDate || fb.releaseDate,
                    rating: m.ageRating || m.rating || fb.rating,
                    score: m.voteAverage || fb.score,
                    duration: m.duration ? `${m.duration} phút` : fb.duration,
                    format: fb.format,
                    genres: m.genres
                        ? (Array.isArray(m.genres) ? m.genres : m.genres.split(","))
                        : fb.genres,
                    backdropPath: m.backdropPath || m.imageUrl || fb.backdropPath,
                    posterPath: m.posterPath || fb.posterPath,
                    trailerUrl: m.trailerUrl || fb.trailerUrl,
                    overview: m.synopsis || m.overview || fb.overview,
                };
            });
        }
        return HERO_MOVIES;
    }, [apiMovies]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [bookmarked, setBookmarked] = useState({});

    const activeMovie = movies[currentIndex] || movies[0];

    const switchSlide = (newIndex) => {
        if (newIndex === currentIndex) return;
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setIsFading(false);
        }, 250);
    };

    const handleNext = () => {
        const next = (currentIndex + 1) % movies.length;
        switchSlide(next);
    };

    const handlePrev = () => {
        const prev = (currentIndex - 1 + movies.length) % movies.length;
        switchSlide(prev);
    };

    const handleToggleBookmark = (movieId, movieTitle) => {
        const nextState = !bookmarked[movieId];
        setBookmarked((prev) => ({ ...prev, [movieId]: nextState }));
        if (nextState) {
            toast.success(`❤️ Đã lưu "${movieTitle}" vào danh sách yêu thích!`, {
                position: "bottom-right",
                autoClose: 2500,
                theme: "dark",
            });
        } else {
            toast.info(`Đã bỏ lưu "${movieTitle}".`, {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark",
            });
        }
    };

    // Auto-slide every 6.5s unless paused
    useEffect(() => {
        if (movies.length <= 1 || isPaused) return;

        const timer = setInterval(() => {
            handleNext();
        }, 6500);

        return () => clearInterval(timer);
    }, [currentIndex, isPaused, movies.length]);

    // Preload next image
    useEffect(() => {
        const nextIdx = (currentIndex + 1) % movies.length;
        const nextMovie = movies[nextIdx];
        if (nextMovie?.backdropPath) new Image().src = nextMovie.backdropPath;
    }, [currentIndex, movies]);

    if (!activeMovie) return null;

    return (
        <section
            className="relative w-full h-[580px] sm:h-[620px] md:h-[680px] lg:h-[720px] overflow-hidden bg-[#07070b] select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Backdrop Image with Enhanced Vibrancy & Smooth Fade */}
            <div
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isFading ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
                }`}
            >
                {/* 1. Backdrop Image with High Dynamic Range, Rich Saturation & Contrast */}
                <img
                    src={activeMovie.backdropPath}
                    alt={activeMovie.title}
                    className="w-full h-full object-cover object-center filter brightness-[1.06] contrast-[1.14] saturate-[1.28] scale-105 transition-all duration-1000"
                    loading="eager"
                />

                {/* 2. RoPhim Signature Halftone Dotted Layer (Chấm nhỏ li li, gradient mờ nhẹ 0.2, chuẩn 100% RoPhim) */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none z-[3] opacity-20 sm:opacity-25"
                    style={{
                        backgroundImage: "url('/images/dotted.png')",
                        backgroundRepeat: "repeat",
                    }}
                />

                {/* 4. Directional Gradient Masks - Keeps Left Text Ultra-Crisp while Leaving Center & Right Artwork Vivid */}
                {/* Left Side Text Protection Gradient */}
                <div className="absolute inset-y-0 left-0 w-full sm:w-[85%] md:w-[70%] lg:w-[58%] bg-gradient-to-r from-[#07070b] via-[#07070b]/90 via-30% md:via-42% to-transparent z-[2]" />

                {/* Bottom Section Blend Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-[#07070b] via-[#07070b]/75 to-transparent z-[2]" />

                {/* Top Subtle Vignette for Navbar */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#07070b]/85 via-[#07070b]/40 to-transparent z-[2]" />

                {/* Right Edge Soft Feathering */}
                <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#07070b]/50 to-transparent z-[2]" />

                {/* 5. Luminous Neon Ambient Glows to Make Background Pop */}
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/25 rounded-full blur-[140px] pointer-events-none mix-blend-screen z-[1]" />
                <div className="absolute bottom-1/3 left-1/3 w-[420px] h-[420px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-[1]" />
                <div className="absolute top-12 right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none mix-blend-screen z-[1]" />
            </div>

            {/* Main Container: Left Content + Right RoPhim Thumbnail Carousel Rail */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end lg:justify-center pb-16 lg:pb-0">
                <div className="flex items-center justify-between gap-8 w-full">
                    {/* LEFT: Featured Movie Showcase Info */}
                    <div
                        className={`max-w-2xl lg:max-w-2xl xl:max-w-3xl space-y-3.5 transition-all duration-500 ${
                            isFading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
                        }`}
                    >
                        {/* Top Badges Row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-rose-600/40">
                                <FontAwesomeIcon icon={faFire} className="text-amber-300 text-[10px]" />
                                <span>Phim Hot Nhất</span>
                            </span>

                            <RatingCard rating={activeMovie.rating || "T13"} />

                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-[10px]" />
                                <span>{activeMovie.score} / 10</span>
                            </div>

                            <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-semibold">
                                {activeMovie.duration}
                            </span>

                            {activeMovie.format && (
                                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-violet-600/30 backdrop-blur-md border border-violet-500/40 text-violet-300 text-xs font-bold">
                                    {activeMovie.format}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-2xl">
                            {activeMovie.title}
                        </h1>

                        {/* Original Title Subtitle */}
                        {activeMovie.originalTitle && (
                            <p className="text-xs sm:text-sm text-violet-300 font-semibold tracking-wide italic">
                                {activeMovie.originalTitle}
                            </p>
                        )}

                        {/* Genres */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {(Array.isArray(activeMovie.genres)
                                ? activeMovie.genres
                                : [activeMovie.genres]
                            ).map((g, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 py-0.5 rounded-md bg-white/10 text-zinc-300 text-xs font-medium backdrop-blur-sm"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>

                        {/* Synopsis */}
                        {activeMovie.overview && (
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3 max-w-xl font-normal drop-shadow-md">
                                {activeMovie.overview}
                            </p>
                        )}

                        {/* Action Buttons Row */}
                        <div className="flex items-center gap-3 pt-3">
                            {/* Primary Button: Đặt vé ngay */}
                            <Link
                                to={`/movie/${activeMovie.id}`}
                                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-violet-600/40 hover:shadow-violet-600/60 transition-all cursor-pointer active:scale-95 group/btn"
                            >
                                <FontAwesomeIcon icon={faTicket} className="text-sm group-hover/btn:rotate-12 transition-transform" />
                                <span>Đặt Vé Ngay</span>
                            </Link>

                            {/* Secondary Button: Xem trailer */}
                            <button
                                type="button"
                                onClick={() => onPlayTrailer && onPlayTrailer(activeMovie)}
                                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-white/15 hover:bg-white text-white hover:text-black border border-white/30 backdrop-blur-md font-bold text-sm sm:text-base transition-all cursor-pointer active:scale-95 shadow-lg group/play"
                            >
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className="text-xs text-violet-400 group-hover/play:text-violet-600 transition-colors"
                                />
                                <span>Xem Trailer</span>
                            </button>

                            {/* Bookmark / Like Button */}
                            <button
                                type="button"
                                onClick={() => handleToggleBookmark(activeMovie.id, activeMovie.title)}
                                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
                                    bookmarked[activeMovie.id]
                                        ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/40"
                                        : "bg-black/50 hover:bg-white/20 border-white/20 text-zinc-300 hover:text-white"
                                }`}
                                title="Lưu phim yêu thích"
                            >
                                <FontAwesomeIcon icon={faHeart} className="text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: RoPhim-style Thumbnail Rail (Visible on lg screens) */}
                    <div className="hidden lg:flex flex-col justify-end w-80 xl:w-96 shrink-0 z-20">
                        {/* Rail Header with Slide Counter and Arrow Controls */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faFilm} className="text-violet-400" />
                                <span className="font-extrabold uppercase tracking-wider text-white">
                                    Phim Tiêu Điểm
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-zinc-400 font-bold">
                                    <strong className="text-violet-400">{String(currentIndex + 1).padStart(2, "0")}</strong> /{" "}
                                    {String(movies.length).padStart(2, "0")}
                                </span>

                                <div className="flex items-center gap-1 ml-2">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="w-7 h-7 rounded-lg bg-zinc-900/90 hover:bg-violet-600 text-zinc-400 hover:text-white border border-zinc-800 hover:border-violet-500 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                                        aria-label="Previous slide"
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="w-7 h-7 rounded-lg bg-zinc-900/90 hover:bg-violet-600 text-zinc-400 hover:text-white border border-zinc-800 hover:border-violet-500 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                                        aria-label="Next slide"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Rail Cards */}
                        <div className="space-y-2.5">
                            {movies.map((movie, idx) => {
                                const isActive = idx === currentIndex;
                                return (
                                    <div
                                        key={movie.id}
                                        onClick={() => switchSlide(idx)}
                                        className={`group relative flex items-center gap-3 p-2 rounded-xl transition-all duration-300 cursor-pointer border select-none ${
                                            isActive
                                                ? "bg-violet-950/60 border-violet-500 ring-1 ring-violet-500/50 shadow-lg shadow-violet-950/60 scale-[1.02]"
                                                : "bg-zinc-950/70 hover:bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700 opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        {/* Mini Poster */}
                                        <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                                            <img
                                                src={movie.posterPath || movie.backdropPath}
                                                alt={movie.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>

                                        {/* Mini Info */}
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`text-xs font-bold truncate transition-colors ${
                                                    isActive ? "text-violet-200" : "text-white group-hover:text-violet-300"
                                                }`}
                                            >
                                                {movie.title}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                                                {movie.duration} • {movie.releaseDate}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300">
                                                    <FontAwesomeIcon icon={faStar} className="text-[9px]" />
                                                    <span>{movie.score}</span>
                                                </span>
                                                <RatingCard rating={movie.rating || "T13"} />
                                            </div>
                                        </div>

                                        {/* Active Playing Indicator */}
                                        {isActive && (
                                            <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping shrink-0 mr-1" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Thumbnails Carousel (Visible on < lg) */}
                <div className="lg:hidden flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none">
                    {movies.map((movie, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={movie.id}
                                type="button"
                                onClick={() => switchSlide(idx)}
                                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-left ${
                                    isActive
                                        ? "bg-violet-600/40 border-violet-400 text-white shadow-md shadow-violet-600/30"
                                        : "bg-black/60 border-white/10 text-zinc-400"
                                }`}
                            >
                                <img
                                    src={movie.posterPath || movie.backdropPath}
                                    alt=""
                                    className="w-6 h-8 rounded object-cover"
                                />
                                <span className="text-xs font-bold max-w-[100px] truncate">
                                    {movie.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureMovies;