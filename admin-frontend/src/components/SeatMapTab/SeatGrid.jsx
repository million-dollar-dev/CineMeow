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
            {/* SCREEN */}
            <div className="text-center mb-4">
                <div className="mx-auto w-1/2 border-b-4 border-gray-400" />
                <Typography variant="caption" className="text-gray-600">
                    SCREEN
                </Typography>
            </div>

            {/* Cột số */}
            <div
                className="grid mb-2"
                style={{
                    gridTemplateColumns: `40px repeat(${cols}, minmax(0,1fr))`,
                }}
            >
                <div />
                {Array.from({ length: cols }).map((_, c) => (
                    <div
                        key={`col-${c}`}
                        className="text-center text-xs font-bold text-black"
                    >
                        {c + 1}
                    </div>
                ))}
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
                                className={`w-8 h-8 rounded cursor-pointer border ${getSeatClass(
                                    seat
                                )}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

