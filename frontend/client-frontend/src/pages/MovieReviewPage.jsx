import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import ReviewList from "../components/MovieDetail/ReviewList.jsx";
import ButtonPlay from "../components/utils/ButtonPlay.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMessage, faStar, faTicketAlt, faCalendarAlt, faClock, faFilm } from "@fortawesome/free-solid-svg-icons";
import RatingCard from "../components/RatingCard.jsx";
import CircularProgressBar from "../components/CircularProgressBar.jsx";
import Promotions from "../components/PromotionSection.jsx";
import { MOVIE_REVIEWS_DATA } from "../data/reviewData.js";

const MovieReviewPage = () => {
    const { movieId } = useParams();
    const [movieInfo, setMovieInfo] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const maxChars = 600;
    const toggleExpand = () => setIsExpanded(!isExpanded);

    // Fallback data if TMDB fetch fails or offline
    const matchedLocalReview = MOVIE_REVIEWS_DATA.find(r => r.movieId === movieId || r.id === movieId);

    const defaultReviewText = matchedLocalReview?.featuredReview?.content 
        ? `${matchedLocalReview.consensus}\n\n${matchedLocalReview.featuredReview.content}`
        : "Tác phẩm điện ảnh được đầu tư công phu với hiệu ứng hình ảnh mãn nhãn, âm thanh Dolby Atmos đỉnh cao và diễn xuất ấn tượng của dàn diễn viên chính. Những trường đoạn cao trào được xử lý mượt mà, truyền tải trọn vẹn thông điệp sâu sắc và mang lại cảm xúc khó quên cho khán giả tại rạp.";

    useEffect(() => {
        setIsLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjYzZGE3N2NiMGM3MjBhYzA5YWEyNzUwM2U2NWRlZiIsIm5iZiI6MTc1MTA5NzczMC4xODcsInN1YiI6IjY4NWZhMTgyMzllNDRlYmMxZWRlYmM0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lkquOyV3pva_h3EMIUppdPCWuLRHj9D-j-Wo3IOZFHk",
            },
        }).then(async (res) => {
            const data = await res.json();
            if (data && data.title) {
                setMovieInfo(data);
            } else if (matchedLocalReview) {
                setMovieInfo({
                    title: matchedLocalReview.title,
                    poster_path: matchedLocalReview.poster,
                    backdrop_path: matchedLocalReview.backdrop,
                    release_date: matchedLocalReview.releaseYear,
                    vote_average: matchedLocalReview.rating,
                    overview: matchedLocalReview.consensus
                });
            }
        }).catch((err) => {
            console.log("Fetch TMDB error:", err);
            if (matchedLocalReview) {
                setMovieInfo({
                    title: matchedLocalReview.title,
                    poster_path: matchedLocalReview.poster,
                    backdrop_path: matchedLocalReview.backdrop,
                    release_date: matchedLocalReview.releaseYear,
                    vote_average: matchedLocalReview.rating,
                    overview: matchedLocalReview.consensus
                });
            }
        }).finally(() => setIsLoading(false));
    }, [movieId, matchedLocalReview]);

    if (isLoading && !movieInfo) {
        return <Loading />;
    }

    const title = movieInfo?.title || matchedLocalReview?.title || "Đánh Giá Phim";
    const posterUrl = movieInfo?.poster_path 
        ? (movieInfo.poster_path.startsWith("http") ? movieInfo.poster_path : `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieInfo.poster_path}`)
        : (matchedLocalReview?.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80");
    
    const backdropUrl = movieInfo?.backdrop_path
        ? (movieInfo.backdrop_path.startsWith("http") ? movieInfo.backdrop_path : `https://image.tmdb.org/t/p/original${movieInfo.backdrop_path}`)
        : (matchedLocalReview?.backdrop || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1280&q=80");

    const displayText = isExpanded ? defaultReviewText : defaultReviewText.slice(0, maxChars) + (defaultReviewText.length > maxChars ? "..." : "");

    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 pt-24 pb-16 selection:bg-violet-600 selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6">
                    <Link to="/" className="hover:text-violet-400 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/reviews" className="hover:text-violet-400 transition-colors">Đánh giá phim</Link>
                    <span>/</span>
                    <span className="text-white font-medium truncate max-w-xs sm:max-w-md">{title}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    {/* Left Sticky Poster Card */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="lg:sticky lg:top-28 rounded-3xl overflow-hidden bg-[#141424] border border-white/10 p-5 shadow-2xl space-y-4">
                            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-lg group">
                                <img
                                    src={posterUrl}
                                    alt={title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute top-3 left-3">
                                    <RatingCard rating={"P"} />
                                </div>
                            </div>

                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
                                <p className="text-xs text-slate-400">
                                    Khởi chiếu: {movieInfo?.release_date || "Đang chiếu tại rạp"}
                                </p>
                            </div>

                            <div className="pt-2">
                                <Link
                                    to={`/movie/${movieId}`}
                                    className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 transition-all hover:scale-105"
                                >
                                    <FontAwesomeIcon icon={faTicketAlt} />
                                    <span>Đặt vé xem phim</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Main Review Content */}
                    <div className="flex-grow min-w-0 space-y-8">
                        
                        {/* Backdrop Hero with Score Badge */}
                        <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
                            <img
                                src={backdropUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14] via-[#0B0B14]/40 to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CircularProgressBar percent={90} size={3.5} strokeWidth={0.3} />
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Đánh giá chung</p>
                                        <p className="text-sm sm:text-base font-black text-white">9.2 / 10 từ khán giả</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                                    <FontAwesomeIcon icon={faMessage} className="text-violet-400" />
                                    <span>{matchedLocalReview?.commentsCount || "2.4K"} bình luận</span>
                                </div>
                            </div>
                        </div>

                        {/* Review Content Card */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#141424] border border-white/10 shadow-xl space-y-4">
                            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                                Review Phim {title} – Góc Nhìn Toàn Diện
                            </h2>

                            <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                                {displayText.split('\n\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>

                            {defaultReviewText.length > maxChars && (
                                <div className="pt-2 text-center">
                                    <button
                                        onClick={toggleExpand}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-violet-400 hover:text-white bg-violet-500/10 hover:bg-violet-600 transition-all"
                                    >
                                        <span>{isExpanded ? "Thu gọn review" : "Đọc toàn bộ bài viết"}</span>
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Interactive Review List Component */}
                        <div className="pt-4">
                            <ReviewList />
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

export default MovieReviewPage;
