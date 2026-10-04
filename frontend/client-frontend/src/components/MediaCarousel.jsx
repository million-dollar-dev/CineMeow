import React, { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faStar,
    faPlay,
    faTicket,
    faArrowRight,
    faClapperboard,
} from "@fortawesome/free-solid-svg-icons";
import RatingCard from "./RatingCard.jsx";
import { useGetAllMoviesQuery } from "../services/movieService.js";

// High-quality verified TMDB & CDN posters for Now Playing movies
const FALLBACK_NOW_PLAYING = [
    {
        id: "dune-2",
        title: "Dune: Hành Tinh Cát 2",
        genre: "Khoa học viễn tưởng, Phiêu lưu",
        rating: "T16",
        score: 9.3,
        duration: "166 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    },
    {
        id: "deadpool-wolverine",
        title: "Deadpool & Wolverine",
        genre: "Hành động, Hài hước",
        rating: "T18",
        score: 9.1,
        duration: "128 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    },
    {
        id: "fantastic-four",
        title: "Bộ Tứ Siêu Đẳng: First Steps",
        genre: "Khoa học viễn tưởng",
        rating: "T13",
        score: 8.8,
        duration: "135 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg",
    },
    {
        id: "despicable-me-4",
        title: "Kẻ Trộm Mặt Trăng 4",
        genre: "Hoạt hình, Hài hước",
        rating: "P",
        score: 8.5,
        duration: "95 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
    },
    {
        id: "inside-out-2",
        title: "Inside Out 2: Cảm Xúc",
        genre: "Hoạt hình, Gia đình",
        rating: "P",
        score: 9.0,
        duration: "96 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    },
    {
        id: "spiderman-spiderverse",
        title: "Người Nhện: Du Hành Vũ Trụ Nhện",
        genre: "Hoạt hình, Hành động, Viễn tưởng",
        rating: "T13",
        score: 9.2,
        duration: "140 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    },
    {
        id: "kungfu-panda-4",
        title: "Kung Fu Panda 4",
        genre: "Hoạt hình, Phiêu lưu",
        rating: "P",
        score: 8.7,
        duration: "94 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    },
    {
        id: "planet-apes",
        title: "Hành Tinh Khỉ: Vương Quốc",
        genre: "Khoa học viễn tưởng, Hành động",
        rating: "T13",
        score: 8.4,
        duration: "145 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    },
];

// Fallback for Comming Soon movies
const FALLBACK_COMMING_SOON = [
    {
        id: "avatar-3",
        title: "Avatar: Dòng Chảy Của Nước",
        genre: "Khoa học viễn tưởng, Phiêu lưu",
        rating: "T13",
        score: 9.4,
        duration: "192 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    },
    {
        id: "barbie",
        title: "Barbie: Thế Giới Rực Rỡ",
        genre: "Hài hước, Giả tưởng",
        rating: "T13",
        score: 8.9,
        duration: "114 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    },
    {
        id: "dune-2",
        title: "Dune: Hành Tinh Cát 2",
        genre: "Khoa học viễn tưởng, Phiêu lưu",
        rating: "T16",
        score: 9.3,
        duration: "166 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    },
    {
        id: "deadpool-wolverine",
        title: "Deadpool & Wolverine",
        genre: "Hành động, Hài hước",
        rating: "T18",
        score: 9.1,
        duration: "128 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    },
    {
        id: "fantastic-four",
        title: "Bộ Tứ Siêu Đẳng: First Steps",
        genre: "Khoa học viễn tưởng",
        rating: "T13",
        score: 8.8,
        duration: "135 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg",
    },
    {
        id: "inside-out-2",
        title: "Inside Out 2: Cảm Xúc",
        genre: "Hoạt hình, Gia đình",
        rating: "P",
        score: 9.0,
        duration: "96 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    },
    {
        id: "spiderman-spiderverse",
        title: "Người Nhện: Du Hành Vũ Trụ Nhện",
        genre: "Hoạt hình, Hành động",
        rating: "T13",
        score: 9.2,
        duration: "140 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    },
    {
        id: "kungfu-panda-4",
        title: "Kung Fu Panda 4",
        genre: "Hoạt hình, Phiêu lưu",
        rating: "P",
        score: 8.7,
        duration: "94 phút",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    },
];

// Rich cinematic backdrop defaults:
// - Now playing: Momo cinema auditorium ambiance
// - Comming soon: Majestic cinema theater hall
const NOW_PLAYING_BACKGROUND = "https://homepage.momocdn.net/img/momo-upload-api-230912110927-638301137672516955.jpeg";
const COMMING_SOON_BACKGROUND = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1920&auto=format&fit=crop";

const MediaCarousel = ({
    title = "Phim đang chiếu",
    subtitle,
    movies: passedMovies,
    seeAllLink,
    backgroundImage,
    showRanking = true,
}) => {
    const isCommingSoon = useMemo(() => {
        return (title || "").toLowerCase().includes("sắp");
    }, [title]);

    const { data: apiMovies = [] } = useGetAllMoviesQuery();

    const displayMovies = useMemo(() => {
        if (Array.isArray(passedMovies) && passedMovies.length > 0) {
            return passedMovies;
        }

        const fallbackList = isCommingSoon ? FALLBACK_COMMING_SOON : FALLBACK_NOW_PLAYING;

        if (Array.isArray(apiMovies) && apiMovies.length > 0) {
            return apiMovies.map((m, idx) => ({
                id: m.id || `movie-${idx}`,
                title: m.title || "Phim chiếu rạp",
                genre: m.genres || "Hành động, Phiêu lưu",
                rating: m.ageRating || m.rating || "T13",
                score: m.voteAverage || 8.9,
                duration: m.duration ? `${m.duration} phút` : undefined,
                image: m.posterPath || m.imageUrl || fallbackList[idx % fallbackList.length].image,
            }));
        }

        return fallbackList;
    }, [passedMovies, apiMovies, isCommingSoon]);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        dragFree: true,
        containScroll: "trimSnaps",
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const computedSeeAllLink = seeAllLink || (isCommingSoon ? "/comming-soon" : "/now-playing");

    // Dynamic background image selection with fallback
    const effectiveBackground = backgroundImage || (isCommingSoon ? COMMING_SOON_BACKGROUND : NOW_PLAYING_BACKGROUND);

    return (
        <section
            className="relative py-10 sm:py-14 my-4 sm:my-6 bg-cover bg-center bg-no-repeat overflow-hidden border-y border-violet-900/30 shadow-2xl"
            style={{
                backgroundImage: `url(${effectiveBackground})`,
            }}
        >
            {/* Top & Bottom Glowing Hairline Accents to Frame Component in Layout */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent z-10" />
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent z-10" />

            {/* Layer 1: Atmospheric dark vignette - allows cinema image to shine through while keeping text crisp */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0d]/90 via-[#0d0c18]/65 to-[#0a0a0d]/95 pointer-events-none" />

            {/* Layer 2: Center Radial Spotlight for maximum depth & theater ambiance */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(127,90,240,0.22),transparent_70%)] pointer-events-none" />

            {/* Layer 3: Backlit Stage Glow behind the poster cards to make them pop */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-56 bg-gradient-to-r from-transparent via-violet-600/15 to-transparent blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                {/* Centered Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-9 relative z-10">
                    {/* Clapperboard Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/70 border border-violet-700/50 text-violet-300 text-[11px] sm:text-xs font-semibold mb-2.5 shadow-[0_0_15px_rgba(127,90,240,0.25)]">
                        <FontAwesomeIcon icon={faClapperboard} className="text-violet-400 text-xs" />
                        <span>{isCommingSoon ? "SẮP KHỞI CHIẾU" : "ĐANG CHIẾU TẠI RẠP"}</span>
                    </div>

                    {/* Centered Main Title */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        {title}
                    </h2>

                    {/* Centered Subtitle */}
                    <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-xl mx-auto font-normal leading-relaxed">
                        {subtitle ||
                            (isCommingSoon
                                ? "Đón chờ những siêu phẩm bom tấn sắp ra mắt tại cụm rạp CineMeow"
                                : "Khám phá những tựa phim xuất sắc được yêu thích nhất đang chiếu tại rạp")}
                    </p>

                    {/* Centered Decorative Divider Line */}
                    <div className="flex items-center justify-center gap-2.5 mt-3.5">
                        <div className="h-[2px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-violet-500 rounded-full" />
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
                        <div className="h-[2px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-violet-500 rounded-full" />
                    </div>
                </div>

                {/* Carousel Wrapper with Floating Navigation Arrows */}
                <div className="relative group/carousel px-1 sm:px-2">
                    {/* Floating Left Arrow (aligned with poster artwork) */}
                    <button
                        type="button"
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        className={`hidden sm:flex absolute -left-2 md:-left-4 top-[42%] -translate-y-1/2 z-30 w-10 h-10 rounded-full items-center justify-center border transition-all duration-200 shadow-2xl cursor-pointer ${
                            canScrollPrev
                                ? "bg-[#181824]/90 backdrop-blur-md border-zinc-700 text-white hover:bg-violet-600 hover:border-violet-500 hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                                : "opacity-0 pointer-events-none"
                        }`}
                        aria-label="Previous slide"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                    </button>

                    {/* Floating Right Arrow (aligned with poster artwork) */}
                    <button
                        type="button"
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        className={`hidden sm:flex absolute -right-2 md:-right-4 top-[42%] -translate-y-1/2 z-30 w-10 h-10 rounded-full items-center justify-center border transition-all duration-200 shadow-2xl cursor-pointer ${
                            canScrollNext
                                ? "bg-[#181824]/90 backdrop-blur-md border-zinc-700 text-white hover:bg-violet-600 hover:border-violet-500 hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                                : "opacity-0 pointer-events-none"
                        }`}
                        aria-label="Next slide"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                    </button>

                    {/* Slides Track */}
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-2.5 sm:gap-3.5 md:gap-4 py-2">
                            {displayMovies.map((movie, index) => (
                                <div
                                    key={movie.id || index}
                                    className="basis-[38%] sm:basis-[26%] md:basis-[19%] lg:basis-[15.5%] xl:basis-[13.5%] shrink-0 group select-none"
                                >
                                    {/* Elevated Poster Card with Glow & Shadow */}
                                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-zinc-900/90 border border-white/10 group-hover:border-violet-500/80 group-hover:shadow-[0_0_25px_rgba(127,90,240,0.45)] transition-all duration-300">
                                        {/* Corner Ranking Badge */}
                                        {showRanking && (
                                            <div className="absolute bottom-1.5 left-2 z-20 pointer-events-none">
                                                <span className="font-black text-2xl sm:text-3xl italic text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        )}

                                        {/* Top Rating Badge */}
                                        <div className="absolute top-2 left-2 z-20 scale-90 sm:scale-100 origin-top-left shadow-md">
                                            <RatingCard rating={movie.rating || "T13"} />
                                        </div>

                                        {/* Score Badge */}
                                        {movie.score && (
                                            <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded shadow-md">
                                                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-[9px]" />
                                                <span>{movie.score}</span>
                                            </div>
                                        )}

                                        {/* Poster Image with Zoom on Hover */}
                                        <img
                                            src={movie.image}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                                            }}
                                        />

                                        {/* Hover Overlay with Play Button & Direct Booking / Details Link */}
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-2 z-20"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <FontAwesomeIcon icon={faPlay} className="text-xs ml-0.5" />
                                            </div>

                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-zinc-950 font-bold text-[11px] sm:text-xs shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                                <FontAwesomeIcon icon={faTicket} className="text-violet-600 text-[11px]" />
                                                <span>{isCommingSoon ? "Xem chi tiết" : "Đặt vé ngay"}</span>
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Movie Title & Genre */}
                                    <div className="mt-2 px-0.5">
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className="block font-semibold text-xs sm:text-sm text-zinc-100 group-hover:text-violet-300 transition-colors line-clamp-1"
                                            title={movie.title}
                                        >
                                            {movie.title}
                                        </Link>
                                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                                            {movie.genre}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Centered Bottom Action: Xem tất cả phim */}
                <div className="flex justify-center mt-7 sm:mt-9 relative z-10">
                    <Link
                        to={computedSeeAllLink}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-violet-600/20 hover:bg-violet-600 text-violet-200 hover:text-white border border-violet-500/40 text-xs sm:text-sm font-bold transition-all shadow-[0_0_20px_rgba(127,90,240,0.25)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] group cursor-pointer active:scale-95"
                    >
                        <span>{isCommingSoon ? "Xem toàn bộ phim sắp chiếu" : "Xem tất cả danh sách phim"}</span>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-xs transform group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default MediaCarousel;