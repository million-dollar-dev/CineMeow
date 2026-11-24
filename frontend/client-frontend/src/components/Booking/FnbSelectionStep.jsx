import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export default function FnbSelectionStep({
    fnbs = [],
    selectedCombos = [],
    onUpdateComboQuantity,
}) {
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    // Dynamic categorization based on item name and category
    const categories = [
        { id: "ALL", label: "Tất Cả" },
        { id: "COMBO", label: "Combo Tiết Kiệm" },
        { id: "POPCORN", label: "Bắp Rang Bơ" },
        { id: "DRINK", label: "Nước Uống & Khác" },
    ];

    const filteredFnbs = useMemo(() => {
        if (!Array.isArray(fnbs)) return [];
        if (selectedCategory === "ALL") return fnbs;
        if (selectedCategory === "COMBO") {
            return fnbs.filter(
                (item) =>
                    item.category === "COMBO" ||
                    (item.name && item.name.toLowerCase().includes("combo"))
            );
        }
        if (selectedCategory === "POPCORN") {
            return fnbs.filter(
                (item) =>
                    item.category === "POPCORN" ||
                    (item.name && item.name.toLowerCase().includes("bắp"))
            );
        }
        if (selectedCategory === "DRINK") {
            return fnbs.filter(
                (item) =>
                    item.category === "DRINK" ||
                    item.category === "SNACK" ||
                    (item.name &&
                        (item.name.toLowerCase().includes("nước") ||
                            item.name.toLowerCase().includes("coca") ||
                            item.name.toLowerCase().includes("snack")))
            );
        }
        return fnbs;
    }, [fnbs, selectedCategory]);

    const getQuantity = (id) => {
        const found = selectedCombos.find((c) => c.id === id);
        return found ? found.quantity || 0 : 0;
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 border-b border-zinc-800/60 shrink-0">
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                                isActive
                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/40"
                                    : "bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700"
                            }`}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* F&B Items Scrollable Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-3 pb-1 scrollbar-thin scrollbar-thumb-zinc-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredFnbs.map((item, idx) => {
                        const quantity = getQuantity(item.id);
                        const isSelected = quantity > 0;

                        return (
                            <div
                                key={item.id}
                                className={`group relative bg-zinc-950/70 backdrop-blur-xl rounded-2xl border p-3.5 transition-all duration-300 flex flex-col justify-between ${
                                    isSelected
                                        ? "border-violet-500/80 bg-gradient-to-br from-zinc-900/90 via-violet-950/20 to-zinc-900/90 shadow-[0_0_20px_rgba(139,92,246,0.18)] ring-1 ring-violet-500/40"
                                        : "border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/95 shadow-md"
                                }`}
                            >
                                {/* Top Badge: Highlight bestseller or discount */}
                                {idx === 0 && (
                                    <span className="absolute -top-2.5 right-4 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md">
                                        Bán Chạy Nhất
                                    </span>
                                )}

                                <div className="flex gap-3.5">
                                    {/* Product Image */}
                                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-bold">
                                                F&B
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                                                {item.description || "Combo bắp rang & nước ngọt chất lượng cao"}
                                            </p>
                                        </div>

                                        {/* Price & Quantity Controller */}
                                        <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
                                            <span className="text-xs sm:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-200">
                                                {(item.price || 0).toLocaleString("vi-VN")} ₫
                                            </span>

                                            {/* Counter */}
                                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 gap-1.5">
                                                <button
                                                    type="button"
                                                    disabled={quantity <= 0}
                                                    onClick={() => onUpdateComboQuantity(item, -1)}
                                                    className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-all ${
                                                        quantity > 0
                                                            ? "bg-zinc-800 text-zinc-200 hover:bg-violet-600 hover:text-white cursor-pointer active:scale-95"
                                                            : "text-zinc-600 cursor-not-allowed"
                                                    }`}
                                                    title="Giảm 1"
                                                >
                                                    <FontAwesomeIcon icon={faMinus} className="text-[8px]" />
                                                </button>

                                                <span
                                                    className={`text-xs font-bold w-4 text-center ${
                                                        quantity > 0 ? "text-violet-300 font-extrabold" : "text-zinc-500"
                                                    }`}
                                                >
                                                    {quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateComboQuantity(item, 1)}
                                                    className="w-5 h-5 rounded bg-zinc-800 text-zinc-200 hover:bg-violet-600 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
                                                    title="Thêm 1"
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="text-[8px]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty filter fallback */}
                {filteredFnbs.length === 0 && (
                    <div className="h-48 flex items-center justify-center rounded-2xl bg-zinc-950/40 border border-zinc-800/60 text-center text-zinc-400">
                        <p className="text-xs">Không tìm thấy món ăn nào trong danh mục này.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
