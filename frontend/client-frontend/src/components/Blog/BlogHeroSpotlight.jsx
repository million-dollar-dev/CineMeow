import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faClock, faEye, faCalendarAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const BlogHeroSpotlight = ({ article }) => {
    if (!article) return null;

    const { id, category, title, excerpt, coverUrl, author, date, readTime, views, tag } = article;

    return (
        <div className="relative mb-12 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1a1228] via-[#121226] to-[#0a0a14] shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 md:p-10 relative z-10">
                {/* Left Content */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <FontAwesomeIcon icon={faBookOpen} />
                            {tag || "GÓC NHÌN ĐIỆN ẢNH"}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                            <FontAwesomeIcon icon={faClock} className="text-amber-400" />
                            {readTime}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-slate-400">
                            <FontAwesomeIcon icon={faEye} />
                            {views} lượt đọc
                        </span>
                    </div>

                    <Link to={`/blogs/${category}/${id}`}>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight hover:text-rose-400 transition-colors">
                            {title}
                        </h1>
                    </Link>

                    <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
                        {excerpt}
                    </p>

                    {/* Author & Read button */}
                    <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={author?.avatar}
                                alt={author?.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/40"
                            />
                            <div>
                                <h4 className="text-sm font-bold text-white leading-tight">{author?.name}</h4>
                                <p className="text-xs text-slate-400">{author?.role} • {date}</p>
                            </div>
                        </div>

                        <Link
                            to={`/blogs/${category}/${id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-900/40 transition-all hover:scale-105"
                        >
                            <span>Đọc bài viết</span>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>

                {/* Right Image */}
                <div className="lg:col-span-5 relative">
                    <Link to={`/blogs/${category}/${id}`} className="block relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                        <img
                            src={coverUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14]/80 via-transparent to-transparent" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogHeroSpotlight;
