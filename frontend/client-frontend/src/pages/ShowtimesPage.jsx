import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faChevronRight,
    faTicket,
    faBolt,
    faGift,
    faFilm,
    faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import ShowtimesTableSection from "../components/utils/ShowtimesTableSection.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import Promotions from "../components/PromotionSection.jsx";

dayjs.locale("vi");

const ShowtimesPage = () => {
    const scheduleSectionRef = useRef(null);

    // Custom smooth scroll with cubic ease-in-out for a slow, silky glide
    const smoothScrollTo = (targetY, duration = 1100) => {
        const startY = window.scrollY || window.pageYOffset;
        const diff = targetY - startY;
        if (Math.abs(diff) < 5) return;

        let startTime = null;
        let animationFrameId = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startY + diff * ease);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            }
        };

        const cancelAnimation = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            window.removeEventListener("wheel", cancelAnimation);
            window.removeEventListener("touchmove", cancelAnimation);
        };

        window.addEventListener("wheel", cancelAnimation, { passive: true });
        window.addEventListener("touchmove", cancelAnimation, { passive: true });

        animationFrameId = requestAnimationFrame(step);
    };

    const scrollToSchedule = (duration = 1100) => {
        if (!scheduleSectionRef.current) return;
        const headerOffset = 76; // Offset for sticky/fixed header
        const rect = scheduleSectionRef.current.getBoundingClientRect();
        const targetY = rect.top + (window.scrollY || window.pageYOffset) - headerOffset;
        smoothScrollTo(targetY, duration);
    };

    useEffect(() => {
        document.title = "Lịch Chiếu Phim Hôm Nay | CineMeow - Đặt Vé Rạp Toàn Quốc";
        window.scrollTo(0, 0);

        // Tự động cuộn từ từ xuống phần hiển thị chọn rạp và giờ
        const timer = setTimeout(() => {
            scrollToSchedule(1100);
        }, 450);

        return () => clearTimeout(timer);
    }, []);

    const todayDisplay = dayjs().format("dddd, [ngày] DD/MM/YYYY");
    const capitalizedToday = todayDisplay.charAt(0).toUpperCase() + todayDisplay.slice(1);

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white">
            {/* Cinematic Hero Section */}
            <div className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden border-b border-zinc-800/80">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-violet-600/15 via-purple-900/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute -top-24 right-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-20 -left-10 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-6">
                        <Link to="/" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faHouse} className="text-xs" />
                            <span>Trang chủ</span>
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-zinc-600" />
                        <span className="text-violet-300 font-medium">Lịch chiếu phim</span>
                    </nav>

                    {/* Main Hero Content */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
                        <div className="max-w-3xl space-y-4">
                            {/* Live Date Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/50 text-violet-300 text-xs sm:text-sm font-semibold shadow-inner">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                </span>
                                <span>{capitalizedToday}</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                Lịch Chiếu Phim Rạp{" "}
                                <span className="bg-gradient-to-r from-[#7f5af0] via-[#a78bfa] to-[#c084fc] bg-clip-text text-transparent">
                                    CineMeow
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
                                Tra cứu nhanh suất chiếu tại tất cả các hệ thống rạp trên toàn quốc (CGV, BHD Star, Lotte Cinema, Galaxy, Beta, Cinestar). Đặt vé tức thì, giữ ghế đẹp và nhận ưu đãi độc quyền.
                            </p>

                            {/* Feature Value Props & Action */}
                            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-300">
                                    <FontAwesomeIcon icon={faBolt} className="text-amber-400" />
                                    <span>Cập nhật theo thời gian thực</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-300">
                                    <FontAwesomeIcon icon={faTicket} className="text-violet-400" />
                                    <span>Đặt vé chọn ghế trực tuyến</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => scrollToSchedule(900)}
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/50 text-violet-200 hover:text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(127,90,240,0.25)] cursor-pointer active:scale-95"
                                >
                                    <span>Chọn rạp & xem giờ</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="text-[10px] animate-bounce" />
                                </button>
                            </div>
                        </div>

                        {/* Quick summary card */}
                        <div className="hidden lg:flex flex-col p-5 rounded-2xl bg-gradient-to-br from-[#18181f] to-[#121217] border border-zinc-800 shadow-xl max-w-xs w-full space-y-3">
                            <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                                <FontAwesomeIcon icon={faFilm} />
                                <span>Rạp chiếu đối tác</span>
                            </div>
                            <p className="text-xs text-zinc-400">
                                Hơn 50+ cụm rạp hiện đại sẵn sàng phục vụ bạn với trải nghiệm điện ảnh đỉnh cao (IMAX, 3D, Dolby Atmos).
                            </p>
                            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                                <span>Giá vé từ: <strong className="text-white">45.000đ</strong></span>
                                <span className="text-emerald-400 font-medium">Ghế VIP sẵn có</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Interactive Showtimes Section */}
            <div className="py-6 sm:py-8" ref={scheduleSectionRef}>
                <ShowtimesTableSection />
            </div>

            {/* Blog & News Section */}
            <div className="border-t border-zinc-900">
                <MovieBlogSection />
            </div>

            {/* Promotions Section */}
            <div className="border-t border-zinc-900 pb-12">
                <Promotions />
            </div>
        </div>
    );
};

export default ShowtimesPage;