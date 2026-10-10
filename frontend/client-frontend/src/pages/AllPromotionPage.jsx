import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFire, 
    faSearch, 
    faFilter, 
    faCrown, 
    faLightbulb, 
    faArrowRotateLeft,
    faChevronRight,
    faTicketAlt
} from "@fortawesome/free-solid-svg-icons";
import PromotionCard from "../components/Promotion/PromotionCard.jsx";
import TopPromotionCard from "../components/Promotion/TopPromotionCard.jsx";
import PromotionHeroSpotlight from "../components/Promotion/PromotionHeroSpotlight.jsx";
import { PROMOTIONS_DATA, PROMOTION_CATEGORIES } from "../data/promotionsData.js";

const AllPromotionPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);

    // Filtered data calculation
    const filteredPromotions = useMemo(() => {
        return PROMOTIONS_DATA.filter((promo) => {
            const matchesCategory = 
                selectedCategory === "all" || promo.category === selectedCategory;
            const matchesSearch = 
                promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                promo.code.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Top hot promotions for sidebar
    const topHotPromotions = useMemo(() => {
        return PROMOTIONS_DATA.filter(p => p.isHot).slice(0, 3);
    }, []);

    // Featured promotion for hero
    const featuredPromotion = PROMOTIONS_DATA[0];

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 4);
    };

    const handleResetFilters = () => {
        setSelectedCategory("all");
        setSearchQuery("");
    };

    return (
        <div className="min-h-screen bg-[#0B0B14] text-slate-100 pt-24 pb-20 selection:bg-violet-600 selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6">
                    <Link to="/" className="hover:text-violet-400 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-white font-medium">Khuyến mãi & Đặc quyền</span>
                </nav>

                {/* Hero Spotlight Section */}
                <PromotionHeroSpotlight featuredPromo={featuredPromotion} />

                {/* Header Title & Subtitle */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
                            <FontAwesomeIcon icon={faTicketAlt} />
                            Kho Voucher Điện Ảnh
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Tất Cả Chương Trình Ưu Đãi
                        </h2>
                        <p className="mt-1 text-sm md:text-base text-slate-400">
                            Khám phá hàng loạt mã giảm giá vé xem phim, combo bắp nước và quà tặng hội viên độc quyền.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm ưu đãi, mã giảm..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/80 transition-colors"
                        />
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" 
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Pills Filter (Violet Active) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-slate-800">
                    {PROMOTION_CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                        : "bg-[#141424] text-slate-300 border border-white/5 hover:border-white/20 hover:text-white"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Layout (Grid + Sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Promotion Cards Grid */}
                    <div className="lg:col-span-8">
                        {filteredPromotions.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {filteredPromotions.slice(0, visibleCount).map((promo) => (
                                        <PromotionCard key={promo.id} promotion={promo} />
                                    ))}
                                </div>

                                {/* Load More Pagination */}
                                {visibleCount < filteredPromotions.length && (
                                    <div className="mt-10 flex flex-col items-center justify-center gap-3">
                                        <button
                                            onClick={handleLoadMore}
                                            className="px-8 py-3 rounded-xl font-bold text-sm bg-[#16162c] hover:bg-[#20203e] border border-white/10 hover:border-violet-500/40 text-white transition-all shadow-md hover:-translate-y-0.5"
                                        >
                                            Xem thêm ưu đãi ({filteredPromotions.length - visibleCount} còn lại)
                                        </button>
                                        <span className="text-xs text-slate-500">
                                            Hiển thị {Math.min(visibleCount, filteredPromotions.length)} trên {filteredPromotions.length} ưu đãi
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty Search State */
                            <div className="py-16 px-6 text-center rounded-2xl bg-[#141424]/60 border border-white/5 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-2xl mb-4">
                                    <FontAwesomeIcon icon={faFilter} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Không tìm thấy chương trình phù hợp
                                </h3>
                                <p className="text-sm text-slate-400 max-w-md mb-6">
                                    Không có ưu đãi nào khớp với từ khóa "{searchQuery}" hoặc danh mục bạn đã chọn.
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                                >
                                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                                    Xóa bộ lọc & Xem tất cả
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Top Trending Deals Box */}
                        <div className="p-5 rounded-2xl bg-[#141424]/90 border border-white/10 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                                    <FontAwesomeIcon icon={faFire} className="text-violet-400" />
                                    Ưu Đãi Nổi Bật Tuần
                                </h3>
                                <span className="text-[11px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                                    Hot Picks
                                </span>
                            </div>

                            <div className="space-y-3">
                                {topHotPromotions.map((promo, index) => (
                                    <TopPromotionCard 
                                        key={promo.id} 
                                        promotion={promo} 
                                        rank={index + 1} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* CineClub VIP Card Banner */}
                        <div className="relative p-6 rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#241a0b] via-[#1a1424] to-[#121226] shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-2">
                                <FontAwesomeIcon icon={faCrown} />
                                CineClub Membership
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2 leading-snug">
                                Đăng Ký Hội Viên - Nhận Ngay 01 Vé Xem Phim Miễn Phí!
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                Tích lũy 5% - 10% điểm cho mỗi lần mua vé và bắp nước, nhận quà tặng độc quyền vào tháng sinh nhật.
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-md"
                            >
                                <span>Tham gia hội viên ngay</span>
                                <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                            </Link>
                        </div>

                        {/* Quick Tips Box */}
                        <div className="p-5 rounded-2xl bg-[#141424]/70 border border-white/5 text-xs text-slate-400 space-y-3">
                            <div className="flex items-center gap-2 font-bold text-slate-200">
                                <FontAwesomeIcon icon={faLightbulb} className="text-amber-400 text-sm" />
                                Mẹo Săn Vé Tiết Kiệm Tại CineMeow
                            </div>
                            <ul className="space-y-2 list-disc list-inside leading-relaxed text-slate-400">
                                <li>Đặt vé vào <strong className="text-slate-200">Thứ Tư</strong> để luôn được đồng giá 45K.</li>
                                <li>Kiểm tra phần <strong className="text-slate-200">Đối tác thanh toán</strong> trước khi checkout để nhận voucher ví MoMo/VNPAY.</li>
                                <li>Mua combo kèm vé trước trên website luôn rẻ hơn mua lẻ tại quầy rạp 20%.</li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default AllPromotionPage;
