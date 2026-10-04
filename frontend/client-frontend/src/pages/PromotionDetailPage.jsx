import React, { useState, useMemo } from 'react';
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCalendarAlt, 
    faEye, 
    faCopy, 
    faCheck, 
    faShare, 
    faArrowLeft, 
    faCheckCircle,
    faFire,
    faFilm
} from "@fortawesome/free-solid-svg-icons";
import TopPromotionCard from "../components/Promotion/TopPromotionCard.jsx";
import { PROMOTIONS_DATA } from "../data/promotionsData.js";

const PromotionDetailPage = () => {
    const { id } = useParams();
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);

    // Find current promotion or fallback to the first one
    const promotion = useMemo(() => {
        return PROMOTIONS_DATA.find(p => p.id === id) || PROMOTIONS_DATA[0];
    }, [id]);

    // Related promotions (exclude current)
    const relatedPromotions = useMemo(() => {
        return PROMOTIONS_DATA.filter(p => p.id !== promotion.id).slice(0, 3);
    }, [promotion.id]);

    const handleCopyCode = () => {
        if (promotion.code) {
            navigator.clipboard.writeText(promotion.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 pt-24 pb-20 selection:bg-violet-600 selection:text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6">
                    <Link to="/" className="hover:text-violet-400 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/promotions" className="hover:text-violet-400 transition-colors">Khuyến mãi</Link>
                    <span>/</span>
                    <span className="text-white font-medium truncate max-w-xs sm:max-w-md">{promotion.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Main Promotion Content */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Hero Image Card */}
                        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
                            <img
                                src={promotion.bannerUrl}
                                alt={promotion.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14] via-transparent to-black/40" />

                            <div className="absolute top-4 left-4">
                                <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-violet-600/90 backdrop-blur-md text-white shadow-lg">
                                    {promotion.discount}
                                </span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs sm:text-sm text-slate-300">
                                <span className="flex items-center gap-2 font-medium">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-violet-400" />
                                    {promotion.validDate}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-400">
                                    <FontAwesomeIcon icon={faEye} />
                                    {promotion.views} lượt xem
                                </span>
                            </div>
                        </div>

                        {/* Title & Share Row */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                    {promotion.tag}
                                </span>

                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#16162a] border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all shadow-md"
                                >
                                    <FontAwesomeIcon icon={shared ? faCheck : faShare} className={shared ? "text-emerald-400" : ""} />
                                    <span>{shared ? "Đã chép link!" : "Chia sẻ ưu đãi"}</span>
                                </button>
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
                                {promotion.title}
                            </h1>

                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                                {promotion.description}
                            </p>
                        </div>

                        {/* Voucher Code Card Box (Violet Button) */}
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1c142c] via-[#16162c] to-[#121224] border border-violet-500/30 shadow-xl space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                                        Mã Khuyến Mãi Áp Dụng
                                    </span>
                                    <div className="mt-1 flex items-center gap-3">
                                        <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest">
                                            {promotion.code}
                                        </span>
                                        <button
                                            onClick={handleCopyCode}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                                                copied 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-violet-600 hover:bg-violet-500 text-white'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                                            <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                                        </button>
                                    </div>
                                </div>

                                <Link
                                    to="/movies"
                                    className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-center shadow-lg shadow-violet-900/40 transition-all hover:scale-105"
                                >
                                    Đặt vé áp dụng ngay
                                </Link>
                            </div>
                            <p className="text-xs text-slate-400">
                                Nhập mã trên tại bước thanh toán vé xem phim hoặc mua bắp nước trực tuyến.
                            </p>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="p-6 rounded-2xl bg-[#141424]/90 border border-white/10 space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-violet-400" />
                                Điều Kiện & Điều Khoản Áp Dụng
                            </h3>
                            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                                {promotion.terms && promotion.terms.length > 0 ? (
                                    promotion.terms.map((term, index) => (
                                        <li key={index} className="flex items-start gap-2.5">
                                            <span className="text-violet-400 font-bold">•</span>
                                            <span className="leading-relaxed">{term}</span>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-violet-400 font-bold">•</span>
                                            <span>Áp dụng cho tất cả khách hàng mua vé trên nền tảng CineMeow.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="text-violet-400 font-bold">•</span>
                                            <span>Không có giá trị quy đổi thành tiền mặt hoặc chuyển nhượng.</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Back to Promotions List */}
                        <div className="pt-4">
                            <Link
                                to="/promotions"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                <span>Quay lại danh sách tất cả khuyến mãi</span>
                            </Link>
                        </div>

                    </div>

                    {/* Right Column: Other Deals */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 shadow-xl">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-4">
                                <FontAwesomeIcon icon={faFire} className="text-violet-400" />
                                Ưu Đãi Hấp Dẫn Khác
                            </h3>
                            <div className="space-y-3">
                                {relatedPromotions.map((promo, idx) => (
                                    <TopPromotionCard key={promo.id} promotion={promo} rank={idx + 1} />
                                ))}
                            </div>
                        </div>

                        {/* Quick Booking CTA Banner (Violet) */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#181226] to-[#0f0f20] border border-violet-500/20 text-center space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-xl">
                                <FontAwesomeIcon icon={faFilm} />
                            </div>
                            <h4 className="font-bold text-white text-base">Xem Phim Hôm Nay?</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Hàng chục suất chiếu bom tấn đang chờ bạn với mức giá ưu đãi nhất.
                            </p>
                            <Link
                                to="/showtimes/today"
                                className="inline-block w-full py-2.5 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-900/40"
                            >
                                Xem lịch chiếu rạp gần bạn
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PromotionDetailPage;
