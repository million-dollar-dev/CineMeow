import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ActiveAccountPage() {
    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden selection:bg-violet-600 selection:text-white">
            
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-1/3 -left-32 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg border border-white/10 bg-[#141424] rounded-3xl shadow-[0_0_40px_rgba(127,90,240,0.15)] p-8 sm:p-10 text-center space-y-6">
                
                {/* Glowing Envelope Icon */}
                <div className="w-20 h-20 mx-auto rounded-3xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center text-3xl shadow-lg shadow-violet-500/20">
                    <FontAwesomeIcon icon={faEnvelope} />
                </div>

                <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                        <span>Đăng ký tài khoản thành công</span>
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Kiểm tra email của bạn
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                        Chúng tôi đã gửi một liên kết xác nhận đến hộp thư của bạn. Vui lòng mở email và nhấn vào liên kết để kích hoạt tài khoản CineMeow.
                    </p>
                </div>

                {/* Notice Box */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-400 space-y-1">
                    <p>Nếu không tìm thấy email trong hộp thư đến?</p>
                    <p className="text-slate-300">
                        Hãy kiểm tra thư mục <strong className="text-violet-400 font-semibold">Spam / Thư rác / Quảng cáo</strong>.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-900/30 transition-all hover:scale-105"
                    >
                        Tới trang Đăng nhập
                    </Link>

                    <Link
                        to="/"
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs sm:text-sm transition-all"
                    >
                        Quay lại Trang chủ
                    </Link>
                </div>

            </div>

        </div>
    );
}
