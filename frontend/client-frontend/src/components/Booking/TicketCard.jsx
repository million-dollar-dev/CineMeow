import React from "react";
import { QRCodeSVG } from "qrcode.react";

/**
 * TicketCard - Cinema Ticket Component adhering to the Dark Cinema Design System.
 * - Perfectly aligned dual perforated cut-out notches (2 lỗ tròn) directly centered on the tear line
 * - Hides the horizontal border at cutouts using exact seam alignment and background matching
 * - Shows ONLY barcode preview & "Chờ thanh toán" during payment step (NO QR code)
 * - Shows high-contrast, offline-ready vector QR code via QRCodeSVG ONLY when payment is successful
 */
const TicketCard = ({
    booking,
    movie,
    showtime,
    selectedSeats = [],
    selectedCombos = [],
    totalPrice = 0,
    showQr = false,
    isPaid = false,
    bookingId = "CMW-98241",
    notchBg = "#07070B",
    className = "",
}) => {
    // Normalize data from either booking object or individual props
    const movieTitle = booking?.movieTitle || movie?.title || "Avatar: Dòng Chảy Của Nước";
    const posterUrl = booking?.posterPath || movie?.posterUrl;
    const cinemaName = booking?.cinemaName || showtime?.cinemaName || "CineMeow Royal City";
    const roomName = booking?.roomName || showtime?.roomName || "Phòng Chiếu 03";
    const roomType = (showtime?.roomType || booking?.roomType || "2D").replace("_", "");
    const startTime = booking?.startTime || showtime?.startTime || new Date().toISOString();

    const formattedDate = new Date(startTime).toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const formattedTime = new Date(startTime).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const seatLabels = (booking?.seats?.map((s) => s.seatLabel || s.label) || selectedSeats.map((s) => s.label)) || [];
    const combosList = booking?.fnbItems || selectedCombos || [];
    const finalAmount = booking?.totalPrice || totalPrice || 0;
    const ticketCode = booking?.id || bookingId;

    // High-contrast, scannable QR payload
    const qrData = `CINEMEOW_TICKET:${ticketCode}:${movieTitle}:${seatLabels.join(",")}:${startTime}`;

    return (
        <div className={`w-full max-w-4xl mx-auto ${className}`}>
            {/* Outer Ticket Container - overflow-visible allows notches to sit on top of the border seamlessly */}
            <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row overflow-visible">

                {/* Left Section: Ticket Body */}
                <div className="flex-1 p-5 sm:p-7 flex flex-col sm:flex-row gap-5 items-start">
                    {/* Movie Poster */}
                    {posterUrl ? (
                        <img
                            src={posterUrl}
                            alt={movieTitle}
                            className="w-28 sm:w-36 h-40 sm:h-52 object-cover rounded-2xl border border-zinc-800 shadow-lg shrink-0"
                        />
                    ) : (
                        <div className="w-28 sm:w-36 h-40 sm:h-52 rounded-2xl bg-zinc-850 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs shrink-0 font-medium">
                            No Poster
                        </div>
                    )}

                    {/* Movie & Showtime Details */}
                    <div className="flex-1 min-w-0 space-y-3.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                                CineMeow Ticket
                            </span>
                            <span className="text-xs font-mono text-zinc-400 font-semibold">
                                #{ticketCode}
                            </span>
                        </div>

                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide truncate">
                                {movieTitle}
                            </h2>
                            <p className="text-xs text-zinc-400 mt-1">
                                {cinemaName} • <span className="text-zinc-200 font-medium">{roomName} ({roomType})</span>
                            </p>
                        </div>

                        {/* Grid Information */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3 border-t border-zinc-800/80 text-xs">
                            <div>
                                <span className="text-zinc-500 block text-[11px]">Suất chiếu</span>
                                <span className="text-white font-semibold">{formattedTime} — {formattedDate}</span>
                            </div>

                            <div>
                                <span className="text-zinc-500 block text-[11px]">Ghế ({seatLabels.length})</span>
                                <span className="text-violet-400 font-bold tracking-wide">
                                    {seatLabels.length > 0 ? seatLabels.join(", ") : "Chưa chọn"}
                                </span>
                            </div>

                            {combosList.length > 0 && (
                                <div className="col-span-2">
                                    <span className="text-zinc-500 block text-[11px]">Bắp & Nước kèm theo</span>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {combosList.map((c, i) => (
                                            <span
                                                key={c.id || i}
                                                className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300"
                                            >
                                                {c.name} {c.quantity ? `x${c.quantity}` : ""}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="col-span-2 pt-2 border-t border-zinc-800/50 flex justify-between items-baseline">
                                <span className="text-zinc-400 text-xs">Tổng thanh toán:</span>
                                <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                                    {finalAmount.toLocaleString("vi-VN")} ₫
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Ticket Stub (Cuống vé) */}
                <div className="w-full md:w-64 p-5 sm:p-6 bg-zinc-950/80 border-t md:border-t-0 md:border-l border-dashed border-zinc-700/80 flex flex-col items-center justify-center text-center relative shrink-0">

                    {/* Top Notch - Centered precisely on dashed line (left: 0, top: 0) */}
                    <div
                        aria-hidden="true"
                        className="hidden md:block absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full z-20 border-b border-zinc-800"
                        style={{ backgroundColor: notchBg }}
                    />

                    {/* Bottom Notch - Centered precisely on dashed line (left: 0, bottom: 0) */}
                    <div
                        aria-hidden="true"
                        className="hidden md:block absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full z-20 border-t border-zinc-800"
                        style={{ backgroundColor: notchBg }}
                    />

                    {/* Status Badge */}
                    <div className="mb-3.5">
                        {isPaid || showQr ? (
                            <span className="whitespace-nowrap text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-700/60 px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                ✓ Đã Thanh Toán
                            </span>
                        ) : (
                            <span className="whitespace-nowrap text-[11px] font-bold text-amber-300 bg-amber-950/50 border border-amber-700/60 px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Chờ Thanh Toán
                            </span>
                        )}
                    </div>

                    {/* QR Code Section: ONLY WHEN PAID OR showQr IS TRUE */}
                    {isPaid || showQr ? (
                        <div className="space-y-3">
                            <div className="bg-white p-2.5 rounded-2xl shadow-xl inline-block border border-white/20">
                                <QRCodeSVG
                                    value={qrData}
                                    size={120}
                                    level="M"
                                    includeMargin={false}
                                />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white tracking-widest uppercase">
                                    Mã QR Check-in
                                </p>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                    Quét mã tại cửa phòng chiếu
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Barcode Preview Stub: WHEN IN PAYMENT STEP (NO QR CODE AT ALL) */
                        <div className="space-y-3 py-2 w-full max-w-[200px]">
                            {/* Stylized Barcode Graphic */}
                            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 inline-block w-full">
                                <div className="flex items-center justify-center gap-[3px] h-12 px-1">
                                    {[2, 4, 1, 3, 5, 2, 1, 4, 2, 3, 1, 5, 2, 4, 1, 3, 2, 4, 1, 3].map((w, i) => (
                                        <div
                                            key={i}
                                            className="bg-zinc-400 h-full rounded-xs"
                                            style={{ width: `${w * 1.5}px` }}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] font-mono text-zinc-500 mt-1.5 tracking-widest text-center">
                                    #{ticketCode}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-zinc-300">
                                    Cuống Vé Tạm Tính
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                    Mã QR sẽ mở sau khi thanh toán
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-zinc-850 w-full text-center">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">
                            CineMeow E-Pass
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
