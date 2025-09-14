import React from "react";

export default function Legend() {
    return (
        <div className="flex justify-around mb-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded" /> Ghế thường
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-400 rounded" /> Ghế couple
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded" /> Ghế VIP
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-transparent border border-gray-400" /> Chỗ trống
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" /> Bảo trì
            </div>
        </div>
    );
}
