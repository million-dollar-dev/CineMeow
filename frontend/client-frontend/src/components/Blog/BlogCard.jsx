import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faClock, faCalendarAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const BlogCard = ({ article }) => {
    if (!article) return null;

    const { id, category, title, excerpt, coverUrl, author, date, readTime, views, tag } = article;

    return (
        <Link
            to={`/blogs/${category}/${id}`}
            className="group flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-[#141424]/90 border border-white/5 hover:border-rose-500/40 hover:bg-[#1a1a32] shadow-lg hover:shadow-[0_8px_25px_rgba(225,29,72,0.12)] transition-all duration-300"
        >
            {/* Image Thumbnail */}
            <div className="relative w-full sm:w-56 h-40 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-slate-900">
                <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {tag}
                </div>
            </div>

            {/* Content info */}
            <div className="flex flex-col justify-between flex-grow min-w-0">
                <div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-[10px] text-rose-400" />
                            {date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} className="text-[10px] text-amber-400" />
                            {readTime}
                        </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                        {title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {excerpt}
                    </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={author?.avatar}
                            alt={author?.name}
                            className="w-5 h-5 rounded-full object-cover border border-white/20"
                        />
                        <span className="text-xs text-slate-300 font-medium">
                            {author?.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faEye} className="text-[11px]" />
                            {views}
                        </span>
                        <span className="text-rose-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                            Đọc tiếp <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
