import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faClock, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const MainCard = ({ article }) => {
    if (!article) return null;

    const { id, category, title, excerpt, coverUrl, author, date, readTime, views, tag } = article;

    return (
        <Link 
            to={`/blogs/${category}/${id}`}
            className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-[#141424] border border-white/10 hover:border-rose-500/40 shadow-xl hover:shadow-[0_10px_30px_rgba(225,29,72,0.15)] transition-all duration-300 hover:-translate-y-1"
        >
            {/* Image Banner */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141424] via-transparent to-transparent opacity-80" />

                {/* Badge Tag */}
                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-lg bg-rose-600/90 text-white backdrop-blur-md shadow">
                        {tag}
                    </span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                        <FontAwesomeIcon icon={faClock} className="text-rose-400 text-[10px]" />
                        {readTime}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                        <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                        {views}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                        {title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {excerpt}
                    </p>
                </div>

                {/* Author footer */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={author?.avatar}
                            alt={author?.name}
                            className="w-6 h-6 rounded-full object-cover border border-white/20"
                        />
                        <span className="text-xs font-medium text-slate-300">
                            {author?.name}
                        </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                        {date}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default MainCard;
