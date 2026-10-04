import React, { useState, useMemo } from 'react';
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEye, 
    faShare, 
    faCalendarAlt, 
    faClock, 
    faCheck, 
    faArrowLeft, 
    faListUl, 
    faTicketAlt,
    faBookOpen
} from "@fortawesome/free-solid-svg-icons";
import MainCard from "../components/Blog/MainCard.jsx";
import TrendCard from "../components/Blog/TrendCard.jsx";
import Promotions from "../components/PromotionSection.jsx";
import { BLOG_ARTICLES, BLOG_CATEGORIES } from "../data/blogData.js";

const BlogDetailPage = () => {
    const { category = "cinema", id } = useParams();
    const [shared, setShared] = useState(false);

    // Find current article or fallback
    const article = useMemo(() => {
        return BLOG_ARTICLES.find(a => a.id === id) || 
               BLOG_ARTICLES.find(a => a.category === category) || 
               BLOG_ARTICLES[0];
    }, [id, category]);

    // Current category label
    const categoryInfo = useMemo(() => {
        return BLOG_CATEGORIES.find(c => c.id === article.category) || BLOG_CATEGORIES[0];
    }, [article.category]);

    // Related articles (same category or others, excluding current)
    const relatedArticles = useMemo(() => {
        return BLOG_ARTICLES.filter(a => a.id !== article.id).slice(0, 3);
    }, [article.id]);

    // Top trending articles for sidebar
    const trendingArticles = useMemo(() => {
        return BLOG_ARTICLES.filter(a => a.isTrending && a.id !== article.id).slice(0, 4);
    }, [article.id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 pt-24 pb-16 selection:bg-rose-600 selection:text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6">
                    <Link to="/" className="hover:text-rose-400 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to={`/blogs/${article.category}`} className="hover:text-rose-400 transition-colors">
                        {categoryInfo.label}
                    </Link>
                    <span>/</span>
                    <span className="text-white font-medium truncate max-w-xs sm:max-w-md">{article.title}</span>
                </nav>

                {/* Article Header */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between gap-4">
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            {article.tag}
                        </span>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#16162a] border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all shadow-md"
                        >
                            <FontAwesomeIcon icon={shared ? faCheck : faShare} className={shared ? "text-emerald-400" : ""} />
                            <span>{shared ? "Đã chép link!" : "Chia sẻ bài viết"}</span>
                        </button>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        {article.title}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 italic leading-relaxed">
                        {article.excerpt}
                    </p>

                    {/* Author & Meta bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <img
                                src={article.author?.avatar}
                                alt={article.author?.name}
                                className="w-11 h-11 rounded-full object-cover border-2 border-rose-500/40"
                            />
                            <div>
                                <h4 className="text-sm font-bold text-white">{article.author?.name}</h4>
                                <p className="text-xs text-slate-400">{article.author?.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-rose-400" />
                                {article.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faClock} className="text-amber-400" />
                                {article.readTime}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faEye} />
                                {article.views} lượt xem
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hero Banner Cover */}
                <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-12 bg-slate-900">
                    <img
                        src={article.coverUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14] via-transparent to-black/30" />
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Column: Article Body */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Article Text Content */}
                        <div className="text-slate-200 text-base sm:text-lg leading-relaxed space-y-6">
                            {article.content ? (
                                article.content.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))
                            ) : (
                                <p className="leading-relaxed">{article.excerpt}</p>
                            )}
                        </div>

                        {/* Booking CTA Banner inside article */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1c1228] via-[#141426] to-[#0f0f20] border border-rose-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                                    Thưởng Thức Trọn Vẹn Tại Rạp
                                </span>
                                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                                    Xem các siêu phẩm điện ảnh với ưu đãi 45K
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400">
                                    Đặt vé trực tuyến nhanh chóng, chọn chỗ ngồi đẹp và nhận combo bắp nước độc quyền.
                                </p>
                            </div>
                            <Link
                                to="/showtimes/today"
                                className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-500 text-white text-center shadow-lg shadow-rose-900/40 transition-all hover:scale-105"
                            >
                                Đặt vé xem ngay
                            </Link>
                        </div>

                        {/* Back link */}
                        <div className="pt-6 border-t border-white/10">
                            <Link
                                to={`/blogs/${article.category}`}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                <span>Quay lại chuyên mục {categoryInfo.label}</span>
                            </Link>
                        </div>

                    </div>

                    {/* Right Column: Sticky Table of Contents & Trending */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Table of Contents (Mục Lục) */}
                        {article.tableOfContents && article.tableOfContents.length > 0 && (
                            <div className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 shadow-xl sticky top-28">
                                <h4 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider mb-3">
                                    <FontAwesomeIcon icon={faListUl} className="text-rose-400" />
                                    Mục Lục Bài Viết
                                </h4>
                                <ul className="space-y-2.5 text-xs text-slate-400">
                                    {article.tableOfContents.map((heading, i) => (
                                        <li key={i} className="hover:text-rose-400 transition-colors cursor-pointer flex items-start gap-2">
                                            <span className="text-rose-500 font-bold">•</span>
                                            <span className="leading-snug">{heading}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Trending Articles Sidebar */}
                        <div className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 shadow-xl">
                            <h4 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
                                <FontAwesomeIcon icon={faEye} className="text-rose-400" />
                                Đọc Nhiều Nhất
                            </h4>
                            <div className="space-y-2 divide-y divide-white/5">
                                {trendingArticles.map((tArticle, idx) => (
                                    <TrendCard key={tArticle.id} article={tArticle} rank={idx + 1} />
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

                {/* Related Articles Carousel / Grid */}
                {relatedArticles.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Gợi Ý Thêm</span>
                                <h3 className="text-2xl font-extrabold text-white">Bài Viết Cùng Chuyên Mục</h3>
                            </div>
                            <Link
                                to={`/blogs/${article.category}`}
                                className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300"
                            >
                                Xem tất cả →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedArticles.map((relArticle) => (
                                <MainCard key={relArticle.id} article={relArticle} />
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Bottom Promotions Section */}
            <div className="mt-16">
                <Promotions />
            </div>
        </div>
    );
};

export default BlogDetailPage;
