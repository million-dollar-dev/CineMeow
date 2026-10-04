import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const TrendCard = ({ article, rank }) => {
    if (!article) return null;

    const { id, category, title, coverUrl, views, date } = article;

    return (
        <Link
            to={`/blogs/${category}/${id}`}
            className="group flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-white/5 transition-all duration-200"
        >
            {/* Thumbnail with Rank Overlay */}
            <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900">
                <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-rose-600/90 text-white font-extrabold text-[10px] flex items-center justify-center shadow">
                    #{rank}
                </span>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between flex-grow min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                    {title}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                        {views}
                    </span>
                    <span>•</span>
                    <span>{date}</span>
                </div>
            </div>
        </Link>
    );
};

export default TrendCard;
