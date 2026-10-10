import React, { useState, useMemo } from 'react';
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faArrowTrendUp, 
    faSearch, 
    faFilm, 
    faTicketAlt, 
    faEnvelope, 
    faCheck, 
    faArrowRotateLeft,
    faBookOpen
} from "@fortawesome/free-solid-svg-icons";
import BlogCard from "../components/Blog/BlogCard.jsx";
import MainCard from "../components/Blog/MainCard.jsx";
import TrendCard from "../components/Blog/TrendCard.jsx";
import BlogHeroSpotlight from "../components/Blog/BlogHeroSpotlight.jsx";
import Promotions from "../components/PromotionSection.jsx";
import { BLOG_ARTICLES, BLOG_CATEGORIES } from "../data/blogData.js";

const AllBlogPage = () => {
    const { category = "cinema" } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(4);
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");

    // Current category metadata
    const currentCatInfo = useMemo(() => {
        return BLOG_CATEGORIES.find(c => c.id === category) || BLOG_CATEGORIES[0];
    }, [category]);

    // Filter articles by category and search query
    const filteredArticles = useMemo(() => {
        return BLOG_ARTICLES.filter((article) => {
            const matchesCat = category === "all" || article.category === category || category === "cinema";
            const matchesSearch = 
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.tag.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [category, searchQuery]);

    // Top featured article for the hero
    const heroArticle = useMemo(() => {
        return filteredArticles.find(a => a.isFeatured) || filteredArticles[0] || BLOG_ARTICLES[0];
    }, [filteredArticles]);

    // 3 prominent articles for editorial showcase (excluding hero)
    const featuredArticles = useMemo(() => {
        return filteredArticles.filter(a => a.id !== heroArticle?.id).slice(0, 3);
    }, [filteredArticles, heroArticle]);

    // Latest list of articles (excluding hero & featured if plenty, or entire list)
    const latestArticles = useMemo(() => {
        return filteredArticles.filter(a => a.id !== heroArticle?.id);
    }, [filteredArticles, heroArticle]);

    // Trending articles for right sidebar
    const trendingArticles = useMemo(() => {
        return BLOG_ARTICLES.filter(a => a.isTrending).slice(0, 4);
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 pt-24 pb-16 selection:bg-violet-600 selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6">
                    <Link to="/" className="hover:text-violet-400 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-white font-medium">{currentCatInfo.label}</span>
                </nav>

                {/* Hero Spotlight Article */}
                {heroArticle && !searchQuery && (
                    <BlogHeroSpotlight article={heroArticle} />
                )}

                {/* Header Title & Live Search */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
                            <FontAwesomeIcon icon={faBookOpen} />
                            Tạp Chí CineMeow
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            {currentCatInfo.label}
                        </h2>
                        <p className="mt-1 text-sm md:text-base text-slate-400">
                            {currentCatInfo.desc}
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm bài viết, chủ đề..."
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

                {/* Category Navigation Tabs (Violet Theme) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-slate-800">
                    {BLOG_CATEGORIES.map((cat) => {
                        const isActive = category === cat.id;
                        return (
                            <Link
                                key={cat.id}
                                to={`/blogs/${cat.id}`}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                        : "bg-[#141424] text-slate-300 border border-white/5 hover:border-white/20 hover:text-white"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* 3 Prominent Editorial Cards (Show when not searching) */}
                {!searchQuery && featuredArticles.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                            Góc Nhìn Nổi Bật
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredArticles.map((article) => (
                                <MainCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Layout (Articles Feed + Sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Articles List */}
                    <div className="lg:col-span-8 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                                <FontAwesomeIcon icon={faFilm} className="text-violet-400" />
                                Bài Viết Mới Nhất
                            </h3>
                            <span className="text-xs text-slate-400 font-medium">
                                {filteredArticles.length} bài viết
                            </span>
                        </div>

                        {filteredArticles.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {latestArticles.slice(0, visibleCount).map((article) => (
                                        <BlogCard key={article.id} article={article} />
                                    ))}
                                </div>

                                {/* Load More Button (Violet Hover) */}
                                {visibleCount < latestArticles.length && (
                                    <div className="pt-6 text-center">
                                        <button
                                            onClick={handleLoadMore}
                                            className="px-8 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#16162c] hover:bg-[#20203e] border border-white/10 hover:border-violet-500/40 text-white transition-all shadow-md hover:-translate-y-0.5"
                                        >
                                            Xem thêm bài viết ({latestArticles.length - visibleCount} còn lại)
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty Search State */
                            <div className="py-16 px-6 text-center rounded-2xl bg-[#141424]/60 border border-white/5 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-2xl mb-4">
                                    <FontAwesomeIcon icon={faBookOpen} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Không tìm thấy bài viết nào
                                </h3>
                                <p className="text-sm text-slate-400 max-w-md mb-6">
                                    Không có bài viết nào khớp với từ khóa "{searchQuery}".
                                </p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                                >
                                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                                    Xem tất cả bài viết
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Trending Sidebar & Widgets */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Trending Articles Box */}
                        <div className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-violet-400" />
                                    Đọc Nhiều Nhất
                                </h3>
                                <span className="text-[11px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                                    Top Views
                                </span>
                            </div>

                            <div className="space-y-2 divide-y divide-white/5">
                                {trendingArticles.map((article, idx) => (
                                    <TrendCard key={article.id} article={article} rank={idx + 1} />
                                ))}
                            </div>
                        </div>

                        {/* Cinema Showtime Quick Booking Banner (Violet Theme) */}
                        <div className="relative p-6 rounded-2xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-purple-950/40 via-[#181226] to-[#0f0f20] shadow-xl text-center space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-xl">
                                <FontAwesomeIcon icon={faTicketAlt} />
                            </div>
                            <h4 className="text-base font-bold text-white">
                                Xem Phim Tại Rạp Ngay Hôm Nay
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Đặt vé xem phim nhanh chóng, nhận ngay bắp nước miễn phí với ưu đãi hội viên CineMeow.
                            </p>
                            <Link
                                to="/showtimes/today"
                                className="inline-block w-full py-2.5 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-900/40"
                            >
                                Xem lịch chiếu các rạp
                            </Link>
                        </div>

                        {/* Newsletter Subscription Card */}
                        <div className="p-5 rounded-2xl bg-[#141424]/80 border border-white/5 space-y-3">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-amber-400" />
                                Đăng Ký Bản Tin Điện Ảnh
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Nhận tin tức phim chiếu rạp mới nhất, bài phân tích độc quyền và mã giảm giá hàng tuần vào email của bạn.
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-2">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập email của bạn..."
                                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-1.5"
                                >
                                    {subscribed ? (
                                        <>
                                            <FontAwesomeIcon icon={faCheck} className="text-emerald-400" />
                                            <span>Đã đăng ký thành công!</span>
                                        </>
                                    ) : (
                                        <span>Đăng ký nhận tin</span>
                                    )}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>

            </div>

            {/* Bottom Promotions Section */}
            <div className="mt-16">
                <Promotions />
            </div>
        </div>
    );
};

export default AllBlogPage;
