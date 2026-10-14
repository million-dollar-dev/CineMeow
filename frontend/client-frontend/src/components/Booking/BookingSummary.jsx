import React from "react";

export default function BookingSummary({
    selectedSeats = [],
    selectedCombos = [],
    setOpenPopup,
    setSelectedCombos,
    seatGroups = [],
    onContinue,
}) {
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

    return (
        <div className="w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between sticky top-28">
            <div className="space-y-6">
                {/* Header (Clean typography, no redundant icon) */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                    <div>
                        <h2 className="text-base font-bold text-white tracking-wide">
                            Tóm Tắt Đặt Vé
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            {selectedSeats.length > 0
                                ? `Đã chọn ${selectedSeats.length} ghế ngồi`
                                : "Vui lòng chọn ghế trên sơ đồ"}
                        </p>
                    </div>
                    {selectedSeats.length > 0 && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                            {selectedSeats.length} ghế
                        </span>
                    )}
                </div>

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

                {/* Combo Section */}
                <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-medium">
                            Combo Bắp & Nước
                        </span>
                        {selectedCombos.length > 0 && (
                            <span className="text-violet-400 font-semibold">
                                {selectedCombos.length} món
                            </span>
                        )}
                    </div>

                    {selectedCombos.length > 0 && (
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                            {selectedCombos.map((combo) => (
                                <div
                                    key={combo.id}
                                    className="relative bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 hover:border-violet-500/40 transition-all flex items-center justify-between gap-3 text-xs"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        {combo.imageUrl && (
                                            <img
                                                src={combo.imageUrl}
                                                alt={combo.name}
                                                className="w-11 h-11 rounded-lg object-cover border border-zinc-800 shrink-0"
                                            />
                                        )}
                                        <div className="min-w-0 flex-1 pr-6">
                                            <p className="font-semibold text-zinc-100 truncate">
                                                {combo.name}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                                                {combo.description || "Combo bắp nước"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateComboQuantity(combo.id, -1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-all active:scale-95 text-xs font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="text-xs font-bold text-white px-1">
                                                    {combo.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateComboQuantity(combo.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white rounded-md transition-all active:scale-95 text-xs font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-violet-400 text-xs">
                                            {((combo.price || 0) * (combo.quantity || 1)).toLocaleString("vi-VN")} ₫
                                        </p>
                                        <p className="text-[10px] text-zinc-500">
                                            {(combo.price || 0).toLocaleString("vi-VN")} ₫/phần
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCombo(combo.id)}
                                        className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-red-400 transition-colors p-1 text-xs"
                                        title="Xóa combo"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setOpenPopup(true)}
                        className="w-full py-2.5 px-4 rounded-xl border border-dashed border-zinc-750 hover:border-violet-500/60 bg-zinc-950/40 hover:bg-violet-950/20 text-zinc-300 hover:text-violet-300 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                    >
                        <span>+ {selectedCombos.length > 0 ? "Chọn thêm combo bắp nước" : "Thêm combo bắp nước"}</span>
                    </button>
                </div>

                {/* Subtotals & Grand Total */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-2.5 text-xs">
                    {seatTotalPrice > 0 && (
                        <div className="flex justify-between items-center text-zinc-400">
                            <span>Tiền vé ({selectedSeats.length} ghế)</span>
                            <span className="font-semibold text-zinc-200">
                                {seatTotalPrice.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    )}

                    {comboTotalPrice > 0 && (
                        <div className="flex justify-between items-center text-zinc-400">
                            <span>Bắp & nước ({selectedCombos.reduce((acc, c) => acc + (c.quantity || 1), 0)} phần)</span>
                            <span className="font-semibold text-zinc-200">
                                {comboTotalPrice.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    )}

                    <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                        <div>
                            <span className="text-sm font-bold text-white block">Tổng thanh toán</span>
                            <span className="text-[11px] text-zinc-500">Đã bao gồm thuế GTGT</span>
                        </div>
                        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                            {grandTotal.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={onContinue}
                className={`mt-6 w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedSeats.length === 0
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-[0.99]"
                }`}
            >
                <span>Tiếp tục thanh toán →</span>
            </button>
        </div>
    );
}
