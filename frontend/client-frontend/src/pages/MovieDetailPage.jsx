import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from "react-router-dom";
import Banner from "../components/MovieDetail/Banner.jsx";
import ShowtimesList from "../components/MovieDetail/ShowtimesList.jsx";
import NowPlayingList from "../components/MovieDetail/NowPlayingList.jsx";
import ReviewList from "../components/MovieDetail/ReviewList.jsx";
import TrailerModal from "../components/NowPlaying/TrailerModal.jsx";
import OverlayLoading from "../components/Booking/OverlayLoading.jsx";
import { useGetMovieQuery } from "../services/movieService.js";
import { useSearchShowtimesQuery } from "../services/showtimeService.js";
import { NOW_PLAYING_MOVIES } from "../components/NowPlaying/nowPlayingData.js";
import { COMMING_SOON_MOVIES } from "../components/CommingSoon/commingSoonData.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faTicket, 
    faComments, 
    faCircleInfo, 
    faShieldHalved, 
    faHeadset,
    faFilm
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const MovieDetailPage = () => {
    const { movieId } = useParams();

    // Trailer modal state
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);
    const [activeTab, setActiveTab] = useState("showtimes");

    // Fetch movie details from API
    const { data: apiMovie, isLoading: isMovieLoading } = useGetMovieQuery(movieId, {
        skip: !movieId,
    });

    // Fetch showtimes for movie from API
    const today = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    const { data: apiShowtimes = [], isLoading: isShowtimeLoading } = useSearchShowtimesQuery({
        page: 0,
        size: 50,
        sort: "startTime,asc",
        filters: [
            `movieId:"${movieId}"`,
            `startTime>"${today}"`,
        ],
    }, {
        skip: !movieId,
    });

    // Safe movie resolution: API -> Mock Now Playing -> Mock Coming Soon -> Default
    const movie = useMemo(() => {
        if (apiMovie && apiMovie.id) {
            return {
                ...apiMovie,
                score: apiMovie.score || 9.2,
                voteCount: apiMovie.voteCount || "32.1K",
                format: apiMovie.format || "2D • IMAX 2D",
                trailerUrl: apiMovie.trailerUrl || "https://www.youtube.com/embed/Way9Dexny3w",
            };
        }

        // Search in NOW_PLAYING_MOVIES
        const foundNp = NOW_PLAYING_MOVIES.find((m) => String(m.id) === String(movieId));
        if (foundNp) {
            return {
                ...foundNp,
                backdropPath: foundNp.backdrop || foundNp.backdropPath || foundNp.poster,
                posterPath: foundNp.posterPath || foundNp.poster,
                overview: foundNp.synopsis || foundNp.overview,
                format: Array.isArray(foundNp.formats) ? foundNp.formats.join(" • ") : foundNp.formats,
            };
        }

        // Search in COMMING_SOON_MOVIES
        const foundCs = COMMING_SOON_MOVIES.find((m) => String(m.id) === String(movieId));
        if (foundCs) {
            return {
                ...foundCs,
                backdropPath: foundCs.backdrop || foundCs.backdropPath || foundCs.poster,
                posterPath: foundCs.posterPath || foundCs.poster,
                overview: foundCs.synopsis || foundCs.overview,
                format: Array.isArray(foundCs.formats) ? foundCs.formats.join(" • ") : foundCs.formats,
            };
        }

        // Fallback to first available movie
        const defaultM = NOW_PLAYING_MOVIES[0];
        return {
            ...defaultM,
            id: movieId || defaultM.id,
            backdropPath: defaultM.backdrop || defaultM.backdropPath || defaultM.poster,
            posterPath: defaultM.posterPath || defaultM.poster,
            overview: defaultM.synopsis,
            format: "IMAX 2D • 2D Phụ đề",
        };
    }, [apiMovie, movieId]);

    // Update document title and scroll to top on mount
    useEffect(() => {
        if (movie?.title) {
            document.title = `${movie.title} - Lịch Chiếu & Đặt Vé | CineMeow`;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [movie?.title]);

    const handleScrollToShowtimes = () => {
        setActiveTab("showtimes");
        document.getElementById("showtimes-section")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScrollToReviews = () => {
        setActiveTab("reviews");
        document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
    };

    if (isMovieLoading && !movie) {
        return <OverlayLoading />;
    }

    return (
        <div className="min-h-screen bg-[#07070b] text-zinc-100 selection:bg-violet-600 selection:text-white">
            {/* 1. Hero Showcase Banner */}
            <Banner
                movieInfo={movie}
                onPlayTrailer={(m) => setSelectedTrailerMovie(m)}
                onScrollToShowtimes={handleScrollToShowtimes}
            />

            {/* 2. Sticky Section Quick-Navigation Tabs */}
            <div className="sticky top-16 sm:top-20 z-30 bg-[#07070b]/90 backdrop-blur-xl border-y border-zinc-800/80 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 scrollbar-hide">
                        <button
                            type="button"
                            onClick={handleScrollToShowtimes}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "showtimes"
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            }`}
                        >
                            <FontAwesomeIcon icon={faTicket} />
                            <span>Lịch Chiếu & Đặt Vé</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleScrollToReviews}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "reviews"
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            }`}
                        >
                            <FontAwesomeIcon icon={faComments} />
                            <span>Đánh Giá Khán Giả</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("info");
                                document.getElementById("info-section")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "info"
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            }`}
                        >
                            <FontAwesomeIcon icon={faCircleInfo} />
                            <span>Quy Định Rạp & Hỗ Trợ</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Main Body Container (2 Columns) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* LEFT COLUMN (8 cols): Showtimes + Community Reviews */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* 3A. Showtimes Section */}
                        <div id="showtimes-section">
                            <ShowtimesList
                                showtimes={apiShowtimes}
                                movieId={movie.id}
                                movieTitle={movie.title}
                            />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

                        {/* 3B. Reviews Section */}
                        <div id="reviews-section" className="scroll-mt-24">
                            <ReviewList
                                movieId={movie.id}
                                movieTitle={movie.title}
                                overallRating={movie.score || 9.2}
                                totalReviewsCount={movie.voteCount || "32.1K"}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN (4 cols): Sticky Pinned Hot Movies + Rules + Support (No Blank Space) */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-36 space-y-6 self-start max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide">
                        {/* 1. Hot Now Playing List */}
                        <NowPlayingList currentMovieId={movie.id} />

                        {/* 2. Cinema Regulations Card */}
                        <div id="info-section" className="rounded-3xl bg-zinc-950/70 border border-zinc-800/80 p-5 backdrop-blur-md shadow-xl space-y-3.5 scroll-mt-24">
                            <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                                <span className="w-2 h-4 rounded-full bg-violet-500" />
                                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                    <FontAwesomeIcon icon={faShieldHalved} className="text-violet-400 text-xs" />
                                    <span>Quy Định Khi Xem Phim</span>
                                </h3>
                            </div>

                            <ul className="space-y-2.5 text-xs text-zinc-400 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                    <span><strong>Quy định độ tuổi:</strong> Khán giả cần mang theo CCCD/giấy tờ tùy thân để kiểm tra phân loại khán giả tại cửa soát vé.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                    <span><strong>Thời gian vào rạp:</strong> Quý khách vui lòng đến trước giờ chiếu từ 15-20 phút để nhận vé và bắp nước.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                    <span><strong>Bản quyền:</strong> Nghiêm cấm mọi hành vi quay phim, chụp ảnh, ghi âm hoặc phát trực tiếp trong phòng chiếu.</span>
                                </li>
                            </ul>
                        </div>

                        {/* 3. Customer Care & Booking Support Card */}
                        <div className="rounded-3xl bg-zinc-950/70 border border-zinc-800/80 p-5 backdrop-blur-md shadow-xl space-y-3">
                            <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                                <span className="w-2 h-4 rounded-full bg-amber-500" />
                                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                    <FontAwesomeIcon icon={faHeadset} className="text-amber-400 text-xs" />
                                    <span>Hỗ Trợ Đặt Vé 24/7</span>
                                </h3>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Cần hỗ trợ hủy vé, đổi suất chiếu hoặc khiếu nại dịch vụ phòng vé? Liên hệ ngay với tổng đài CineMeow:
                            </p>

                            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] text-zinc-500 font-medium">Hotline Chăm Sóc Khách Hàng</p>
                                    <p className="text-sm font-black text-amber-400">1900 6868 (Miễn phí)</p>
                                </div>
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    24/7
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Global Trailer Video Modal */}
            <TrailerModal
                isOpen={!!selectedTrailerMovie}
                movie={selectedTrailerMovie}
                onClose={() => setSelectedTrailerMovie(null)}
            />
        </div>
    );
};

export default MovieDetailPage;