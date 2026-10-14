import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function PaymentStep({
    onBack,
    selectedCombos = [],
    selectedSeats = [],
    seatTotalPrice = 0,
    comboTotalPrice = 0,
    discount = 0,
    finalPrice = 0,
    handleApplyVoucher,
    voucherCode = "",
    setVoucherCode,
    errorMsg = "",
    phone = "",
    setPhone,
    email = "",
    setEmail,
    paymentMethod = "VNPAY",
    setPaymentMethod,
    handleCreateBooking,
    user,
    isBooking = false,
    isValidatingVoucher = false,
}) {
    const paymentOptions = [
        {
            id: "VNPAY",
            label: "VNPAY QR",
            description: "Thẻ ATM, Thẻ quốc tế, Quét QR",
            badge: "Khuyên dùng",
        },
        {
            id: "PAYPAL",
            label: "PayPal",
            description: "Thanh toán quốc tế",
        },
    ];

    return (
        <div className="w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between sticky top-28">
            <div className="space-y-6">
                {/* Header & Back Button */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                    >
                        <span>← Quay lại chọn ghế</span>
                    </button>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400 bg-violet-600/10 px-2.5 py-1 rounded-full border border-violet-500/20">
                        Bước 2 / 2
                    </span>
                </div>

                {/* Section 1: Thông tin người nhận vé */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">
                            Thông Tin Nhận Vé
                        </h3>
                        <span className="text-[11px] text-zinc-500">Bắt buộc</span>
                    </div>

                    <div className="space-y-2.5">
                        <div>
                            <label className="text-[11px] text-zinc-400 block mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Nhập số điện thoại nhận vé..."
                                className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] text-zinc-400 block mb-1">
                                Email nhận vé điện tử
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email nhận vé..."
                                className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 italic">
                        Mã vé điện tử & hóa đơn sẽ được gửi trực tiếp đến email và số điện thoại trên.
                    </p>
                </div>

                {/* Section 2: Mã giảm giá / Voucher */}
                <div className="space-y-2.5 pt-4 border-t border-zinc-800/80">
                    <span className="text-xs font-bold text-white block">
                        Mã Ưu Đãi / Voucher
                    </span>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            placeholder="Nhập mã ưu đãi..."
                            className="flex-1 bg-zinc-950/70 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 uppercase tracking-wider focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        />
                        <button
                            type="button"
                            disabled={!voucherCode.trim() || isValidatingVoucher}
                            onClick={() => handleApplyVoucher(voucherCode)}
                            className="px-4 py-2.5 bg-zinc-800 hover:bg-violet-600 disabled:bg-zinc-850 text-white font-semibold text-xs rounded-xl disabled:text-zinc-500 disabled:cursor-not-allowed transition-all duration-200 shrink-0 flex items-center gap-1.5"
                        >
                            {isValidatingVoucher && (
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                            )}
                            <span>Áp dụng</span>
                        </button>
                    </div>

                    {errorMsg && (
                        <p className="text-red-400 text-xs bg-red-950/20 border border-red-900/40 px-3 py-2 rounded-lg">
                            {errorMsg}
                        </p>
                    )}

                    {discount > 0 && (
                        <div className="flex items-center justify-between text-emerald-400 text-xs bg-emerald-950/20 border border-emerald-900/40 px-3 py-2 rounded-lg">
                            <span>Đã áp dụng giảm giá</span>
                            <span className="font-bold">-{discount.toLocaleString("vi-VN")} ₫</span>
                        </div>
                    )}
                </div>

                {/* Section 3: Phương thức thanh toán */}
                <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                    <span className="text-xs font-bold text-white block">
                        Phương Thức Thanh Toán
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {paymentOptions.map((opt) => {
                            const isSelected = paymentMethod === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(opt.id)}
                                    className={`relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? "border-violet-500 bg-violet-950/30 ring-1 ring-violet-500/50 shadow-md"
                                            : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                                    }`}
                                >
                                    {opt.badge && (
                                        <span className="absolute top-2.5 right-2.5 text-[9px] font-bold text-violet-300 bg-violet-600/30 px-1.5 py-0.5 rounded-full border border-violet-500/30">
                                            {opt.badge}
                                        </span>
                                    )}
                                    <span className="font-bold text-xs text-white mb-0.5">
                                        {opt.label}
                                    </span>
                                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                                        {opt.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section 4: Chi tiết giá */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-2 text-xs">
                    {seatTotalPrice > 0 && (
                        <div className="flex justify-between items-center text-zinc-400">
                            <span>Vé xem phim ({selectedSeats.length} ghế)</span>
                            <span className="font-semibold text-zinc-200">
                                {seatTotalPrice.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    )}

                    {comboTotalPrice > 0 && (
                        <div className="flex justify-between items-center text-zinc-400">
                            <span>Bắp & nước ({selectedCombos.length} món)</span>
                            <span className="font-semibold text-zinc-200">
                                {comboTotalPrice.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    )}

                    {discount > 0 && (
                        <div className="flex justify-between items-center text-emerald-400">
                            <span>Giảm giá voucher</span>
                            <span className="font-semibold">
                                -{discount.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    )}

                    <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                        <div>
                            <span className="text-sm font-bold text-white block">Tổng thanh toán</span>
                            <span className="text-[11px] text-zinc-500">Đã bao gồm thuế GTGT</span>
                        </div>
                        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                            {finalPrice.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Payment Button */}
            <div className="mt-6 space-y-2">
                <button
                    type="button"
                    disabled={isBooking || (!phone && !email)}
                    onClick={() => handleCreateBooking()}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                        isBooking || (!phone && !email)
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    }`}
                >
                    {isBooking && (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                    )}
                    <span>Thanh toán với {paymentMethod}</span>
                </button>

                <p className="text-center text-[11px] text-zinc-500">
                    Bảo mật chuẩn mã hóa thanh toán quốc tế 256-bit SSL
                </p>
            </div>
        </div>
    );
}
