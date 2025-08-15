import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Link} from "react-router-dom";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <div className="bg-white p-10 flex flex-col justify-center">
                {/* Tiêu đề thay đổi */}
                <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    Đăng ký
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Đã có tài khoản?{" "}
                    <Link to={"/login"}>
                        <button
                            className="text-black font-medium hover:underline"
                        >
                            Đăng nhập
                        </button>
                    </Link>
                </p>

                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
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
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                        </button>
                    </div>
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
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Đăng ký
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300"/>
                    <span className="px-2 text-gray-500 text-sm">hoặc</span>
                    <hr className="flex-grow border-gray-300"/>
                </div>

                <div className="flex gap-4">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100">
                        <FontAwesomeIcon icon={faGoogle} className="text-lg text-red-500"/> Google
                    </button>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;