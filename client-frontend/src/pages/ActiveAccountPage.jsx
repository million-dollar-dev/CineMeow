import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";

export default function ActiveAccountPage() {
    return (
        <div className="min-h-screen bg-[#010101] text-[#fffffe] flex flex-col items-center justify-center px-6 py-12">
            {/* Icon + Tiêu đề */}
            <div className="border border-[#1f1f1f] bg-[#141414] rounded-2xl shadow-[0_0_20px_rgba(127,90,240,0.15)] my-[2vw] flex flex-col items-center justify-center px-6 py-12">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-[#7f5af0]/20 text-[#7f5af0] rounded-full flex items-center justify-center text-4xl font-bold mb-6">
                        <FontAwesomeIcon icon={faEnvelope} size="lg" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                        Kiểm tra email của bạn
                    </h2>

                    <p className="text-[#94a1b2] max-w-md">
                        Cảm ơn bạn đã đăng ký tài khoản!
                        Chúng tôi đã gửi một liên kết xác nhận đến hộp thư của bạn.
                        Vui lòng mở email và nhấn vào liên kết để kích hoạt tài khoản.
                    </p>
                </div>

                {/* Hướng dẫn thêm */}
                <div className="mt-10 text-center text-sm text-[#94a1b2]">
                    <p className="mt-2">
                        Nếu vẫn không thấy, hãy kiểm tra thư mục{" "}
                        <span className="font-medium text-[#fffffe]">Spam / Quảng cáo</span>.
                    </p>
                </div>

                {/* Nút quay lại trang chủ */}
                <div className="mt-12">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="px-6 py-3 bg-[#7f5af0] text-[#fffffe] font-semibold rounded-xl hover:opacity-90 transition"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}
