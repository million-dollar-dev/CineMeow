import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faChevronRight,
    faTicket,
    faFilm,
    faStar,
    faFire,
    faMagnifyingGlass,
    faXmark,
    faFilter,
    faRotateLeft,
    faArrowRight,
    faCalendarDays,
    faBolt,
    faGift,
    faClapperboard,
    faTags,
    faShieldHalved,
    faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";

import CustomDropdown from "../components/common/CustomDropdown.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import TopReviewSection from "../components/TopReviewSection.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";

import NowPlayingMovieCard from "../components/NowPlaying/NowPlayingMovieCard.jsx";
import TrailerModal from "../components/NowPlaying/TrailerModal.jsx";
import {
    NOW_PLAYING_MOVIES,
    GENRE_OPTIONS,
    FORMAT_OPTIONS,
    AGE_RATING_OPTIONS,
    SORT_OPTIONS,
} from "../components/NowPlaying/nowPlayingData.js";
import { useGetAllMoviesQuery } from "../services/movieService.js";

const QUICK_FILTERS = [
    { id: "all", label: "Tất cả", icon: faFilm },
    { id: "hot", label: "🔥 Phim Hot nhất", icon: faFire },
    { id: "highRating", label: "⭐ Điểm cao (>= 8.8)", icon: faStar },
    { id: "imax", label: "🎬 IMAX / 3D", icon: faClapperboard },
    { id: "animation", label: "🍿 Hoạt hình & Gia đình", icon: null },
    { id: "action", label: "💥 Hành động & Viễn tưởng", icon: null },
];

const NowPlayingPage = () => {
    const catalogRef = useRef(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedQuickFilter, setSelectedQuickFilter] = useState("all");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [selectedFormat, setSelectedFormat] = useState("all");
    const [selectedAgeRating, setSelectedAgeRating] = useState("all");
    const [sortBy, setSortBy] = useState("score_desc");

    // Modal state
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);

    // API integration with rich fallback
    const { data: apiMovies = [] } = useGetAllMoviesQuery();

    const allMovies = useMemo(() => {
        if (Array.isArray(apiMovies) && apiMovies.length > 0) {
            return apiMovies.map((m, idx) => {
                const fallback = NOW_PLAYING_MOVIES[idx % NOW_PLAYING_MOVIES.length];
                return {
                    id: m.id || fallback.id,
                    title: m.title || fallback.title,
                    originalTitle: m.originalTitle || fallback.originalTitle,
                    genres: m.genres || fallback.genres,
                    rating: m.ageRating || m.rating || fallback.rating,
                    score: m.voteAverage || fallback.score,
                    voteCount: fallback.voteCount,
                    duration: m.duration ? `${m.duration} phút` : fallback.duration,
                    releaseDate: m.releaseDate || fallback.releaseDate,
                    formats: m.formats || fallback.formats,
                    poster: m.posterPath || m.imageUrl || fallback.poster,
                    trailerUrl: m.trailerUrl || fallback.trailerUrl,
                    isHot: m.isHot ?? fallback.isHot,
                    isEarlyScreening: m.isEarlyScreening ?? fallback.isEarlyScreening,
                    synopsis: m.synopsis || fallback.synopsis,
                };
            });
        }
        return NOW_PLAYING_MOVIES;
    }, [apiMovies]);

    // Filtered & Sorted Movies
    const filteredMovies = useMemo(() => {
        return allMovies
            .filter((movie) => {
                // Search query
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    const matchesTitle = movie.title.toLowerCase().includes(q);
                    const matchesGenre = movie.genres.toLowerCase().includes(q);
                    if (!matchesTitle && !matchesGenre) return false;
                }

                // Quick filter chips
                if (selectedQuickFilter === "hot" && !movie.isHot) return false;
                if (selectedQuickFilter === "highRating" && (movie.score || 0) < 8.8) return false;
                if (
                    selectedQuickFilter === "imax" &&
                    !movie.formats?.some((f) => f.includes("IMAX") || f.includes("3D"))
                )
                    return false;
                if (
                    selectedQuickFilter === "animation" &&
                    !movie.genres.toLowerCase().includes("hoạt hình") &&
                    !movie.genres.toLowerCase().includes("gia đình")
                )
                    return false;
                if (
                    selectedQuickFilter === "action" &&
                    !movie.genres.toLowerCase().includes("hành động") &&
                    !movie.genres.toLowerCase().includes("viễn tưởng")
                )
                    return false;

                // Dropdown filters
                if (selectedGenre !== "all" && !movie.genres.includes(selectedGenre)) return false;
                if (
                    selectedFormat !== "all" &&
                    !movie.formats?.some((f) => f.toLowerCase().includes(selectedFormat.toLowerCase()))
                )
                    return false;
                if (selectedAgeRating !== "all" && movie.rating !== selectedAgeRating) return false;

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "score_desc") return (b.score || 0) - (a.score || 0);
                if (sortBy === "hot") return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
                if (sortBy === "title_asc") return a.title.localeCompare(b.title);
                if (sortBy === "duration_desc") {
                    const durA = parseInt(a.duration) || 0;
                    const durB = parseInt(b.duration) || 0;
                    return durB - durA;
                }
                return 0;
            });
    }, [
        allMovies,
        searchQuery,
        selectedQuickFilter,
        selectedGenre,
        selectedFormat,
        selectedAgeRating,
        sortBy,
    ]);

    const isFilterActive =
        searchQuery.trim() !== "" ||
        selectedQuickFilter !== "all" ||
        selectedGenre !== "all" ||
        selectedFormat !== "all" ||
        selectedAgeRating !== "all" ||
        sortBy !== "score_desc";

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedQuickFilter("all");
        setSelectedGenre("all");
        setSelectedFormat("all");
        setSelectedAgeRating("all");
        setSortBy("score_desc");
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
        document.title = "Phim Đang Chiếu Tại Rạp | CineMeow - Đặt Vé Xem Phim Toàn Quốc";
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
                    <span className="text-zinc-200 font-medium">Phim đang chiếu</span>
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
                            <span>PHIM ĐANG CÔNG CHIẾU TẠI RẠP</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            Phim Chiếu Rạp Mới Nhất &{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300">
                                Hot Nhất Hôm Nay
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
                            Thưởng thức những tác phẩm điện ảnh bom tấn xuất sắc nhất tại các hệ thống rạp CGV, Lotte
                            Cinema, BHD Star, Beta, Cinestar trên toàn quốc. Đặt vé nhanh chóng, chọn ghế ngồi ưng ý và
                            nhận nhiều ưu đãi độc quyền.
                        </p>

                        {/* Highlights pills */}
                        <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-5 sm:mt-6">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-300">
                                <FontAwesomeIcon icon={faFilm} className="text-violet-400" />
                                <span>{allMovies.length}+ Phim đang chiếu</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-300">
                                <FontAwesomeIcon icon={faBolt} className="text-amber-400" />
                                <span>Cập nhật suất chiếu tức thì</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-300">
                                <FontAwesomeIcon icon={faGift} className="text-rose-400" />
                                <span>Ưu đãi vé xem phim từ 45k</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-7 sm:mt-8">
                            <Link
                                to="/showtimes/today"
                                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/40 hover:shadow-violet-600/60 transition-all cursor-pointer active:scale-95"
                            >
                                <FontAwesomeIcon icon={faCalendarDays} className="text-sm" />
                                <span>Xem Lịch Chiếu Hôm Nay</span>
                            </Link>

                            <button
                                type="button"
                                onClick={scrollToCatalog}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faFilter} className="text-xs text-violet-300" />
                                <span>Khám Phá Danh Sách Phim</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Movies Showcase (MediaCarousel with centered title & stage backdrop) */}
            <div className="mb-10 sm:mb-14">
                <MediaCarousel
                    title="Top Phim Đang Chiếu Hot Nhất"
                    subtitle="Bảng xếp hạng những siêu phẩm điện ảnh ăn khách nhất đang gây sốt tại các phòng vé toàn quốc"
                    seeAllLink="#movie-catalog"
                />
            </div>

            {/* Master Catalog Section with Search, Filter and Grid */}
            <section ref={catalogRef} id="movie-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                {/* Catalog Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
                            <FontAwesomeIcon icon={faFilm} className="text-xs text-violet-400" />
                            <span>DANH MỤC ĐIỆN ẢNH</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Toàn Bộ Phim Đang Chiếu
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm text-zinc-400">
                            Hiển thị:{" "}
                            <strong className="text-violet-300 font-bold">{filteredMovies.length}</strong> /{" "}
                            {allMovies.length} phim
                        </span>
                        {isFilterActive && (
                            <button
                                onClick={handleResetFilters}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRotateLeft} className="text-violet-400 text-xs" />
                                <span>Đặt lại bộ lọc</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Filter Category Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 custom-scrollbar">
                    {QUICK_FILTERS.map((chip) => {
                        const active = selectedQuickFilter === chip.id;
                        return (
                            <button
                                key={chip.id}
                                type="button"
                                onClick={() => setSelectedQuickFilter(chip.id)}
                                className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                    active
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-500"
                                        : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5"
                                }`}
                            >
                                {chip.icon && <FontAwesomeIcon icon={chip.icon} className="text-xs" />}
                                <span>{chip.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Advanced Search & Dropdown Controls Bar */}
                <div className="relative z-30 bg-[#141424] rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                        {/* Search Input */}
                        <div className="relative sm:col-span-2 lg:col-span-1">
                            <div className="relative w-full h-10">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm tên phim, thể loại..."
                                    className="w-full h-full pl-9 pr-8 bg-zinc-950/80 rounded-xl border border-zinc-800 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/40 transition-all"
                                />
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
                                        aria-label="Xóa tìm kiếm"
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Thể loại */}
                        <div>
                            <CustomDropdown
                                icon={faTags}
                                options={GENRE_OPTIONS}
                                value={selectedGenre}
                                onChange={setSelectedGenre}
                                headerTitle="Thể Loại Phim"
                                align="left"
                                dropdownWidth="w-56"
                            />
                        </div>

                        {/* Định dạng */}
                        <div>
                            <CustomDropdown
                                icon={faFilm}
                                options={FORMAT_OPTIONS}
                                value={selectedFormat}
                                onChange={setSelectedFormat}
                                headerTitle="Định Dạng Chiếu"
                                align="left"
                                dropdownWidth="w-56"
                            />
                        </div>

                        {/* Độ tuổi */}
                        <div>
                            <CustomDropdown
                                icon={faShieldHalved}
                                options={AGE_RATING_OPTIONS}
                                value={selectedAgeRating}
                                onChange={setSelectedAgeRating}
                                headerTitle="Độ Tuổi Khán Giả"
                                align="left"
                                dropdownWidth="w-64"
                            />
                        </div>

                        {/* Sắp xếp */}
                        <div>
                            <CustomDropdown
                                icon={faArrowDownWideShort}
                                options={SORT_OPTIONS}
                                value={sortBy}
                                onChange={setSortBy}
                                headerTitle="Sắp Xếp Theo"
                                align="right"
                                dropdownWidth="w-56"
                            />
                        </div>
                    </div>
                </div>

                {/* Movie Grid */}
                {filteredMovies.length > 0 ? (
                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {filteredMovies.map((movie) => (
                            <NowPlayingMovieCard
                                key={movie.id}
                                movie={movie}
                                onPlayTrailer={(m) => setSelectedTrailerMovie(m)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty Search State */
                    <div className="text-center py-16 px-4 bg-zinc-950/60 rounded-3xl border border-zinc-800">
                        <div className="w-16 h-16 rounded-full bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
                            <FontAwesomeIcon icon={faFilm} className="text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Không tìm thấy phim phù hợp</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-5">
                            Thử điều chỉnh từ khóa tìm kiếm hoặc bỏ chọn một số tiêu chí bộ lọc để xem danh sách phim.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all"
                        >
                            <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                            <span>Đặt lại tất cả bộ lọc</span>
                        </button>
                    </div>
                )}
            </section>

            {/* Fast-Track Online Ticket Booking Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-950 via-[#18162d] to-zinc-950 border border-violet-800/40 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase mb-3">
                            <FontAwesomeIcon icon={faTicket} />
                            <span>ĐẶT VÉ NHANH GỌN</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Bạn Đã Chọn Được Bộ Phim Yêu Thích?
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                            Tra cứu suất chiếu tại tất cả các rạp chiếu phim gần bạn nhất chỉ với 1 cú nhấp chuột. Giữ
                            chỗ đẹp, không xếp hàng mua vé tại quầy!
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 shrink-0">
                        <Link
                            to="/showtimes/today"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-700/50 transition-all cursor-pointer active:scale-95"
                        >
                            <span>Lịch Chiếu Hôm Nay</span>
                            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </Link>
                        <Link
                            to="/comming-soon"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
                        >
                            <span>Xem Phim Sắp Chiếu</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Verified Reviews, Blog & Promotions */}
            <div className="space-y-4">
                <TopReviewSection />
                <MovieBlogSection />
                <PromotionSection />
            </div>

            {/* Video Trailer Modal */}
            <TrailerModal
                isOpen={Boolean(selectedTrailerMovie)}
                onClose={() => setSelectedTrailerMovie(null)}
                movie={selectedTrailerMovie}
            />
        </div>
    );
};

export default NowPlayingPage;