import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faCrown,
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
                `Đã bật nhắc nhở cho "${movie.title}". CineMeow sẽ gửi thông báo khi rạp mở bán vé sớm.`,
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
        <div className="min-h-[100dvh] bg-[#0f1013] text-[#eff0f1] overflow-x-hidden selection:bg-main selection:text-main-contrast">
            {/* 1. FeatureMovies Spotlight (RoPhim-inspired banner with Right-hand Thumbnail Rail) */}
            <FeatureMovies
                onPlayTrailer={(movie) => setSelectedTrailerMovie(movie)}
            />

            {/* 2. Quick Ticket Booking Widget */}
            <QuickBookingWidget />

            {/* 3. Cinema Partner Chains Strip - Clean flat tone-step surface, no glassmorphism or pulsing */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
                <div className="rounded-2xl bg-[#18191d] p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="shrink-0 flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-main" />
                            <span className="text-sm font-medium text-zinc-300">
                                Cụm rạp đối tác
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                            {MOCK_BRANDS.map((brand) => (
                                <Link
                                    key={brand.id}
                                    to={`/brands/${brand.id}`}
                                    className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#222428] hover:bg-[#2b2d33] transition-colors duration-150"
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
                                        <span className="hidden text-[10px] font-bold text-zinc-400">
                                            {brand.name.substring(0, 3)}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors duration-150">
                                        {brand.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Now Playing: 2-Row Grid Layout - Separated by whitespace, no hairline rules */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Phim Chiếu Rạp Mới Nhất
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">
                            Các suất chiếu hôm nay tại tất cả cụm rạp trên toàn quốc
                        </p>
                    </div>

                    <Link
                        to="/now-playing"
                        className="text-sm text-main hover:text-main-hover font-medium flex items-center gap-1.5 transition-colors duration-150 shrink-0 group"
                    >
                        <span>Xem tất cả {NOW_PLAYING_MOVIES.length} phim</span>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-xs group-hover:translate-x-1 transition-transform duration-150"
                        />
                    </Link>
                </div>

                {/* 2-Row Grid (5 cols x 2 rows = 10 movies) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {nowPlaying2Rows.map((movie) => (
                        <NowPlayingMovieCard
                            key={movie.id}
                            movie={movie}
                            onPlayTrailer={(m) => setSelectedTrailerMovie(m)}
                        />
                    ))}
                </div>
            </section>

            {/* 5. Upcoming Blockbusters Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Phim Sắp Khởi Chiếu
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">
                            Lịch phát hành dự kiến và các suất chiếu sớm mở bán trước
                        </p>
                    </div>

                    <Link
                        to="/comming-soon"
                        className="text-sm text-main hover:text-main-hover font-medium flex items-center gap-1.5 transition-colors duration-150 shrink-0 group"
                    >
                        <span>Xem tất cả {COMMING_SOON_MOVIES.length} phim</span>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-xs group-hover:translate-x-1 transition-transform duration-150"
                        />
                    </Link>
                </div>

                {/* Dynamic Grid: Aligned CommingSoonMovieCards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
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

            {/* 6. CineClub VIP Membership Banner - Solid flat reply card, zero gradients or glow */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="rounded-2xl bg-[#18191d] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-main text-sm font-medium mb-3">
                            <FontAwesomeIcon icon={faCrown} />
                            <span>Đặc quyền thành viên CineClub</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Gia nhập CineClub, đổi vé và ưu đãi bắp nước
                        </h3>
                        <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
                            Tích điểm tự động mỗi lần đặt vé, đổi combo bắp nước miễn phí và sở hữu tấm vé premier
                            gặp gỡ đạo diễn, diễn viên các bom tấn điện ảnh.
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Link
                            to="/register"
                            className="px-6 py-3 rounded-xl bg-main hover:bg-main-hover text-main-contrast font-semibold text-sm transition-colors duration-150 text-center"
                        >
                            Đăng ký thành viên
                        </Link>
                        <Link
                            to="/promotions"
                            className="px-6 py-3 rounded-xl bg-[#25272c] hover:bg-[#2f3137] text-zinc-100 font-medium text-sm transition-colors duration-150 text-center"
                        >
                            Xem thể lệ ưu đãi
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. Top Reviews Section */}
            <div className="mb-20">
                <TopReviewSection
                    title="Bình Luận & Đánh Giá Nổi Bật"
                />
            </div>

            {/* 8. Movie News & Previews Blog Section */}
            <div className="mb-20">
                <MovieBlogSection />
            </div>

            {/* 9. Promotions Section */}
            <div className="mb-16">
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
