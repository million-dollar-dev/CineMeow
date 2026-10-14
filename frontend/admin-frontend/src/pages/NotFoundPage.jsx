import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const NotFoundPage = () => {
    const navigate = useNavigate();

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
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/20 font-black text-sm">
                        CM
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-base">
                        CineMeow <span className="text-violet-600 font-semibold text-xs ml-1 px-2 py-0.5 rounded-md bg-violet-50 border border-violet-100">Portal</span>
                    </span>
                </div>
            </div>

            {/* Main Center Content Box */}
            <div className="max-w-xl mx-auto w-full my-auto text-center relative z-10 py-8">

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-bold tracking-wider uppercase mb-6 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-violet-600" />
                    <span>Lỗi 404 • Không tìm thấy trang</span>
                </div>

                {/* 3D Blueprint Isometric Geometry Vector */}
                <div className="relative w-64 h-44 mx-auto my-4 flex items-center justify-center select-none">
                    <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-sm">
                        {/* Floor Reference Rings */}
                        <ellipse cx="100" cy="130" rx="75" ry="22" fill="none" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 3" />
                        <ellipse cx="100" cy="130" rx="45" ry="13" fill="none" stroke="#CBD5E1" strokeWidth="1" />

                        {/* Isometric Cube (Solid Base) */}
                        <g transform="translate(100, 95)">
                            <polygon points="0,-25 45,0 0,25 -45,0" fill="#EEF2F6" stroke="#94A3B8" strokeWidth="1.5" />
                            <polygon points="-45,0 0,25 0,65 -45,40" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
                            <polygon points="0,25 45,0 45,40 0,65" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
                        </g>

                        {/* Floating Isometric Upper Cube with Violet Gradient */}
                        <g transform="translate(100, 48)">
                            <polygon points="0,-25 45,0 0,25 -45,0" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.75" />
                            <polygon points="-45,0 0,25 0,25 -45,0" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.75" />
                            <polygon points="0,25 45,0 45,0 0,25" fill="#C7D2FE" stroke="#6366F1" strokeWidth="1.75" />
                            <text x="0" y="7" textAnchor="middle" fill="#4F46E5" fontSize="18" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">
                                404
                            </text>
                            <line x1="0" y1="25" x2="0" y2="47" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3 2" />
                            <line x1="-45" y1="0" x2="-45" y2="22" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3 2" />
                            <line x1="45" y1="0" x2="45" y2="22" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3 2" />
                        </g>
                    </svg>
                </div>

                {/* Primary Heading & Description */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 mb-2">
                    Không Tìm Thấy Trang
                </h1>
                
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
                    Đường dẫn bạn yêu cầu không tồn tại, đã bị xóa hoặc tài khoản của bạn chưa có quyền truy cập vào mục này.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200/90 shadow-2xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
                        <span>Quay lại</span>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
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

export default NotFoundPage;
