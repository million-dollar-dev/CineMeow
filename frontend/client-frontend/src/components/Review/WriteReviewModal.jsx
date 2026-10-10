import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faXmark, faCheck, faPenNib } from "@fortawesome/free-solid-svg-icons";

const WriteReviewModal = ({ isOpen, onClose, onReviewSubmitted }) => {
    const [movieName, setMovieName] = useState("");
    const [score, setScore] = useState(10);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            if (onReviewSubmitted) onReviewSubmitted({ movieName, score, title, content });
            onClose();
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#141424] border border-white/10 shadow-2xl shadow-violet-950/50 space-y-6">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                {/* Header */}
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-400">
                        <FontAwesomeIcon icon={faPenNib} />
                        Chia Sẻ Trải Nghiệm
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">Viết Đánh Giá Phim</h3>
                    <p className="text-xs text-slate-400">Góp phần xây dựng cộng đồng điện ảnh uy tín cho người xem rạp.</p>
                </div>

                {submitted ? (
                    <div className="py-8 text-center space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                            <FontAwesomeIcon icon={faCheck} />
                        </div>
                        <h4 className="text-lg font-bold text-white">Cảm ơn bạn đã gửi đánh giá!</h4>
                        <p className="text-xs text-slate-400">Bài viết của bạn đang được kiểm duyệt và sẽ xuất hiện sớm trên CineMeow.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Movie Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Tên phim</label>
                            <input
                                type="text"
                                required
                                value={movieName}
                                onChange={(e) => setMovieName(e.target.value)}
                                placeholder="Ví dụ: Dune 2, Conan, Deadpool & Wolverine..."
                                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c34] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Rating Score Selector (1-10) */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-300 uppercase">Điểm đánh giá của bạn</label>
                                <span className="text-sm font-black text-amber-400 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faStar} />
                                    {score} / 10
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.5"
                                value={score}
                                onChange={(e) => setScore(Number(e.target.value))}
                                className="w-full accent-violet-600 cursor-pointer"
                            />
                        </div>

                        {/* Review Title */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Tiêu đề bài viết</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Tóm tắt cảm nghĩ trong một câu..."
                                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c34] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Review Content */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Nội dung đánh giá chi tiết</label>
                            <textarea
                                required
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Hãy chia sẻ về diễn xuất, cốt truyện, kỹ xảo, âm thanh hoặc trải nghiệm tại rạp..."
                                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c34] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                            />
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 transition-all hover:scale-105"
                            >
                                Đăng đánh giá
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default WriteReviewModal;
