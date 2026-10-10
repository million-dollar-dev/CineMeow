import React, { useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faChevronRight,
    faLocationDot,
    faUser,
    faPhone,
    faStar,
    faFilm,
    faCalendarDays,
    faGift,
    faShieldHalved,
    faCircleCheck,
    faGlobe,
    faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

import ShowtimesTableSection from "../components/utils/ShowtimesTableSection.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";

import { useGetBrandQuery } from "../services/brandService.js";
import { BRAND_PROFILES, ALL_BRANDS_LIST } from "../data/brandData.js";

const BrandPage = () => {
    const { brandId } = useParams();
    const navigate = useNavigate();
    const showtimesRef = useRef(null);

    // Normalize active brand ID
    const activeBrandId = useMemo(() => {
        const id = (brandId || "cgv").toLowerCase();
        return BRAND_PROFILES[id] ? id : "cgv";
    }, [brandId]);

    // Query API with rich static fallback
    const { data: apiBrandData } = useGetBrandQuery(activeBrandId, {
        skip: !activeBrandId,
    });

    const currentBrand = useMemo(() => {
        const fallback = BRAND_PROFILES[activeBrandId] || BRAND_PROFILES.cgv;
        if (apiBrandData) {
            return {
                ...fallback,
                ...apiBrandData,
                name: apiBrandData.name || fallback.name,
                description: apiBrandData.description || fallback.description,
                logoUrl: apiBrandData.logoUrl || fallback.logoUrl,
                backgroundUrl: apiBrandData.backgroundUrl || fallback.backgroundUrl,
                employeeCount: apiBrandData.employeeCount
                    ? `${apiBrandData.employeeCount} nhân viên`
                    : fallback.employeeCount,
            };
        }
        return fallback;
    }, [activeBrandId, apiBrandData]);

    const scrollToShowtimes = () => {
        if (!showtimesRef.current) return;
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = showtimesRef.current.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        document.title = `${currentBrand.name} - Lịch Chiếu & Đặt Vé Rạp | CineMeow`;
        window.scrollTo(0, 0);
    }, [currentBrand]);

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
                    <Link to="/brands" className="hover:text-white transition-colors">
                        Hệ thống rạp
                    </Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-zinc-600" />
                    <span className="text-zinc-200 font-medium">{currentBrand.name}</span>
                </nav>
            </div>

            {/* Interactive Cinema Brands Switcher Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {ALL_BRANDS_LIST.map((brand) => {
                        const isActive = brand.id === activeBrandId;
                        return (
                            <button
                                key={brand.id}
                                type="button"
                                onClick={() => navigate(`/brands/${brand.id}`)}
                                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer shrink-0 border select-none ${
                                    isActive
                                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-400 text-white shadow-lg shadow-violet-600/30 scale-105"
                                        : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800"
                                }`}
                            >
                                <div className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden p-0.5">
                                    <img
                                        src={brand.logoUrl}
                                        alt={brand.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                            e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                        }}
                                    />
                                    <span className="hidden text-[8px] font-bold text-zinc-400">
                                        {brand.fallbackText}
                                    </span>
                                </div>
                                <span className="text-xs font-bold whitespace-nowrap">
                                    {brand.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Cinematic Hero Header Section (No vw units!) */}
            <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="relative rounded-3xl overflow-hidden min-h-[380px] md:min-h-[440px] bg-zinc-950 border border-violet-900/30 shadow-2xl flex flex-col justify-end p-6 sm:p-8 md:p-12">
                    {/* Background Theater Backdrop with Smooth Dark Gradient */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
                        style={{
                            backgroundImage: `url(${currentBrand.backgroundUrl})`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/75 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0d] via-[#0a0a0d]/60 to-transparent" />

                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-10 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Hero Content */}
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
                        {/* Brand Logo in Glass Container */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md border border-white/20 p-3 shadow-2xl shadow-violet-950/60 flex items-center justify-center shrink-0">
                            <img
                                src={currentBrand.logoUrl}
                                alt={currentBrand.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                }}
                            />
                            <span className="hidden font-black text-2xl text-violet-400">
                                {currentBrand.fallbackText}
                            </span>
                        </div>

                        {/* Brand Details */}
                        <div className="flex-1 space-y-3">
                            {/* Partner Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/25 border border-violet-500/40 text-violet-300 text-xs font-bold shadow-md">
                                <FontAwesomeIcon icon={faShieldHalved} className="text-violet-400 text-xs" />
                                <span>ĐỐI TÁC CHÍNH THỨC CINEMEOW</span>
                            </div>

                            {/* Brand Name & Tagline */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                                {currentBrand.name}
                            </h1>

                            <p className="text-xs sm:text-sm md:text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200">
                                {currentBrand.tagline}
                            </p>

                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl font-normal">
                                {currentBrand.description}
                            </p>

                            {/* Highlight Pills */}
                            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-200">
                                    <FontAwesomeIcon icon={faLocationDot} className="text-rose-400" />
                                    <span>{currentBrand.theaterCount}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-200">
                                    <FontAwesomeIcon icon={faUser} className="text-violet-400" />
                                    <span>{currentBrand.employeeCount}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-200">
                                    <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                                    <span>{currentBrand.rating || "4.8 / 5.0"} Đánh giá</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-200">
                                    <FontAwesomeIcon icon={faPhone} className="text-emerald-400" />
                                    <span>Hotline: {currentBrand.hotline}</span>
                                </div>
                            </div>

                            {/* Action CTA Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={scrollToShowtimes}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/40 transition-all cursor-pointer active:scale-95"
                                >
                                    <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
                                    <span>Xem Lịch Chiếu Tại Rạp Này</span>
                                </button>

                                <Link
                                    to="/promotions"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faGift} className="text-xs text-amber-300" />
                                    <span>Ưu Đãi Rạp {currentBrand.shortName}</span>
                                </Link>

                                {currentBrand.website && (
                                    <a
                                        href={currentBrand.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-black/40 hover:bg-black/60 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm border border-white/10 transition-all"
                                    >
                                        <FontAwesomeIcon icon={faGlobe} className="text-xs text-violet-400" />
                                        <span>Website chính thức</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Special Technologies & Highlights of this Brand */}
            {currentBrand.technologies && currentBrand.technologies.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-zinc-800">
                        <div>
                            <span className="text-xs font-bold uppercase text-violet-400 tracking-wider">
                                ĐẲNG CẤP PHÒNG CHIẾU
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                                Công Nghệ & Trải Nghiệm Đột Phá Tại {currentBrand.name}
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {currentBrand.technologies.map((tech, idx) => (
                            <div
                                key={idx}
                                className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-violet-500/50 shadow-lg transition-all hover:-translate-y-0.5"
                            >
                                <div className="flex items-center justify-between mb-2.5">
                                    <h3 className="font-extrabold text-white text-base">
                                        {tech.name}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold">
                                        {tech.badge}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                                    {tech.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Brand Perks / Privileges */}
            {currentBrand.perks && currentBrand.perks.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-950/60 via-[#131124] to-zinc-900/80 border border-violet-500/25 shadow-xl">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faGift} className="text-amber-400 text-sm" />
                            <span>Đặc Quyền Khách Hàng Đặt Vé {currentBrand.name} Qua CineMeow</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {currentBrand.perks.map((perk, pIdx) => (
                                <div
                                    key={pIdx}
                                    className="flex items-start gap-2.5 text-xs text-zinc-300 bg-black/40 p-3 rounded-xl border border-white/5"
                                >
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="text-emerald-400 text-sm shrink-0 mt-0.5"
                                    />
                                    <span>{perk}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Master Showtimes Table Section Filtered to this Brand */}
            <div ref={showtimesRef} id="brand-showtimes" className="mb-14">
                <ShowtimesTableSection initialBrandId={currentBrand.id} />
            </div>

            {/* Featured Now Playing Carousel */}
            <div className="mb-14">
                <MediaCarousel
                    title={`Phim Đang Chiếu Tại ${currentBrand.name}`}
                    subtitle={`Những tác phẩm điện ảnh bom tấn ăn khách nhất đang phục vụ khán giả tại hệ thống cụm rạp ${currentBrand.name}`}
                />
            </div>

            {/* Movie News & Blogs */}
            <div className="mb-14">
                <MovieBlogSection />
            </div>

            {/* Promotions Section */}
            <div className="mb-8">
                <PromotionSection />
            </div>
        </div>
    );
};

export default BrandPage;