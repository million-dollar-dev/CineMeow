import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHouse, 
    faArrowLeft, 
    faFilm, 
    faTicket,
    faCalendarDays,
    faCompass,
    faCat
} from '@fortawesome/free-solid-svg-icons';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0B0B14] text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-violet-500/30">
            
            {/* Cinematic Perspective Floor Grid */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 75%)'
                }}
            />

            {/* Ambient Radial Cinema Lights */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header Brand Bar */}
            <div className="max-w-5xl mx-auto w-full flex items-center justify-between relative z-10">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform">
                        <FontAwesomeIcon icon={faCat} className="text-xl" />
                    </div>
                    <span className="font-black text-xl tracking-tight text-white group-hover:text-violet-400 transition-colors">
                        Cine<span className="text-violet-500">Meow</span>
                    </span>
                </Link>
            </div>

            {/* Center Content Box */}
            <div className="max-w-2xl mx-auto w-full my-auto text-center relative z-10 py-8">

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold tracking-wider uppercase mb-8 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    <span>Lỗi 404 • Không tìm thấy trang</span>
                </div>

                {/* 404 Typography with Optical Film Aperture Centerpiece */}
                <div className="relative mx-auto my-4 select-none">
                    <div className="flex items-center justify-center gap-2 sm:gap-6">
                        
                        {/* Number 4 (Left) */}
                        <span className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                            4
                        </span>

                        {/* Geometric Film Reel & Optical Aperture Centerpiece (0) */}
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                            
                            {/* Outer Dashed Orbiting Ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/30" />

                            {/* Inner Geometric Hexagonal Aperture */}
                            <div className="absolute inset-3 rounded-full border border-violet-400/30 bg-gradient-to-br from-[#1b153b] via-[#121024] to-[#0B0B14] shadow-[0_0_40px_rgba(127,90,240,0.3)] flex items-center justify-center">
                                
                                {/* Geometric Radial Crosshairs */}
                                <div className="absolute w-full h-[1px] bg-violet-500/20" />
                                <div className="absolute h-full w-[1px] bg-violet-500/20" />

                                {/* Concentric Inner Iris Ring */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-violet-400/40 bg-[#0B0B14] flex items-center justify-center shadow-inner">
                                    <FontAwesomeIcon icon={faCat} className="text-2xl sm:text-3xl text-violet-400" />
                                </div>
                            </div>

                            {/* Orbiting Satellite Accent Dots */}
                            <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />
                            <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
                        </div>

                        {/* Number 4 (Right) */}
                        <span className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                            4
                        </span>

                    </div>
                </div>

                {/* Primary Message */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-3">
                    Không Tìm Thấy Trang Yêu Cầu
                </h1>
                
                <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8">
                    Suất chiếu hoặc trang bạn đang tìm kiếm có thể đã kết thúc đợt phát hành, bị xóa hoặc đường dẫn chưa chính xác.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Quay lại</span>
                    </button>

                    <Link
                        to="/"
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-violet-900/40 transition-all hover:scale-105 active:scale-95"
                    >
                        <FontAwesomeIcon icon={faHouse} />
                        <span>Về Trang Chủ</span>
                    </Link>

                    <Link
                        to="/movies"
                        className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-violet-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                        <FontAwesomeIcon icon={faFilm} />
                        <span>Khám Phá Phim</span>
                    </Link>
                </div>

                {/* Quick Discovery Navigation Bar */}
                <div className="pt-6 border-t border-white/10 max-w-xl mx-auto">
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">
                        Gợi ý điểm đến
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                        <Link to="/now-playing" className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 transition-colors flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faTicket} className="text-violet-400 text-[10px]" />
                            <span>Phim Đang Chiếu</span>
                        </Link>
                        <Link to="/showtimes" className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 transition-colors flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-violet-400 text-[10px]" />
                            <span>Suất Chiếu Hôm Nay</span>
                        </Link>
                        <Link to="/brands" className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 transition-colors flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faCompass} className="text-violet-400 text-[10px]" />
                            <span>Hệ Thống Cụm Rạp</span>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Bottom Footer Note */}
            <div className="text-center text-xs text-slate-600 relative z-10">
                <span>© {new Date().getFullYear()} CineMeow Cinema Experience</span>
            </div>
        </div>
    );
};

export default NotFoundPage;
