import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import ReviewList from "../components/MovieDetail/ReviewList.jsx";
import Promotions from "../components/PromotionSection.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronDown, 
    faChevronUp,
    faMessage, 
    faStar, 
    faTicketAlt, 
    faCalendarAlt, 
    faClock, 
    faFilm, 
    faPlay, 
    faTimes, 
    faShareAlt, 
    faBookmark, 
    faCheckCircle, 
    faExclamationCircle, 
    faAward, 
    faCheck, 
    faCopy, 
    faTv, 
    faVolumeUp 
} from "@fortawesome/free-solid-svg-icons";
import { MOVIE_REVIEWS_DATA, getMovieEditorialData } from "../data/reviewData.js";

const MovieReviewPage = () => {
    const { movieId } = useParams();
    const [movieInfo, setMovieInfo] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    // Look up local review match
    const matchedLocalReview = useMemo(() => {
        return MOVIE_REVIEWS_DATA.find(r => 
            String(r.movieId) === String(movieId) || 
            String(r.id) === String(movieId) ||
            (movieInfo?.title && r.title.toLowerCase().includes(movieInfo.title.toLowerCase()))
        );
    }, [movieId, movieInfo]);

    // Editorial and criteria data
    const editorial = useMemo(() => {
        return getMovieEditorialData(matchedLocalReview || movieInfo || { movieId });
    }, [matchedLocalReview, movieInfo, movieId]);

    // Fetch TMDB data with robust fallback
    useEffect(() => {
        setIsLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=vi-VN`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjYzZGE3N2NiMGM3MjBhYzA5YWEyNzUwM2U2NWRlZiIsIm5iZiI6MTc1MTA5NzczMC4xODcsInN1YiI6IjY4NWZhMTgyMzllNDRlYmMxZWRlYmM0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lkquOyV3pva_h3EMIUppdPCWuLRHj9D-j-Wo3IOZFHk",
            },
        })
        .then(async (res) => {
            const data = await res.json();
            if (data && (data.title || data.name)) {
                setMovieInfo(data);
            } else if (matchedLocalReview) {
                setMovieInfo({
                    title: matchedLocalReview.title,
                    original_title: matchedLocalReview.originalTitle,
                    poster_path: matchedLocalReview.poster,
                    backdrop_path: matchedLocalReview.backdrop,
                    release_date: matchedLocalReview.releaseYear,
                    vote_average: matchedLocalReview.rating,
                    overview: matchedLocalReview.consensus,
                    genres: (matchedLocalReview.genres || []).map((name, i) => ({ id: i, name })),
                    runtime: 135
                });
            }
        })
        .catch((err) => {
            console.log("TMDB Fetch fallback:", err);
            // Fallback to local review or first available review data
            const fallbackItem = matchedLocalReview || MOVIE_REVIEWS_DATA[0];
            if (fallbackItem) {
                setMovieInfo({
                    title: fallbackItem.title,
                    original_title: fallbackItem.originalTitle,
                    poster_path: fallbackItem.poster,
                    backdrop_path: fallbackItem.backdrop,
                    release_date: fallbackItem.releaseYear,
                    vote_average: fallbackItem.rating,
                    overview: fallbackItem.consensus,
                    genres: (fallbackItem.genres || []).map((name, i) => ({ id: i, name })),
                    runtime: 135
                });
            }
        })
        .finally(() => setIsLoading(false));
    }, [movieId, matchedLocalReview]);

    const handleCopyLink = () => {
        navigator.clipboard?.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
    };

    if (isLoading && !movieInfo && !matchedLocalReview) {
        return <Loading />;
    }

    // Consolidated attributes
    const title = movieInfo?.title || matchedLocalReview?.title || "Đánh Giá Phim";
    const originalTitle = movieInfo?.original_title || matchedLocalReview?.originalTitle || "";
    const ratingScore = matchedLocalReview?.rating || (movieInfo?.vote_average ? Number(movieInfo.vote_average.toFixed(1)) : 9.2);
    const releaseDate = movieInfo?.release_date || matchedLocalReview?.releaseYear || "2024";
    const durationText = editorial?.duration || (movieInfo?.runtime ? `${movieInfo.runtime} phút` : matchedLocalReview?.duration || "130 phút");
    const ageRating = editorial?.ageRating ? editorial.ageRating.split(" - ")[0] : "T16";
    const genresList = movieInfo?.genres?.map(g => g.name) || matchedLocalReview?.genres || ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"];

    const posterUrl = movieInfo?.poster_path 
        ? (movieInfo.poster_path.startsWith("http") ? movieInfo.poster_path : `https://image.tmdb.org/t/p/w780${movieInfo.poster_path}`)
        : (matchedLocalReview?.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80");
    
    const backdropUrl = movieInfo?.backdrop_path
        ? (movieInfo.backdrop_path.startsWith("http") ? movieInfo.backdrop_path : `https://image.tmdb.org/t/p/original${movieInfo.backdrop_path}`)
        : (matchedLocalReview?.backdrop || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1280&q=80");

    // In-depth review content
    const featuredContent = matchedLocalReview?.featuredReview?.content;
    const fullReviewArticle = [
        editorial?.verdict || matchedLocalReview?.consensus || movieInfo?.overview || "Tác phẩm điện ảnh đáng chú ý với chất lượng sản xuất vượt trội.",
        featuredContent ? `Nhận xét từ khán giả nổi bật:\n"${featuredContent}"` : "",
        `Về mặt nghe nhìn, ${title} tiếp tục khẳng định tiêu chuẩn cao của các tác phẩm chiếu rạp hiện đại. Khán giả được đắm chìm trong từng khuôn hình chỉn chu, sắc màu được căn chỉnh kỹ lưỡng kết hợp cùng thiết kế âm thanh sống động mang lại cảm giác chân thực tuyệt đối.`,
        `Tóm lại, đây là một trong những bộ phim xứng đáng để khán giả mua vé thưởng thức tại rạp chiếu, đặc biệt là trên các định dạng cao cấp như IMAX hoặc phòng chiếu có hệ thống âm thanh Dolby Atmos.`
    ].filter(Boolean);

    // Other related reviews (exclude current)
    const otherMovieReviews = MOVIE_REVIEWS_DATA.filter(r => 
        String(r.movieId) !== String(movieId) && String(r.id) !== String(movieId)
    ).slice(0, 3);

    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 pt-24 pb-20 selection:bg-violet-600 selection:text-white">
            
            {/* Top Navigation & Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                        <Link to="/" className="hover:text-violet-400 transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <Link to="/reviews" className="hover:text-violet-400 transition-colors">Đánh giá phim</Link>
                        <span>/</span>
                        <span className="text-white font-semibold truncate max-w-xs sm:max-w-sm">{title}</span>
                    </nav>

                    {/* Social & Action Tools */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                isBookmarked 
                                    ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30" 
                                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <FontAwesomeIcon icon={faBookmark} />
                            <span>{isBookmarked ? "Đã lưu" : "Lưu review"}</span>
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                        >
                            <FontAwesomeIcon icon={copiedLink ? faCheck : faShareAlt} className={copiedLink ? "text-emerald-400" : ""} />
                            <span>{copiedLink ? "Đã chép link!" : "Chia sẻ"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Cinematic Hero Backdrop Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <img
                        src={backdropUrl}
                        alt={title}
                        className="w-full h-full object-cover object-center filter brightness-90"
                    />
                    
                    {/* Multi-layer cinema gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14] via-[#0B0B14]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B14]/90 via-transparent to-black/30" />

                    {/* Center Trailer Play Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button
                            onClick={() => setShowTrailerModal(true)}
                            className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 hover:border-violet-500/80 hover:bg-violet-600/80 text-white font-bold text-xs sm:text-sm shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <div className="w-8 h-8 rounded-full bg-violet-600 group-hover:bg-white text-white group-hover:text-violet-600 flex items-center justify-center transition-colors">
                                <FontAwesomeIcon icon={faPlay} className="text-xs translate-x-0.5" />
                            </div>
                            <span>Xem Trailer Phim</span>
                        </button>
                    </div>

                    {/* Bottom Banner Content */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-amber-500 text-black uppercase tracking-wider">
                                    {ageRating}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-violet-600/30 text-violet-300 border border-violet-500/30">
                                    Đánh giá độc quyền
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    {durationText} • Khởi chiếu {releaseDate}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                                {title}
                            </h1>
                            {originalTitle && originalTitle !== title && (
                                <p className="text-xs sm:text-sm text-slate-400 font-medium italic">
                                    {originalTitle}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {genresList.map((genre, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/10 text-slate-200 backdrop-blur-sm"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Large Rating Pill in Hero */}
                        <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 self-start sm:self-auto">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/30">
                                {ratingScore}
                            </div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-1 text-amber-400 text-xs">
                                    {[1, 2, 3, 4, 5].map(s => <FontAwesomeIcon key={s} icon={faStar} />)}
                                </div>
                                <p className="text-xs font-bold text-white uppercase tracking-wider">
                                    Điểm từ Khán giả
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    {matchedLocalReview?.ratingCount || "10K+ đánh giá"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout: Left Sidebar + Right Article & Reviews */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Sticky Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Poster Card with Quick Booking CTA */}
                        <div className="lg:sticky lg:top-24 rounded-3xl overflow-hidden bg-[#141424] border border-white/10 p-5 shadow-2xl space-y-5">
                            
                            {/* Glossy Poster */}
                            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl group border border-white/5">
                                <img
                                    src={posterUrl}
                                    alt={title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                
                                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-violet-600/90 text-white font-black text-xs backdrop-blur-md border border-violet-400/30 shadow-lg">
                                    {ageRating}
                                </div>

                                <div className="absolute bottom-3 left-3 right-3 text-center">
                                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                                        ✓ Đang chiếu tại các rạp toàn quốc
                                    </span>
                                </div>
                            </div>

                            {/* Main CTA: Booking Button (Violet Gradient) */}
                            <div className="space-y-2">
                                <Link
                                    to={`/movie/${movieId}`}
                                    className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-violet-900/40 transition-all hover:scale-105 hover:shadow-violet-600/50"
                                >
                                    <FontAwesomeIcon icon={faTicketAlt} className="text-base" />
                                    <span>ĐẶT VÉ XEM PHIM NGAY</span>
                                </Link>

                                <p className="text-center text-[11px] text-slate-400">
                                    Xem lịch chiếu & chọn ghế tốt tại rạp gần bạn
                                </p>
                            </div>

                            {/* Quick Facts Specs Table */}
                            <div className="space-y-3 pt-3 border-t border-white/10">
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                    Thông tin tác phẩm
                                </h4>

                                <div className="space-y-2 text-xs divide-y divide-white/5">
                                    <div className="flex justify-between items-start pt-1.5">
                                        <span className="text-slate-400">Đạo diễn:</span>
                                        <span className="font-semibold text-white text-right ml-2">{editorial.director}</span>
                                    </div>

                                    <div className="flex justify-between items-start pt-1.5">
                                        <span className="text-slate-400">Diễn viên:</span>
                                        <span className="font-semibold text-slate-200 text-right ml-2 max-w-[180px] truncate">
                                            {Array.isArray(editorial.cast) ? editorial.cast.join(", ") : editorial.cast}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-start pt-1.5">
                                        <span className="text-slate-400">Thời lượng:</span>
                                        <span className="font-semibold text-white text-right ml-2">{durationText}</span>
                                    </div>

                                    <div className="flex justify-between items-start pt-1.5">
                                        <span className="text-slate-400">Định dạng khuyên xem:</span>
                                        <span className="font-semibold text-amber-400 text-right ml-2">{editorial.aspectRatio}</span>
                                    </div>

                                    <div className="flex justify-between items-start pt-1.5">
                                        <span className="text-slate-400">Hệ thống âm thanh:</span>
                                        <span className="font-semibold text-violet-300 text-right ml-2">{editorial.soundFormat}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Today's Quick Showtime Teaser */}
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                                        <FontAwesomeIcon icon={faClock} className="text-violet-400" />
                                        <span>Suất chiếu gợi ý hôm nay</span>
                                    </span>
                                    <span className="text-[10px] text-emerald-400 font-semibold">2D Phụ đề</span>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5">
                                    {["18:15", "19:40", "21:10"].map((slot, i) => (
                                        <Link
                                            key={i}
                                            to={`/movie/${movieId}`}
                                            className="py-1.5 rounded-lg bg-white/5 hover:bg-violet-600/30 border border-white/10 hover:border-violet-500/50 text-center text-xs font-bold text-slate-200 hover:text-white transition-all"
                                        >
                                            {slot}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Right Main Body: Editorial Review + Pros/Cons + Criteria + ReviewList (8 cols) */}
                    <div className="lg:col-span-8 space-y-8 min-w-0">
                        
                        {/* Section 1: Editorial Consensus & Full Review */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#141424] border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

                            {/* Editorial Badge */}
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-violet-600/30 to-purple-600/30 border border-violet-500/40 text-violet-300">
                                    <FontAwesomeIcon icon={faAward} />
                                    <span>GÓC NHÌN BIÊN TẬP VIÊN CINEMEOW</span>
                                </span>
                            </div>

                            {/* Headline */}
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug">
                                Đánh Giá Chi Tiết Phim {title}: Đỉnh Cao Thị Giác Và Cảm Xúc Rạp Chiếu
                            </h2>

                            {/* Highlight Consensus Quote Card */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-900/20 via-purple-900/15 to-transparent border-l-4 border-violet-500 bg-black/30">
                                <p className="text-sm sm:text-base font-semibold text-slate-200 italic leading-relaxed">
                                    "{editorial.verdict}"
                                </p>
                                <p className="text-[11px] text-violet-400 font-bold mt-2 text-right">
                                    — Hội đồng Thẩm định Điện ảnh CineMeow
                                </p>
                            </div>

                            {/* Article Body */}
                            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                                <p>{fullReviewArticle[0]}</p>
                                
                                {isExpanded && fullReviewArticle.slice(1).map((paragraph, idx) => (
                                    <p key={idx} className="whitespace-pre-line">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Expand / Collapse Button */}
                            <div className="pt-2 text-center border-t border-white/5">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-violet-400 hover:text-white bg-violet-500/10 hover:bg-violet-600 transition-all shadow-md group"
                                >
                                    <span>{isExpanded ? "Thu gọn bài viết" : "Đọc toàn bộ bài phân tích chuyên sâu"}</span>
                                    <FontAwesomeIcon
                                        icon={isExpanded ? faChevronUp : faChevronDown}
                                        className="transition-transform duration-200 group-hover:translate-y-0.5"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Section 2: Ưu điểm & Nhược điểm (Pros & Cons Comparison) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Pros Card */}
                            <div className="p-6 rounded-3xl bg-[#141424] border border-emerald-500/20 shadow-xl space-y-4 relative overflow-hidden">
                                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm sm:text-base">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                    </div>
                                    <span>Ưu điểm nổi bật</span>
                                </div>

                                <ul className="space-y-3">
                                    {editorial.pros.map((proItem, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                                            <span className="text-emerald-400 mt-1 flex-shrink-0 font-bold">✓</span>
                                            <span>{proItem}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Cons Card */}
                            <div className="p-6 rounded-3xl bg-[#141424] border border-amber-500/20 shadow-xl space-y-4 relative overflow-hidden">
                                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm sm:text-base">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                    </div>
                                    <span>Điểm cần lưu ý</span>
                                </div>

                                <ul className="space-y-3">
                                    {editorial.cons.map((conItem, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                                            <span className="text-amber-400 mt-1 flex-shrink-0 font-bold">•</span>
                                            <span>{conItem}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>

                        {/* Section 3: Bảng điểm 4 tiêu chí cốt lõi (Scorecard) */}
                        <div className="p-6 sm:p-7 rounded-3xl bg-[#141424] border border-white/10 shadow-xl space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <FontAwesomeIcon icon={faAward} className="text-amber-400" />
                                    <span>Đánh giá theo 4 tiêu chí kỹ thuật</span>
                                </h3>
                                <span className="text-xs text-slate-400">
                                    Thang điểm 10 theo chuẩn CineMeow Cinema Benchmark
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[
                                    { name: "Kịch bản & Cốt truyện", score: editorial.criteria.script, desc: "Cấu trúc, nhịp độ và chiều sâu thông điệp" },
                                    { name: "Diễn xuất & Nhân vật", score: editorial.criteria.acting, desc: "Sự nhập vai và sức thuyết phục cảm xúc" },
                                    { name: "Hình ảnh & Kỹ xảo (VFX)", score: editorial.criteria.visuals, desc: "Góc quay, ánh sáng và mức độ hoành tráng" },
                                    { name: "Âm thanh & Nhạc phim (OST)", score: editorial.criteria.sound, desc: "Hiệu ứng âm vòm Dolby và cảm xúc âm nhạc" }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-200">{item.name}</span>
                                            <span className="font-black text-amber-400 text-sm">{item.score} / 10</span>
                                        </div>

                                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-amber-400"
                                                style={{ width: `${(item.score / 10) * 100}%` }}
                                            />
                                        </div>

                                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 4: Interactive ReviewList Component */}
                        <div className="pt-2">
                            <ReviewList 
                                movieId={movieId}
                                movieTitle={title}
                                initialReviews={matchedLocalReview?.recentComments || []}
                                overallRating={ratingScore}
                                totalReviewsCount={matchedLocalReview?.commentsCount || "1.8K"}
                            />
                        </div>

                        {/* Section 5: Phim Cùng Thể Loại Gợi Ý */}
                        {otherMovieReviews.length > 0 && (
                            <div className="pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-white">
                                        Các bài đánh giá phim khác
                                    </h3>
                                    <Link to="/reviews" className="text-xs font-bold text-violet-400 hover:text-white transition-colors">
                                        Xem tất cả review →
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {otherMovieReviews.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/movies/${item.movieId || item.id}/review`}
                                            className="group rounded-2xl overflow-hidden bg-[#141424] border border-white/10 hover:border-violet-500/40 p-3 flex flex-col space-y-2.5 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                                        >
                                            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black">
                                                <img
                                                    src={item.poster}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 font-bold text-[11px] flex items-center gap-1 border border-white/10">
                                                    <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                                                    <span>{item.rating}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1 flex-grow">
                                                <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">
                                                    {item.title}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                                    {item.consensus}
                                                </p>
                                            </div>

                                            <div className="pt-1 text-[11px] font-bold text-violet-400 group-hover:translate-x-0.5 transition-transform">
                                                Đọc review →
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>

            {/* Trailer Modal Popup */}
            {showTrailerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-[#141424] border border-white/20 shadow-2xl">
                        
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                <FontAwesomeIcon icon={faPlay} className="text-violet-400 text-xs" />
                                <span>Trailer Phim: {title}</span>
                            </h3>
                            <button
                                onClick={() => setShowTrailerModal(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="relative aspect-video w-full bg-black">
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/Way9Dexny3w?autoplay=1"
                                title={`Trailer ${title}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                            />
                        </div>

                        <div className="p-4 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
                            <span>Thưởng thức trọn vẹn tại các rạp chiếu trên toàn quốc</span>
                            <Link
                                to={`/movie/${movieId}`}
                                onClick={() => setShowTrailerModal(false)}
                                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors"
                            >
                                Đặt vé xem phim ngay
                            </Link>
                        </div>

                    </div>
                </div>
            )}

            {/* Bottom Promotions Section */}
            <div className="mt-20">
                <Promotions />
            </div>

        </div>
    );
};

export default MovieReviewPage;
