import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChair, faXmark, faTicket } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function BookingSummary({
                                           selectedSeats = [],
                                           selectedCombos = [],
                                           setOpenPopup,
                                           setSelectedCombos,
                                       }) {
    const seatPrice = 45000;
    const [discountCode, setDiscountCode] = useState("");
    const [discountValue, setDiscountValue] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");

    const comboTotal = selectedCombos.reduce(
        (sum, combo) => sum + (combo.price || 0) * (combo.quantity || 0),
        0
    );

    const subtotal = selectedSeats.length * seatPrice + comboTotal;
    const totalPrice = Math.max(subtotal - discountValue, 0);

    const validCodes = {
        GIAM10: 0.1, // giảm 10%
        GIAM20: 0.2, // giảm 20%
        BAPNUOC: 30000, // giảm cố định 30k
    };

    const handleApplyDiscount = () => {
        const code = discountCode.trim().toUpperCase();
        if (validCodes[code]) {
            const value =
                validCodes[code] < 1 ? subtotal * validCodes[code] : validCodes[code];
            setDiscountValue(value);
            setErrorMsg("");
        } else {
            setDiscountValue(0);
            setErrorMsg("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
        }
    };

    const updateComboQuantity = (id, delta) => {
        setSelectedCombos((prev) =>
            prev
                .map((c) =>
                    c.id === id
                        ? { ...c, quantity: Math.max(0, (c.quantity || 1) + delta) }
                        : c
                )
                .filter((c) => c.quantity > 0)
        );
    };

    const handleRemoveCombo = (id) => {
        setSelectedCombos((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <div className="lg:w-2/5 w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl p-[1.8vw] flex flex-col justify-between shadow-[0_0_25px_rgba(127,90,240,0.08)]">
            <div className="space-y-6">
                {/* 🪑 Tiêu đề */}
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faChair} className="text-[#9f7bff]" />
                    <h2 className="text-[1.2vw] font-semibold text-[#f1f1f1]">
                        Ghế bạn đã chọn
                    </h2>
                </div>

                {/* 💺 Danh sách ghế */}
                <div className="flex flex-wrap gap-[0.6vw] min-h-[3vw] bg-[#202020] p-[0.8vw] rounded-xl border border-[#2a2a2a]">
                    {selectedSeats.length > 0 ? (
                        selectedSeats.map((s) => (
                            <div
                                key={s}
                                className="flex items-center justify-center bg-gradient-to-br from-[#7f5af0] to-[#9f7bff] text-white px-[0.8vw] py-[0.3vw] rounded-md text-[0.85vw] font-semibold shadow-[0_0_10px_rgba(127,90,240,0.4)]"
                            >
                                {s.label}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-[0.9vw] italic">
                            Chưa chọn ghế nào.
                        </p>
                    )}
                </div>

                {/* 🍿 Combo đã chọn */}
                <div className="space-y-2">
                    {selectedCombos.map((combo) => (
                        <div
                            key={combo.id}
                            className="relative bg-[#202020] p-[0.8vw] rounded-lg border border-[#2a2a2a] flex justify-between items-center text-[0.9vw] text-gray-200 hover:border-[#9f7bff] transition-all"
                        >
                            <div className="flex items-center gap-[0.8vw]">
                                <img
                                    src={combo.imageUrl}
                                    alt={combo.name}
                                    className="w-[3.2vw] h-[3.2vw] rounded-md object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-white">{combo.name}</p>
                                    <p className="text-gray-400 text-[0.8vw] line-clamp-2">
                                        {combo.description || "Không có mô tả"}
                                    </p>

                                    <div className="flex items-center gap-[0.5vw] mt-[0.4vw]">
                                        <button
                                            onClick={() => updateComboQuantity(combo.id, -1)}
                                            className="w-[1.8vw] h-[1.8vw] flex items-center justify-center bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-full text-[0.9vw] active:scale-90"
                                        >
                                            −
                                        </button>
                                        <span className="text-white font-semibold">
                      {combo.quantity}
                    </span>
                                        <button
                                            onClick={() => updateComboQuantity(combo.id, 1)}
                                            className="w-[1.8vw] h-[1.8vw] flex items-center justify-center bg-gradient-to-r from-[#7f5af0] to-[#9f7bff] hover:opacity-90 text-white rounded-full text-[0.9vw] active:scale-90"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-[#9f7bff]">
                                    {(combo.price * combo.quantity).toLocaleString("vi-VN")} ₫
                                </p>
                            </div>

                            <button
                                onClick={() => handleRemoveCombo(combo.id)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition-colors"
                                title="Xóa combo"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}

                    {/* ➕ Nút thêm combo */}
                    <button
                        className="w-full bg-[#2a2a2a] hover:bg-[#323232] text-white py-[0.8vw] rounded-xl text-[0.9vw] font-medium transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-[0.5vw] shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                        onClick={() => setOpenPopup(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Thêm combo bắp nước</span>
                    </button>
                </div>

                {/* 🎟️ Ô nhập mã giảm giá */}
                <div className="border-t border-[#2a2a2a] pt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faTicket} className="text-[#9f7bff]" />
                        <span className="text-white font-semibold text-[1vw]">
              Mã giảm giá
            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Nhập mã khuyến mãi..."
                            className="flex-1 bg-[#202020] border border-[#2a2a2a] rounded-lg p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#9f7bff]"
                        />
                        <button
                            onClick={handleApplyDiscount}
                            className="px-4 py-2 bg-gradient-to-r from-[#7f5af0] to-[#9f7bff] rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-all"
                        >
                            Áp dụng
                        </button>
                    </div>
                    {errorMsg && <p className="text-red-400 text-sm mt-1">{errorMsg}</p>}
                    {discountValue > 0 && (
                        <p className="text-green-400 text-sm mt-1">
                            Giảm {discountValue.toLocaleString("vi-VN")}đ
                        </p>
                    )}
                </div>

                {/* 💰 Tổng kết giá */}
                <div className="border-t border-[#333] pt-4 space-y-3 text-[1vw]">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Giá vé</span>
                        <span className="font-semibold text-[#f5f5f5]">
              {seatPrice.toLocaleString("vi-VN")}đ
            </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Số ghế</span>
                        <span className="font-semibold text-[#f5f5f5]">
              {selectedSeats.length}
            </span>
                    </div>
                    {selectedCombos.length > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Combo</span>
                            <span className="font-semibold text-[#f5f5f5]">
                {comboTotal.toLocaleString("vi-VN")}đ
              </span>
                        </div>
                    )}
                    {discountValue > 0 && (
                        <div className="flex justify-between text-green-400">
                            <span>Giảm giá</span>
                            <span>-{discountValue.toLocaleString("vi-VN")}đ</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-[1.1vw] pt-3 border-t border-[#2a2a2a]">
                        <span>Tổng cộng</span>
                        <span className="text-[#9f7bff]">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
                    </div>
                </div>
            </div>

            {/* 🔘 Nút thanh toán */}
            <button
                disabled={selectedSeats.length === 0}
                className={`mt-8 w-full py-[0.9vw] rounded-xl font-semibold text-[1vw] transition-all duration-300 ${
                    selectedSeats.length === 0
                        ? "bg-[#2a2a2a] text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#7f5af0] to-[#9f7bff] text-white hover:shadow-[0_0_20px_rgba(127,90,240,0.6)] active:scale-95"
                }`}
            >
                Tiếp tục thanh toán
            </button>
        </div>
    );
}
