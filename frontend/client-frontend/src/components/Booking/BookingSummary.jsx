import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCouch,
    faUtensils,
    faArrowRight,
    faArrowLeft,
    faPlus,
    faMinus,
    faTimes,
    faPen,
} from "@fortawesome/free-solid-svg-icons";

export default function BookingSummary({
    step = "seat", // "seat" | "fnb"
    selectedSeats = [],
    selectedCombos = [],
    setSelectedCombos,
    seatGroups = [],
    onContinue,
    onBack,
    onSkipFnb,
}) {
    const updateComboQuantity = (id, delta) => {
        if (!setSelectedCombos) return;
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
        if (!setSelectedCombos) return;
        setSelectedCombos((prev) => prev.filter((c) => c.id !== id));
    };

    const groups = Array.isArray(seatGroups) ? seatGroups : Object.values(seatGroups || {});

    const seatTotalPrice = groups.reduce(
        (sum, g) => sum + (g.price || 0) * (g.seats?.length || 0),
        0
    );

    const comboTotalPrice = selectedCombos.reduce(
        (sum, combo) => sum + (combo.price || 0) * (combo.quantity || 0),
        0
    );

    const grandTotal = seatTotalPrice + comboTotalPrice;
    const totalComboCount = selectedCombos.reduce((sum, c) => sum + (c.quantity || 0), 0);

    return (
        <div className={`w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-hidden ${
            step === "fnb" ? "h-[560px] lg:h-[600px]" : "sticky top-20"
        }`}>
            {/* Top & Scrollable Body Section */}
            <div className="flex-1 min-h-0 flex flex-col space-y-3.5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-white tracking-wide">
                            Tóm Tắt Đặt Vé
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            {step === "seat"
                                ? selectedSeats.length > 0
                                    ? `Đã chọn ${selectedSeats.length} ghế ngồi`
                                    : "Vui lòng chọn ghế trên sơ đồ"
                                : `Bước 2/3: Đã chọn ${totalComboCount} phần bắp nước`}
                        </p>
                    </div>

                    {selectedSeats.length > 0 && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                            {selectedSeats.length} ghế
                        </span>
                    )}
                </div>

                {/* ================= STEP 1: SEAT SELECTION SUMMARY ================= */}
                {step === "seat" && (
                    <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                        {/* Selected Seats Badges */}
                        <div className="space-y-2">
                            <span className="text-zinc-400 font-medium text-xs block">
                                Ghế đã chọn
                            </span>
                            <div className="min-h-[44px] bg-zinc-950/70 p-3 rounded-2xl border border-zinc-800/80 flex flex-wrap gap-1.5 items-center">
                                {selectedSeats.length > 0 ? (
                                    selectedSeats.map((s) => (
                                        <span
                                            key={s.id}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-200 border border-violet-500/30 text-xs font-semibold shadow-xs"
                                        >
                                            {s.label}
                                            <span className="text-[10px] text-zinc-400 font-normal">
                                                ({s.type})
                                            </span>
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-zinc-500 text-xs italic">
                                        Nhấp chọn ghế trên sơ đồ để bắt đầu
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Seat Groups Breakdown Table */}
                        {groups.length > 0 && (
                            <div className="bg-zinc-950/70 rounded-2xl border border-zinc-800/80 overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="text-zinc-400 bg-zinc-900/60 border-b border-zinc-800/80 text-left">
                                            <th className="py-2.5 px-3 font-medium">Loại ghế</th>
                                            <th className="py-2.5 px-3 text-center font-medium">SL</th>
                                            <th className="py-2.5 px-3 text-right font-medium">Đơn giá</th>
                                            <th className="py-2.5 px-3 text-right font-medium">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        {groups.map((g, idx) => (
                                            <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                                                <td className="py-2.5 px-3 font-semibold text-zinc-200">
                                                    {g.seatType}
                                                </td>
                                                <td className="py-2.5 px-3 text-center text-zinc-300 font-medium">
                                                    {g.seats.length}
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-zinc-400">
                                                    {(g.price || 0).toLocaleString("vi-VN")} ₫
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-violet-400 font-semibold">
                                                    {((g.price || 0) * g.seats.length).toLocaleString("vi-VN")} ₫
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Single Seat Gap Reminder */}
                        <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/60 text-[11px] text-zinc-400 leading-relaxed">
                            💡 Bước tiếp theo bạn sẽ chọn thêm bắp rang và nước ngọt với giá ưu đãi đặc quyền trước khi thanh toán.
                        </div>
                    </div>
                )}

                {/* ================= STEP 2: F&B SELECTION SUMMARY ================= */}
                {step === "fnb" && (
                    <>
                        {/* Compact Seats Summary Card (Fixed shrink-0) */}
                        <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between gap-3 text-xs shrink-0">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center text-xs shrink-0">
                                    <FontAwesomeIcon icon={faCouch} />
                                </span>
                                <div className="min-w-0">
                                    <p className="font-bold text-white truncate">
                                        {selectedSeats.length} Ghế:{" "}
                                        <span className="text-violet-300 font-semibold">
                                            {selectedSeats.map((s) => s.label).join(", ")}
                                        </span>
                                    </p>
                                    <p className="text-[11px] text-zinc-400">
                                        {seatTotalPrice.toLocaleString("vi-VN")} ₫
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Selected Combos List - Flex-1 Scroller that NEVER pushes the bottom out */}
                        <div className="flex-1 min-h-0 flex flex-col space-y-2">
                            <div className="flex items-center justify-between text-xs shrink-0">
                                <span className="text-zinc-400 font-medium">Bắp Nước Đã Chọn</span>
                                <span className="text-violet-400 font-bold">{totalComboCount} món</span>
                            </div>

                            {selectedCombos.length > 0 ? (
                                <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-zinc-700/50">
                                    {selectedCombos.map((combo) => (
                                        <div
                                            key={combo.id}
                                            className="relative bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/80 flex items-center justify-between gap-2.5 text-xs"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-zinc-200 truncate pr-5">
                                                    {combo.name}
                                                </p>
                                                <p className="text-[11px] text-violet-400 font-bold mt-0.5">
                                                    {((combo.price || 0) * (combo.quantity || 1)).toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    ₫
                                                </p>
                                            </div>

                                            {/* Quantity Adjuster */}
                                            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => updateComboQuantity(combo.id, -1)}
                                                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 text-[9px] cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                                <span className="w-4 text-center text-xs font-bold text-white">
                                                    {combo.quantity || 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateComboQuantity(combo.id, 1)}
                                                    className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 text-[9px] cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCombo(combo.id)}
                                                className="text-zinc-500 hover:text-red-400 p-1 text-xs cursor-pointer"
                                                title="Xóa"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-center text-zinc-500 text-xs italic">
                                    Chưa chọn combo bắp nước nào. Vui lòng chọn ở danh sách bên trái.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Bottom Section: Subtotals & Grand Total + Main CTA Button (Pinned at bottom, shrink-0) */}
            <div className="shrink-0 pt-3 border-t border-zinc-800/80 space-y-2.5 mt-2">
                {seatTotalPrice > 0 && (
                    <div className="flex justify-between items-center text-zinc-400 text-xs">
                        <span>Tiền vé ({selectedSeats.length} ghế)</span>
                        <span className="font-semibold text-zinc-200">
                            {seatTotalPrice.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>
                )}

                {step === "fnb" && comboTotalPrice > 0 && (
                    <div className="flex justify-between items-center text-zinc-400 text-xs">
                        <span>Bắp & nước ({totalComboCount} món)</span>
                        <span className="font-semibold text-zinc-200">
                            {comboTotalPrice.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>
                )}

                <div className="pt-2.5 border-t border-zinc-800 flex justify-between items-baseline">
                    <div>
                        <span className="text-sm font-bold text-white block">Tổng thanh toán</span>
                        <span className="text-[10px] text-zinc-500">Đã bao gồm thuế GTGT</span>
                    </div>
                    <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                        {(step === "seat" ? seatTotalPrice : grandTotal).toLocaleString("vi-VN")} ₫
                    </span>
                </div>

                {/* Only Main CTA Button */}
                <div className="pt-1">
                    {step === "seat" ? (
                        <button
                            type="button"
                            disabled={selectedSeats.length === 0}
                            onClick={onContinue}
                            className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                                selectedSeats.length === 0
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                                    : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-[0.99]"
                            }`}
                        >
                            <span>Tiếp tục: Chọn bắp nước</span>
                            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onContinue}
                            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <span>Tiếp tục: Thanh toán</span>
                            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
