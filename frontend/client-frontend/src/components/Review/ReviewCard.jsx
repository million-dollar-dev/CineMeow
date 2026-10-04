import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faStar, 
    faComment, 
    faThumbsUp, 
    faTicketAlt, 
    faArrowRight, 
    faCheckCircle,
    faClock
} from "@fortawesome/free-solid-svg-icons";

const ReviewCard = ({ review }) => {
    const [likes, setLikes] = useState(review?.likesCount || 0);
    const [hasLiked, setHasLiked] = useState(false);

    if (!review) return null;

    const {
        id,
        movieId,
        title,
        originalTitle,
        poster,
        rating,
        ratingCount,
        genres = [],
        duration,
        releaseYear,
        consensus,
        commentsCount,
        featuredReview
    } = review;

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!hasLiked) {
            setLikes(prev => prev + 1);
            setHasLiked(true);
        } else {
            setLikes(prev => prev - 1);
            setHasLiked(false);
        }
    };

    return (
        <div className="group rounded-3xl overflow-hidden bg-[#141424] border border-white/10 hover:border-violet-500/40 shadow-xl hover:shadow-[0_12px_35px_rgba(127,90,240,0.18)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            
            {/* Top: Movie Showcase */}
            <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img
                        src={poster}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141424] via-[#141424]/40 to-transparent" />

                    {/* Rating Badge */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 font-black text-sm shadow-lg">
                        <FontAwesomeIcon icon={faStar} className="text-amber-400 text-xs" />
                        <span>{rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">/10</span>
                    </div>

                    {/* Year & Duration */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-slate-300">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md font-semibold text-[11px]">
                            {releaseYear}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-300">
                            <FontAwesomeIcon icon={faClock} className="text-[10px] text-violet-400" />
                            {duration}
                        </span>
                    </div>
                </div>

                {/* Movie Header Info */}
                <div className="p-5 pb-3">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {genres.slice(0, 3).map((genre, idx) => (
                            <span 
                                key={idx} 
                                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/5"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>

                    <Link to={`/movies/${movieId}/review`}>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1 leading-snug">
                            {title}
                        </h3>
                    </Link>
                    <p className="text-xs text-slate-400 truncate mb-3">{originalTitle}</p>

                    {/* Consensus badge */}
                    <div className="p-3 rounded-xl bg-[#1c1c34]/70 border border-white/5 text-xs text-slate-300 leading-relaxed mb-4">
                        <span className="font-bold text-violet-400 mr-1.5">Nhận định:</span>
                        {consensus}
                    </div>

                    {/* Featured Review Comment Box */}
                    {featuredReview && (
                        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={featuredReview.avatar}
                                        alt={featuredReview.user}
                                        className="w-7 h-7 rounded-full object-cover border border-violet-500/30"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-white flex items-center gap-1">
                                            {featuredReview.user}
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 text-[10px]" title="Đã xem rạp" />
                                        </p>
                                        <p className="text-[10px] text-slate-500">{featuredReview.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                                    <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                                    <span>{featuredReview.score}</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-300 italic line-clamp-2 leading-relaxed">
                                "{featuredReview.content}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="p-5 pt-0 mt-3">
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                                hasLiked 
                                    ? "bg-violet-500/20 text-violet-400 font-bold" 
                                    : "hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <FontAwesomeIcon icon={faThumbsUp} className="text-[11px]" />
                            <span>{likes}</span>
                        </button>

                        <Link 
                            to={`/movies/${movieId}/review`}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                            <FontAwesomeIcon icon={faComment} className="text-[11px]" />
                            <span>{commentsCount}</span>
                        </Link>
                    </div>

                    <Link
                        to={`/movie/${movieId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-md shadow-violet-900/30 transition-all hover:scale-105"
                    >
                        <FontAwesomeIcon icon={faTicketAlt} className="text-[10px]" />
                        <span>Đặt vé</span>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default ReviewCard;
