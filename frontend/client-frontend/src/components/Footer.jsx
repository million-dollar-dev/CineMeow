import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilm,
    faPhone,
    faEnvelope,
    faLocationDot,
    faShieldHalved,
    faCreditCard,
    faArrowUp,
    faChevronRight,
    faPaperPlane,
    faLock,
    faCheck,
    faTicket,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
    faFacebookF,
    faInstagram,
    faYoutube,
    faTiktok,
    faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";

// 7 Partner Cinema Chains
const PARTNER_BRANDS = [
    {
        id: "cgv",
        name: "CGV Cinema",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104618-637644579789390234.png",
        fallbackText: "CGV",
    },
    {
        id: "bhd",
        name: "BHD Star",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104618-637644579789390234.png",
        fallbackText: "BHD",
    },
    {
        id: "lotte",
        name: "Lotte Cinema",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104719-637644580392942838.png",
        fallbackText: "LOTTE",
    },
    {
        id: "galaxy",
        name: "Galaxy Cinema",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104644-637644580047392686.png",
        fallbackText: "GALAXY",
    },
    {
        id: "beta",
        name: "Beta Cinemas",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104603-637644579633857850.png",
        fallbackText: "BETA",
    },
    {
        id: "cinestar",
        name: "Cinestar",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104631-637644579918239088.png",
        fallbackText: "CINESTAR",
    },
    {
        id: "megags",
        name: "Mega GS",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104740-637644580602324908.png",
        fallbackText: "MEGAGS",
    },
];

// Payment partners
const PAYMENT_METHODS = [
    { name: "Momo", color: "bg-[#A50064] text-white" },
    { name: "ZaloPay", color: "bg-[#0068FF] text-white" },
    { name: "VNPay", color: "bg-[#005BAA] text-white" },
    { name: "ShopeePay", color: "bg-[#EE4D2D] text-white" },
    { name: "Visa", color: "bg-[#1A1F71] text-white" },
    { name: "Mastercard", color: "bg-[#EB001B] text-white" },
    { name: "Napas", color: "bg-[#0072CE] text-white" },
];

const Footer = () => {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
            toast.error("Vui lòng nhập địa chỉ email hợp lệ!");
            return;
        }

        setIsSubscribed(true);
        toast.success("🎉 Đăng ký thành công! CineMeow sẽ gửi mã giảm giá và lịch chiếu hot nhất đến email của bạn.");
        setNewsletterEmail("");
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative bg-[#07070b] text-zinc-300 border-t border-zinc-800/80 overflow-hidden selection:bg-violet-600 selection:text-white">
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[150px] bg-gradient-to-b from-violet-600/10 via-fuchsia-600/5 to-transparent blur-3xl pointer-events-none" />

            {/* Newsletter Subscription Strip */}
            <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    <div className="relative rounded-2xl bg-gradient-to-r from-violet-950/70 via-[#131126] to-zinc-900 border border-violet-500/25 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="text-center lg:text-left max-w-xl">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-semibold mb-2.5">
                                <FontAwesomeIcon icon={faTicket} className="text-violet-400" />
                                <span>BẢN TIN ĐIỆN ẢNH & ƯU ĐÃI</span>
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                Nhận Mã Giảm Giá Vé Lên Đến 50%
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                                Đăng ký nhận thông báo sớm về các suất chiếu đặc biệt, vé premier và quà tặng combo độc quyền từ CineMeow mỗi tuần.
                            </p>
                        </div>

                        {/* Newsletter Input Form */}
                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="w-full lg:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-2.5"
                        >
                            <div className="relative flex-1">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"
                                />
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Nhập email của bạn (vd: yourname@gmail.com)..."
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-11 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                                <span>Đăng Ký</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Cinema Brand Partners Bar */}
            <div className="border-b border-zinc-800/80 bg-zinc-950/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="shrink-0">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                <FontAwesomeIcon icon={faFilm} className="text-violet-400" />
                                <span>Hệ Thống Rạp Đối Tác Toàn Quốc</span>
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                            {PARTNER_BRANDS.map((brand) => (
                                <Link
                                    key={brand.id}
                                    to={`/brands/${brand.id}`}
                                    className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/50 transition-all shadow-sm"
                                    title={`Xem lịch chiếu rạp ${brand.name}`}
                                >
                                    <div className="w-5 h-5 rounded flex items-center justify-center overflow-hidden bg-black/40">
                                        <img
                                            src={brand.logoUrl}
                                            alt={brand.name}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                            }}
                                        />
                                        <span className="hidden text-[9px] font-bold text-zinc-400">
                                            {brand.fallbackText}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-300 group-hover:text-violet-300 transition-colors">
                                        {brand.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Links Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
                    {/* Brand Info & Mission (Cols 1-2 on desktop) */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform">
                                <FontAwesomeIcon icon={faFilm} className="text-lg" />
                            </div>
                            <div>
                                <span className="text-2xl font-black text-white tracking-wider">
                                    Cine<span className="text-violet-400">Meow</span>
                                </span>
                                <p className="text-[10px] text-zinc-400 tracking-widest uppercase font-semibold">
                                    Cinema & Ticket Platform
                                </p>
                            </div>
                        </Link>

                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                            CineMeow là nền tảng đặt vé xem phim trực tuyến hiện đại hàng đầu Việt Nam. Kết nối trực tiếp
                            lịch chiếu, bảng giá vé, ghế ngồi và các chương trình khuyến mãi độc quyền từ hơn 250+ cụm rạp
                            trên toàn quốc.
                        </p>

                        {/* Contact details */}
                        <div className="space-y-2 pt-2 text-xs text-zinc-400">
                            <div className="flex items-center gap-2.5">
                                <FontAwesomeIcon icon={faPhone} className="text-violet-400 w-3.5 text-center" />
                                <span>Hotline: <strong className="text-white">1900 123 456</strong> (8:00 - 22:00 hàng ngày)</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <FontAwesomeIcon icon={faEnvelope} className="text-violet-400 w-3.5 text-center" />
                                <span>Hỗ trợ kỹ thuật: <strong className="text-white">support@cinemeow.vn</strong></span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <FontAwesomeIcon icon={faLocationDot} className="text-violet-400 w-3.5 text-center" />
                                <span>Trụ sở: Tòa nhà CineMeow Tower, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-2">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
                                Kết Nối Với CineMeow
                            </p>
                            <div className="flex items-center gap-2.5">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-[#1877F2] text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-zinc-800 hover:border-[#1877F2] shadow-sm hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <FontAwesomeIcon icon={faFacebookF} className="text-xs" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-[#E4405F] text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-zinc-800 hover:border-[#E4405F] shadow-sm hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <FontAwesomeIcon icon={faInstagram} className="text-xs" />
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-[#CD201F] text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-zinc-800 hover:border-[#CD201F] shadow-sm hover:scale-110"
                                    aria-label="YouTube"
                                >
                                    <FontAwesomeIcon icon={faYoutube} className="text-xs" />
                                </a>
                                <a
                                    href="https://tiktok.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-black text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-zinc-800 hover:border-zinc-700 shadow-sm hover:scale-110"
                                    aria-label="TikTok"
                                >
                                    <FontAwesomeIcon icon={faTiktok} className="text-xs" />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-zinc-800 hover:border-zinc-700 shadow-sm hover:scale-110"
                                    aria-label="Twitter / X"
                                >
                                    <FontAwesomeIcon icon={faXTwitter} className="text-xs" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 1: Khám Phá Điện Ảnh */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800/80 flex items-center justify-between">
                            <span>Khám Phá Điện Ảnh</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs text-zinc-400">
                            <li>
                                <Link to="/now-playing" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Phim Đang Chiếu Rạp</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/comming-soon" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Phim Sắp Chiếu & Pre-sale</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/showtimes/today" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Lịch Chiếu Hôm Nay</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/reviews" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Review & Phê Bình Phim</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/movies" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Toàn Bộ Danh Mục Phim</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Rạp Chiếu & Hệ Thống */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800/80">
                            <span>Rạp Chiếu Đối Tác</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs text-zinc-400">
                            <li>
                                <Link to="/brands/cgv" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Hệ Thống CGV Cinema</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/brands/lotte" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Hệ Thống Lotte Cinema</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/brands/bhd" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Hệ Thống BHD Star</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/brands/galaxy" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Hệ Thống Galaxy Cinema</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/brands/beta" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Hệ Thống Beta Cinemas</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/brands/cinestar" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Hệ Thống Cinestar</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Hỗ Trợ & Chính Sách */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800/80">
                            <span>Chính Sách & Hỗ Trợ</span>
                        </h4>
                        <ul className="space-y-2.5 text-xs text-zinc-400">
                            <li>
                                <Link to="/promotions" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Ưu Đãi & Khuyến Mãi</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/blogs/all" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Tin Tức & Blog Điện Ảnh</span>
                                </Link>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Hướng Dẫn Đặt Vé Online</span>
                                </a>
                            </li>
                            <li>
                                <a href="#refund" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Chính Sách Đổi & Hoàn Vé</span>
                                </a>
                            </li>
                            <li>
                                <a href="#privacy" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Chính Sách Bảo Mật Thông Tin</span>
                                </a>
                            </li>
                            <li>
                                <a href="#terms" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                                    <span>Điều Khoản Sử Dụng</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Payment Methods & Security Strip */}
            <div className="border-t border-zinc-900 bg-zinc-950/80 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Payment methods */}
                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                        <span className="text-xs font-semibold text-zinc-400 mr-2 flex items-center gap-1">
                            <FontAwesomeIcon icon={faCreditCard} className="text-violet-400" />
                            <span>Thanh toán tiện lợi:</span>
                        </span>
                        {PAYMENT_METHODS.map((pm, idx) => (
                            <span
                                key={idx}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${pm.color} shadow-sm`}
                            >
                                {pm.name}
                            </span>
                        ))}
                    </div>

                    {/* Trust & Security badges */}
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                            <FontAwesomeIcon icon={faLock} className="text-emerald-400 text-xs" />
                            <span className="text-[11px] font-medium">Bảo mật SSL 256-bit</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                            <FontAwesomeIcon icon={faShieldHalved} className="text-violet-400 text-xs" />
                            <span className="text-[11px] font-medium">Chứng nhận Bộ Công Thương</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Bar with Back to Top */}
            <div className="border-t border-zinc-800/80 bg-[#050508] py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
                    <p className="text-center sm:text-left">
                        © {new Date().getFullYear()} CineMeow Entertainment JSC. Toàn bộ bản quyền được bảo lưu. Giấy phép số 0108923485 cấp bởi Sở TT&TT.
                    </p>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-violet-500/50 transition-all cursor-pointer shadow-sm text-xs font-semibold group shrink-0"
                    >
                        <span>Lên đầu trang</span>
                        <FontAwesomeIcon
                            icon={faArrowUp}
                            className="text-[10px] text-violet-400 group-hover:-translate-y-0.5 transition-transform"
                        />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
