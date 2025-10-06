import React, { useMemo } from "react";

const SeatSelection = ({ seats = [], selectedSeats = [], onToggleSeat }) => {
    const groupedSeats = useMemo(() => {
        const rows = {};
        if (!Array.isArray(seats)) return rows;
        seats.forEach((seat) => {
            if (!rows[seat.rowIndex]) rows[seat.rowIndex] = [];
            rows[seat.rowIndex].push(seat);
        });
        return rows;
    }, [seats]);

    const getSeatStyle = (seat) => {
        if (seat.type === "EMPTY") return "invisible";
        if (seat.status !== "ACTIVE")
            return "bg-gray-700 cursor-not-allowed text-gray-500";
        if (selectedSeats.includes(seat.id))
            return "bg-gradient-to-br from-[#7f5af0] to-[#9f7bff] text-white shadow-[0_0_10px_rgba(127,90,240,0.6)] scale-105";
        if (seat.type === "COUPLE")
            return "bg-[#1f1f1f] border-1 border-lime hover:scale-105 transition-all duration-200";
        return "bg-[#1f1f1f] border border-gray-600 hover:bg-[#2b2b2b] text-gray-300 hover:text-white transition-all duration-200 hover:scale-105";
    };

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (!seats || seats.length === 0) {
        return (
            <div className="text-gray-400 text-center py-8">
                Đang tải sơ đồ ghế...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center my-[2vw] text-white">
            {/* Màn hình */}
            <div className="relative w-full max-w-4xl mb-[2vw]">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[80%] h-[1vw] bg-gradient-to-b from-[#7f5af0]/80 to-transparent rounded-t-full blur-[2px]"></div>
                <p className="text-center text-gray-300 text-[0.9vw] mt-[1.5vw] tracking-wide">
                    MÀN HÌNH
                </p>
            </div>

            {/* Ghế */}
            <div className="relative">
                <div className="flex flex-col gap-[0.8vw]">
                    {Object.keys(groupedSeats)
                        .sort((a, b) => a - b)
                        .map((rowIndex) => (
                            <div key={rowIndex} className="flex items-center justify-center">
                                {/* Chữ hàng */}
                                <p className="text-gray-400 w-[2vw] text-center mr-[0.5vw] text-[0.8vw] font-medium">
                                    {alphabet[rowIndex] || "?"}
                                </p>

                                {/* Các ghế trong hàng */}
                                <div className="flex gap-[0.6vw] justify-center">
                                    {groupedSeats[rowIndex]
                                        .sort((a, b) => a.colIndex - b.colIndex)
                                        .map((seat) => (
                                            <button
                                                key={seat.id}
                                                onClick={() => onToggleSeat(seat)}
                                                className={`w-[2.5vw] h-[2.5vw] rounded-md flex items-center justify-center text-[0.8vw] font-semibold ${getSeatStyle(
                                                    seat
                                                )}`}
                                            >
                                                {seat.type !== "EMPTY" ? seat.colIndex + 1 : ""}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Ghi chú */}
            <div className="mt-[2vw] flex gap-[2vw] text-[0.9vw] text-gray-300">
                <div className="flex items-center gap-2">
                    <div className="w-[1vw] h-[1vw] bg-[#1f1f1f] border border-gray-600 rounded-sm"></div>
                    Trống
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-[1vw] h-[1vw] bg-gradient-to-br from-[#7f5af0] to-[#9f7bff] rounded-sm shadow-[0_0_8px_rgba(127,90,240,0.6)]"></div>
                    Đang chọn
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-[1vw] h-[1vw] bg-[#1f1f1f] border-1 border-lime rounded-sm"></div>
                    Ghế đôi (Couple)
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-[1vw] h-[1vw] bg-gray-700 rounded-sm"></div>
                    Đã đặt
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
