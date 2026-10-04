import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBookOpen, faEye, faClock } from "@fortawesome/free-solid-svg-icons";
import { BLOG_ARTICLES } from "../data/blogData.js";

export default function MovieBlogSection() {
    const [activeTab, setActiveTab] = useState("latest");

    const displayedPosts = useMemo(() => {
        if (activeTab === "mostViewed") {
            return BLOG_ARTICLES.filter(a => a.isTrending).slice(0, 4);
        }
        return BLOG_ARTICLES.slice(0, 4);
    }, [activeTab]);

    return (
        <section className="bg-[#0B0B14] py-16 px-4 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
                            <FontAwesomeIcon icon={faBookOpen} />
                            Góc Nhìn Điện Ảnh
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Blog & Tạp Chí Điện Ảnh
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Tổng hợp bài viết phân tích, tin tức hậu trường và review phim chiếu rạp mới nhất.
                        </p>
                    </div>

                    <Link
                        to="/blogs/cinema"
                        className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors group"
                    >
                        <span>Khám phá tất cả bài viết</span>
                        <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => setActiveTab("latest")}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === "latest"
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                : "bg-[#141424] text-slate-400 hover:text-white border border-white/5"
                        }`}
                    >
                        Mới nhất
                    </button>
                    <button
                        onClick={() => setActiveTab("mostViewed")}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            activeTab === "mostViewed"
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                : "bg-[#141424] text-slate-400 hover:text-white border border-white/5"
                        }`}
                    >
                        Xem nhiều nhất
                    </button>
                </div>

                {/* Blog cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedPosts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/blogs/${post.category}/${post.id}`}
                            className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-[#141424] border border-white/10 hover:border-violet-500/40 shadow-lg hover:shadow-[0_8px_25px_rgba(127,90,240,0.18)] transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                                <img 
                                    src={post.coverUrl} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                                    {post.tag}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                                    {post.title}
                                </h3>
                                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} className="text-[10px] text-amber-400" />
                                        {post.readTime}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                                        {post.views}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-10 text-center">
                    <Link
                        to="/blogs/cinema"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#16162c] hover:bg-[#20203e] border border-white/10 hover:border-violet-500/40 text-white transition-all shadow-md"
                    >
                        <span>Xem thêm chuyên mục Blog</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
