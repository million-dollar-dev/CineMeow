import React, { useState, useMemo } from 'react';
import ReviewItem from "./ReviewItem.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faStar, 
    faCheckCircle, 
    faPaperPlane, 
    faFilter, 
    faFire, 
    faChevronDown, 
    faTicketAlt,
    faComments
} from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_COMMUNITY_REVIEWS } from "../../data/reviewData.js";

const PRESET_TAGS = [
    "Đáng tiền vé",
    "Kỹ xảo mãn nhãn",
    "Kịch tính gay cấn",
    "Cảm động rơi nước mắt",
    "Diễn xuất đỉnh cao",
    "Nhạc phim xuất sắc",
    "Plot twist bất ngờ"
];

const RATING_SCORE_LABELS = {
    10: "10/10 - Tuyệt phẩm điện ảnh",
    9: "9/10 - Rất hay, rất đáng xem",
    8: "8/10 - Đáng tiền vé, giải trí tốt",
    7: "7/10 - Khá ổn, xem được",
    6: "6/10 - Mức độ trung bình",
    5: "5/10 - Xem tạm, còn thiếu sót",
    4: "4/10 - Dưới kỳ vọng",
    3: "3/10 - Khá thất vọng",
    2: "2/10 - Rất tệ",
    1: "1/10 - Không nên xem"
};

const ReviewList = ({ 
    movieId, 
    movieTitle = "Bộ phim", 
    initialReviews = [], 
    overallRating = 9.2, 
    totalReviewsCount = "1.8K" 
}) => {
    // Combine initial reviews with default fallback reviews if needed
    const initialList = useMemo(() => {
        if (initialReviews && initialReviews.length > 0) {
            // If fewer than 4, merge with default
            if (initialReviews.length < 4) {
                const existingUsers = new Set(initialReviews.map(r => r.user));
                const extras = DEFAULT_COMMUNITY_REVIEWS.filter(r => !existingUsers.has(r.user));
                return [...initialReviews, ...extras];
            }
            return initialReviews;
        }
        return DEFAULT_COMMUNITY_REVIEWS;
    }, [initialReviews]);

    const [reviews, setReviews] = useState(initialList);
    const [visibleCount, setVisibleCount] = useState(4);
    const [activeFilter, setActiveFilter] = useState("all");

    // Form states
    const [userRating, setUserRating] = useState(10);
    const [hoverRating, setHoverRating] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [reviewerName, setReviewerName] = useState("");
    const [selectedTags, setSelectedTags] = useState(["Đáng tiền vé", "Kỹ xảo mãn nhãn"]);
    const [isVerifiedTicket, setIsVerifiedTicket] = useState(true);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Toggle sentiment tags
    const handleToggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    // Submit new review
    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newReviewObj = {
            id: `usr-${Date.now()}`,
            user: reviewerName.trim() || "Khán giả CineMeow",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
            role: "Khán giả rạp",
            score: userRating,
            date: "Vừa xong",
            content: commentText.trim(),
            tags: selectedTags,
            verifiedTicket: isVerifiedTicket,
            likes: 1
        };

        setReviews(prev => [newReviewObj, ...prev]);
        setCommentText("");
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
    };

    // Filter reviews
    const filteredReviews = useMemo(() => {
        switch (activeFilter) {
            case "verified":
                return reviews.filter(r => r.verifiedTicket);
            case "top":
                return reviews.filter(r => r.score >= 9.0);
            case "likes":
                return [...reviews].sort((a, b) => (b.likes || 0) - (a.likes || 0));
            default:
                return reviews;
        }
    }, [reviews, activeFilter]);

    return (
        <div className="space-y-8 text-slate-100">
            
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                        <FontAwesomeIcon icon={faComments} className="text-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                            Bình luận & Đánh giá từ Khán giả
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Ý kiến chân thực từ cộng đồng người xem điện ảnh tại rạp
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold">
                        {reviews.length} đánh giá đã duyệt
                    </span>
                </div>
            </div>

            {/* Rating Breakdown Dashboard Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141424] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                    
                    {/* Left: Overall Score Box */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Điểm đánh giá chung
                        </span>
                        
                        <div className="flex items-baseline justify-center gap-1.5">
                            <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                                {overallRating}
                            </span>
                            <span className="text-xl font-bold text-slate-500">/10</span>
                        </div>

                        {/* Gold Stars Bar */}
                        <div className="flex items-center gap-1 text-amber-400 text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FontAwesomeIcon key={star} icon={faStar} />
                            ))}
                        </div>

                        <p className="text-xs text-slate-400">
                            Dựa trên <strong className="text-white">{totalReviewsCount}</strong> lượt đánh giá
                        </p>

                        <div className="pt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                                <span>96% Khán giả khuyên nên xem</span>
                            </span>
                        </div>
                    </div>

                    {/* Middle: Rating Distribution Bars */}
                    <div className="md:col-span-5 space-y-2.5">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Phân bố mức điểm
                        </p>

                        {[
                            { label: "5 sao (9-10đ)", percent: 82, count: "82%" },
                            { label: "4 sao (7-8đ)", percent: 12, count: "12%" },
                            { label: "3 sao (5-6đ)", percent: 4, count: "4%" },
                            { label: "2 sao (3-4đ)", percent: 1, count: "1%" },
                            { label: "1 sao (1-2đ)", percent: 1, count: "1%" }
                        ].map((row, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                                <span className="w-24 text-slate-400 truncate">{row.label}</span>
                                <div className="flex-grow h-2 rounded-full bg-white/5 overflow-hidden">
                                    <div 
                                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700"
                                        style={{ width: `${row.percent}%` }}
                                    />
                                </div>
                                <span className="w-10 text-right text-slate-400 font-medium">{row.count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right: Aspect Highlights */}
                    <div className="md:col-span-3 space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Điểm theo tiêu chí
                        </p>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Kịch bản</span>
                                <span className="font-bold text-amber-400">9.1 ★</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Diễn xuất</span>
                                <span className="font-bold text-amber-400">9.5 ★</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Kỹ xảo & Hình ảnh</span>
                                <span className="font-bold text-amber-400">9.8 ★</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Âm thanh & Nhạc</span>
                                <span className="font-bold text-amber-400">9.6 ★</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Interactive Write Review Form */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#141424] border border-white/10 shadow-xl space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                        <span>Viết cảm nhận của bạn về</span>
                        <span className="text-violet-400 truncate max-w-xs">{movieTitle}</span>
                    </h4>

                    {/* Verified badge info */}
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faTicketAlt} className="text-violet-400" />
                        <span>Đánh giá từ khán giả thực tế</span>
                    </span>
                </div>

                {/* Success alert message */}
                {showSuccessToast && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <span>Cảm ơn bạn! Đánh giá đã được đăng thành công và hiển thị ngay bên dưới.</span>
                    </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                    
                    {/* Star Rating Selector */}
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-300">
                                Bạn chấm phim này mấy điểm?
                            </span>
                            <span className="text-xs font-bold text-amber-400">
                                {RATING_SCORE_LABELS[hoverRating || userRating]}
                            </span>
                        </div>

                        {/* Interactive Stars 1 to 10 */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap pt-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starVal) => {
                                const isHighlighted = (hoverRating || userRating) >= starVal;
                                return (
                                    <button
                                        key={starVal}
                                        type="button"
                                        onClick={() => setUserRating(starVal)}
                                        onMouseEnter={() => setHoverRating(starVal)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all ${
                                            isHighlighted 
                                                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 scale-105" 
                                                : "bg-white/5 text-slate-400 hover:bg-white/10"
                                        }`}
                                    >
                                        {starVal}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sentiment Tag Chips */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300">
                            Chọn thẻ cảm nhận nổi bật (tuỳ chọn):
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleToggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                            isSelected 
                                                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105" 
                                                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                                        }`}
                                    >
                                        #{tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Review text input */}
                    <div className="space-y-1.5">
                        <textarea
                            rows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Chia sẻ cảm nhận chi tiết của bạn về nội dung, diễn xuất, kỹ xảo, hay những điều bạn thích ở bộ phim..."
                            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                            maxLength={800}
                        />
                        <div className="flex justify-between items-center text-[11px] text-slate-500">
                            <span>Không tiết lộ trước kết phim (spoilers) để giữ trọn trải nghiệm cho người khác.</span>
                            <span>{commentText.length} / 800 ký tự</span>
                        </div>
                    </div>

                    {/* Bottom User info & Submit */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                placeholder="Tên hiển thị của bạn (tuỳ chọn)"
                                className="px-3.5 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 w-52 sm:w-60"
                            />
                            
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white select-none">
                                <input
                                    type="checkbox"
                                    checked={isVerifiedTicket}
                                    onChange={(e) => setIsVerifiedTicket(e.target.checked)}
                                    className="rounded border-white/20 text-violet-600 focus:ring-violet-500 accent-violet-600"
                                />
                                <span>Đã xem tại rạp</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30 transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                            <span>Gửi bình luận</span>
                        </button>
                    </div>

                </form>
            </div>

            {/* Filter Tabs Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        { id: "all", label: `Tất cả (${reviews.length})` },
                        { id: "verified", label: `Đã xem rạp (${reviews.filter(r => r.verifiedTicket).length})` },
                        { id: "top", label: `Điểm cao 9-10★ (${reviews.filter(r => r.score >= 9).length})` },
                        { id: "likes", label: "Nhiều lượt thích nhất" }
                    ].map((tab) => {
                        const isActive = activeFilter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    isActive 
                                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30" 
                                        : "bg-[#141424] text-slate-400 hover:text-white border border-white/5 hover:border-white/10"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="text-xs text-slate-400">
                    Hiển thị {Math.min(visibleCount, filteredReviews.length)} / {filteredReviews.length} bình luận
                </div>
            </div>

            {/* Review Items List */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-[#141424] border border-white/10 space-y-3">
                        <FontAwesomeIcon icon={faComments} className="text-3xl text-slate-600" />
                        <p className="text-sm text-slate-400 font-medium">Chưa có bình luận nào phù hợp với bộ lọc này.</p>
                        <button
                            onClick={() => setActiveFilter("all")}
                            className="text-xs text-violet-400 hover:underline font-bold"
                        >
                            Xem tất cả bình luận
                        </button>
                    </div>
                ) : (
                    filteredReviews.slice(0, visibleCount).map((rev, idx) => (
                        <ReviewItem key={rev.id || idx} review={rev} />
                    ))
                )}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredReviews.length && (
                <div className="flex justify-center pt-2">
                    <button
                        onClick={() => setVisibleCount(prev => prev + 4)}
                        className="px-6 py-3 rounded-2xl bg-[#141424] hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-violet-600/10 group"
                    >
                        <span>Xem thêm {filteredReviews.length - visibleCount} bình luận khác</span>
                        <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className="group-hover:translate-y-0.5 transition-transform" 
                        />
                    </button>
                </div>
            )}

        </div>
    );
};

export default ReviewList;