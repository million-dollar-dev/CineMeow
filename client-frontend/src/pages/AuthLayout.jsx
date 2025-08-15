import React, {Suspense, useState} from 'react';
import Header from "../components/Header.jsx";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCat, faEye, faEyeSlash, faFilm, faTicketAlt} from "@fortawesome/free-solid-svg-icons";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import Loading from "../components/Loading.jsx";

const AuthLayout = () => {
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
                <Suspense fallback={<Loading />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    );
};

export default AuthLayout;