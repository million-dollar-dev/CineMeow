import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheck, faLock, faArrowsLeftRight } from "@fortawesome/free-solid-svg-icons";

const SeatSelection = ({
    seats = [],
    selectedSeats = [],
    onToggleSeat,
    priceList = [],
    roomType = "_2D"
}) => {
    const groupedSeats = useMemo(() => {
        const rows = {};
        if (!Array.isArray(seats)) return rows;
        seats.forEach((seat) => {
            if (!rows[seat.rowIndex]) rows[seat.rowIndex] = [];
            rows[seat.rowIndex].push(seat);
        });
        return rows;
    }, [seats]);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Find price hints for legend
    const normalPrice = useMemo(() => {
        const item = priceList.find(p => p.seatType === "NORMAL" && p.roomType === roomType);
        return item?.price ? `${item.price.toLocaleString("vi-VN")}đ` : "75.000đ";
    }, [priceList, roomType]);

    const vipPrice = useMemo(() => {
        const item = priceList.find(p => p.seatType === "VIP" && p.roomType === roomType);
        return item?.price ? `${item.price.toLocaleString("vi-VN")}đ` : "95.000đ";
    }, [priceList, roomType]);

    const couplePrice = useMemo(() => {
        const item = priceList.find(p => p.seatType === "COUPLE" && p.roomType === roomType);
        return item?.price ? `${item.price.toLocaleString("vi-VN")}đ` : "160.000đ";
    }, [priceList, roomType]);

    const getSeatClasses = (seat) => {
        if (seat.type === "EMPTY") return "invisible pointer-events-none";

        const isSelected = selectedSeats.some((s) => s.id === seat.id);
        const isUnavailable = seat.status !== "AVAILABLE";

        if (isSelected) {
            return "bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white font-extrabold shadow-[0_0_15px_rgba(139,92,246,0.7)] border border-violet-300 scale-105 z-10 ring-2 ring-violet-400/40";
        }

        if (isUnavailable) {
            return "bg-zinc-900/90 border border-zinc-800/80 text-zinc-600 cursor-not-allowed opacity-35 select-none";
        }

        if (seat.type === "COUPLE") {
            return "bg-rose-950/30 border border-rose-500/60 text-rose-300 hover:border-rose-400 hover:bg-rose-900/40 hover:scale-105 transition-all shadow-sm";
        }

        if (seat.type === "VIP") {
            return "bg-amber-950/30 border border-amber-500/60 text-amber-300 hover:border-amber-400 hover:bg-amber-900/40 hover:scale-110 hover:shadow-amber-500/20 transition-all shadow-sm";
        }

        // NORMAL
        return "bg-zinc-800/80 border border-zinc-700/80 text-zinc-200 hover:border-violet-500 hover:text-white hover:bg-zinc-700 hover:scale-110 hover:shadow-md transition-all shadow-sm";
    };

    if (!seats || seats.length === 0) {
        return (
            <div className="text-zinc-400 text-center py-16 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Đang tải sơ đồ ghế phòng chiếu...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            {/* Luminous Curved Screen */}
            <div className="w-full max-w-2xl mx-auto mb-10 text-center relative select-none">
                <div className="h-2 w-4/5 mx-auto bg-gradient-to-r from-violet-600/10 via-violet-500 to-violet-600/10 rounded-full shadow-[0_0_25px_rgba(139,92,246,0.8)]" />
                <div className="h-14 w-full bg-gradient-to-b from-violet-500/15 via-violet-500/5 to-transparent blur-sm rounded-t-3xl -mt-1" />
                <div className="flex items-center justify-center gap-2 -mt-6">
                    <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
                        MÀN HÌNH CHIẾU
                    </span>
                </div>
            </div>

            {/* Mobile Scroll Hint */}
            <div className="lg:hidden flex items-center gap-1.5 text-xs text-zinc-500 mb-3 self-center">
                <FontAwesomeIcon icon={faArrowsLeftRight} className="text-violet-400" />
                <span>Kéo ngang để xem toàn bộ phòng chiếu</span>
            </div>

            {/* Responsive Seat Grid Canvas */}
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700/50 pb-6 flex justify-center">
                <div className="min-w-fit px-4 flex flex-col gap-2.5">
                    {Object.keys(groupedSeats)
                        .sort((a, b) => a - b)
                        .map((rowIndex) => {
                            const rowLetter = alphabet[rowIndex] || "?";
                            const rowSeats = groupedSeats[rowIndex].sort((a, b) => a.colIndex - b.colIndex);

                            return (
                                <div key={rowIndex} className="flex items-center gap-2 sm:gap-3 justify-center">
                                    {/* Left Row Letter */}
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-xs text-zinc-400 bg-zinc-900/80 rounded-md border border-zinc-800/80 select-none">
                                        {rowLetter}
                                    </div>

                                    {/* Seats in Row */}
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        {rowSeats.map((seat) => {
                                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                                            const isCouple = seat.type === "COUPLE";

                                            return (
                                                <button
                                                    key={seat.id}
                                                    type="button"
                                                    onClick={() => onToggleSeat(seat)}
                                                    disabled={seat.type === "EMPTY" || seat.status !== "AVAILABLE"}
                                                    title={`${seat.label} - ${seat.type === "COUPLE" ? "Ghế Đôi" : seat.type === "VIP" ? "Ghế VIP" : "Ghế Thường"}`}
                                                    className={`
                                                        ${isCouple ? "w-14 sm:w-16 md:w-20" : "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"}
                                                        h-7 sm:h-8 md:h-9 text-[10px] sm:text-xs font-bold rounded-lg
                                                        flex items-center justify-center cursor-pointer
                                                        ${getSeatClasses(seat)}
                                                    `}
                                                >
                                                    {seat.type !== "EMPTY" && (
                                                        <>
                                                            {isSelected ? (
                                                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                            ) : isCouple ? (
                                                                <span className="flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faHeart} className="text-[10px] text-rose-400" />
                                                                    <span>{seat.label}</span>
                                                                </span>
                                                            ) : seat.status !== "AVAILABLE" ? (
                                                                <FontAwesomeIcon icon={faLock} className="text-[10px] text-zinc-600" />
                                                            ) : (
                                                                <span>{seat.label}</span>
                                                            )}
                                                        </>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Right Row Letter */}
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-xs text-zinc-400 bg-zinc-900/80 rounded-md border border-zinc-800/80 select-none">
                                        {rowLetter}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Standardized Legend Bar */}
            <div className="w-full pt-6 mt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-zinc-300">
                {/* Ghế Thường */}
                <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800">
                    <div className="w-4 h-4 bg-zinc-800 border border-zinc-700 rounded-sm" />
                    <span>Ghế Thường ({normalPrice})</span>
                </div>

                {/* Ghế VIP */}
                <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800">
                    <div className="w-4 h-4 bg-amber-950/50 border border-amber-500 rounded-sm" />
                    <span>Ghế VIP ({vipPrice})</span>
                </div>

                {/* Ghế Đôi */}
                <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800">
                    <div className="w-6 h-4 bg-rose-950/50 border border-rose-500 rounded-sm flex items-center justify-center">
                        <FontAwesomeIcon icon={faHeart} className="text-[8px] text-rose-400" />
                    </div>
                    <span>Ghế Đôi ({couplePrice})</span>
                </div>

                {/* Đang chọn */}
                <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800">
                    <div className="w-4 h-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-sm shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                    <span className="text-violet-300 font-semibold">Đang Chọn</span>
                </div>

                {/* Đã đặt */}
                <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800">
                    <div className="w-4 h-4 bg-zinc-900 border border-zinc-800 rounded-sm opacity-40 flex items-center justify-center">
                        <FontAwesomeIcon icon={faLock} className="text-[8px] text-zinc-600" />
                    </div>
                    <span className="text-zinc-500">Đã Bán</span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
