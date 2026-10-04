import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilm,
    faCalendarDays,
    faFire,
    faArrowRight,
    faCrown,
    faTicket,
    faGift,
    faStar,
    faClapperboard,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import FeatureMovies from "../components/FeatureMovies/index.jsx";
import QuickBookingWidget from "../components/Home/QuickBookingWidget.jsx";
import NowPlayingMovieCard from "../components/NowPlaying/NowPlayingMovieCard.jsx";
import CommingSoonMovieCard from "../components/CommingSoon/CommingSoonMovieCard.jsx";
import TopReviewSection from "../components/TopReviewSection.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";
import TrailerModal from "../components/NowPlaying/TrailerModal.jsx";

import { NOW_PLAYING_MOVIES } from "../components/NowPlaying/nowPlayingData.js";
import { COMMING_SOON_MOVIES } from "../components/CommingSoon/commingSoonData.js";
import { MOCK_BRANDS } from "../components/Showtimes/mockShowtimesData.js";

const HomePage = () => {
    // Global trailer modal state
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);

    // Reminded movies state for upcoming cards
    const [remindedMovies, setRemindedMovies] = useState({});

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

    useEffect(() => {
        document.title = "CineMeow - Đặt Vé Xem Phim Trực Tuyến & Lịch Chiếu Toàn Quốc";
        window.scrollTo(0, 0);
    }, []);

    // Now Playing: exactly 2 rows (5 cols x 2 rows = 10 movies)
    const nowPlaying2Rows = NOW_PLAYING_MOVIES.slice(0, 10);

    return (
        <div className="min-h-screen bg-[#07070b] text-zinc-100 overflow-x-hidden selection:bg-violet-600 selection:text-white relative">
            {/* Ambient Background Dotted Texture Layer (Mật độ thông thoáng 24px, tinh tế) */}
            <div
                aria-hidden="true"
                className="fixed inset-0 pointer-events-none z-0 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.28) 1.2px, transparent 1.2px)",
                    backgroundSize: "24px 24px",
                }}
            />

            {/* 1. FeatureMovies Spotlight (RoPhim-inspired banner with Right-hand Thumbnail Rail) */}
            <FeatureMovies
                onPlayTrailer={(movie) => setSelectedTrailerMovie(movie)}
            />

            {/* 2. Quick Ticket Booking Widget */}
            <QuickBookingWidget />

            {/* 3. Cinema Partner Chains Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-14">
                <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-4 sm:p-5 backdrop-blur-sm shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="shrink-0 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                                Cụm Rạp Đối Tác:
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                            {MOCK_BRANDS.map((brand) => (
                                <Link
                                    key={brand.id}
                                    to={`/brands/${brand.id}`}
                                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/50 transition-all shadow-sm"
                                    title={`Xem lịch chiếu rạp ${brand.name}`}
                                >
                                    <div className="w-5 h-5 rounded flex items-center justify-center overflow-hidden bg-black/40">
                                        <img
                                            src={brand.logoUrl}
                                            alt={brand.name}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                            }}
                                        />
                                        <span className="hidden text-[9px] font-bold text-zinc-400">
                                            {brand.name.substring(0, 3)}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-300 group-hover:text-violet-300 transition-colors">
                                        {brand.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Now Playing: 2-Row Grid Layout (Thay thế carousel) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-zinc-800">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-1.5">
                            <FontAwesomeIcon icon={faClapperboard} className="text-violet-400 text-xs" />
                            <span>PHIM ĐANG CÔNG CHIẾU TẠI RẠP</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Phim Chiếu Rạp Mới Nhất
                        </h2>
                    </div>

                    <Link
                        to="/now-playing"
                        className="text-xs sm:text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors shrink-0 group"
                    >
                        <span>Xem tất cả {NOW_PLAYING_MOVIES.length} phim</span>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-xs group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>

                {/* 2-Row Grid (5 cols x 2 rows = 10 movies) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                    {nowPlaying2Rows.map((movie) => (
                        <NowPlayingMovieCard
                            key={movie.id}
                            movie={movie}
                            onPlayTrailer={(m) => setSelectedTrailerMovie(m)}
                        />
                    ))}
                </div>
            </section>

            {/* 5. Upcoming Blockbusters Showcase (Grid tùy thuộc vào số lượng phim) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-zinc-800">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-1.5">
                            <FontAwesomeIcon icon={faFire} className="text-rose-400 text-xs" />
                            <span>MÙA PHIM BOM TẤN 2026 - 2027</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Phim Sắp Khởi Chiếu & Mở Bán Sớm
                        </h2>
                    </div>

                    <Link
                        to="/comming-soon"
                        className="text-xs sm:text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors shrink-0 group"
                    >
                        <span>Xem tất cả {COMMING_SOON_MOVIES.length} phim</span>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-xs group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>

                {/* Dynamic Grid: Aligned CommingSoonMovieCards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                    {COMMING_SOON_MOVIES.map((movie) => (
                        <CommingSoonMovieCard
                            key={movie.id}
                            movie={movie}
                            onPlayTrailer={(m) => setSelectedTrailerMovie(m)}
                            onToggleRemind={handleToggleRemind}
                            isReminded={!!remindedMovies[movie.id]}
                        />
                    ))}
                </div>
            </section>

            {/* 6. CineClub VIP Membership Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-950 via-[#18122c] to-indigo-950 border border-violet-500/30 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3">
                            <FontAwesomeIcon icon={faCrown} className="text-amber-400" />
                            <span>ĐẶC QUYỀN THÀNH VIÊN CINECLUB</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">
                            Gia Nhập CineClub - Nhận Vé 0đ & Ưu Đãi Bắp Nước 50%
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                            Tích điểm tự động mỗi lần đặt vé, đổi combo bắp nước miễn phí và sở hữu tấm vé premier độc quyền
                            gặp gỡ đạo diễn, diễn viên các bom tấn Hollywood & Việt Nam.
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                        <Link
                            to="/register"
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black text-xs sm:text-sm transition-all shadow-lg text-center"
                        >
                            Đăng Ký Thành Viên Ngay
                        </Link>
                        <Link
                            to="/promotions"
                            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all text-center"
                        >
                            Xem Thể Lệ Ưu Đãi
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. Top Reviews Section (Gọn gàng trong 1 khung hình) */}
            <div className="mb-14">
                <TopReviewSection
                    title="Bình Luận & Đánh Giá Nổi Bật"
                />
            </div>

            {/* 8. Movie News & Previews Blog Section */}
            <div className="mb-14">
                <MovieBlogSection />
            </div>

            {/* 9. Promotions Section */}
            <div className="mb-8">
                <PromotionSection />
            </div>

            {/* Global Trailer Video Modal */}
            <TrailerModal
                isOpen={!!selectedTrailerMovie}
                movie={selectedTrailerMovie}
                onClose={() => setSelectedTrailerMovie(null)}
            />
        </div>
    );
};

export default HomePage;
