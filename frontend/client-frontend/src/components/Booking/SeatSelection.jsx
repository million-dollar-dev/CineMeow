import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheck, faLock, faArrowsLeftRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const SeatSelection = ({
    seats = [],
    selectedSeats = [],
    onToggleSeat,
    priceList = [],
    roomType = "_2D",
    violatedSeat = null
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

        const isViolated = violatedSeat && violatedSeat.id === seat.id;
        if (isViolated) {
            return "bg-rose-950/90 border-2 border-rose-500 text-rose-200 ring-4 ring-rose-500/50 animate-pulse font-extrabold shadow-[0_0_20px_rgba(244,63,94,0.8)] scale-110 z-20";
        }

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
            {/* Single-Seat Gap Warning Banner */}
            {violatedSeat && (
                <div className="w-full max-w-xl mx-auto mb-3 p-3 rounded-xl bg-rose-950/70 border border-rose-500/60 flex items-start sm:items-center gap-2.5 text-rose-200 text-xs animate-pulse shadow-lg shadow-rose-950/50">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/40 text-rose-400">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-xs" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-rose-300">Cảnh báo quy tắc chọn ghế (Single-Seat Gap):</p>
                        <p className="text-zinc-300 text-[11px] mt-0.5">
                            Không thể để trống 1 ghế đơn độc <span className="font-extrabold text-rose-400 bg-rose-900/60 px-1 py-0.5 rounded border border-rose-500/40">({violatedSeat.label})</span>. Vui lòng chọn ghế liền kề hoặc cách ít nhất 2 ghế.
                        </p>
                    </div>
                </div>
            )}

            {/* Luminous Curved Screen - Ultra Compact */}
            <div className="w-full max-w-xl mx-auto mb-3 sm:mb-4 text-center relative select-none">
                <div className="h-1.5 w-3/4 mx-auto bg-gradient-to-r from-violet-600/10 via-violet-500 to-violet-600/10 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
                <div className="h-6 w-full bg-gradient-to-b from-violet-500/15 via-violet-500/5 to-transparent blur-xs rounded-t-2xl -mt-0.5" />
                <div className="flex items-center justify-center gap-2 -mt-4">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400 font-bold">
                        MÀN HÌNH CHIẾU
                    </span>
                </div>
            </div>

            {/* Mobile Scroll Hint */}
            <div className="lg:hidden flex items-center gap-1.5 text-[11px] text-zinc-500 mb-2 self-center">
                <FontAwesomeIcon icon={faArrowsLeftRight} className="text-violet-400 text-xs" />
                <span>Kéo ngang để xem toàn bộ phòng chiếu</span>
            </div>

            {/* Responsive Seat Grid Canvas - Ultra Compact */}
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700/50 pb-2 sm:pb-3 flex justify-center">
                <div className="min-w-fit px-2 sm:px-4 flex flex-col gap-1.5 sm:gap-2">
                    {Object.keys(groupedSeats)
                        .sort((a, b) => a - b)
                        .map((rowIndex) => {
                            const rowLetter = alphabet[rowIndex] || "?";
                            const rowSeats = groupedSeats[rowIndex].sort((a, b) => a.colIndex - b.colIndex);

                            return (
                                <div key={rowIndex} className="flex items-center gap-1.5 sm:gap-2 justify-center">
                                    {/* Left Row Letter */}
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[10px] sm:text-xs text-zinc-400 bg-zinc-900/80 rounded border border-zinc-800/80 select-none">
                                        {rowLetter}
                                    </div>

                                    {/* Seats in Row */}
                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                        {rowSeats.map((seat) => {
                                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                                            const isCouple = seat.type === "COUPLE";
                                            const isViolated = violatedSeat && violatedSeat.id === seat.id;
                                            const isLeftCouple = isCouple && (seat.colIndex % 2 === 0);
                                            const isRightCouple = isCouple && (seat.colIndex % 2 === 1);

                                            return (
                                                <button
                                                    key={seat.id}
                                                    type="button"
                                                    onClick={() => onToggleSeat(seat)}
                                                    disabled={seat.type === "EMPTY" || seat.status !== "AVAILABLE"}
                                                    title={
                                                        isViolated
                                                            ? `${seat.label} - Cảnh báo: Không thể để trống 1 ghế đơn độc!`
                                                            : `${seat.label} - ${seat.type === "COUPLE" ? "Ghế Đôi Sweetbox" : seat.type === "VIP" ? "Ghế VIP" : "Ghế Thường"}`
                                                    }
                                                    className={`
                                                        ${isCouple ? "w-7 sm:w-8 md:w-8.5" : "w-6 sm:w-7 md:w-8"}
                                                        h-6 sm:h-7 md:h-8
                                                        text-[9px] sm:text-[10px] md:text-xs font-bold leading-none
                                                        flex items-center justify-center cursor-pointer transition-transform select-none
                                                        ${isLeftCouple ? "rounded-l-md rounded-r-none border-r-dashed border-r-rose-500/40 mr-[-4px] sm:mr-[-6px] z-10" : ""}
                                                        ${isRightCouple ? "rounded-r-md rounded-l-none border-l-0" : ""}
                                                        ${!isCouple ? "rounded-md" : ""}
                                                        ${getSeatClasses(seat)}
                                                    `}
                                                >
                                                    {seat.type !== "EMPTY" && (
                                                        <>
                                                            {isViolated ? (
                                                                 <span className="flex items-center gap-0.5 text-rose-300 font-extrabold animate-pulse">
                                                                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-[8px] text-rose-400" />
                                                                    <span>{seat.label}</span>
                                                                </span>
                                                            ) : isSelected ? (
                                                                <FontAwesomeIcon icon={faCheck} className="text-[10px] sm:text-xs" />
                                                            ) : seat.status !== "AVAILABLE" ? (
                                                                <FontAwesomeIcon icon={faLock} className="text-[9px] text-zinc-600" />
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
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[10px] sm:text-xs text-zinc-400 bg-zinc-900/80 rounded border border-zinc-800/80 select-none">
                                        {rowLetter}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Standardized Legend Bar - Clean, bug-free, perfectly aligned */}
            <div className="w-full pt-3 mt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 text-xs text-zinc-300">
                {/* Ghế Thường */}
                <div className="flex items-center gap-2 bg-zinc-900/80 px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm">
                    <div className="w-4 h-4 rounded bg-zinc-800 border border-zinc-700 shrink-0" />
                    <span>Thường <strong className="text-white font-semibold">({normalPrice})</strong></span>
                </div>

                {/* Ghế VIP */}
                <div className="flex items-center gap-2 bg-zinc-900/80 px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm">
                    <div className="w-4 h-4 rounded bg-amber-950/40 border border-amber-500/70 shrink-0" />
                    <span>VIP <strong className="text-amber-400 font-semibold">({vipPrice})</strong></span>
                </div>

                {/* Ghế Đôi */}
                <div className="flex items-center gap-2 bg-zinc-900/80 px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm">
                    <div className="flex items-center shrink-0">
                        <div className="w-3.5 h-4 rounded-l bg-rose-950/40 border border-rose-500/70 border-r-dashed border-r-rose-500/40 flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} className="text-[6px] text-rose-400" />
                        </div>
                        <div className="w-3.5 h-4 rounded-r bg-rose-950/40 border border-rose-500/70 border-l-0" />
                    </div>
                    <span>Ghế Đôi <strong className="text-rose-400 font-semibold">({couplePrice})</strong></span>
                </div>

                <div className="hidden sm:block w-px h-4 bg-zinc-800 shrink-0" />

                {/* Đang Chọn */}
                <div className="flex items-center gap-2 bg-zinc-900/80 px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 border border-violet-300 flex items-center justify-center text-white shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.6)]">
                        <FontAwesomeIcon icon={faCheck} className="text-[8px]" />
                    </div>
                    <span className="text-violet-300 font-semibold">Đang chọn</span>
                </div>

                {/* Đã Bán */}
                <div className="flex items-center gap-2 bg-zinc-900/80 px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm text-zinc-500">
                    <div className="w-4 h-4 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 opacity-50">
                        <FontAwesomeIcon icon={faLock} className="text-[8px] text-zinc-500" />
                    </div>
                    <span>Đã bán</span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
