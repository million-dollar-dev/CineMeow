import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faStar, 
    faSearch, 
    faFilter, 
    faArrowRotateLeft, 
    faCrown, 
    faLightbulb, 
    faTicketAlt, 
    faTrophy,
    faFilm
} from "@fortawesome/free-solid-svg-icons";
import ReviewCard from "../components/Review/ReviewCard.jsx";
import ReviewHeroSpotlight from "../components/Review/ReviewHeroSpotlight.jsx";
import WriteReviewModal from "../components/Review/WriteReviewModal.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import Promotions from "../components/PromotionSection.jsx";
import { MOVIE_REVIEWS_DATA, REVIEW_CATEGORIES } from "../data/reviewData.js";

const ReviewPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);
    const [writeModalOpen, setWriteModalOpen] = useState(false);

    // Filter reviews by category and search query
    const filteredReviews = useMemo(() => {
        return MOVIE_REVIEWS_DATA.filter((movie) => {
            const matchesCat = 
                selectedCategory === "all" || 
                (selectedCategory === "top-rated" && movie.rating >= 9.0) ||
                (selectedCategory === "now-playing" && movie.category === "now-playing") ||
                (selectedCategory === "most-discussed" && (movie.category === "most-discussed" || movie.isHot));

            const matchesSearch = 
                movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                movie.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                movie.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
                movie.consensus.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCat && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Top ranked movies for sidebar (sorted by rating)
    const topHallOfFame = useMemo(() => {
        return [...MOVIE_REVIEWS_DATA].sort((a, b) => b.rating - a.rating).slice(0, 4);
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const handleResetFilters = () => {
        setSelectedCategory("all");
        setSearchQuery("");
    };

    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 pt-24 pb-16 selection:bg-violet-600 selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6">
                    <Link to="/" className="hover:text-violet-400 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-white font-medium">Góc Review & Đánh Giá</span>
                </nav>

                {/* Hero Spotlight Header with Community Stats */}
                <ReviewHeroSpotlight onOpenWriteModal={() => setWriteModalOpen(true)} />

                {/* Search & Category Filter Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
                            <FontAwesomeIcon icon={faTrophy} />
                            Bảng Xếp Hạng & Bình Luận
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Phim Chiếu Rạp Được Bình Luận Nhiều Nhất
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Cập nhật liên tục điểm số và đánh giá chi tiết từ cộng đồng người xem phim CineMeow.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm phim, diễn viên..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/80 transition-colors"
                        />
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" 
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Pills Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-slate-800">
                    {REVIEW_CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                        : "bg-[#141424] text-slate-300 border border-white/5 hover:border-white/20 hover:text-white"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Layout (Reviews Grid + Sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Reviews Grid */}
                    <div className="lg:col-span-8">
                        {filteredReviews.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredReviews.slice(0, visibleCount).map((review) => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                                </div>

                                {/* Load More Pagination */}
                                {visibleCount < filteredReviews.length && (
                                    <div className="mt-10 flex flex-col items-center justify-center gap-3">
                                        <button
                                            onClick={handleLoadMore}
                                            className="px-8 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#16162c] hover:bg-[#20203e] border border-white/10 hover:border-violet-500/40 text-white transition-all shadow-md hover:-translate-y-0.5"
                                        >
                                            Xem thêm phim ({filteredReviews.length - visibleCount} phim còn lại)
                                        </button>
                                        <span className="text-xs text-slate-500">
                                            Hiển thị {Math.min(visibleCount, filteredReviews.length)} trên {filteredReviews.length} phim
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty Search State */
                            <div className="py-16 px-6 text-center rounded-2xl bg-[#141424]/60 border border-white/5 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-2xl mb-4">
                                    <FontAwesomeIcon icon={faFilter} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Không tìm thấy phim phù hợp
                                </h3>
                                <p className="text-sm text-slate-400 max-w-md mb-6">
                                    Không có phim nào khớp với từ khóa "{searchQuery}" trong bộ lọc hiện tại.
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                                >
                                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                                    Xóa bộ lọc & Xem tất cả
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Top Hall of Fame Movies */}
                        <div className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCrown} className="text-amber-400" />
                                    Điểm Cao Nhất Tháng
                                </h3>
                                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    Hall of Fame
                                </span>
                            </div>

                            <div className="space-y-3">
                                {topHallOfFame.map((movie, index) => (
                                    <Link
                                        key={movie.id}
                                        to={`/movies/${movie.movieId}/review`}
                                        className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all"
                                    >
                                        <div className="relative w-14 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                            <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-violet-600 text-white font-black text-[10px] flex items-center justify-center">
                                                #{index + 1}
                                            </span>
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors truncate">
                                                {movie.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-400 truncate">{movie.genres[0] || "Điện ảnh"}</p>
                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                                                <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                                                <span>{movie.rating}</span>
                                                <span className="text-[10px] text-slate-500 font-normal">({movie.commentsCount})</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Cinema Booking CTA */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#181226] to-[#0f0f20] border border-violet-500/20 text-center space-y-3 shadow-xl">
                            <div className="w-12 h-12 mx-auto rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-xl">
                                <FontAwesomeIcon icon={faFilm} />
                            </div>
                            <h4 className="text-base font-bold text-white">Xem Phim Ngay Hôm Nay</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Đặt vé xem các siêu phẩm được cộng đồng đánh giá cao nhất với giá vé chỉ từ 45K.
                            </p>
                            <Link
                                to="/showtimes/today"
                                className="inline-block w-full py-2.5 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-900/40"
                            >
                                Xem suất chiếu tại rạp
                            </Link>
                        </div>

                        {/* Review Guidelines / Tips Box */}
                        <div className="p-5 rounded-2xl bg-[#141424]/70 border border-white/5 text-xs text-slate-400 space-y-3">
                            <div className="flex items-center gap-2 font-bold text-slate-200">
                                <FontAwesomeIcon icon={faLightbulb} className="text-amber-400 text-sm" />
                                Tiêu Chí Đánh Giá Phim Tại CineMeow
                            </div>
                            <ul className="space-y-2 list-disc list-inside leading-relaxed text-slate-400">
                                <li><strong className="text-slate-200">Kịch bản & Cốt truyện:</strong> Chiều sâu nội dung, thông điệp và cú twist.</li>
                                <li><strong className="text-slate-200">Diễn xuất:</strong> Cảm xúc và sự hóa thân của dàn diễn viên.</li>
                                <li><strong className="text-slate-200">Hình ảnh & Kỹ xảo:</strong> Góc máy quay, màu sắc và CGI chân thực.</li>
                                <li><strong className="text-slate-200">Âm thanh & OST:</strong> Độ hoành tráng của âm thanh vòm Dolby Atmos.</li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>

            {/* Now Playing Carousel & Promotions */}
            <div className="mt-16">
                <MediaCarousel title={"Phim đang chiếu tại rạp"} />
            </div>

            <div className="mt-8">
                <Promotions />
            </div>

            {/* Write Review Modal */}
            <WriteReviewModal
                isOpen={writeModalOpen}
                onClose={() => setWriteModalOpen(false)}
                onReviewSubmitted={(newRev) => {
                    console.log("New review submitted:", newRev);
                }}
            />
        </div>
    );
};

export default ReviewPage;
