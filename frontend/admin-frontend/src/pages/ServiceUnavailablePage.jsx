import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const ServiceUnavailablePage = () => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleRetry = async () => {
        setIsChecking(true);
        setStatusMessage(null);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            
            const res = await fetch('http://localhost:8888/actuator/health', {
                signal: controller.signal
            }).catch(() => null);

            clearTimeout(timeoutId);

            if (res && (res.ok || res.status < 500)) {
                setStatusMessage('Kết nối đã sẵn sàng! Đang chuyển hướng về Bảng điều khiển...');
                setTimeout(() => navigate('/dashboard'), 1200);
            } else {
                setStatusMessage('Máy chủ chưa phản hồi. Vui lòng thử lại sau ít phút.');
            }
        } catch {
            setStatusMessage('Chưa thể kết nối tới máy chủ. Vui lòng thử lại sau ít phút.');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
            
            {/* Subtle Blueprint Dot Grid Background */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Header Brand Bar */}
            <div className="max-w-4xl mx-auto w-full flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 font-black text-sm">
                        CM
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-base">
                        CineMeow <span className="text-amber-600 font-semibold text-xs ml-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100">Portal</span>
                    </span>
                </div>
            </div>

            {/* Main Center Content Box */}
            <div className="max-w-xl mx-auto w-full my-auto text-center relative z-10 py-8">

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold tracking-wider uppercase mb-6 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Lỗi 503 • Dịch vụ tạm thời gián đoạn</span>
                </div>

                {/* 3D Blueprint Isometric Server Node Vector */}
                <div className="relative w-64 h-44 mx-auto my-4 flex items-center justify-center select-none">
                    <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-sm">
                        {/* Floor Reference Rings */}
                        <ellipse cx="100" cy="130" rx="75" ry="22" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 3" />
                        <ellipse cx="100" cy="130" rx="45" ry="13" fill="none" stroke="#E2E8F0" strokeWidth="1" />

                        {/* Server Bay Base */}
                        <g transform="translate(100, 95)">
                            <polygon points="0,-25 45,0 0,25 -45,0" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                            <polygon points="-45,0 0,25 0,60 -45,35" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
                            <polygon points="0,25 45,0 45,35 0,60" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
                        </g>

                        {/* Floating Isometric Beacon */}
                        <g transform="translate(100, 48)">
                            <polygon points="0,-25 45,0 0,25 -45,0" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.75" />
                            <polygon points="-45,0 0,25 0,25 -45,0" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.75" />
                            <polygon points="0,25 45,0 45,0 0,25" fill="#FDE68A" stroke="#D97706" strokeWidth="1.75" />
                            <text x="0" y="7" textAnchor="middle" fill="#B45309" fontSize="18" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">
                                503
                            </text>
                            <line x1="0" y1="25" x2="0" y2="47" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" />
                            <line x1="-45" y1="0" x2="-45" y2="22" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" />
                            <line x1="45" y1="0" x2="45" y2="22" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 2" />
                        </g>
                    </svg>
                </div>

                {/* Primary Heading & Description */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 mb-2">
                    Dịch Vụ Tạm Thời Gián Đoạn
                </h1>
                
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
                    Hệ thống máy chủ đang bảo trì hoặc chưa sẵn sàng kết nối. Vui lòng thử lại sau ít phút hoặc quay về bảng điều khiển.
                </p>

                {/* Status Feedback Message */}
                {statusMessage && (
                    <div className="max-w-md mx-auto mb-6 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-semibold text-amber-800 flex items-center justify-center gap-2">
                        <WarningAmberRoundedIcon sx={{ fontSize: 16 }} className="text-amber-600" />
                        <span>{statusMessage}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={handleRetry}
                        disabled={isChecking}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        <RefreshRoundedIcon sx={{ fontSize: 18 }} className={isChecking ? "animate-spin" : ""} />
                        <span>{isChecking ? "Đang kiểm tra..." : "Thử kết nối lại"}</span>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200/90 shadow-2xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <HomeRoundedIcon sx={{ fontSize: 18 }} />
                        <span>Về Bảng Điều Khiển</span>
                    </button>
                </div>

            </div>

            {/* Bottom Footer Note */}
            <div className="text-center text-xs text-slate-400 relative z-10">
                <span>© {new Date().getFullYear()} CineMeow Management System</span>
            </div>
        </div>
    );
};

export default ServiceUnavailablePage;
