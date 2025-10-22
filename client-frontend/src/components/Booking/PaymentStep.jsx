import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCreditCard, faMoneyBill, faTicket, faWallet} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

export default function PaymentStep({
                                        onBack,
                                        selectedCombos,
                                        selectedSeats,
                                        seatTotalPrice,
                                        comboTotalPrice,
                                        discount,
                                        finalPrice,
                                        handleApplyVoucher,
                                        voucherCode,
                                        setVoucherCode,
                                        errorMsg,
                                    }) {
    const [paymentMethod, setPaymentMethod] = useState("MOMO");

    return (
        <div
            className="relative lg:w-2/5 w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl p-[1.8vw] flex flex-col justify-between shadow-[0_0_25px_rgba(127,90,240,0.08)]">
            <button
                onClick={onBack}
                className="absolute top-3 left-3 flex items-center gap-1 text-gray-400 hover:text-white text-sm transition"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-[0.9vw]"/>
                <span>Quay lại</span>
            </button>

            <div className="mt-[2vw] space-y-6">

                {/* 💳 Section: Phương thức thanh toán */}
                <div className="border-t border-[#2a2a2a] pt-4">
                    <h3 className="text-white font-semibold text-[1vw] mb-3">
                        Chọn phương thức thanh toán
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            {label: "MOMO", icon: faWallet},
                            {label: "Thẻ", icon: faCreditCard},
                            {label: "Tiền mặt", icon: faMoneyBill},
                        ].map((method) => (
                            <button
                                key={method.label}
                                onClick={() => setPaymentMethod(method.label)}
                                className={`flex flex-col items-center justify-center p-[0.8vw] rounded-xl border text-sm transition-all duration-200 ${
                                    paymentMethod === method.label
                                        ? "border-[#9f7bff] bg-[#2a2a2a] text-[#9f7bff]"
                                        : "border-[#2a2a2a] bg-[#202020] text-gray-300 hover:border-[#9f7bff]/40 hover:text-white"
                                }`}
                            >
                                <FontAwesomeIcon icon={method.icon} className="text-[1vw] mb-1"/>
                                <span>{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nhập mã giảm giá */}
                <div className="border-t border-[#2a2a2a] pt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faTicket} className="text-[#9f7bff]"/>
                        <span className="text-white font-semibold text-[1vw]">
              Mã giảm giá
            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            placeholder="Nhập mã khuyến mãi..."
                            className="flex-1 bg-[#202020] border border-[#2a2a2a] rounded-lg p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#9f7bff]"
                        />
                        <button
                            onClick={() => handleApplyVoucher(voucherCode)}
                            className="px-4 py-2 bg-gradient-to-r from-[#7f5af0] to-[#9f7bff] rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-all"
                        >
                            Áp dụng
                        </button>
                    </div>
                    {errorMsg && <p className="text-red-400 text-sm mt-1">{errorMsg}</p>}
                    {discount > 0 && (
                        <p className="text-green-400 text-sm mt-1">
                            Giảm {discount.toLocaleString("vi-VN")}đ
                        </p>
                    )}
                </div>



                {/* 🧾 Tổng quan giá */}
                <div className="border-t border-[#333] pt-4 space-y-3 text-[1vw]">
                    {selectedCombos.length > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Combo</span>
                            <span className="font-semibold text-[#f5f5f5]">
                {comboTotalPrice.toLocaleString("vi-VN")}đ
              </span>
                        </div>
                    )}

                    {selectedSeats.length > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Tiền vé</span>
                            <span className="font-semibold text-[#f5f5f5]">
                {seatTotalPrice.toLocaleString("vi-VN")}đ
              </span>
                        </div>
                    )}

                    {discount > 0 && (
                        <div className="flex justify-between text-green-400">
                            <span>Giảm giá</span>
                            <span>-{discount.toLocaleString("vi-VN")}đ</span>
                        </div>
                    )}

                    <div className="flex justify-between font-bold text-[1.1vw] pt-3 border-t border-[#2a2a2a]">
                        <span>Tổng cộng</span>
                        <span className="text-[#9f7bff]">
              {finalPrice.toLocaleString("vi-VN")}đ
            </span>
                    </div>
                </div>
            </div>

            {/* Nút thanh toán */}
            <button
                className="mt-8 w-full py-[0.9vw] bg-gradient-to-r from-[#7f5af0] to-[#9f7bff] text-white rounded-xl font-semibold text-[1vw] hover:shadow-[0_0_20px_rgba(127,90,240,0.6)] active:scale-95 transition-all"
            >
                Thanh toán bằng {paymentMethod}
            </button>
        </div>
    );
}
