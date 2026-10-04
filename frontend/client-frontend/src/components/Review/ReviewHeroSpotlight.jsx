import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faStar, 
    faCommentDots, 
    faUsers, 
    faFilm, 
    faPenToSquare, 
    faCheck,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import { REVIEW_STATS } from "../../data/reviewData.js";

const ReviewHeroSpotlight = ({ onOpenWriteModal }) => {
    return (
        <div className="relative mb-12 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1a112c] via-[#121226] to-[#0a0a14] shadow-2xl p-6 sm:p-10">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 relative z-10">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/15 text-violet-400 border border-violet-500/30">
                        <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                        Góc Nhìn Khán Giả Đích Thực
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        Review & Đánh Giá Phim Chiếu Rạp
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                        Nền tảng đánh giá phim chiếu rạp minh bạch, uy tín nhất. Khám phá nhận định chân thực từ các chuyên gia phê bình và hàng vạn khán giả đã xem rạp để chọn phim chuẩn xác nhất.
                    </p>

                    {/* Community Stats Counters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                            <span className="text-lg sm:text-2xl font-black text-amber-400">{REVIEW_STATS.averageRating}</span>
                            <p className="text-[11px] text-slate-400 font-medium">Điểm trung bình</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                            <span className="text-lg sm:text-2xl font-black text-white">{REVIEW_STATS.totalMovies}</span>
                            <p className="text-[11px] text-slate-400 font-medium">Phim có review</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                            <span className="text-lg sm:text-2xl font-black text-violet-400">{REVIEW_STATS.totalComments}</span>
                            <p className="text-[11px] text-slate-400 font-medium">Bình luận rạp</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                            <span className="text-lg sm:text-2xl font-black text-emerald-400">{REVIEW_STATS.verifiedReviewers}</span>
                            <p className="text-[11px] text-slate-400 font-medium">Reviewer xác thực</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                        <button
                            onClick={onOpenWriteModal}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-900/40 transition-all hover:scale-105"
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span>Đăng bài đánh giá phim của bạn</span>
                        </button>
                    </div>
                </div>

                {/* Right Spotlight Card */}
                <div className="lg:col-span-5 relative">
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#16162a]/90 shadow-2xl p-4">
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3">
                            <img
                                src="https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
                                alt="Dune 2"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#16162a] via-transparent to-transparent" />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-violet-600/90 text-white text-xs font-bold backdrop-blur-md">
                                Top #1 Đánh Giá Cao
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-base">Dune: Hành Tinh Cát - Phần 2</h3>
                                <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
                                    <FontAwesomeIcon icon={faStar} />
                                    <span>9.6</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">
                                "Một kiệt tác không lời nào diễn tả hết! Âm thanh Dolby Atmos rung chuyển từng thớ ghế..."
                            </p>
                            <Link
                                to="/movies/693134/review"
                                className="block text-center py-2 rounded-xl text-xs font-bold text-violet-400 hover:text-white bg-white/5 hover:bg-violet-600 transition-all"
                            >
                                Đọc bài review chi tiết →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewHeroSpotlight;
