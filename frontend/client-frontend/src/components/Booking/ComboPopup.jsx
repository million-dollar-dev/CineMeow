import React, { useState, useEffect, useMemo } from "react";

export default function ComboPopup({
    open,
    onClose,
    combos = [],
    onConfirm,
    selectedCombos = [],
}) {
    const [localCombos, setLocalCombos] = useState([]);

    useEffect(() => {
        if (open) {
            const mapped = combos.map((c) => {
                const existing = selectedCombos.find((sc) => sc.id === c.id);
                return {
                    ...c,
                    quantity: existing ? existing.quantity : 0,
                };
            });
            setLocalCombos(mapped);
        }
    }, [open, combos, selectedCombos]);

    const updateQuantity = (id, delta) => {
        setLocalCombos((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = Math.max(0, (item.quantity || 0) + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const totalComboPrice = useMemo(() => {
        return localCombos.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    }, [localCombos]);

    const totalQuantity = useMemo(() => {
        return localCombos.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }, [localCombos]);

    const handleConfirm = () => {
        const confirmed = localCombos.filter((item) => (item.quantity || 0) > 0);
        onConfirm(confirmed);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Subtle top ambient glow */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 bg-zinc-900/40">
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-wide">
                            Combo Bắp & Nước Uống
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Chọn combo ưu đãi để nhận trực tiếp tại quầy bắp nước
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm"
                        title="Đóng"
                    >
                        ✕
                    </button>
                </div>

                {/* Combos Scroll List */}
                <div className="p-6 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-800">
                    {combos.length === 0 ? (
                        <div className="py-12 text-center text-zinc-400 text-sm">
                            Hiện không có combo bắp nước khả dụng cho rạp này.
                        </div>
                    ) : (
                        localCombos.map((combo) => {
                            const qty = combo.quantity || 0;
                            const isSelected = qty > 0;

                            return (
                                <div
                                    key={combo.id}
                                    className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                                        isSelected
                                            ? "border-violet-500/70 bg-violet-950/20 shadow-md shadow-violet-950/20"
                                            : "border-zinc-850 bg-zinc-900/40 hover:border-zinc-750 hover:bg-zinc-900/70"
                                    }`}
                                >
                                    {/* Image & Info */}
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <img
                                            src={
                                                combo.imageUrl ||
                                                "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=200&q=80"
                                            }
                                            alt={combo.name}
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-zinc-800"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                                                {combo.name}
                                            </h3>
                                            <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                                                {combo.description || "Combo bắp nước chuẩn rạp"}
                                            </p>
                                            <p className="text-sm font-bold text-violet-400 mt-1.5">
                                                {(combo.price || 0).toLocaleString("vi-VN")} ₫
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stepper / Action Button */}
                                    <div className="shrink-0">
                                        {qty === 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(combo.id, 1)}
                                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-violet-600 text-zinc-200 hover:text-white border border-zinc-800 hover:border-violet-500 transition-all cursor-pointer active:scale-95"
                                            >
                                                + Chọn
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-zinc-900 border border-violet-500/50 px-2 py-1 rounded-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(combo.id, -1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition cursor-pointer active:scale-90 text-sm font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="w-6 text-center font-bold text-white text-sm">
                                                    {qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(combo.id, 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition cursor-pointer active:scale-90 text-sm font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-zinc-400">Đã chọn ({totalQuantity} phần)</p>
                        <p className="text-base font-bold text-violet-400">
                            {totalComboPrice.toLocaleString("vi-VN")} ₫
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-850 transition cursor-pointer"
                        >
                            Để sau
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 transition cursor-pointer active:scale-95"
                        >
                            Xác Nhận Combo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
