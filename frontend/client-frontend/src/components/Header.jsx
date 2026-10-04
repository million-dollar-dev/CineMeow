import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCat, 
    faChevronDown, 
    faUser, 
    faBars, 
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import { useGetAllBrandsQuery } from "../services/brandService.js";
import { useGetMeQuery } from "../services/authService.js";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice.js";
import { useGetProfileQuery } from "../services/profileService.js";
import { useLogoutHandler } from "../hooks/useLogoutHandler.js";
import OverlayLoading from "./Booking/OverlayLoading.jsx";

const FALLBACK_BRANDS = [
    { id: "cgv", name: "CGV Cinemas" },
    { id: "lotte", name: "Lotte Cinema" },
    { id: "bhd", name: "BHD Star Cineplex" },
    { id: "galaxy", name: "Galaxy Cinema" },
    { id: "beta", name: "Beta Cinemas" },
    { id: "cinestar", name: "Cinestar" }
];

const Header = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const accessToken = useSelector((state) => state.auth.accessToken);
    const reduxUser = useSelector((state) => state.user);
    const { handleLogout, isLoggingOut } = useLogoutHandler();
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSubmenu, setMobileSubmenu] = useState(null);

    // Scroll listener for sticky header background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileSubmenu(null);
    }, [location.pathname]);

    // Data queries
    const { data: brandData = [] } = useGetAllBrandsQuery();
    const displayBrands = brandData.length > 0 ? brandData : FALLBACK_BRANDS;

    const { data: user } = useGetMeQuery(undefined, {
        skip: !accessToken,
    });

    const currentUser = user || (reduxUser?.username ? reduxUser : null);

    const { data: profile, isSuccess: isProfileSuccess } = useGetProfileQuery(currentUser?.id || currentUser?.userId, {
        skip: !(currentUser?.id || currentUser?.userId),
    });

    // Sync profile to Redux store
    useEffect(() => {
        if (isProfileSuccess && profile && currentUser) {
            dispatch(setUser({
                userId: currentUser.id || currentUser.userId,
                username: currentUser.username,
                phoneNumber: profile.phoneNumber,
                email: profile.email,
            }));
        }
    }, [currentUser, profile, isProfileSuccess, dispatch]);

    if (isLoggingOut) return <OverlayLoading />;

    const isLinkActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-[#0B0B14]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/80 py-3"
                    : "bg-gradient-to-b from-[#0B0B14]/95 via-[#0B0B14]/60 to-transparent py-5"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                
                {/* 1. Brand Logo (Violet Theme) */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-900/40 group-hover:scale-105 transition-transform duration-300">
                        <FontAwesomeIcon icon={faCat} className="text-xl" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white">
                            Cine<span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Meow</span>
                        </span>
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                            Cinema Ticketing
                        </span>
                    </div>
                </Link>

                {/* 2. Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-1">
                    
                    {/* Dropdown: Lịch chiếu (No icons at start) */}
                    <div className="relative group px-3 py-2">
                        <button 
                            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                                isLinkActive('/showtimes') || isLinkActive('/now-playing') || isLinkActive('/comming-soon')
                                    ? "text-violet-400 font-bold"
                                    : "text-slate-300 hover:text-white"
                            }`}
                        >
                            <span>Lịch chiếu</span>
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className="text-[10px] transition-transform duration-300 group-hover:rotate-180 text-slate-400 group-hover:text-violet-400" 
                            />
                        </button>

                        <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 w-60">
                            <div className="p-3 rounded-2xl bg-[#141424]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 space-y-1">
                                <Link
                                    to="/showtimes/today"
                                    className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group/item"
                                >
                                    <p className="text-xs font-bold text-white group-hover/item:text-violet-400 transition-colors">
                                        Lịch chiếu hôm nay
                                    </p>
                                    <p className="text-[11px] text-slate-400">Suất chiếu theo ngày & giờ</p>
                                </Link>

                                <Link
                                    to="/now-playing"
                                    className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group/item"
                                >
                                    <p className="text-xs font-bold text-white group-hover/item:text-violet-400 transition-colors">
                                        Phim đang chiếu
                                    </p>
                                    <p className="text-[11px] text-slate-400">Các bom tấn đang tại rạp</p>
                                </Link>

                                <Link
                                    to="/comming-soon"
                                    className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group/item"
                                >
                                    <p className="text-xs font-bold text-white group-hover/item:text-violet-400 transition-colors">
                                        Phim sắp chiếu
                                    </p>
                                    <p className="text-[11px] text-slate-400">Lịch khởi chiếu sắp tới</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Dropdown: Cụm rạp (No icons at start) */}
                    <div className="relative group px-3 py-2">
                        <button 
                            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                                isLinkActive('/brands') ? "text-violet-400 font-bold" : "text-slate-300 hover:text-white"
                            }`}
                        >
                            <span>Cụm rạp</span>
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className="text-[10px] transition-transform duration-300 group-hover:rotate-180 text-slate-400 group-hover:text-violet-400" 
                            />
                        </button>

                        <div className="absolute top-full -left-10 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 w-80">
                            <div className="p-4 rounded-2xl bg-[#141424]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Hệ Thống Rạp Đối Tác
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {displayBrands.map((brand) => (
                                        <Link
                                            key={brand.id}
                                            to={`/brands/${brand.id}`}
                                            className="p-2.5 rounded-xl hover:bg-white/5 border border-white/5 hover:border-violet-500/30 text-xs font-semibold text-slate-300 hover:text-violet-400 transition-all truncate"
                                        >
                                            {brand.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link: Ưu đãi (Promotions) */}
                    <Link
                        to="/promotions"
                        className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                            isLinkActive('/promotions') ? "text-violet-400 font-bold" : "text-slate-300 hover:text-white"
                        }`}
                    >
                        <span>Ưu đãi</span>
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-violet-600 text-white animate-pulse shadow">
                            HOT
                        </span>
                    </Link>

                    {/* Link: Review Phim */}
                    <Link
                        to="/reviews"
                        className={`px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                            isLinkActive('/reviews') ? "text-violet-400 font-bold" : "text-slate-300 hover:text-white"
                        }`}
                    >
                        <span>Review</span>
                    </Link>

                    {/* Dropdown: Blog Phim (No icons at start) */}
                    <div className="relative group px-3 py-2">
                        <button 
                            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                                isLinkActive('/blogs') ? "text-violet-400 font-bold" : "text-slate-300 hover:text-white"
                            }`}
                        >
                            <span>Blog điện ảnh</span>
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className="text-[10px] transition-transform duration-300 group-hover:rotate-180 text-slate-400 group-hover:text-violet-400" 
                            />
                        </button>

                        <div className="absolute top-full -left-6 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 w-56">
                            <div className="p-3 rounded-2xl bg-[#141424]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 space-y-1">
                                <Link
                                    to="/blogs/cinema"
                                    className="block p-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold text-slate-300 hover:text-violet-400 transition-colors"
                                >
                                    Blog điện ảnh
                                </Link>
                                <Link
                                    to="/blogs/movie"
                                    className="block p-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold text-slate-300 hover:text-violet-400 transition-colors"
                                >
                                    Phim chiếu rạp
                                </Link>
                                <Link
                                    to="/blogs/synthetic"
                                    className="block p-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold text-slate-300 hover:text-violet-400 transition-colors"
                                >
                                    Tổng hợp phim
                                </Link>
                                <Link
                                    to="/blogs/netflix"
                                    className="block p-2.5 rounded-xl hover:bg-white/5 text-xs font-semibold text-slate-300 hover:text-violet-400 transition-colors"
                                >
                                    Phim Netflix & OTT
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* 3. Auth Actions & User Profile (Violet Button) */}
                <div className="hidden lg:flex items-center gap-3">
                    {accessToken ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#141424] border border-white/10 hover:border-violet-500/40 transition-colors shadow">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow">
                                    {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                                </div>
                                <span className="text-xs font-bold text-white max-w-[120px] truncate">
                                    {currentUser?.username || "Tài khoản"}
                                </span>
                                <FontAwesomeIcon icon={faChevronDown} className="text-[10px] text-slate-400 group-hover:rotate-180 transition-transform" />
                            </button>

                            <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 w-56">
                                <div className="p-3 rounded-2xl bg-[#141424]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 space-y-1">
                                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                                        <p className="text-xs font-bold text-white truncate">{currentUser?.username || "Thành viên"}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{currentUser?.email || "Hội viên CineMeow"}</p>
                                    </div>

                                    <Link
                                        to={`/user-profile/${currentUser?.id || currentUser?.userId || 'me'}`}
                                        className="block p-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Thông tin tài khoản
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full block p-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 transition-all hover:scale-105"
                        >
                            <FontAwesomeIcon icon={faUser} className="text-xs" />
                            <span>Đăng nhập</span>
                        </Link>
                    )}
                </div>

                {/* 4. Mobile Hamburger Button */}
                <div className="flex lg:hidden items-center gap-2">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2.5 rounded-xl bg-[#141424] border border-white/10 text-white text-base hover:bg-white/10 transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} />
                    </button>
                </div>

            </div>

            {/* 5. Mobile Slide-Down Drawer Navigation */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 bg-[#0B0B14]/95 backdrop-blur-2xl border-t border-white/10 overflow-y-auto px-6 py-6 space-y-6">
                    
                    {/* User profile or login button */}
                    <div className="pb-4 border-b border-white/10">
                        {accessToken ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                                        {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{currentUser?.username || "Thành viên"}</p>
                                        <Link to={`/user-profile/${currentUser?.id || currentUser?.userId || 'me'}`} className="text-xs text-violet-400">Xem hồ sơ →</Link>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40"
                            >
                                <FontAwesomeIcon icon={faUser} />
                                <span>Đăng nhập / Đăng ký</span>
                            </Link>
                        )}
                    </div>

                    {/* Navigation links accordion */}
                    <div className="space-y-4 text-sm font-semibold">
                        
                        {/* Lịch chiếu */}
                        <div>
                            <button
                                onClick={() => setMobileSubmenu(mobileSubmenu === 'showtimes' ? null : 'showtimes')}
                                className="w-full flex items-center justify-between text-slate-200 py-2"
                            >
                                <span>Lịch chiếu & Phim</span>
                                <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`text-xs transition-transform ${mobileSubmenu === 'showtimes' ? 'rotate-180 text-violet-400' : ''}`} 
                                />
                            </button>
                            {mobileSubmenu === 'showtimes' && (
                                <div className="pl-4 space-y-2 pt-2 text-xs text-slate-400">
                                    <Link to="/showtimes/today" className="block py-1.5 hover:text-violet-400">Lịch chiếu hôm nay</Link>
                                    <Link to="/now-playing" className="block py-1.5 hover:text-violet-400">Phim đang chiếu</Link>
                                    <Link to="/comming-soon" className="block py-1.5 hover:text-violet-400">Phim sắp chiếu</Link>
                                </div>
                            )}
                        </div>

                        {/* Cụm rạp */}
                        <div>
                            <button
                                onClick={() => setMobileSubmenu(mobileSubmenu === 'brands' ? null : 'brands')}
                                className="w-full flex items-center justify-between text-slate-200 py-2"
                            >
                                <span>Hệ thống cụm rạp</span>
                                <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`text-xs transition-transform ${mobileSubmenu === 'brands' ? 'rotate-180 text-violet-400' : ''}`} 
                                />
                            </button>
                            {mobileSubmenu === 'brands' && (
                                <div className="pl-4 grid grid-cols-2 gap-2 pt-2 text-xs text-slate-400">
                                    {displayBrands.map((brand) => (
                                        <Link key={brand.id} to={`/brands/${brand.id}`} className="py-1 hover:text-violet-400 truncate">
                                            {brand.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Ưu đãi */}
                        <Link to="/promotions" className="flex items-center justify-between text-slate-200 py-2">
                            <span>Khuyến mãi & Voucher</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-600 text-white">HOT</span>
                        </Link>

                        {/* Review */}
                        <Link to="/reviews" className="block text-slate-200 py-2 hover:text-violet-400">
                            Góc Review Phim
                        </Link>

                        {/* Blog */}
                        <div>
                            <button
                                onClick={() => setMobileSubmenu(mobileSubmenu === 'blog' ? null : 'blog')}
                                className="w-full flex items-center justify-between text-slate-200 py-2"
                            >
                                <span>Blog & Tạp chí</span>
                                <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`text-xs transition-transform ${mobileSubmenu === 'blog' ? 'rotate-180 text-violet-400' : ''}`} 
                                />
                            </button>
                            {mobileSubmenu === 'blog' && (
                                <div className="pl-4 space-y-2 pt-2 text-xs text-slate-400">
                                    <Link to="/blogs/cinema" className="block py-1.5 hover:text-violet-400">Blog điện ảnh</Link>
                                    <Link to="/blogs/movie" className="block py-1.5 hover:text-violet-400">Phim chiếu rạp</Link>
                                    <Link to="/blogs/synthetic" className="block py-1.5 hover:text-violet-400">Tổng hợp phim</Link>
                                    <Link to="/blogs/netflix" className="block py-1.5 hover:text-violet-400">Phim Netflix & OTT</Link>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
