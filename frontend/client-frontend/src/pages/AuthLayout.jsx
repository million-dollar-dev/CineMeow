import React, { Suspense, useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCat, 
    faStar, 
    faArrowLeft, 
    faShieldAlt,
    faBolt,
    faChair,
    faGift
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Loading.jsx";

const SPOTLIGHT_MOVIES = [
    {
        id: "dune-2",
        title: "Dune: Hành Tinh Cát 2",
        genre: "Khoa học viễn tưởng • Sử thi",
        poster: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
        rating: 9.6,
        format: "IMAX Laser 3D",
        ambientGlow: "bg-amber-500/25"
    },
    {
        id: "conan-27",
        title: "Conan: Ngôi Sao 5 Cánh",
        genre: "Hoạt hình • Trinh thám",
        poster: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/8f9sUXp0E7bW87gN2KkG59pD9uC.jpg",
        rating: 9.4,
        format: "Widescreen 2D",
        ambientGlow: "bg-blue-500/25"
    },
    {
        id: "deadpool-3",
        title: "Deadpool & Wolverine",
        genre: "Hành động • Hài hước",
        poster: "https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
        rating: 9.2,
        format: "4DX Extreme",
        ambientGlow: "bg-rose-500/25"
    }
];

const WEB_HIGHLIGHTS = [
    {
        id: "quick-booking",
        icon: faBolt,
        tag: "ĐẶT VÉ SIÊU TỐC",
        title: "Giữ chỗ 30s • Quét mã QR vào rạp",
        desc: "Thao tác mượt mà, xác nhận tức thì, không cần xếp hàng chờ đợi đổi vé tại quầy.",
        perk: "Check-in 1 chạm"
    },
    {
        id: "smart-seats",
        icon: faChair,
        tag: "CHỌN GHẾ THÔNG MINH",
        title: "Sơ đồ phòng chiếu 3D trực quan",
        desc: "Góc nhìn màn ảnh chuẩn xác, cập nhật vị trí ghế trống trực tiếp theo thời gian thực.",
        perk: "Live Real-time"
    },
    {
        id: "exclusive-rewards",
        icon: faGift,
        tag: "ƯU ĐÃI THÀNH VIÊN",
        title: "CineMeow Club & Tích điểm",
        desc: "Tích lũy tới 10% điểm thưởng MeowPoints, đổi combo bắp nước & vé 0đ mỗi tuần.",
        perk: "Đặc quyền VIP"
    }
];

const AuthLayout = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto rotate spotlight movies & web features every 3 seconds (faster transition)
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % SPOTLIGHT_MOVIES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const activeMovie = SPOTLIGHT_MOVIES[activeIdx];
    const activeHighlight = WEB_HIGHLIGHTS[activeIdx];

    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative overflow-hidden selection:bg-violet-600 selection:text-white">
            
            {/* Ambient Cinema Lighting Orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />

            {/* Back to Home Link */}
            <div className="w-full max-w-5xl mb-4">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors group"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Quay lại Trang chủ</span>
                </Link>
            </div>

            {/* Main Auth Container Box */}
            <div className="w-full max-w-5xl rounded-3xl overflow-hidden bg-[#141424] border border-white/10 shadow-[0_0_60px_rgba(127,90,240,0.18)] grid grid-cols-1 lg:grid-cols-12 relative z-10">
                
                {/* LEFT SIDE - Next-Gen Interactive Cinema Showcase */}
                <div 
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="lg:col-span-5 relative flex flex-col justify-between p-7 sm:p-8 bg-gradient-to-br from-[#16122e] via-[#100e20] to-[#080711] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden"
                >
                    
                    {/* Atmospheric Cinema Projector Light Cone */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

                    {/* Top: Brand Header (Without arrows) */}
                    <div className="relative z-10 flex items-center justify-between">
                        <Link to="/" className="inline-flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-violet-600/40 group-hover:scale-105 transition-transform border border-violet-400/30">
                                <FontAwesomeIcon icon={faCat} className="text-lg" />
                            </div>
                            <div>
                                <span className="text-xl font-black text-white tracking-tight flex items-center gap-1">
                                    <span>Cine</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">Meow</span>
                                </span>
                                <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">
                                    Cinema Lounge
                                </p>
                            </div>
                        </Link>

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live Cinema Hub</span>
                        </span>
                    </div>

                    {/* Center: 3D Spatial Panoramic Coverflow Stage */}
                    <div 
                        className="relative z-10 my-2 flex justify-center items-center h-[260px] sm:h-[275px]"
                        style={{ perspective: "1000px" }}
                    >
                        {/* Dynamic Floor Spotlight reflecting active movie theme */}
                        <div 
                            className={`absolute bottom-0 w-52 h-14 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${activeMovie.ambientGlow}`}
                        />

                        {/* 3D Spatial Cards Carousel */}
                        {SPOTLIGHT_MOVIES.map((movie, idx) => {
                            let diff = idx - activeIdx;
                            if (diff === 2) diff = -1;
                            if (diff === -2) diff = 1;

                            const isCenter = diff === 0;
                            const isRight = diff === 1;

                            // 3D Matrix Transformations
                            const transformStyle = isCenter
                                ? "translate3d(0, 0, 45px) rotateY(0deg) rotate(0deg) scale(1.03)"
                                : isRight
                                    ? "translate3d(58%, 6px, -25px) rotateY(-18deg) rotate(6deg) scale(0.82)"
                                    : "translate3d(-58%, 6px, -25px) rotateY(18deg) rotate(-6deg) scale(0.82)";

                            return (
                                <div
                                    key={movie.id}
                                    onClick={() => !isCenter && setActiveIdx(idx)}
                                    style={{
                                        transform: transformStyle,
                                        transition: "all 0.7s cubic-bezier(0.34, 1.25, 0.64, 1)"
                                    }}
                                    className={`absolute w-36 sm:w-40 aspect-[2/3] rounded-2xl overflow-hidden border select-none group bg-slate-900 ${
                                        isCenter
                                            ? "z-30 border-violet-400/60 shadow-[0_25px_50px_rgba(127,90,240,0.45)] ring-2 ring-violet-500/30 cursor-default"
                                            : "z-10 border-white/10 shadow-2xl opacity-40 hover:opacity-85 cursor-pointer filter brightness-80 hover:brightness-100"
                                    }`}
                                >
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Gradient Vignette */}
                                    <div className={`absolute inset-0 transition-opacity duration-500 ${
                                        isCenter
                                            ? "bg-gradient-to-t from-[#0B0B14] via-[#0B0B14]/30 to-transparent"
                                            : "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                                    }`} />

                                    {isCenter ? (
                                        <>
                                            {/* Top Left: Live Beacon */}
                                            <div className="absolute top-2 left-2 animate-fadeIn">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold bg-black/80 backdrop-blur-md border border-white/15 text-white">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    <span>Đang chiếu</span>
                                                </span>
                                            </div>

                                            {/* Top Right: Gold Score Pill */}
                                            <div className="absolute top-2 right-2 animate-fadeIn">
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[9px] font-black bg-amber-500 text-black backdrop-blur-md shadow">
                                                    <FontAwesomeIcon icon={faStar} className="text-[8px]" />
                                                    <span>{movie.rating}</span>
                                                </span>
                                            </div>

                                            {/* Bottom Card Meta */}
                                            <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-0.5 animate-fadeIn">
                                                <p className="text-[11px] font-black text-white leading-tight drop-shadow truncate">
                                                    {movie.title}
                                                </p>
                                                <div className="flex items-center gap-1 text-[9px] text-slate-300">
                                                    <span className="px-1.5 py-0.2 rounded bg-violet-600/90 font-bold text-[8px] text-white">
                                                        {movie.format}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="text-slate-400 text-[9px] truncate">{movie.genre}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        /* Side Card Click Tooltip on Hover */
                                        <div className="absolute inset-0 flex items-end justify-center p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-[9px] font-bold text-violet-300 bg-black/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-violet-500/30 shadow-lg">
                                                Xem phim này
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom: Web Standout Highlight Card & Progress Pills */}
                    <div className="relative z-10 space-y-3 pt-1">
                        
                        {/* Standout Website Feature Card */}
                        <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 backdrop-blur-md space-y-1.5 transition-all duration-300 hover:border-violet-500/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-violet-600/25 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xs">
                                        <FontAwesomeIcon icon={activeHighlight.icon} />
                                    </div>
                                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-violet-400">
                                        {activeHighlight.tag}
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                    {activeHighlight.perk}
                                </span>
                            </div>

                            <h4 className="text-xs font-bold text-white leading-tight">
                                {activeHighlight.title}
                            </h4>

                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                {activeHighlight.desc}
                            </p>
                        </div>

                        {/* Interactive Capsule Progress Indicators */}
                        <div className="flex items-center justify-center gap-2 pt-0.5">
                            {SPOTLIGHT_MOVIES.map((movie, idx) => {
                                const isActive = activeIdx === idx;
                                return (
                                    <button
                                        key={movie.id}
                                        onClick={() => setActiveIdx(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            isActive 
                                                ? "w-8 bg-gradient-to-r from-violet-500 to-indigo-500 shadow-md shadow-violet-500/50" 
                                                : "w-2 bg-white/20 hover:bg-white/40"
                                        }`}
                                        title={movie.title}
                                    />
                                );
                            })}
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE - FORM CONTAINER */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#141424] relative">
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </div>

            </div>

            {/* Bottom Security Assurance Note */}
            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-500" />
                    <span>Mã hóa bảo mật SSL 256-bit</span>
                </span>
                <span>•</span>
                <span>Bảo vệ thông tin cá nhân 100%</span>
            </div>

        </div>
    );
};

export default AuthLayout;