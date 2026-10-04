import React, { useEffect } from "react";
import Loading from "../components/Loading.jsx";
import { useVerifyAccountMutation } from "../services/authService.js";
import { useDispatch } from "react-redux";
import { setTokens } from "../redux/slices/authSlice.js";
import { showToast } from "../redux/slices/toastSlice.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function VerifyAccountPage() {
    const dispatch = useDispatch();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const [verifyAccount, { isLoading, isSuccess, isError }] = useVerifyAccountMutation(token, { skip: !token });

    useEffect(() => {
        if (token) {
            verifyAccount(token)
                .unwrap()
                .then((res) => {
                    if (res?.data?.accessToken && res?.data?.refreshToken) {
                        dispatch(setTokens({
                            accessToken: res.data.accessToken,
                            refreshToken: res.data.refreshToken
                        }));
                        dispatch(showToast({ message: "Kích hoạt tài khoản và đăng nhập thành công!" }));
                        setTimeout(() => (window.location.href = "/"), 2000);
                    }
                })
                .catch(() => {});
        }
    }, [verifyAccount, token, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B14] text-slate-100 px-4 sm:px-6 py-12 relative overflow-hidden selection:bg-violet-600 selection:text-white">
            
            <div className="absolute top-1/3 -left-32 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg border border-white/10 bg-[#141424] rounded-3xl shadow-[0_0_40px_rgba(127,90,240,0.15)] p-8 sm:p-10 text-center space-y-6">
                
                {isLoading && (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <Loading />
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Đang xác thực tài khoản...</h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Vui lòng đợi trong giây lát, hệ thống CineMeow đang kích hoạt tài khoản của bạn.
                        </p>
                    </div>
                )}

                {isSuccess && (
                    <div className="flex flex-col items-center gap-4 py-4 animate-fadeIn space-y-2">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Xác thực thành công!</h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-sm">
                            Tài khoản CineMeow của bạn đã được kích hoạt. Hệ thống sẽ tự động chuyển hướng đến trang chủ trong giây lát...
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all"
                            >
                                <span>Vào xem phim ngay</span>
                                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </Link>
                        </div>
                    </div>
                )}

                {(isError || token == null) && !isLoading && (
                    <div className="flex flex-col items-center gap-4 py-4 animate-fadeIn space-y-2">
                        <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-3xl shadow-lg shadow-rose-500/20">
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Xác thực không thành công</h2>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                            Liên kết kích hoạt không hợp lệ, đã hết hạn hoặc tài khoản đã được kích hoạt trước đó.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                to="/login"
                                className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm transition-all"
                            >
                                Thử đăng nhập
                            </Link>
                            <Link
                                to="/"
                                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs sm:text-sm transition-all"
                            >
                                Quay lại Trang chủ
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
