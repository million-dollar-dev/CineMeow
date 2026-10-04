import React, { useState, useMemo, useRef } from "react";
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
    faCalendarDays,
    faClock,
    faGlobe,
    faTags,
    faClapperboard,
    faPlay,
    faArrowDownWideShort,
    faBolt,
} from "@fortawesome/free-solid-svg-icons";

import CustomDropdown from "../components/common/CustomDropdown.jsx";
import RatingCard from "../components/RatingCard.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import TopReviewSection from "../components/TopReviewSection.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";
import TrailerModal from "../components/NowPlaying/TrailerModal.jsx";

import { NOW_PLAYING_MOVIES } from "../components/NowPlaying/nowPlayingData.js";
import { COMMING_SOON_MOVIES } from "../components/CommingSoon/commingSoonData.js";
import { useGetAllMoviesQuery } from "../services/movieService.js";

// Curated Asian & Vietnamese cinema hits to ensure complete filter coverage (Vietnam, Korea, Japan)
const ADDITIONAL_CINEMA_HITS = [
    {
        id: "mai-tran-thanh",
        title: "Mai",
        originalTitle: "Mai (2024)",
        genres: "Tâm lý, Tình cảm, Gia đình",
        rating: "T18",
        score: 9.0,
        voteCount: "58.2K",
        duration: "131 phút",
        releaseDate: "10/02/2024",
        formats: ["2D Tiếng Việt", "IMAX 2D"],
        poster: "https://image.tmdb.org/t/p/w780/6Wpbtv8n7aJm3uU4qOa1wS1a2.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/6Wpbtv8n7aJm3uU4qOa1wS1a2.jpg",
        trailerUrl: "https://www.youtube.com/embed/9wG3p58C0y4",
        isHot: true,
        status: "now_playing",
        country: "Việt Nam",
        year: "2024",
        synopsis: "Mai kể về cuộc đời đầy biến cố và tổn thương của một người phụ nữ làm nghề massage, cùng mối tình lãng mạn nhưng trắc trở với chàng nhạc công trẻ tuổi.",
    },
    {
        id: "lat-mat-7",
        title: "Lật Mặt 7: Một Điều Ước",
        originalTitle: "Face Off 7: One Wish",
        genres: "Gia đình, Chính kịch, Tâm lý",
        rating: "T13",
        score: 9.2,
        voteCount: "49.5K",
        duration: "138 phút",
        releaseDate: "26/04/2024",
        formats: ["2D Tiếng Việt", "IMAX 2D"],
        poster: "https://image.tmdb.org/t/p/w780/kYgQXO99RozvvJ1792lp7zW69qV.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/kYgQXO99RozvvJ1792lp7zW69qV.jpg",
        trailerUrl: "https://www.youtube.com/embed/0gAom8Z0x6U",
        isHot: true,
        status: "now_playing",
        country: "Việt Nam",
        year: "2024",
        synopsis: "Câu chuyện gia đình cảm động của người mẹ 73 tuổi cùng 5 người con đã trưởng thành, đặt ra câu hỏi day dứt về lòng hiếu thảo và tình thân ruột thịt.",
    },
    {
        id: "exhuma",
        title: "Quật Mộ Trùng Ma",
        originalTitle: "Exhuma (파묘)",
        genres: "Kinh dị, Bí ẩn, Giật gân",
        rating: "T16",
        score: 9.3,
        voteCount: "64.1K",
        duration: "134 phút",
        releaseDate: "15/03/2024",
        formats: ["2D Phụ đề", "4DX"],
        poster: "https://image.tmdb.org/t/p/w780/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        trailerUrl: "https://www.youtube.com/embed/sQd7rI_Gg1U",
        isHot: true,
        status: "now_playing",
        country: "Hàn Quốc",
        year: "2024",
        synopsis: "Một nhóm pháp sư, thầy phong thủy và chuyên gia tang lễ thực hiện khai quật một ngôi mộ bí ẩn ở vùng hẻo lánh và vô tình giải phóng ác linh kinh hoàng.",
    },
    {
        id: "conan-movie-27",
        title: "Conan: Ngôi Sao 5 Cánh 1 Triệu Đô",
        originalTitle: "Detective Conan: The Million-dollar Pentagram",
        genres: "Hoạt hình, Trinh thám, Hành động",
        rating: "P",
        score: 9.1,
        voteCount: "37.8K",
        duration: "111 phút",
        releaseDate: "02/08/2024",
        formats: ["2D Lồng tiếng", "2D Phụ đề", "IMAX 2D"],
        poster: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        trailerUrl: "https://www.youtube.com/embed/cqGjhVJWtEg",
        isHot: true,
        status: "now_playing",
        country: "Nhật Bản",
        year: "2024",
        synopsis: "Conan và Hattori Heiji đối đầu siêu trộm Kaito Kid tại Hakodate để giải mã bí mật thanh kiếm cổ thời Mạc phủ liên quan đến kho báu gia tộc Onoe.",
    },
    {
        id: "doraemon-movie-43",
        title: "Doraemon: Bản Giao Hưởng Địa Cầu",
        originalTitle: "Doraemon the Movie: Nobita's Earth Symphony",
        genres: "Hoạt hình, Âm nhạc, Phiêu lưu",
        rating: "P",
        score: 8.9,
        voteCount: "28.3K",
        duration: "115 phút",
        releaseDate: "24/05/2024",
        formats: ["2D Lồng tiếng", "2D Phụ đề"],
        poster: "https://image.tmdb.org/t/p/w780/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
        trailerUrl: "https://www.youtube.com/embed/qQlr9-gF32Q",
        isHot: false,
        status: "now_playing",
        country: "Nhật Bản",
        year: "2024",
        synopsis: "Nobita và nhóm bạn bước vào cuộc phiêu lưu bảo vệ âm nhạc khỏi một sinh vật quái dị muốn nuốt chửng toàn bộ giai điệu trên Trái Đất.",
    },
    {
        id: "parasite-special",
        title: "Ký Sinh Trùng",
        originalTitle: "Parasite (기생충)",
        genres: "Tâm lý, Giật gân, Hài hước",
        rating: "T18",
        score: 9.4,
        voteCount: "82.5K",
        duration: "132 phút",
        releaseDate: "21/06/2023",
        formats: ["2D Phụ đề", "IMAX 2D"],
        poster: "https://image.tmdb.org/t/p/w780/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
        trailerUrl: "https://www.youtube.com/embed/5xH0hhJ98Bx",
        isHot: true,
        status: "now_playing",
        country: "Hàn Quốc",
        year: "2023",
        synopsis: "Tác phẩm đoạt 4 giải Oscar của Bong Joon-ho về sự cộng sinh kỳ lạ và bi kịch phân hóa giàu nghèo giữa hai gia đình đối lập ở Seoul.",
    },
];

// Quick Tabs
const QUICK_STATUS_TABS = [
    { id: "all", label: "Tất cả phim", icon: faFilm },
    { id: "now_playing", label: "🔥 Đang chiếu tại rạp", icon: faFire },
    { id: "coming_soon", label: "⏳ Sắp khởi chiếu", icon: faCalendarDays },
    { id: "hot", label: "⭐ Phim Hot / Bom tấn", icon: faStar },
    { id: "imax", label: "🎬 Phim IMAX / 3D", icon: faClapperboard },
];

// Dropdown Filters Config
const GENRE_OPTIONS = [
    { value: "all", label: "Tất cả thể loại" },
    { value: "Hành động", label: "Hành động" },
    { value: "Khoa học viễn tưởng", label: "Khoa học viễn tưởng" },
    { value: "Hoạt hình", label: "Hoạt hình" },
    { value: "Hài hước", label: "Hài hước" },
    { value: "Kinh dị", label: "Kinh dị" },
    { value: "Phiêu lưu", label: "Phiêu lưu" },
    { value: "Tâm lý", label: "Tâm lý" },
    { value: "Gia đình", label: "Gia đình" },
    { value: "Âm nhạc", label: "Âm nhạc" },
    { value: "Trinh thám", label: "Trinh thám" },
    { value: "Tình cảm", label: "Tình cảm" },
    { value: "Lịch sử", label: "Lịch sử" },
];

const COUNTRY_OPTIONS = [
    { value: "all", label: "Tất cả quốc gia" },
    { value: "Mỹ", label: "Mỹ (Hollywood)" },
    { value: "Việt Nam", label: "Việt Nam" },
    { value: "Hàn Quốc", label: "Hàn Quốc" },
    { value: "Nhật Bản", label: "Nhật Bản" },
    { value: "Anh", label: "Anh Quốc" },
];

const YEAR_OPTIONS = [
    { value: "all", label: "Tất cả năm phát hành" },
    { value: "2026", label: "Năm 2026" },
    { value: "2025", label: "Năm 2025" },
    { value: "2024", label: "Năm 2024" },
    { value: "2023", label: "Năm 2023" },
];

const FORMAT_OPTIONS = [
    { value: "all", label: "Tất cả định dạng" },
    { value: "IMAX", label: "IMAX 2D / 3D" },
    { value: "2D Phụ đề", label: "2D Phụ đề" },
    { value: "2D Lồng tiếng", label: "2D Lồng tiếng" },
    { value: "3D", label: "3D" },
    { value: "4DX", label: "4DX" },
];

const SORT_OPTIONS = [
    { value: "score_desc", label: "Đánh giá cao nhất ⭐" },
    { value: "hot", label: "Độ phổ biến / Hot 🔥" },
    { value: "newest", label: "Mới khởi chiếu 🎬" },
    { value: "title_asc", label: "Tên phim (A - Z) 🔤" },
];

const ITEMS_PER_PAGE = 10;

// Individual Movie Card Component for the Catalog Grid
const MovieCatalogCard = ({ movie, onPlayTrailer }) => {
    const isNowPlaying = movie.status === "now_playing";

    return (
        <div className="group relative flex flex-col justify-between bg-[#12121e]/90 hover:bg-[#161626] rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/70 shadow-xl hover:shadow-[0_12px_35px_rgba(127,90,240,0.3)] transition-all duration-300">
            {/* Top Poster Container */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                {/* Age Rating Badge */}
                <div className="absolute top-2.5 left-2.5 z-20 shadow-md">
                    <RatingCard rating={movie.rating || "T13"} />
                </div>

                {/* Status & Hot Badges */}
                <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end gap-1.5">
                    {/* Status Pill */}
                    <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide backdrop-blur-md shadow-sm ${
                            isNowPlaying
                                ? "bg-emerald-500/90 text-black border border-emerald-400/40"
                                : "bg-amber-500/90 text-black border border-amber-400/40"
                        }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-black/60 animate-pulse" />
                        <span>{isNowPlaying ? "Đang chiếu" : "Sắp chiếu"}</span>
                    </span>

                    {/* Hot Flame Badge */}
                    {movie.isHot && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[10px] font-extrabold uppercase shadow-sm">
                            <FontAwesomeIcon icon={faFire} className="text-amber-300 text-[10px]" />
                            <span>Hot</span>
                        </span>
                    )}

                    {/* Score */}
                    {movie.score && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-300 text-[10px] sm:text-[11px] font-bold shadow-sm">
                            <FontAwesomeIcon icon={faStar} className="text-amber-400 text-[9px]" />
                            <span>{movie.score}</span>
                        </div>
                    )}
                </div>

                {/* Format Badges at bottom of poster */}
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
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black border border-white/40 text-xs font-bold transition-all transform scale-90 group-hover:scale-100 cursor-pointer shadow-lg"
                        >
                            <FontAwesomeIcon icon={faPlay} className="text-xs text-violet-400 group-hover:text-violet-600" />
                            <span>Xem Trailer</span>
                        </button>
                    )}

                    <Link
                        to={`/movie/${movie.id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-900/50 transform scale-90 group-hover:scale-100 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faTicket} className="text-xs" />
                        <span>{isNowPlaying ? "Đặt Vé Chi Tiết" : "Xem Thông Tin"}</span>
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

                    {/* Metadata line: Duration & Release / Country */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2.5 pt-2.5 border-t border-white/5">
                        <span className="flex items-center gap-1.5 truncate max-w-[50%]">
                            <FontAwesomeIcon icon={faClock} className="text-violet-400 text-[10px]" />
                            <span>{movie.duration || "120 phút"}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate max-w-[50%]">
                            <FontAwesomeIcon icon={faGlobe} className="text-zinc-500 text-[10px]" />
                            <span>{movie.country || "Mỹ"}</span>
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-3.5">
                    {movie.trailerUrl ? (
                        <button
                            type="button"
                            onClick={() => onPlayTrailer(movie)}
                            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/5 text-xs font-semibold transition-all cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faPlay} className="text-[10px] text-violet-400" />
                            <span>Trailer</span>
                        </button>
                    ) : (
                        <Link
                            to={`/movie/${movie.id}`}
                            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/5 text-xs font-semibold transition-all cursor-pointer"
                        >
                            <span>Chi tiết</span>
                        </Link>
                    )}

                    <Link
                        to={`/movie/${movie.id}`}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95 ${
                            isNowPlaying
                                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/40"
                                : "bg-zinc-700 hover:bg-zinc-600 text-white shadow-black/40"
                        }`}
                    >
                        <FontAwesomeIcon icon={faTicket} className="text-[10px]" />
                        <span>{isNowPlaying ? "Đặt vé" : "Chi tiết"}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const MoviesPage = () => {
    const catalogRef = useRef(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedFormat, setSelectedFormat] = useState("all");
    const [sortBy, setSortBy] = useState("score_desc");
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);

    // API integration with rich local movie database
    const { data: apiMovies = [] } = useGetAllMoviesQuery();

    // Master Catalog Data compilation
    const masterMovies = useMemo(() => {
        // 1. Process Now Playing Movies
        const npProcessed = NOW_PLAYING_MOVIES.map((m) => ({
            ...m,
            status: "now_playing",
            country: m.country || "Mỹ",
            year: m.year || (m.releaseDate ? m.releaseDate.split("/")[2] : "2026") || "2026",
            score: m.score || 9.0,
        }));

        // 2. Process Coming Soon Movies
        const csProcessed = COMMING_SOON_MOVIES.map((m) => ({
            ...m,
            status: "coming_soon",
            country: m.country || "Mỹ",
            year: m.year || (m.releaseDate ? m.releaseDate.split("/")[2] : "2026") || "2026",
            score: m.score || m.expectedScore || 8.8,
        }));

        const combinedBase = [...npProcessed, ...csProcessed, ...ADDITIONAL_CINEMA_HITS];

        // If backend API returns custom movies, merge them in cleanly
        if (Array.isArray(apiMovies) && apiMovies.length > 0) {
            const apiMapped = apiMovies.map((m, idx) => {
                const fallback = combinedBase[idx % combinedBase.length];
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
                    backdrop: m.backdropPath || fallback.backdrop,
                    trailerUrl: m.trailerUrl || fallback.trailerUrl,
                    isHot: m.isHot ?? fallback.isHot,
                    status: fallback.status || "now_playing",
                    country: fallback.country || "Mỹ",
                    year: fallback.year || "2026",
                    synopsis: m.synopsis || fallback.synopsis,
                };
            });
            return apiMapped;
        }

        return combinedBase;
    }, [apiMovies]);

    // Active counts for highlights
    const counts = useMemo(() => {
        const nowPlayingCount = masterMovies.filter((m) => m.status === "now_playing").length;
        const comingSoonCount = masterMovies.filter((m) => m.status === "coming_soon").length;
        return {
            total: masterMovies.length,
            nowPlaying: nowPlayingCount,
            comingSoon: comingSoonCount,
        };
    }, [masterMovies]);

    // Filter & Sort Logic
    const filteredMovies = useMemo(() => {
        return masterMovies
            .filter((movie) => {
                // Tab filter
                if (selectedTab === "now_playing" && movie.status !== "now_playing") return false;
                if (selectedTab === "coming_soon" && movie.status !== "coming_soon") return false;
                if (selectedTab === "hot" && !movie.isHot) return false;
                if (selectedTab === "imax") {
                    const hasImax = movie.formats && movie.formats.some((f) => f.includes("IMAX") || f.includes("3D"));
                    if (!hasImax) return false;
                }

                // Search query
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    const titleMatch = movie.title?.toLowerCase().includes(q);
                    const origMatch = movie.originalTitle?.toLowerCase().includes(q);
                    const genreMatch = movie.genres?.toLowerCase().includes(q);
                    const countryMatch = movie.country?.toLowerCase().includes(q);
                    if (!titleMatch && !origMatch && !genreMatch && !countryMatch) return false;
                }

                // Genre dropdown
                if (selectedGenre !== "all") {
                    if (!movie.genres || !movie.genres.includes(selectedGenre)) return false;
                }

                // Country dropdown
                if (selectedCountry !== "all") {
                    if (movie.country !== selectedCountry) return false;
                }

                // Year dropdown
                if (selectedYear !== "all") {
                    if (String(movie.year) !== String(selectedYear)) return false;
                }

                // Format dropdown
                if (selectedFormat !== "all") {
                    if (!movie.formats || !movie.formats.some((f) => f.includes(selectedFormat))) return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "score_desc") {
                    return (b.score || 0) - (a.score || 0);
                }
                if (sortBy === "hot") {
                    if (a.isHot && !b.isHot) return -1;
                    if (!a.isHot && b.isHot) return 1;
                    return (b.score || 0) - (a.score || 0);
                }
                if (sortBy === "newest") {
                    return (b.year || "2026").localeCompare(a.year || "2026");
                }
                if (sortBy === "title_asc") {
                    return (a.title || "").localeCompare(b.title || "", "vi");
                }
                return 0;
            });
    }, [masterMovies, selectedTab, searchQuery, selectedGenre, selectedCountry, selectedYear, selectedFormat, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE) || 1;
    const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredMovies.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredMovies, currentPage]);

    // Handle Page Change with smooth scroll
    const handlePageChange = (page) => {
        setCurrentPage(page);
        if (catalogRef.current) {
            catalogRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Reset all filters
    const isFilterActive =
        selectedTab !== "all" ||
        selectedGenre !== "all" ||
        selectedCountry !== "all" ||
        selectedYear !== "all" ||
        selectedFormat !== "all" ||
        searchQuery.trim() !== "" ||
        sortBy !== "score_desc";

    const handleResetFilters = () => {
        setSelectedTab("all");
        setSelectedGenre("all");
        setSelectedCountry("all");
        setSelectedYear("all");
        setSelectedFormat("all");
        setSearchQuery("");
        setSortBy("score_desc");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[#07070b] text-white">
            {/* 1. Hero Cinematic Showcase Header */}
            <div className="relative pt-28 sm:pt-32 pb-14 sm:pb-20 overflow-hidden border-b border-zinc-800/60">
                {/* Background backdrop with RoPhim dotted texture */}
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src="https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5207.jpg"
                        alt="Cinema backdrop"
                        className="w-full h-full object-cover object-center filter blur-[4px] brightness-[0.35] scale-105"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none opacity-25"
                        style={{
                            backgroundImage: "url('/images/dotted.png')",
                            backgroundRepeat: "repeat",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#07070b] via-transparent to-[#07070b]" />

                    {/* Ambient Neon Spotlight */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet-600/20 rounded-full blur-[140px] mix-blend-screen" />
                </div>

                {/* Hero Header Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center justify-center sm:justify-start gap-2 text-xs text-zinc-400 mb-6">
                        <Link to="/" className="flex items-center gap-1.5 hover:text-violet-400 transition-colors">
                            <FontAwesomeIcon icon={faHouse} className="text-[11px]" />
                            <span>Trang chủ</span>
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                        <span className="text-zinc-200 font-semibold">Phim Chiếu Rạp</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="space-y-3 max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider">
                                <FontAwesomeIcon icon={faBolt} className="text-amber-400 text-xs" />
                                <span>CineMeow Cinema Hub</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                                Khám Phá <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Phim Chiếu Rạp</span>
                            </h1>
                            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
                                Tổng hợp danh sách phim bom tấn chiếu rạp đang chiếu và sắp khởi chiếu mới nhất tại các hệ thống rạp CGV, Lotte, BHD, Galaxy, Beta, Cinestar trên toàn quốc.
                            </p>
                        </div>

                        {/* Quick System Stats */}
                        <div className="flex items-center justify-center sm:justify-start lg:justify-end gap-3 sm:gap-4 shrink-0">
                            <div className="px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-lg text-center">
                                <p className="text-lg sm:text-xl font-black text-violet-400">{counts.total}</p>
                                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Tổng phim</p>
                            </div>
                            <div className="px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-lg text-center">
                                <p className="text-lg sm:text-xl font-black text-emerald-400">{counts.nowPlaying}</p>
                                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Đang chiếu</p>
                            </div>
                            <div className="px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-lg text-center">
                                <p className="text-lg sm:text-xl font-black text-amber-400">{counts.comingSoon}</p>
                                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Sắp chiếu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Media Carousel Showcase */}
            <div className="py-8 bg-[#09090f]">
                <MediaCarousel title="Phim Đang Chiếu Nổi Bật" seeAllLink="/now-playing" />
            </div>

            {/* 3. Main Catalog Section & Filtering Center */}
            <main ref={catalogRef} id="movie-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 scroll-mt-24">
                
                {/* Header & Quick Status Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faFilm} className="text-violet-500" />
                            <span>Danh Sách Phim Chiếu Rạp</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                            Tìm kiếm, lọc theo thể loại, quốc gia, năm phát hành và đặt vé nhanh chóng
                        </p>
                    </div>

                    {/* Quick Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        {QUICK_STATUS_TABS.map((tab) => {
                            const isActive = selectedTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedTab(tab.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                            : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5"
                                    }`}
                                >
                                    {tab.icon && <FontAwesomeIcon icon={tab.icon} className="text-[11px]" />}
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Filter Controls Bar */}
                <div className="relative z-30 mt-6 p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md shadow-xl space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Live Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Tìm phim theo tên, diễn viên, thể loại..."
                                className="w-full h-11 pl-10 pr-9 bg-zinc-900/90 rounded-xl border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 text-xs"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCurrentPage(1);
                                    }}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer p-1"
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Filters Collection */}
                        <div className="relative z-30 flex items-center gap-2.5 flex-wrap">
                            {/* Thể loại */}
                            <CustomDropdown
                                icon={faTags}
                                options={GENRE_OPTIONS}
                                value={selectedGenre}
                                onChange={(val) => {
                                    setSelectedGenre(val);
                                    setCurrentPage(1);
                                }}
                                headerTitle="Thể Loại Phim"
                                width="w-auto"
                                dropdownWidth="w-56"
                            />

                            {/* Quốc gia */}
                            <CustomDropdown
                                icon={faGlobe}
                                options={COUNTRY_OPTIONS}
                                value={selectedCountry}
                                onChange={(val) => {
                                    setSelectedCountry(val);
                                    setCurrentPage(1);
                                }}
                                headerTitle="Quốc Gia"
                                width="w-auto"
                                dropdownWidth="w-52"
                            />

                            {/* Năm phát hành */}
                            <CustomDropdown
                                icon={faCalendarDays}
                                options={YEAR_OPTIONS}
                                value={selectedYear}
                                onChange={(val) => {
                                    setSelectedYear(val);
                                    setCurrentPage(1);
                                }}
                                headerTitle="Năm Phát Hành"
                                width="w-auto"
                                dropdownWidth="w-48"
                            />

                            {/* Định dạng */}
                            <CustomDropdown
                                icon={faClapperboard}
                                options={FORMAT_OPTIONS}
                                value={selectedFormat}
                                onChange={(val) => {
                                    setSelectedFormat(val);
                                    setCurrentPage(1);
                                }}
                                headerTitle="Định Dạng Chiếu"
                                width="w-auto"
                                dropdownWidth="w-48"
                            />

                            {/* Sắp xếp */}
                            <CustomDropdown
                                icon={faArrowDownWideShort}
                                options={SORT_OPTIONS}
                                value={sortBy}
                                onChange={(val) => {
                                    setSortBy(val);
                                    setCurrentPage(1);
                                }}
                                headerTitle="Sắp Xếp Phim"
                                width="w-auto"
                                dropdownWidth="w-56"
                            />

                            {/* Reset Filters button */}
                            {isFilterActive && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                                    title="Xóa tất cả bộ lọc"
                                >
                                    <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                                    <span>Đặt lại</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Results Summary */}
                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
                        <p>
                            Hiển thị{" "}
                            <span className="text-violet-400 font-bold">
                                {filteredMovies.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span>
                            {" - "}
                            <span className="text-violet-400 font-bold">
                                {Math.min(currentPage * ITEMS_PER_PAGE, filteredMovies.length)}
                            </span>{" "}
                            trong tổng số <span className="text-white font-bold">{filteredMovies.length}</span> bộ phim phù hợp
                        </p>

                        {isFilterActive && (
                            <span className="text-zinc-500 text-[11px] italic">
                                * Đang áp dụng bộ lọc tùy chỉnh
                            </span>
                        )}
                    </div>
                </div>

                {/* Movie Grid */}
                <div className="relative z-10 mt-8">
                    {filteredMovies.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {paginatedMovies.map((movie) => (
                                <MovieCatalogCard
                                    key={movie.id}
                                    movie={movie}
                                    onPlayTrailer={(m) => setSelectedTrailerMovie(m)}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="py-16 sm:py-24 text-center rounded-3xl bg-zinc-950/60 border border-zinc-800/80 px-4">
                            <div className="w-16 h-16 rounded-2xl bg-violet-600/15 text-violet-400 border border-violet-500/30 flex items-center justify-center mx-auto text-2xl mb-4 shadow-lg">
                                <FontAwesomeIcon icon={faFilm} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                                Không tìm thấy phim phù hợp
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
                                Rất tiếc, không có bộ phim nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn. Vui lòng thử từ khóa khác hoặc xóa bộ lọc.
                            </p>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-900/40 transition-all cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRotateLeft} />
                                <span>Xóa tất cả bộ lọc</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Interactive Cinema Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        {/* Prev button */}
                        <button
                            type="button"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-900 border-white/10 hover:bg-zinc-800 text-zinc-300"
                        >
                            &lt; Trang trước
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                const isActive = page === currentPage;
                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => handlePageChange(page)}
                                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-400/40 scale-105"
                                                : "bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next button */}
                        <button
                            type="button"
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-900 border-white/10 hover:bg-zinc-800 text-zinc-300"
                        >
                            Trang sau &gt;
                        </button>
                    </div>
                )}
            </main>

            {/* 4. Supporting Community Sections */}
            <div className="border-t border-zinc-800/60 bg-[#09090f] py-12">
                <TopReviewSection />
            </div>

            <div className="border-t border-zinc-800/60 bg-[#07070b] py-12">
                <MovieBlogSection />
            </div>

            <div className="border-t border-zinc-800/60 bg-[#09090f] py-12">
                <PromotionSection />
            </div>

            {/* 5. Trailer Popup Modal */}
            <TrailerModal
                isOpen={!!selectedTrailerMovie}
                onClose={() => setSelectedTrailerMovie(null)}
                movie={selectedTrailerMovie}
            />
        </div>
    );
};

export default MoviesPage;