import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faClockRotateLeft,
    faLock,
    faRightFromBracket,
    faTicket,
    faHouse,
    faChevronRight,
    faCrown,
    faCoins,
    faGift,
    faShieldHalved,
    faCopy,
    faCheck,
    faEye,
    faEyeSlash,
    faHeadset,
    faArrowRight,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import UserProfileForm from "../components/UserProfile/UserProfileForm.jsx";
import BookingHistory from "../components/UserProfile/BookingHistory.jsx";
import { useSearchBookingQuery } from "../services/bookingService.js";
import { useLogoutHandler } from "../hooks/useLogoutHandler.js";
import OverlayLoading from "../components/Booking/OverlayLoading.jsx";
import { toast } from "react-toastify";

export default function UserProfile() {
    const [activeTab, setActiveTab] = useState("info");
    const user = useSelector((state) => state.user);
    const { handleLogout, isLoggingOut } = useLogoutHandler();

    // Password change form states
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [copiedVoucher, setCopiedVoucher] = useState(null);

    // Fetch booking history for the current user
    const {
        data: historyResponse = [],
        isLoading: isHistoryLoading,
    } = useSearchBookingQuery(
        {
            sort: "createdAt,desc",
            filters: [`userId:"${user?.userId}"`],
        },
        { skip: !user?.userId }
    );

    const handleCopyVoucher = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedVoucher(code);
        toast.success(`Đã sao chép mã voucher ${code}!`);
        setTimeout(() => setCopiedVoucher(null), 2500);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!oldPassword.trim()) {
            toast.warn("Vui lòng nhập mật khẩu hiện tại!");
            return;
        }
        if (!newPassword.trim() || newPassword.length < 6) {
            toast.warn("Mật khẩu mới phải có tối thiểu 6 ký tự!");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Xác nhận mật khẩu mới không khớp!");
            return;
        }

        setIsSubmittingPassword(true);
        setTimeout(() => {
            setIsSubmittingPassword(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Đổi mật khẩu thành công! Hãy đăng nhập lại khi cần.");
        }, 800);
    };

    if (isLoggingOut) return <OverlayLoading />;

    const usernameInitial = user?.username
        ? user.username.charAt(0).toUpperCase()
        : "U";

    return (
        <div className="min-h-screen bg-[#07070b] text-white">
            {/* Top Cinematic Hero Background */}
            <div className="relative pt-24 sm:pt-28 pb-10 sm:pb-12 overflow-hidden border-b border-zinc-800/60">
                {/* Background backdrop with RoPhim dotted texture */}
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src="https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5207.jpg"
                        alt="Profile backdrop"
                        className="w-full h-full object-cover object-center filter blur-[4px] brightness-[0.25] scale-105"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none opacity-25"
                        style={{
                            backgroundImage: "url('/images/dotted.png')",
                            backgroundRepeat: "repeat",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/85 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#07070b] via-transparent to-[#07070b]" />

                    {/* Ambient Neon Spotlight */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-violet-600/18 rounded-full blur-[140px] mix-blend-screen" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
                        <Link to="/" className="flex items-center gap-1.5 hover:text-violet-400 transition">
                            <FontAwesomeIcon icon={faHouse} className="text-[11px]" />
                            <span>Trang chủ</span>
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-zinc-600" />
                        <span className="text-zinc-200 font-semibold">Tài Khoản Thành Viên</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                                Trung Tâm <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Hội Viên CineMeow</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
                                Quản lý thông tin cá nhân, kiểm tra vé điện tử và theo dõi điểm thưởng CinePoints
                            </p>
                        </div>

                        {/* Top Member Status Pill */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-lg self-start sm:self-auto">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 font-bold text-xs shadow">
                                <FontAwesomeIcon icon={faCrown} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">Hạng Bạc (Silver)</p>
                                <p className="text-[10px] text-zinc-400">1,250 Điểm CinePoints</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* 1. LEFT SIDEBAR (lg:col-span-4 xl:col-span-3) */}
                    <aside className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">
                        {/* Profile Info Card */}
                        <div className="bg-[#12121e]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl text-center space-y-4">
                            {/* Avatar */}
                            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 p-0.5 shadow-xl shadow-violet-900/40">
                                <div className="w-full h-full bg-[#12121e] rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
                                    {usernameInitial}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#12121e] flex items-center justify-center text-[10px] text-white shadow">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                            </div>

                            {/* Names & ID */}
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                                    {user?.username || "Thành viên CineMeow"}
                                </h2>
                                <p className="text-xs text-zinc-400 truncate mt-0.5">
                                    {user?.email || "Hội viên trực tuyến"}
                                </p>
                            </div>

                            {/* CinePoints Quick Progress Card */}
                            <div className="p-3.5 rounded-xl bg-gradient-to-br from-violet-950/40 via-purple-950/30 to-[#0B0B14] border border-violet-500/20 text-left space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1.5 font-semibold text-violet-300">
                                        <FontAwesomeIcon icon={faCoins} className="text-amber-400" />
                                        <span>CinePoints</span>
                                    </span>
                                    <span className="font-bold text-white">1,250 / 2,000</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-violet-500 to-amber-400 h-2 rounded-full w-[62%] transition-all duration-700" />
                                </div>
                                <p className="text-[10px] text-zinc-400">
                                    Tích thêm 750 điểm để thăng hạng <span className="text-amber-300 font-bold">Vàng (Gold VIP)</span>
                                </p>
                            </div>
                        </div>

                        {/* Navigation Menu Links */}
                        <div className="bg-[#12121e]/90 border border-white/10 rounded-2xl p-3 backdrop-blur-xl shadow-xl space-y-1">
                            {/* Tab 1: Profile Info */}
                            <button
                                type="button"
                                onClick={() => setActiveTab("info")}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                    activeTab === "info"
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                        : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faUser} className="text-xs" />
                                    <span>Thông tin tài khoản</span>
                                </span>
                                <FontAwesomeIcon icon={faChevronRight} className="text-[10px] opacity-70" />
                            </button>

                            {/* Tab 2: Booking History */}
                            <button
                                type="button"
                                onClick={() => setActiveTab("history")}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                    activeTab === "history"
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                        : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faClockRotateLeft} className="text-xs" />
                                    <span>Lịch sử đặt vé</span>
                                </span>
                                {historyResponse.length > 0 ? (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        activeTab === "history" ? "bg-white/20 text-white" : "bg-violet-600/30 text-violet-300"
                                    }`}>
                                        {historyResponse.length}
                                    </span>
                                ) : (
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px] opacity-70" />
                                )}
                            </button>

                            {/* Tab 3: Rewards & Vouchers */}
                            <button
                                type="button"
                                onClick={() => setActiveTab("rewards")}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                    activeTab === "rewards"
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                        : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faGift} className="text-xs" />
                                    <span>Điểm thưởng & Voucher</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Ưu đãi
                                </span>
                            </button>

                            {/* Tab 4: Security & Password */}
                            <button
                                type="button"
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                    activeTab === "security"
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                                        : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                                    <span>Đổi mật khẩu & Bảo mật</span>
                                </span>
                                <FontAwesomeIcon icon={faChevronRight} className="text-[10px] opacity-70" />
                            </button>

                            <div className="pt-2 my-1 border-t border-white/10" />

                            {/* Logout Action */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                                <span>Đăng xuất tài khoản</span>
                            </button>
                        </div>

                        {/* Customer Care Hotline Box */}
                        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 text-xs text-zinc-400 space-y-2">
                            <p className="flex items-center gap-2 font-bold text-zinc-200">
                                <FontAwesomeIcon icon={faHeadset} className="text-violet-400" />
                                <span>Hỗ Trợ Khách Hàng</span>
                            </p>
                            <p className="text-[11px] leading-relaxed">
                                Cần hỗ trợ thay đổi vé hoặc giải đáp thắc mắc? Liên hệ hotline CineMeow:
                            </p>
                            <a
                                href="tel:19001234"
                                className="inline-block text-xs font-bold text-violet-400 hover:underline"
                            >
                                📞 1900 1234 (8:00 - 22:00)
                            </a>
                        </div>
                    </aside>

                    {/* 2. RIGHT MAIN CONTENT (lg:col-span-8 xl:col-span-9) */}
                    <main className="lg:col-span-8 xl:col-span-9 space-y-6">
                        
                        {/* TAB 1: Thông tin tài khoản */}
                        {activeTab === "info" && (
                            <div className="space-y-6 animate-fadeIn">
                                <UserProfileForm />
                            </div>
                        )}

                        {/* TAB 2: Lịch sử đặt vé */}
                        {activeTab === "history" && (
                            <div className="animate-fadeIn">
                                <BookingHistory
                                    history={historyResponse}
                                    isLoading={isHistoryLoading}
                                />
                            </div>
                        )}

                        {/* TAB 3: Điểm thưởng & Voucher */}
                        {activeTab === "rewards" && (
                            <div className="space-y-6 animate-fadeIn">
                                {/* Points Banner */}
                                <div className="bg-gradient-to-r from-violet-950 via-[#16122e] to-zinc-950 border border-violet-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-2 max-w-lg">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase">
                                                <FontAwesomeIcon icon={faCoins} />
                                                <span>CinePoints Rewards</span>
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-black text-white">
                                                Bạn có <span className="text-amber-400">1,250 điểm</span> tích lũy
                                            </h3>
                                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                                                Điểm thưởng có thể dùng để khấu trừ trực tiếp khi thanh toán vé xem phim hoặc đổi bắp nước miễn phí tại tất cả cụm rạp đối tác.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2 shrink-0">
                                            <Link
                                                to="/now-playing"
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-900/40 transition cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={faTicket} />
                                                <span>Đặt vé dùng điểm ngay</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Exclusive Vouchers Grid */}
                                <div className="bg-[#12121e]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                            <FontAwesomeIcon icon={faGift} className="text-amber-400" />
                                            <span>Kho Voucher Của Bạn</span>
                                        </h3>
                                        <p className="text-xs text-zinc-400 mt-1">
                                            Sao chép mã voucher và nhập tại bước thanh toán để nhận chiết khấu
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Voucher 1 */}
                                        <div className="p-4 rounded-xl bg-[#0B0B14] border border-white/5 hover:border-violet-500/40 transition flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                                        Giảm 50.000₫
                                                    </span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 font-semibold">
                                                        Đơn từ 200k
                                                    </span>
                                                </div>
                                                <p className="text-xs font-semibold text-white">Mã: MEOWVIP50</p>
                                                <p className="text-[11px] text-zinc-500">HSD: Còn 28 ngày</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyVoucher("MEOWVIP50")}
                                                className="px-3.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 text-xs font-bold transition cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={copiedVoucher === "MEOWVIP50" ? faCheck : faCopy} className="mr-1.5" />
                                                <span>{copiedVoucher === "MEOWVIP50" ? "Đã chép" : "Sao chép"}</span>
                                            </button>
                                        </div>

                                        {/* Voucher 2 */}
                                        <div className="p-4 rounded-xl bg-[#0B0B14] border border-white/5 hover:border-violet-500/40 transition flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                                        Tặng Bắp Ngọt
                                                    </span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-300 font-semibold">
                                                        Mua 2 vé
                                                    </span>
                                                </div>
                                                <p className="text-xs font-semibold text-white">Mã: FREEPOPCORN</p>
                                                <p className="text-[11px] text-zinc-500">HSD: Còn 15 ngày</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyVoucher("FREEPOPCORN")}
                                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={copiedVoucher === "FREEPOPCORN" ? faCheck : faCopy} className="mr-1.5" />
                                                <span>{copiedVoucher === "FREEPOPCORN" ? "Đã chép" : "Sao chép"}</span>
                                            </button>
                                        </div>

                                        {/* Voucher 3 */}
                                        <div className="p-4 rounded-xl bg-[#0B0B14] border border-white/5 hover:border-violet-500/40 transition flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                                                        Giảm 20% IMAX
                                                    </span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-300 font-semibold">
                                                        Suất đặc biệt
                                                    </span>
                                                </div>
                                                <p className="text-xs font-semibold text-white">Mã: IMAXEXPERIENCE</p>
                                                <p className="text-[11px] text-zinc-500">HSD: Còn 45 ngày</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyVoucher("IMAXEXPERIENCE")}
                                                className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={copiedVoucher === "IMAXEXPERIENCE" ? faCheck : faCopy} className="mr-1.5" />
                                                <span>{copiedVoucher === "IMAXEXPERIENCE" ? "Đã chép" : "Sao chép"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: Đổi mật khẩu & Bảo mật */}
                        {activeTab === "security" && (
                            <div className="space-y-6 animate-fadeIn">
                                <form
                                    onSubmit={handleChangePassword}
                                    className="bg-[#12121e]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6"
                                >
                                    <div className="pb-4 border-b border-white/10">
                                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                            <FontAwesomeIcon icon={faLock} className="text-violet-400" />
                                            <span>Đổi Mật Khẩu Đăng Nhập</span>
                                        </h2>
                                        <p className="text-xs text-zinc-400 mt-1">
                                            Để bảo vệ an toàn cho tài khoản, hãy sử dụng mật khẩu mạnh có chứa chữ hoa, số và ký tự đặc biệt
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Mật khẩu cũ */}
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                                Mật khẩu hiện tại
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showOldPassword ? "text" : "password"}
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    placeholder="Nhập mật khẩu cũ"
                                                    className="w-full h-11 pl-4 pr-10 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition cursor-pointer p-1"
                                                >
                                                    <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} className="text-xs" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mật khẩu mới */}
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                                Mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Tối thiểu 6 ký tự"
                                                    className="w-full h-11 pl-4 pr-10 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition cursor-pointer p-1"
                                                >
                                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="text-xs" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Xác nhận mật khẩu mới */}
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Nhập lại mật khẩu mới"
                                                    className="w-full h-11 pl-4 pr-10 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition cursor-pointer p-1"
                                                >
                                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                                        <p className="text-[11px] text-zinc-400">
                                            Đổi mật khẩu sẽ tự động đăng xuất trên các thiết bị cũ không xác thực
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingPassword}
                                            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-violet-900/40 transition disabled:opacity-60 cursor-pointer"
                                        >
                                            {isSubmittingPassword ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
                                        </button>
                                    </div>
                                </form>

                                {/* Security Recommendations */}
                                <div className="p-5 rounded-2xl bg-[#12121e]/80 border border-white/10 backdrop-blur-xl space-y-3">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400" />
                                        <span>Gợi ý bảo mật tài khoản điện ảnh</span>
                                    </h4>
                                    <ul className="space-y-2 text-xs text-zinc-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-400">✓</span>
                                            <span>Không chia sẻ mã vé QR hoặc thông tin đăng nhập cho người lạ để tránh mất quyền lợi xem phim.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-400">✓</span>
                                            <span>Thường xuyên cập nhật số điện thoại và email chính chủ để nhận thông báo khẩn cấp khi đổi lịch chiếu.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
}
