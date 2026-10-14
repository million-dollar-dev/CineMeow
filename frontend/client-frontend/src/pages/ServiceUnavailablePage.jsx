import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHouse, 
    faRotateRight, 
    faTriangleExclamation,
    faCat
} from '@fortawesome/free-solid-svg-icons';

const ServiceUnavailablePage = () => {
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryMessage, setRetryMessage] = useState(null);

    const handleRetry = async () => {
        setIsRetrying(true);
        setRetryMessage(null);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const res = await fetch('http://localhost:8888/actuator/health', {
                signal: controller.signal
            }).catch(() => null);

            clearTimeout(timeoutId);

            if (res && (res.ok || res.status < 500)) {
                setRetryMessage('Kết nối đã sẵn sàng! Đang chuyển hướng về trang chủ...');
                setTimeout(() => window.location.href = '/', 1200);
            } else {
                setRetryMessage('Máy chủ chưa phản hồi. Vui lòng thử lại sau ít phút.');
            }
        } catch {
            setRetryMessage('Chưa thể kết nối tới máy chủ. Vui lòng thử lại sau ít phút.');
        } finally {
            setIsRetrying(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B14] text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-amber-500/30">
            
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

            {/* Ambient Amber Lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

            {/* Header Brand Bar */}
            <div className="max-w-5xl mx-auto w-full flex items-center justify-between relative z-10">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                        <FontAwesomeIcon icon={faCat} className="text-xl" />
                    </div>
                    <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                        Cine<span className="text-amber-500">Meow</span>
                    </span>
                </Link>
            </div>

            {/* Center Content Box */}
            <div className="max-w-2xl mx-auto w-full my-auto text-center relative z-10 py-8">

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase mb-8 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Lỗi 503 • Dịch vụ tạm thời bảo trì</span>
                </div>

                {/* 503 Typography Centerpiece */}
                <div className="relative mx-auto my-4 select-none">
                    <div className="flex items-center justify-center gap-2 sm:gap-6 relative z-10">
                        
                        {/* Number 5 */}
                        <span className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500/60 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                            5
                        </span>

                        {/* Geometric Shield Centerpiece (0) */}
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                            
                            {/* Hexagonal Shield Outer Frame */}
                            <div className="absolute inset-1 rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#261b11] via-[#161224] to-[#0B0B14] shadow-[0_0_40px_rgba(245,158,11,0.25)] flex items-center justify-center rotate-45">
                                <div className="absolute inset-2 border border-dashed border-white/10 rounded-2xl" />
                            </div>

                            {/* Inner Warning Core */}
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/25">
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl text-amber-400" />
                                </div>
                            </div>

                        </div>

                        {/* Number 3 */}
                        <span className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500/60 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                            3
                        </span>

                    </div>
                </div>

                {/* Primary Message */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-3">
                    Máy Chủ Đang Bảo Trì Hoặc Nâng Cấp
                </h1>
                
                <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6">
                    Hệ thống máy chủ CineMeow đang tạm thời bảo trì hoặc gián đoạn kết nối. Đội ngũ kỹ thuật đang xử lý để đưa dịch vụ trở lại trong thời gian sớm nhất.
                </p>

                {/* Status Message Notification */}
                {retryMessage && (
                    <div className="max-w-md mx-auto mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-amber-300 flex items-center justify-center gap-2">
                        <span>{retryMessage}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-900/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faRotateRight} className={isRetrying ? "animate-spin" : ""} />
                        <span>{isRetrying ? "Đang thử lại..." : "Thử kết nối lại"}</span>
                    </button>

                    <Link
                        to="/"
                        className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                        <FontAwesomeIcon icon={faHouse} />
                        <span>Về Trang Chủ</span>
                    </Link>
                </div>

            </div>

            {/* Bottom Footer Note */}
            <div className="text-center text-xs text-slate-600 relative z-10">
                <span>© {new Date().getFullYear()} CineMeow Cinema Experience</span>
            </div>
        </div>
    );
};

export default ServiceUnavailablePage;
