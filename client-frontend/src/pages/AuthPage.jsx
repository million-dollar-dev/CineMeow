import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCat, faEye, faEyeSlash, faFilm, faTicketAlt} from "@fortawesome/free-solid-svg-icons";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true); // false = đăng ký, true = đăng nhập
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 w-full max-w-5xl overflow-hidden">
                {/* LEFT SIDE */}
                <div className="relative flex flex-col justify-center p-10 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-black overflow-hidden">
                    <div className="absolute w-96 h-96 bg-gradient-to-br from-purple-500 to-transparent rounded-full blur-3xl opacity-60 -top-20 -left-20" />
                    {/* Circle 2 */}
                    <div className="absolute w-96 h-96 bg-gradient-to-tr from-violet to-transparent rounded-full blur-3xl opacity-60 bottom-0 right-0" />
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-lg z-0" />

                    <div className="relative z-10 space-y-8 animate-fadeIn">
                        <h1 className="text-4xl font-bold leading-tight text-gray-900">
                            <FontAwesomeIcon icon={faCat}/> CineMeow
                        </h1>
                        <h1 className="text-3xl font-bold leading-tight text-gray-sub">
                            Đặt Vé Nhanh. <br /> Trải Nghiệm Mượt.
                        </h1>

                        <div className="flex items-start gap-4">
                            <FontAwesomeIcon icon={faTicketAlt} className="text-3xl text-gray-800" />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Đặt Vé Tức Thì</h2>
                                <p className="text-sm text-gray-700">
                                    Xác nhận vé nhanh chóng, không lo bỏ lỡ suất chiếu.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <FontAwesomeIcon icon={faFilm} className="text-3xl text-gray-800" />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Cập Nhật Rủi Ro</h2>
                                <p className="text-sm text-gray-700">
                                    Thông báo suất chiếu sắp hết vé, giúp bạn đặt chỗ kịp thời.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - FORM */}
                <div className="bg-white p-10 flex flex-col justify-center">
                    {/* Tiêu đề thay đổi */}
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">
                        {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        {isLogin ? (
                            <>
                                Chưa có tài khoản?{" "}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-black font-medium hover:underline"
                                >
                                    Đăng ký
                                </button>
                            </>
                        ) : (
                            <>
                                Đã có tài khoản?{" "}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-black font-medium hover:underline"
                                >
                                    Đăng nhập
                                </button>
                            </>
                        )}
                    </p>

                    <form className="space-y-4">
                        {!isLogin && (
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        )}
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        {!isLogin && (
                            <p className="text-xs text-gray-500">
                                Khi đăng ký, bạn đồng ý với{" "}
                                <a href="#" className="underline">
                                    Điều khoản sử dụng
                                </a>{" "}
                                và{" "}
                                <a href="#" className="underline">
                                    Chính sách bảo mật
                                </a>.
                            </p>
                        )}

                        {isLogin && (
                            <p className="text-sm text-gray-500 text-right underline">
                                Quên mật khẩu
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            {isLogin ? "Đăng nhập" : "Đăng ký"}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300" />
                        <span className="px-2 text-gray-500 text-sm">hoặc</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100">
                            <FontAwesomeIcon icon={faGoogle} className="text-lg text-red-500" /> Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;