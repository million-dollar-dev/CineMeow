import React, { useState, useEffect } from "react";

export default function ComboPopup({ open, onClose, combos, onConfirm, selectedCombos = [] }) {
    const [localSelected, setLocalSelected] = useState([]);

    useEffect(() => {
        if (open) {
            setLocalSelected(selectedCombos);
        }
    }, [open, selectedCombos]);

    const handleSelectCombo = (combo) => {
        const exists = localSelected.find((c) => c.id === combo.id);
        if (exists) {
            setLocalSelected(localSelected.filter((c) => c.id !== combo.id));
        } else {
            setLocalSelected([...localSelected, { ...combo, quantity: 1 }]);
        }
    };

    const handleConfirm = () => {
        onConfirm(localSelected);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-[#1b1b1b] rounded-2xl p-6 w-[40vw] border border-[#2a2a2a] shadow-xl">
                <h2 className="text-xl font-bold text-[#9f7bff] mb-4 text-center">
                    🎬 Chọn combo bắp nước
                </h2>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                    {combos.map((combo) => {
                        const isSelected = localSelected.some((c) => c.id === combo.id);
                        return (
                            <div
                                key={combo.id}
                                onClick={() => handleSelectCombo(combo)}
                                className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                    isSelected
                                        ? "border-[#9f7bff] bg-[#282038]"
                                        : "border-[#2a2a2a] hover:border-[#444]"
                                }`}
                            >
                                <img
                                    src={combo.imageUrl}
                                    alt={combo.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-white">{combo.name}</p>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {combo.description}
                                    </p>
                                    <p className="text-[#9f7bff] font-semibold mt-1">
                                        {combo.price.toLocaleString("vi-VN")} ₫
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg bg-[#9f7bff] hover:bg-[#7f5af0] text-white font-semibold transition"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}

