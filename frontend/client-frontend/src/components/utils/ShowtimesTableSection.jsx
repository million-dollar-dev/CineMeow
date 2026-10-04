import React, { useMemo, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faLocationCrosshairs,
    faChevronDown,
    faSearch,
    faXmark,
    faMapLocationDot,
    faPhone,
    faFilter,
    faCalendarDays,
    faRotateRight,
    faFilm,
    faBuilding,
    faClock
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import CinemaBrandSelector from "../MovieDetail/CinemaBrandSelector.jsx";
import MovieDateSelector from "../MovieDetail/MovieDateSelector.jsx";
import MovieAndShowtimeCard from "../Showtimes/MovieAndShowtimeCard.jsx";
import CinemaCard from "../Showtimes/CinemaCard.jsx";

import { useGetAllBrandsQuery } from "../../services/brandService.js";
import { useGetAllCinemasQuery } from "../../services/cinemaService.js";
import { useGetAllShowtimesQuery } from "../../services/showtimeService.js";
import { useGetAllMoviesQuery } from "../../services/movieService.js";

import { MOCK_BRANDS, MOCK_CINEMAS, generateMockMoviesForDate } from "../Showtimes/mockShowtimesData.js";

dayjs.locale("vi");

const CITIES = [
    "Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Bình Dương",
    "Đồng Nai",
    "Cần Thơ",
    "Hải Phòng",
    "Toàn quốc",
];

const TIME_SLOTS = [
    { id: "all", label: "Tất cả giờ" },
    { id: "morning", label: "Sáng (< 12:00)" },
    { id: "afternoon", label: "Chiều (12:00 - 18:00)" },
    { id: "evening", label: "Tối (> 18:00)" },
];

const FORMATS = ["Tất cả định dạng", "2D Phụ đề", "2D Lồng tiếng", "IMAX", "3D"];

// Custom Filter Dropdown matching CineMeow aesthetic
const CustomFilterDropdown = ({
    icon,
    label,
    options,
    value,
    onChange,
    headerTitle,
    align = "right",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Check if current value is non-default
    const isFiltered = value !== (typeof options[0] === "object" ? options[0].id : options[0]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer active:scale-95 ${
                    isFiltered
                        ? "bg-violet-950/60 border-violet-500 text-violet-300 shadow-[0_0_12px_rgba(127,90,240,0.35)] ring-1 ring-violet-500/50"
                        : "bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:border-zinc-500 hover:bg-[#1f1a2e] hover:text-white"
                }`}
            >
                {icon && <FontAwesomeIcon icon={icon} className="text-violet-400 text-xs flex-shrink-0" />}
                <span className="truncate max-w-[130px] sm:max-w-[150px]">{label}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-[9px] text-zinc-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-violet-400" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    className={`absolute top-full mt-2 w-52 bg-[#1a1a22] border border-zinc-700/80 rounded-xl shadow-2xl z-50 py-1.5 animate-fadeIn ring-1 ring-violet-500/25 ${
                        align === "right" ? "right-0" : "left-0"
                    }`}
                >
                    {headerTitle && (
                        <p className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/80 mb-1">
                            {headerTitle}
                        </p>
                    )}
                    <div className="space-y-0.5 px-1 max-h-56 overflow-y-auto custom-scrollbar">
                        {options.map((opt) => {
                            const optId = typeof opt === "object" ? opt.id : opt;
                            const optLabel = typeof opt === "object" ? opt.label : opt;
                            const isSelected = value === optId;

                            return (
                                <button
                                    key={optId}
                                    type="button"
                                    onClick={() => {
                                        onChange(optId);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                                        isSelected
                                            ? "bg-violet-600/25 text-violet-300 font-bold"
                                            : "text-zinc-300 hover:bg-zinc-800/70 hover:text-white"
                                    }`}
                                >
                                    <span>{optLabel}</span>
                                    {isSelected && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(127,90,240,0.8)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const ShowtimesTableSection = ({ initialBrandId = "all" }) => {
    // API Queries
    const { data: brandsData = [], isLoading: loadingBrands } = useGetAllBrandsQuery();
    const { data: cinemasData = [], isLoading: loadingCinemas } = useGetAllCinemasQuery();
    const { data: showtimesData = [], isLoading: loadingShowtimes } = useGetAllShowtimesQuery();
    const { data: allMoviesData = [] } = useGetAllMoviesQuery();

    // Fallback merge
    const brands = useMemo(() => {
        const list = Array.isArray(brandsData) && brandsData.length > 0 ? brandsData : MOCK_BRANDS;
        return list;
    }, [brandsData]);

    const allCinemas = useMemo(() => {
        const list = Array.isArray(cinemasData) && cinemasData.length > 0 ? cinemasData : MOCK_CINEMAS;
        return list;
    }, [cinemasData]);

    // Active state filters
    const [selectedBrandId, setSelectedBrandId] = useState(initialBrandId || "all");
    const [selectedCity, setSelectedCity] = useState("Hồ Chí Minh");
    const [isNearMe, setIsNearMe] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [searchCinemaQuery, setSearchCinemaQuery] = useState("");
    const [searchMovieQuery, setSearchMovieQuery] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("Tất cả định dạng");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("all");
    const [mobileTab, setMobileTab] = useState("schedule"); // "cinemas" | "schedule"

    const cityDropdownRef = useRef(null);

    // Close city dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
                setShowCityDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // If initialBrandId changes (e.g. from parent props on BrandPage)
    useEffect(() => {
        if (initialBrandId) {
            setSelectedBrandId(initialBrandId);
        }
    }, [initialBrandId]);

    // Generate dates (exactly 7 days starting today)
    const days = useMemo(() => {
        const today = dayjs().startOf("day");
        return Array.from({ length: 7 }, (_, i) => {
            const date = today.add(i, "day");
            let weekday = date.format("dddd");
            if (i === 0) weekday = "Hôm nay";
            else if (i === 1) weekday = "Ngày mai";
            else {
                // Short weekday for balanced fit
                weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
            }

            return {
                isoDate: date.format("YYYY-MM-DD"),
                displayDate: date.format("DD/MM"),
                weekday,
            };
        });
    }, []);

    const [selectedDate, setSelectedDate] = useState(days[0].isoDate);

    // Filter Cinemas by City, Brand, and Search text
    const filteredCinemas = useMemo(() => {
        return allCinemas.filter((cinema) => {
            // Filter by brand
            if (selectedBrandId !== "all") {
                const bId = cinema.brandId || cinema.brand?.id;
                if (bId && bId !== selectedBrandId) return false;
            }

            // Filter by city
            if (selectedCity !== "Toàn quốc") {
                const cinemaCity = cinema.city || "";
                if (!cinemaCity.toLowerCase().includes(selectedCity.toLowerCase())) {
                    // Try address matching
                    if (!cinema.address?.toLowerCase().includes(selectedCity.toLowerCase())) {
                        return false;
                    }
                }
            }

            // Filter by cinema search query
            if (searchCinemaQuery.trim()) {
                const query = searchCinemaQuery.toLowerCase().trim();
                const matchName = cinema.name?.toLowerCase().includes(query);
                const matchAddr = cinema.address?.toLowerCase().includes(query);
                if (!matchName && !matchAddr) return false;
            }

            return true;
        });
    }, [allCinemas, selectedBrandId, selectedCity, searchCinemaQuery]);

    // Selected Cinema State
    const [selectedCinemaId, setSelectedCinemaId] = useState("");

    // Auto-select first cinema when filtered list changes if current is invalid
    useEffect(() => {
        if (filteredCinemas.length > 0) {
            const exists = filteredCinemas.some((c) => c.id === selectedCinemaId);
            if (!exists) {
                setSelectedCinemaId(filteredCinemas[0].id);
            }
        } else {
            setSelectedCinemaId("");
        }
    }, [filteredCinemas, selectedCinemaId]);

    const activeCinema = useMemo(() => {
        return allCinemas.find((c) => c.id === selectedCinemaId) || filteredCinemas[0] || null;
    }, [allCinemas, selectedCinemaId, filteredCinemas]);

    // Map & process showtimes for selected cinema & date
    const moviesWithShowtimes = useMemo(() => {
        if (!activeCinema) return [];

        // Check if real API has showtimes for this cinema
        const realShowtimes = Array.isArray(showtimesData)
            ? showtimesData.filter((st) => {
                  const matchCinema = st.cinemaId === activeCinema.id || st.cinemaName === activeCinema.name;
                  if (!matchCinema) return false;

                  const stDate = dayjs(st.startTime).format("YYYY-MM-DD");
                  return stDate === selectedDate;
              })
            : [];

        let moviesList = [];

        if (realShowtimes.length > 0) {
            // Group real showtimes by movie
            const movieMap = {};
            realShowtimes.forEach((st) => {
                const mId = st.movieId || "unknown";
                if (!movieMap[mId]) {
                    movieMap[mId] = {
                        id: mId,
                        title: st.movieTitle || "Phim chiếu rạp",
                        posterPath: st.posterPath,
                        rating: st.movieRating || "T13",
                        genres: st.genres || "Hành động, Hồi hộp",
                        duration: st.duration ? `${st.duration} phút` : "120 phút",
                        showtimes: [],
                    };
                }
                movieMap[mId].showtimes.push(st);
            });
            moviesList = Object.values(movieMap);
        } else {
            // Use realistic mock showtimes for this date
            moviesList = generateMockMoviesForDate(selectedDate);
        }

        // Apply filters: Search movie title, format, time slot
        return moviesList
            .map((movie) => {
                let filteredSt = movie.showtimes || [];

                // Filter by Format
                if (selectedFormat !== "Tất cả định dạng") {
                    filteredSt = filteredSt.filter((st) => {
                        const fmt = st.roomType || "2D Phụ đề";
                        return fmt.toLowerCase().includes(selectedFormat.toLowerCase());
                    });
                }

                // Filter by Time Slot
                if (selectedTimeSlot !== "all") {
                    filteredSt = filteredSt.filter((st) => {
                        const hour = dayjs(st.startTime).hour();
                        if (selectedTimeSlot === "morning") return hour < 12;
                        if (selectedTimeSlot === "afternoon") return hour >= 12 && hour < 18;
                        if (selectedTimeSlot === "evening") return hour >= 18;
                        return true;
                    });
                }

                return {
                    ...movie,
                    showtimes: filteredSt,
                };
            })
            .filter((movie) => {
                // Must have at least 1 showtime after format/timeslot filters
                if (movie.showtimes.length === 0) return false;

                // Search movie query
                if (searchMovieQuery.trim()) {
                    const query = searchMovieQuery.toLowerCase().trim();
                    return movie.title.toLowerCase().includes(query) || movie.genres?.toLowerCase().includes(query);
                }
                return true;
            });
    }, [activeCinema, showtimesData, selectedDate, selectedFormat, selectedTimeSlot, searchMovieQuery]);

    // Handle "Gần bạn" geolocation toggle
    const handleNearMeToggle = () => {
        setIsNearMe((prev) => !prev);
        if (!isNearMe) {
            setSelectedCity("Hồ Chí Minh");
        }
    };

    // Google Maps direction URL
    const getGoogleMapsUrl = (cinema) => {
        if (!cinema) return "#";
        const query = encodeURIComponent(`${cinema.name} ${cinema.address}`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Top Control Bar: City + Near Me + Brand Carousel */}
            <div className="bg-[#121215] border border-zinc-800 rounded-2xl shadow-xl mb-6 relative z-30">
                {/* Row 1: Location & Search */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-zinc-800/80 bg-[#16161a] rounded-t-2xl relative z-40">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs sm:text-sm font-medium text-zinc-400">Khu vực:</span>

                        {/* City Dropdown */}
                        <div className="relative" ref={cityDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setShowCityDropdown(!showCityDropdown)}
                                className="flex items-center gap-2 bg-[#7f5af0] hover:bg-[#906df9] text-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-[0_0_12px_rgba(127,90,240,0.35)] cursor-pointer active:scale-95"
                            >
                                <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                                <span>{selectedCity}</span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`text-[10px] transition-transform duration-200 ${
                                        showCityDropdown ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {showCityDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-52 bg-[#1a1a22] border border-zinc-700/80 rounded-xl shadow-2xl z-50 py-2 animate-fadeIn ring-1 ring-violet-500/20">
                                    <p className="px-3.5 py-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                        Chọn Tỉnh/Thành phố
                                    </p>
                                    {CITIES.map((city) => (
                                        <button
                                            key={city}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCity(city);
                                                setShowCityDropdown(false);
                                            }}
                                            className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                                selectedCity === city
                                                    ? "bg-violet-600/20 text-violet-300 font-bold"
                                                    : "text-zinc-300 hover:bg-zinc-800/70 hover:text-white"
                                            }`}
                                        >
                                            <span>{city}</span>
                                            {selectedCity === city && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Near Me Button */}
                        <button
                            type="button"
                            onClick={handleNearMeToggle}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border cursor-pointer active:scale-95 ${
                                isNearMe
                                    ? "bg-violet-600 text-white border-violet-500 shadow-[0_0_12px_rgba(127,90,240,0.4)]"
                                    : "bg-transparent border-zinc-700 text-zinc-300 hover:border-violet-500 hover:text-violet-300"
                            }`}
                        >
                            <FontAwesomeIcon icon={faLocationCrosshairs} className="text-xs" />
                            <span>Gần bạn</span>
                        </button>
                    </div>

                    {/* Stats pill */}
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1.5 bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-700/50">
                            <FontAwesomeIcon icon={faBuilding} className="text-violet-400" />
                            <span>{filteredCinemas.length} rạp khả dụng</span>
                        </span>
                    </div>
                </div>

                {/* Row 2: Cinema Brands Horizontal Bar */}
                <div className="p-3 sm:p-4 bg-[#141418] rounded-b-2xl">
                    <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto py-2.5 px-1.5 custom-scrollbar">
                        {/* All Brands button */}
                        <CinemaBrandSelector
                            name="Tất cả rạp"
                            logoUrl="https://homepage.momocdn.net/next-js/_next/static/public/cinema/dexuat-icon.svg"
                            handleClick={() => setSelectedBrandId("all")}
                            isSelected={selectedBrandId === "all"}
                        />

                        {/* List of Cinema Brands */}
                        {brands.map((b) => (
                            <CinemaBrandSelector
                                key={b.id}
                                name={b.name}
                                logoUrl={b.logoUrl}
                                handleClick={() => setSelectedBrandId(b.id)}
                                isSelected={selectedBrandId === b.id}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Tab Switcher (Visible on < lg screens) */}
            <div className="lg:hidden flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 mb-4">
                <button
                    type="button"
                    onClick={() => setMobileTab("schedule")}
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                        mobileTab === "schedule"
                            ? "bg-violet-600 text-white shadow-md"
                            : "text-zinc-400 hover:text-white"
                    }`}
                >
                    🎞️ Suất chiếu ({moviesWithShowtimes.length} phim)
                </button>
                <button
                    type="button"
                    onClick={() => setMobileTab("cinemas")}
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                        mobileTab === "cinemas"
                            ? "bg-violet-600 text-white shadow-md"
                            : "text-zinc-400 hover:text-white"
                    }`}
                >
                    📍 Chọn rạp ({filteredCinemas.length})
                </button>
            </div>

            {/* Main Interactive Grid (2 Columns on Desktop) */}
            <div className="bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
                {/* LEFT COLUMN: Cinema Selection (4 Cols) */}
                <div
                    className={`lg:col-span-4 border-r border-zinc-800 bg-[#141418] flex flex-col ${
                        mobileTab === "cinemas" ? "block" : "hidden lg:flex"
                    }`}
                >
                    {/* Cinema Search Bar */}
                    <div className="p-3.5 border-b border-zinc-800/80 bg-[#18181c]">
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"
                            />
                            <input
                                type="text"
                                value={searchCinemaQuery}
                                onChange={(e) => setSearchCinemaQuery(e.target.value)}
                                placeholder="Tìm theo tên rạp, đường, quận..."
                                className="w-full pl-8 pr-8 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                            {searchCinemaQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchCinemaQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                >
                                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Cinemas Scrollable List */}
                    <div className="flex-1 overflow-y-auto max-h-[580px] lg:max-h-[720px] p-3 space-y-2.5 custom-scrollbar">
                        {loadingCinemas ? (
                            <div className="p-6 text-center text-zinc-400 space-y-2">
                                <FontAwesomeIcon icon={faRotateRight} className="animate-spin text-violet-400 text-xl" />
                                <p className="text-xs">Đang tải danh sách rạp...</p>
                            </div>
                        ) : filteredCinemas.length === 0 ? (
                            <div className="p-8 text-center text-zinc-400 space-y-3">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                                    <FontAwesomeIcon icon={faBuilding} className="text-lg" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-300">Không tìm thấy rạp nào</p>
                                <p className="text-xs text-zinc-500">
                                    Thử đổi khu vực hoặc từ khóa tìm kiếm.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchCinemaQuery("");
                                        setSelectedCity("Toàn quốc");
                                        setSelectedBrandId("all");
                                    }}
                                    className="text-xs text-violet-400 hover:underline font-semibold"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        ) : (
                            filteredCinemas.map((cinema) => (
                                <CinemaCard
                                    key={cinema.id}
                                    cinema={cinema}
                                    isSelected={activeCinema?.id === cinema.id}
                                    onSelect={(c) => {
                                        setSelectedCinemaId(c.id);
                                        setMobileTab("schedule");
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Date Selector, Filters & Showtimes (8 Cols) */}
                <div
                    className={`lg:col-span-8 bg-[#121215] flex flex-col ${
                        mobileTab === "schedule" ? "block" : "hidden lg:flex"
                    }`}
                >
                    {/* Active Cinema Header Info */}
                    {activeCinema ? (
                        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#16161b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start sm:items-center gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-black/40 border border-zinc-700/80 p-2 flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <img
                                        src={
                                            activeCinema.brand?.logoUrl ||
                                            activeCinema.logoUrl ||
                                            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"
                                        }
                                        alt={activeCinema.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-base sm:text-lg text-white">
                                        {activeCinema.name}
                                    </h3>
                                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-violet-400" />
                                        <span>{activeCinema.address}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                                <a
                                    href={getGoogleMapsUrl(activeCinema)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-violet-600 text-zinc-200 hover:text-white text-xs font-semibold transition-all border border-zinc-700"
                                >
                                    <FontAwesomeIcon icon={faMapLocationDot} />
                                    <span>Bản đồ</span>
                                </a>
                                {activeCinema.phone && (
                                    <a
                                        href={`tel:${activeCinema.phone}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all border border-zinc-700"
                                    >
                                        <FontAwesomeIcon icon={faPhone} />
                                        <span>{activeCinema.phone}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 border-b border-zinc-800 text-zinc-400 text-sm">
                            Vui lòng chọn rạp chiếu
                        </div>
                    )}

                    {/* Date Strip Navigation: 7 Prominent Equal Slots */}
                    <div className="p-3 sm:p-4 border-b border-zinc-800 bg-[#141418]">
                        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3 w-full">
                            {days.map((d) => (
                                <MovieDateSelector
                                    key={d.isoDate}
                                    date={d.displayDate}
                                    day={d.weekday}
                                    isSelected={selectedDate === d.isoDate}
                                    handleClick={() => setSelectedDate(d.isoDate)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Secondary Filters Bar: Movie search, Format & Time slot */}
                    <div className="p-3 sm:p-3.5 border-b border-zinc-800/80 bg-[#16161b] flex flex-wrap items-center justify-between gap-3 relative z-20">
                        {/* Movie search inside selected cinema */}
                        <div className="relative flex-1 min-w-[180px] max-w-xs">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"
                            />
                            <input
                                type="text"
                                value={searchMovieQuery}
                                onChange={(e) => setSearchMovieQuery(e.target.value)}
                                placeholder="Lọc phim tại rạp này..."
                                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                            {searchMovieQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchMovieQuery("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                >
                                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                                </button>
                            )}
                        </div>

                        {/* Format & Time Custom Dropdowns */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Format selector */}
                            <CustomFilterDropdown
                                icon={faFilm}
                                label={selectedFormat}
                                options={FORMATS}
                                value={selectedFormat}
                                onChange={(val) => setSelectedFormat(val)}
                                headerTitle="Chọn định dạng chiếu"
                                align="right"
                            />

                            {/* Time Slot selector */}
                            <CustomFilterDropdown
                                icon={faClock}
                                label={TIME_SLOTS.find((t) => t.id === selectedTimeSlot)?.label || "Tất cả giờ"}
                                options={TIME_SLOTS}
                                value={selectedTimeSlot}
                                onChange={(val) => setSelectedTimeSlot(val)}
                                headerTitle="Chọn khung giờ chiếu"
                                align="right"
                            />

                            {/* Reset filters if any active */}
                            {(searchMovieQuery || selectedFormat !== "Tất cả định dạng" || selectedTimeSlot !== "all") && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchMovieQuery("");
                                        setSelectedFormat("Tất cả định dạng");
                                        setSelectedTimeSlot("all");
                                    }}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-700/80 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                                    title="Đặt lại bộ lọc"
                                >
                                    <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
                                    <span className="hidden sm:inline">Đặt lại</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Movie Showtimes List Container */}
                    <div className="flex-1 overflow-y-auto max-h-[560px] lg:max-h-[640px] custom-scrollbar divide-y divide-zinc-800/80">
                        {loadingShowtimes ? (
                            <div className="p-12 text-center text-zinc-400 space-y-3">
                                <FontAwesomeIcon icon={faRotateRight} className="animate-spin text-violet-400 text-2xl" />
                                <p className="text-sm">Đang tải lịch chiếu...</p>
                            </div>
                        ) : moviesWithShowtimes.length === 0 ? (
                            <div className="p-12 text-center text-zinc-400 space-y-3">
                                <div className="w-14 h-14 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto text-zinc-500">
                                    <FontAwesomeIcon icon={faFilm} className="text-2xl" />
                                </div>
                                <h4 className="text-base font-bold text-zinc-200">
                                    Không có suất chiếu phù hợp
                                </h4>
                                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                    Không tìm thấy suất chiếu nào tại rạp vào ngày {dayjs(selectedDate).format("DD/MM/YYYY")}{" "}
                                    với bộ lọc hiện tại.
                                </p>
                                <div className="flex items-center justify-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedDate(days[0].isoDate);
                                            setSelectedFormat("Tất cả định dạng");
                                            setSelectedTimeSlot("all");
                                            setSearchMovieQuery("");
                                        }}
                                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-md"
                                    >
                                        Xem lịch hôm nay
                                    </button>
                                </div>
                            </div>
                        ) : (
                            moviesWithShowtimes.map((movie, idx) => (
                                <MovieAndShowtimeCard
                                    key={movie.id}
                                    movie={movie}
                                    showtimes={movie.showtimes}
                                    index={idx}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowtimesTableSection;