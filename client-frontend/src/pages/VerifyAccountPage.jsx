import Loading from "../components/Loading.jsx";
import {useEffect} from "react";
import {useVerifyAccountMutation} from "../services/authService.js";
import {useDispatch} from "react-redux";
import {setTokens} from "../redux/slices/authSlice.js";
import {showToast} from "../redux/slices/toastSlice.js";

export default function VerifyAccountPage() {
    const dispatch = useDispatch();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const [verifyAccount,
        { isLoading, isSuccess, isError }
    ] = useVerifyAccountMutation(token, {skip: !token});

    useEffect(() => {
        if (token) {
            verifyAccount(token)
                .unwrap()
                .then((res) => {
                    if (res.data.accessToken && res.data.refreshToken) {
                        dispatch(setTokens({accessToken: res.data.accessToken, refreshToken: res.data.refreshToken}));
                        dispatch(showToast("Đăng nhập thành công"))
                        setTimeout(() => (window.location.href = "/"), 2000);
                    }
                })
                .catch(() => {});
        }
    }, [verifyAccount]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#010101] text-[#fffffe] px-4">
            <div className="text-center max-w-md">
                {isLoading && (
                    <div className="flex flex-col items-center gap-4">
                        <Loading />
                        <h2 className="text-2xl font-semibold">Đang xác thực tài khoản...</h2>
                        <p className="text-[#94a1b2]">
                            Vui lòng đợi trong giây lát, chúng tôi đang xác minh tài khoản của
                            bạn.
                        </p>
                    </div>
                )}

                {isSuccess && (
                    <div className="flex flex-col items-center gap-4 animate-fadeIn border border-[#1f1f1f] bg-[#141414] rounded-2xl shadow-[0_0_20px_rgba(127,90,240,0.15)] my-[2vw] px-6 py-12">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#7f5af0]/20 border border-[#7f5af0]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-[#7f5af0]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold">Xác thực thành công!</h2>
                        <p className="text-[#94a1b2]">
                            Tài khoản của bạn đã được kích hoạt.
                            Hệ thống sẽ tự động đăng nhập trong giây lát...
                        </p>
                    </div>
                )}

                {(isError || token == null) && (
                    <div className="flex flex-col items-center gap-4 animate-fadeIn border border-[#1f1f1f] bg-[#141414] rounded-2xl shadow-[0_0_20px_rgba(127,90,240,0.15)] my-[2vw] px-6 py-12">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500/20 border border-red-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold">Xác thực thất bại</h2>
                        <p className="text-[#94a1b2]">
                            Liên kết xác nhận không hợp lệ hoặc đã hết hạn.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
