import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faChevronRight,
    faFilm,
    faFire,
    faStar,
    faMagnifyingGlass,
    faXmark,
    faFilter,
    faRotateLeft,
    faCalendarDays,
    faBell,
    faBolt,
    faGift,
    faClapperboard,
    faTicket,
    faTags,
    faShieldHalved,
    faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import CustomDropdown from "../components/common/CustomDropdown.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import TopReviewSection from "../components/TopReviewSection.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";

import CommingSoonMovieCard from "../components/CommingSoon/CommingSoonMovieCard.jsx";
import TrailerModal from "../components/NowPlaying/TrailerModal.jsx";
import {
    COMMING_SOON_MOVIES,
    MONTH_OPTIONS,
    GENRE_OPTIONS,
    AGE_RATING_OPTIONS,
    SORT_OPTIONS,
} from "../components/CommingSoon/commingSoonData.js";
import { useGetAllMoviesQuery } from "../services/movieService.js";

const QUICK_FILTERS = [
    { id: "all", label: "Tất cả", icon: faFilm },
    { id: "presale", label: "🎟️ Đang Mở Bán Sớm", icon: faTicket },
    { id: "soon", label: "⚡ Khởi chiếu sớm (< 30 ngày)", icon: faBolt },
    { id: "imax", label: "🎬 IMAX / 3D", icon: faClapperboard },
    { id: "animation", label: "🍿 Hoạt hình & Gia đình", icon: null },
    { id: "action", label: "💥 Hành động & Viễn tưởng", icon: null },
];

const CommingSoonPage = () => {
    const catalogRef = useRef(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedQuickFilter, setSelectedQuickFilter] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [selectedAgeRating, setSelectedAgeRating] = useState("all");
    const [sortBy, setSortBy] = useState("release_asc");

    // Reminded movie IDs set
    const [remindedMovies, setRemindedMovies] = useState({});

    // Modal state
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);

    // API integration for upcoming movies if available
    const { data: apiMovies = [] } = useGetAllMoviesQuery();

    const allMovies = useMemo(() => {
        // Filter or combine apiMovies if upcoming category flag exists, otherwise use rich curated list
        const apiUpcoming = Array.isArray(apiMovies)
            ? apiMovies.filter((m) => m.status === "COMING_SOON" || m.isComingSoon)
            : [];

        if (apiUpcoming.length > 0) {
            return apiUpcoming.map((m, idx) => {
                const fallback = COMMING_SOON_MOVIES[idx % COMMING_SOON_MOVIES.length];
                return {
                    id: m.id || fallback.id,
                    title: m.title || fallback.title,
                    originalTitle: m.originalTitle || fallback.originalTitle,
                    genres: m.genres || fallback.genres,
                    rating: m.ageRating || m.rating || fallback.rating,
                    expectedScore: m.voteAverage || fallback.expectedScore,
                    wantToSeeCount: fallback.wantToSeeCount,
                    duration: m.duration ? `${m.duration} phút` : fallback.duration,
                    releaseDate: m.releaseDate || fallback.releaseDate,
                    releaseMonth: fallback.releaseMonth,
                    daysLeft: fallback.daysLeft,
                    formats: m.formats || fallback.formats,
                    poster: m.posterPath || m.imageUrl || fallback.poster,
                    trailerUrl: m.trailerUrl || fallback.trailerUrl,
                    isHot: m.isHot ?? fallback.isHot,
                    isPreSale: m.isPreSale ?? fallback.isPreSale,
                    synopsis: m.synopsis || fallback.synopsis,
                };
            });
        }
        return COMMING_SOON_MOVIES;
    }, [apiMovies]);

    // Filter & Sort logic
    const filteredMovies = useMemo(() => {
        return allMovies
            .filter((movie) => {
                // Search query
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    const matchesTitle = movie.title.toLowerCase().includes(q);
                    const matchesOriginal = movie.originalTitle?.toLowerCase().includes(q);
                    const matchesGenre = movie.genres.toLowerCase().includes(q);
                    if (!matchesTitle && !matchesOriginal && !matchesGenre) return false;
                }

                // Quick filter chips
                if (selectedQuickFilter === "presale" && !movie.isPreSale) return false;
                if (selectedQuickFilter === "soon" && (movie.daysLeft === undefined || movie.daysLeft > 30)) {
                    return false;
                }
                if (
                    selectedQuickFilter === "imax" &&
                    !movie.formats?.some((f) => f.includes("IMAX") || f.includes("3D"))
                ) {
                    return false;
                }
                if (
                    selectedQuickFilter === "animation" &&
                    !movie.genres.toLowerCase().includes("hoạt hình") &&
                    !movie.genres.toLowerCase().includes("gia đình")
                ) {
                    return false;
                }
                if (
                    selectedQuickFilter === "action" &&
                    !movie.genres.toLowerCase().includes("hành động") &&
                    !movie.genres.toLowerCase().includes("viễn tưởng")
                ) {
                    return false;
                }

                // Dropdown filters
                if (selectedMonth !== "all" && movie.releaseMonth !== selectedMonth) {
                    return false;
                }
                if (selectedGenre !== "all" && !movie.genres.includes(selectedGenre)) {
                    return false;
                }
                if (selectedAgeRating !== "all" && movie.rating !== selectedAgeRating) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "release_asc") {
                    return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
                }
                if (sortBy === "want_desc") {
                    const parseCount = (str) => parseFloat(str) * (str.includes("K") ? 1000 : 1);
                    return parseCount(b.wantToSeeCount || "0") - parseCount(a.wantToSeeCount || "0");
                }
                if (sortBy === "score_desc") {
                    return (b.expectedScore || 0) - (a.expectedScore || 0);
                }
                if (sortBy === "title_asc") {
                    return a.title.localeCompare(b.title);
                }
                return 0;
            });
    }, [
        allMovies,
        searchQuery,
        selectedQuickFilter,
        selectedMonth,
        selectedGenre,
        selectedAgeRating,
        sortBy,
    ]);

    const isFilterActive =
        searchQuery.trim() !== "" ||
        selectedQuickFilter !== "all" ||
        selectedMonth !== "all" ||
        selectedGenre !== "all" ||
        selectedAgeRating !== "all" ||
        sortBy !== "release_asc";

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedQuickFilter("all");
        setSelectedMonth("all");
        setSelectedGenre("all");
        setSelectedAgeRating("all");
        setSortBy("release_asc");
    };

    const handleToggleRemind = (movie, nextState) => {
        setRemindedMovies((prev) => ({
            ...prev,
            [movie.id]: nextState,
        }));

        if (nextState) {
            toast.success(
                `🔔 Đã bật nhắc nhở cho "${movie.title}"! CineMeow sẽ gửi thông báo khi rạp mở bán vé sớm.`,
                {
                    position: "bottom-right",
                    autoClose: 3500,
                    theme: "dark",
                }
            );
        } else {
            toast.info(`Đã tắt nhắc nhở cho "${movie.title}".`, {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark",
            });
        }
    };

    const scrollToCatalog = () => {
        if (!catalogRef.current) return;
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = catalogRef.current.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        document.title = "Phim Sắp Chiếu Tại Rạp | CineMeow - Đặt Vé & Nhận Nhắc Nhở Sớm";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0d] text-zinc-100 pt-20 sm:pt-24 pb-16 selection:bg-violet-600 selection:text-white">
            {/* Top Breadcrumb Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <nav className="flex items-center gap-2 text-xs text-zinc-400">
                    <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faHouse} className="text-violet-400 text-xs" />
                        <span>Trang chủ</span>
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-zinc-600" />
                    <span className="text-zinc-200 font-medium">Phim sắp chiếu</span>
                </nav>
            </div>

            {/* Cinematic Hero Header Section */}
            <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-[#131124] to-zinc-950 border border-violet-900/30 p-6 sm:p-10 md:p-12 shadow-2xl">
                    {/* Atmospheric Ambient Glow */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 left-10 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl">
                        {/* Cinema Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-semibold mb-4 shadow-[0_0_15px_rgba(127,90,240,0.25)]">
                            <FontAwesomeIcon icon={faClapperboard} className="text-violet-400 text-xs" />
                            <span>SIÊU PHẨM SẮP CÔNG CHIẾU • MÙA PHIM 2026 - 2027</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            Bom Tấn Điện Ảnh Sắp Ra Mắt &{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300">
                                Đặt Vé Sớm Nhất
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
                            Đón đầu những siêu phẩm điện ảnh đỉnh cao sắp đổ bộ các cụm rạp CGV, Lotte Cinema, BHD Star,
                            Beta, Cinestar toàn quốc. Đăng ký thông báo mở bán vé sớm, xem trailer độc quyền và không bỏ lỡ
                            suất chiếu đầu tiên.
                        </p>

                        {/* Highlights pills */}
                        <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-5 sm:mt-6">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-300">
                                <FontAwesomeIcon icon={faFilm} className="text-violet-400" />
                                <span>{allMovies.length}+ Phim sắp khởi chiếu</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-300">
                                <FontAwesomeIcon icon={faBell} className="text-amber-400" />
                                <span>Nhắc nhở mở bán vé tự động</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-300">
                                <FontAwesomeIcon icon={faTicket} className="text-rose-400" />
                                <span>Suất chiếu sớm & Vé Pre-sale</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-7 sm:mt-8">
                            <button
                                type="button"
                                onClick={scrollToCatalog}
                                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/40 hover:shadow-violet-600/60 transition-all cursor-pointer active:scale-95"
                            >
                                <FontAwesomeIcon icon={faCalendarDays} className="text-sm" />
                                <span>Xem Lịch Phim Sắp Ra Mắt</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const hotMovie = allMovies.find((m) => m.trailerUrl);
                                    if (hotMovie) setSelectedTrailerMovie(hotMovie);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faClapperboard} className="text-xs text-violet-300" />
                                <span>Xem Trailer Hot Nhất</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Upcoming Movies Showcase (MediaCarousel with centered title & stage backdrop) */}
            <div className="mb-10 sm:mb-14">
                <MediaCarousel
                    title="Top Phim Sắp Chiếu Được Mong Đợi Nhất"
                    subtitle="Bảng xếp hạng những siêu phẩm điện ảnh có lượng khán giả đặt quan tâm và ngóng chờ cao nhất phòng vé"
                    seeAllLink="#upcoming-catalog"
                />
            </div>

            {/* Master Catalog Section with Search, Filter and Grid */}
            <section ref={catalogRef} id="upcoming-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                {/* Catalog Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
                            <FontAwesomeIcon icon={faFilm} className="text-xs text-violet-400" />
                            <span>DANH MỤC PHIM SẮP RA MẮT</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Toàn Bộ Phim Sắp Khởi Chiếu
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm text-zinc-400">
                            Hiển thị <span className="text-violet-400 font-bold">{filteredMovies.length}</span> / {allMovies.length} phim
                        </span>
                        {isFilterActive && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                                <span>Đặt lại</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Controls Panel */}
                <div className="bg-[#10101a] border border-white/10 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
                    {/* Top Row: Search Input + Sort Dropdown */}
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        {/* Search Input Bar */}
                        <div className="relative flex-1">
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm phim sắp chiếu theo tên, tựa gốc, thể loại (Võ sĩ giác đấu, Avatar, Moana...)..."
                                className="w-full h-11 pl-11 pr-10 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="w-full md:w-64">
                            <CustomDropdown
                                options={SORT_OPTIONS}
                                value={sortBy}
                                onChange={setSortBy}
                                icon={faArrowDownWideShort}
                                placeholder="Sắp xếp danh sách"
                            />
                        </div>
                    </div>

                    {/* Quick Filter Category Chips */}
                    <div className="flex flex-wrap gap-2 pt-3 pb-3 border-t border-zinc-800/80">
                        {QUICK_FILTERS.map((chip) => {
                            const isActive = selectedQuickFilter === chip.id;
                            return (
                                <button
                                    key={chip.id}
                                    type="button"
                                    onClick={() => setSelectedQuickFilter(chip.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                                            : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
                                    }`}
                                >
                                    {chip.icon && (
                                        <FontAwesomeIcon
                                            icon={chip.icon}
                                            className={`text-[10px] ${isActive ? "text-white" : "text-violet-400"}`}
                                        />
                                    )}
                                    <span>{chip.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Secondary Dropdown Filters: Month, Genre, Age Rating */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800/80">
                        {/* Month Filter */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase text-zinc-400 mb-1.5">
                                Tháng Khởi Chiếu
                            </label>
                            <CustomDropdown
                                options={MONTH_OPTIONS}
                                value={selectedMonth}
                                onChange={setSelectedMonth}
                                icon={faCalendarDays}
                                placeholder="Tất cả các tháng"
                            />
                        </div>

                        {/* Genre Filter */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase text-zinc-400 mb-1.5">
                                Thể Loại Phim
                            </label>
                            <CustomDropdown
                                options={GENRE_OPTIONS}
                                value={selectedGenre}
                                onChange={setSelectedGenre}
                                icon={faTags}
                                placeholder="Tất cả thể loại"
                            />
                        </div>

                        {/* Age Rating Filter with RatingCard embedded in options */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase text-zinc-400 mb-1.5">
                                Độ Tuổi Khán Giả
                            </label>
                            <CustomDropdown
                                options={AGE_RATING_OPTIONS}
                                value={selectedAgeRating}
                                onChange={setSelectedAgeRating}
                                icon={faShieldHalved}
                                placeholder="Tất cả độ tuổi"
                            />
                        </div>
                    </div>
                </div>

                {/* Active Filter Indicators Summary Bar */}
                {isFilterActive && (
                    <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-300">Đang lọc theo:</span>
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                                Từ khóa: "{searchQuery}"
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="cursor-pointer ml-1 hover:text-white"
                                    onClick={() => setSearchQuery("")}
                                />
                            </span>
                        )}
                        {selectedQuickFilter !== "all" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                                Mục: {QUICK_FILTERS.find((q) => q.id === selectedQuickFilter)?.label}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="cursor-pointer ml-1 hover:text-white"
                                    onClick={() => setSelectedQuickFilter("all")}
                                />
                            </span>
                        )}
                        {selectedMonth !== "all" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                                Tháng: {MONTH_OPTIONS.find((m) => m.value === selectedMonth)?.label}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="cursor-pointer ml-1 hover:text-white"
                                    onClick={() => setSelectedMonth("all")}
                                />
                            </span>
                        )}
                        {selectedGenre !== "all" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                                Thể loại: {selectedGenre}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="cursor-pointer ml-1 hover:text-white"
                                    onClick={() => setSelectedGenre("all")}
                                />
                            </span>
                        )}
                        {selectedAgeRating !== "all" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                                Độ tuổi: {selectedAgeRating}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="cursor-pointer ml-1 hover:text-white"
                                    onClick={() => setSelectedAgeRating("all")}
                                />
                            </span>
                        )}
                    </div>
                )}

                {/* Movie Grid */}
                {filteredMovies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                        {filteredMovies.map((movie) => (
                            <CommingSoonMovieCard
                                key={movie.id}
                                movie={movie}
                                onPlayTrailer={(m) => setSelectedTrailerMovie(m)}
                                onToggleRemind={handleToggleRemind}
                                isReminded={!!remindedMovies[movie.id]}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty Search/Filter State */
                    <div className="py-16 px-4 text-center rounded-2xl bg-[#12121e]/40 border border-white/5 max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-full bg-violet-600/15 text-violet-400 flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
                            <FontAwesomeIcon icon={faFilm} className="text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            Không tìm thấy phim sắp chiếu phù hợp
                        </h3>
                        <p className="text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
                            Rất tiếc, không có bộ phim sắp ra mắt nào khớp với bộ lọc hoặc từ khóa bạn vừa nhập. Hãy thử thay đổi tiêu chí lọc.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                            <span>Đặt lại toàn bộ bộ lọc</span>
                        </button>
                    </div>
                )}
            </section>

            {/* Exclusive Pre-Sale & Membership Perks Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-950 via-[#18122c] to-indigo-950 border border-violet-500/30 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3">
                            <FontAwesomeIcon icon={faGift} className="text-amber-400" />
                            <span>ĐẶC QUYỀN THÀNH VIÊN CINEMEOW</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">
                            Nhận Vé Suất Chiếu Sớm & Quà Tặng Độc Quyền
                        </h3>
                        <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                            Đăng ký nhận thông báo sớm qua ứng dụng CineMeow để có cơ hội sở hữu vé premier, combo bắp nước giới hạn và bốc thăm trúng quà kỷ niệm từ các hãng phim Disney, Warner Bros, Marvel!
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                        <Link
                            to="/promotions"
                            className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-lg text-center"
                        >
                            Xem Ưu Đãi Mở Bán
                        </Link>
                        <Link
                            to="/showtimes/today"
                            className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-violet-600/40 text-center"
                        >
                            Lịch Chiếu Hôm Nay
                        </Link>
                    </div>
                </div>
            </section>

            {/* Top Review Section */}
            <div className="mb-14">
                <TopReviewSection
                    title="Bình Luận & Đánh Giá Phim Chiếu Rạp Mới Nhất"
                    subtitle="Tham khảo đánh giá chân thực từ cộng đồng trước khi chọn siêu phẩm khởi chiếu tiếp theo"
                />
            </div>

            {/* Movie News & Previews Blog Section */}
            <div className="mb-14">
                <MovieBlogSection />
            </div>

            {/* Promotions Section */}
            <div className="mb-8">
                <PromotionSection />
            </div>

            {/* Trailer Modal */}
            <TrailerModal
                isOpen={!!selectedTrailerMovie}
                movie={selectedTrailerMovie}
                onClose={() => setSelectedTrailerMovie(null)}
            />
        </div>
    );
};

export default CommingSoonPage;