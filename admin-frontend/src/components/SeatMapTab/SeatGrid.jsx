import React from "react";
import {Typography} from "@mui/material";

export default function SeatGrid({ seats, handleSeatClick }) {
    const cols = seats[0]?.length || 0;

    const getRowLabel = (index) =>
        String.fromCharCode("A".charCodeAt(0) + index);

    const getSeatClass = (seat) => {
        switch (seat.type) {
            case "NORMAL":
                return "bg-gray-300";
            case "COUPLE":
                return "bg-pink-400";
            case "EMPTY":
                return "bg-transparent border border-gray-300";
            default:
                return "bg-gray-200";
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex-1 overflow-auto">
            {seats.length > 0 ? (
                <>
                    {/* SCREEN */}
                    <div className="text-center mb-4">
                        <div className="mx-auto w-1/2 border-b-4 border-gray-400" />
                        <Typography variant="caption" className="text-gray-600">
                            SCREEN
                        </Typography>
                    </div>

                    {/* Ghế + nhãn hàng */}
                    <div className="grid gap-1">
                        {seats.map((row, r) => (
                            <div
                                key={`row-${r}`}
                                className="grid gap-1"
                                style={{
                                    gridTemplateColumns: `40px repeat(${cols}, minmax(0,1fr))`,
                                }}
                            >
                                {/* Row label */}
                                <div className="flex items-center justify-center text-xs font-bold text-black">
                                    {getRowLabel(r)}
                                </div>

                                {/* Seats */}
                                {row.map((seat, c) => (
                                    <div
                                        key={`${r}-${c}`}
                                        onClick={() => handleSeatClick(r, c)}
                                        className={`w-8 h-8 rounded cursor-pointer border flex justify-center items-center 
                                        ${getSeatClass(
                                            seat
                                        )}`}
                                    >
                                        <p className="text-[0.8vw] font-semibold">{seat?.label}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <Typography variant="body2" className="text-gray-600 text-center">
                        Hiện chưa có sơ đồ ghế. Vui lòng nhấn vào{" "}
                        <span className="font-semibold">"Chỉnh sửa sơ đồ ghế"</span> để tạo mới.
                    </Typography>
                </div>
            )}
        </div>
    );

}

