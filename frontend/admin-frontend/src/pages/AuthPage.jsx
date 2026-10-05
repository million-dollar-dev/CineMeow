import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { setTokens } from "../redux/slices/authSlice.js";
import { openSnackbar } from "../redux/slices/snackbarSlice.js";
import { useLoginMutation } from "../services/authService.js";

// Material UI Icons
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const formSchema = yup.object().shape({
    username: yup.string().required("Vui lòng nhập tên đăng nhập"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
});

const AuthPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
        resolver: yupResolver(formSchema),
    });

    const [login, { data = {}, isError, error, isSuccess, isLoading }] = useLoginMutation();

    const onSubmit = (formData) => {
        login(formData);
    };

    // Quick fill demo credentials for testing
    const handleQuickFillDemo = (username, password) => {
        setValue("username", username, { shouldValidate: true });
        setValue("password", password, { shouldValidate: true });
    };

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(
                openSnackbar({
                    message: "Đăng nhập hệ thống quản trị CineMeow thành công!",
                    type: "success",
                })
            );
            dispatch(
                setTokens({
                    accessToken: data.data.accessToken,
                    refreshToken: data.data.refreshToken,
                })
            );
            navigate("/dashboard");
        }
    }, [isSuccess, data, navigate, dispatch]);

    return (
        <div className="min-h-screen w-full flex bg-[#F8FAFC] text-slate-800 selection:bg-violet-600 selection:text-white">
            
            {/* 1. LEFT SHOWCASE PANEL (Desktop Only - Clean, Intuitive, Aesthetic Light Layout) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-[52%] relative flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-violet-50/60 via-slate-50 to-indigo-50/40 border-r border-slate-200/80 select-none overflow-hidden">
                
                {/* Subtle Geometric Background Dot Grid Pattern */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-50"
                    style={{
                        backgroundImage: "radial-gradient(#cbd5e1 1.2px, transparent 1.2px)",
                        backgroundSize: "24px 24px"
                    }}
                />

                {/* Soft Ambient Pastel Glows */}
                <div className="absolute top-10 -left-16 w-[450px] h-[450px] bg-violet-200/30 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-200/25 rounded-full blur-[100px] pointer-events-none" />

                {/* Top: Brand Header with Live Status Indicator */}
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 p-2.5">
                            {/* Cat Cinema SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-full h-full fill-current">
                                <path d="M96 160C149 160 192 203 192 256L192 341.8C221.7 297.1 269.8 265.6 325.4 257.8C351 317.8 410.6 359.9 480 359.9C490.9 359.9 501.6 358.8 512 356.8L512 544C512 561.7 497.7 576 480 576C462.3 576 448 561.7 448 544L448 403.2L312 512L368 512C385.7 512 400 526.3 400 544C400 561.7 385.7 576 368 576L224 576C171 576 128 533 128 480L128 256C128 239.4 115.4 225.8 99.3 224.2L92.7 223.9C76.6 222.2 64 208.6 64 192C64 174.3 78.3 160 96 160zM565.8 67.2C576.2 58.5 592 65.9 592 79.5L592 192C592 253.9 541.9 304 480 304C418.1 304 368 253.9 368 192L368 79.5C368 65.9 383.8 58.5 394.2 67.2L448 112L512 112L565.8 67.2zM432 172C421 172 412 181 412 192C412 203 421 212 432 212C443 212 452 203 452 192C452 181 443 172 432 172zM528 172C517 172 508 181 508 192C508 203 517 212 528 212C539 212 548 203 548 192C548 181 539 172 528 172z"/>
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                                    Cine<span className="text-violet-600">Meow</span>
                                </h2>
                                <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold tracking-wide uppercase">
                                    Admin
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Hệ thống quản trị cụm rạp
                            </p>
                        </div>
                    </div>

                    {/* Live System Status Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-600">
                        <FiberManualRecordIcon sx={{ fontSize: 10 }} className="text-emerald-500 animate-pulse" />
                        <span>Hệ thống trực tuyến</span>
                    </div>
                </div>

                {/* Middle: Value Prop & Live Operational Metric Widgets */}
                <div className="relative z-10 space-y-7 max-w-lg my-auto py-6">
                    <div className="space-y-3">
                        <h1 className="text-3xl xl:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Vận hành cụm rạp thông minh, dữ liệu thời gian thực
                        </h1>
                        <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Điều phối suất chiếu, kiểm soát tỷ lệ lấp đầy ghế ngồi và theo dõi hiệu suất doanh thu tập trung cho toàn bộ phòng chiếu.
                        </p>
                    </div>

                    {/* Operational KPI Cards */}
                    <div className="space-y-3">
                        {/* Revenue KPI Widget */}
                        <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-violet-300 transition">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
                                        <TrendingUpOutlinedIcon sx={{ fontSize: 18 }} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700">Doanh thu phòng vé hôm nay</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                                    +18.4%
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-extrabold text-slate-900">48.250.000 ₫</span>
                                <span className="text-xs text-slate-500">/ 3.240 vé bán ra</span>
                            </div>
                        </div>

                        {/* Showtimes & Screens Widget */}
                        <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-violet-300 transition">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                                        <MovieOutlinedIcon sx={{ fontSize: 18 }} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700">Suất chiếu đang diễn ra</span>
                                </div>
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                                    8 phòng chiếu
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>42 suất chiếu hôm nay</span>
                                <span className="text-slate-400 font-medium">IMAX Laser • 2D Digital</span>
                            </div>
                        </div>

                        {/* Occupancy Rate Bar Widget */}
                        <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-violet-300 transition">
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                                        <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18 }} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700">Tỷ lệ lấp đầy ghế bình quân</span>
                                </div>
                                <span className="text-xs font-extrabold text-slate-900">84.6%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
                                <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full w-[84.6%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Version & Security Notice */}
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-200/80">
                    <p className="flex items-center gap-1.5 font-medium">
                        <ShieldOutlinedIcon sx={{ fontSize: 16 }} className="text-emerald-600" />
                        <span>Mã hóa SSL 256-bit • Phiên bản v2.5.0</span>
                    </p>
                    <span className="text-slate-400 font-medium">CineMeow Portal</span>
                </div>
            </div>

            {/* 2. RIGHT LOGIN FORM PANEL (Ultra-Clean, Aesthetic & Focused Light Style) */}
            <div className="w-full lg:w-1/2 xl:w-[48%] flex flex-col justify-between items-center p-6 sm:p-12 relative overflow-y-auto">
                
                {/* Top Bar with Mobile Brand Logo & Client Portal Link */}
                <div className="w-full max-w-md flex items-center justify-between mb-4">
                    {/* Brand for Mobile Screens */}
                    <div className="flex lg:hidden items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow p-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-full h-full fill-current">
                                <path d="M96 160C149 160 192 203 192 256L192 341.8C221.7 297.1 269.8 265.6 325.4 257.8C351 317.8 410.6 359.9 480 359.9C490.9 359.9 501.6 358.8 512 356.8L512 544C512 561.7 497.7 576 480 576C462.3 576 448 561.7 448 544L448 403.2L312 512L368 512C385.7 512 400 526.3 400 544C400 561.7 385.7 576 368 576L224 576C171 576 128 533 128 480L128 256C128 239.4 115.4 225.8 99.3 224.2L92.7 223.9C76.6 222.2 64 208.6 64 192C64 174.3 78.3 160 96 160zM565.8 67.2C576.2 58.5 592 65.9 592 79.5L592 192C592 253.9 541.9 304 480 304C418.1 304 368 253.9 368 192L368 79.5C368 65.9 383.8 58.5 394.2 67.2L448 112L512 112L565.8 67.2zM432 172C421 172 412 181 412 192C412 203 421 212 432 212C443 212 452 203 452 192C452 181 443 172 432 172zM528 172C517 172 508 181 508 192C508 203 517 212 528 212C539 212 548 203 548 192C548 181 539 172 528 172z"/>
                            </svg>
                        </div>
                        <span className="font-extrabold text-lg text-slate-900">CineMeow Admin</span>
                    </div>

                    {/* Back to Client Website Button */}
                    <a
                        href="http://127.0.0.1:5174/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-violet-600 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-sm transition ml-auto"
                    >
                        <ArrowBackIcon sx={{ fontSize: 14 }} />
                        <span>Trang khách hàng</span>
                    </a>
                </div>

                {/* Main Clean Light Card */}
                <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.07)] my-auto relative">
                    
                    {/* Header inside Card: Clean, without redundant subtitles */}
                    <div className="mb-7">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Đăng Nhập Quản Trị
                        </h2>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        {/* Error Alert Banner */}
                        {isError && (
                            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                                <span className="font-bold text-sm leading-none shrink-0 text-rose-500">⚠️</span>
                                <div>
                                    <p className="font-bold text-rose-900">Đăng nhập không thành công!</p>
                                    <p className="text-[11px] text-rose-700 mt-0.5">
                                        {error?.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Username Field: No redundant label, concise placeholder */}
                        <div className="space-y-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
                                </div>
                                <input
                                    type="text"
                                    {...register("username")}
                                    placeholder="Tên đăng nhập"
                                    className={`w-full h-12 pl-10 pr-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition ${
                                        errors.username
                                            ? "border-rose-400 focus:border-rose-500"
                                            : "border-slate-200 focus:border-violet-600"
                                    }`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-rose-500 text-xs mt-1 font-medium pl-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field: No redundant label, concise placeholder */}
                        <div className="space-y-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <LockOutlinedIcon sx={{ fontSize: 20 }} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Mật khẩu"
                                    className={`w-full h-12 pl-10 pr-11 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition ${
                                        errors.password
                                            ? "border-rose-400 focus:border-rose-500"
                                            : "border-slate-200 focus:border-violet-600"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                >
                                    {showPassword ? (
                                        <VisibilityOff sx={{ fontSize: 19 }} />
                                    ) : (
                                        <Visibility sx={{ fontSize: 19 }} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-rose-500 text-xs mt-1 font-medium pl-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password Row */}
                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/20 cursor-pointer accent-violet-600"
                                />
                                <span className="font-medium">Ghi nhớ đăng nhập</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => alert("Vui lòng liên hệ bộ phận Kỹ thuật / Quản trị viên cấp cao để cấp lại mật khẩu.")}
                                className="font-medium text-violet-600 hover:text-violet-700 transition cursor-pointer"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-violet-600/20 hover:shadow-lg hover:shadow-violet-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed pt-0.5 mt-2"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    <span>Đang xác thực...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Đăng Nhập</span>
                                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Intuitive Quick-Fill Demo Credentials Helper */}
                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 font-medium text-slate-600">
                                <KeyOutlinedIcon sx={{ fontSize: 14 }} className="text-violet-600" />
                                <span>Tài khoản kiểm thử nhanh:</span>
                            </span>
                            <span className="text-[11px] text-slate-400">1-chạm điền</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickFillDemo("admin", "admin")}
                                className="p-2.5 rounded-xl bg-slate-50 hover:bg-violet-50/80 border border-slate-200/90 hover:border-violet-300 text-left transition cursor-pointer group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs text-slate-800 font-mono">admin</span>
                                    <span className="text-[10px] text-violet-600 font-semibold group-hover:underline">Điền</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">Quyền Admin</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFillDemo("manager", "manager123")}
                                className="p-2.5 rounded-xl bg-slate-50 hover:bg-violet-50/80 border border-slate-200/90 hover:border-violet-300 text-left transition cursor-pointer group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs text-slate-800 font-mono">manager</span>
                                    <span className="text-[10px] text-violet-600 font-semibold group-hover:underline">Điền</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">Quyền Manager</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal / Security Info */}
                <div className="w-full max-w-md text-center text-xs text-slate-400 mt-6">
                    <p className="font-medium">© 2026 CineMeow Cinema Network</p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;