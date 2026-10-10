import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import dayjs from "dayjs";

// Icons
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

// Components
import StatusChip from "../StatusChip.jsx";

// Constants
import {
    BOOKING_STATUSES,
    BOOKING_STATUS_CONFIG,
} from "../../constants/bookingConstants.js";

export default function QuickLookupModal({
    open,
    onClose,
    bookings,
    onSelectBooking,
    onCheckIn,
}) {
    const [query, setQuery] = useState("");

    const matchedBooking = React.useMemo(() => {
        if (!query.trim()) return null;
        const q = query.trim().toLowerCase();
        return bookings.find(
            (b) =>
                b.ticketCode.toLowerCase().includes(q) ||
                b.orderCode.toLowerCase().includes(q) ||
                b.customer.phone.includes(q)
        );
    }, [query, bookings]);

    const handleClear = () => {
        setQuery("");
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
                    overflow: "hidden",
                },
            }}
        >
            {/* Top Stripe Gradient */}
            <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500" />

            <DialogTitle
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #F1F5F9",
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-2xs">
                        <QrCodeScannerOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                            Tra Cứu Nhanh Mã Vé & Check-in
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Nhập Mã vé, Mã đơn hàng hoặc Số điện thoại người mua
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                >
                    <CloseOutlinedIcon sx={{ fontSize: 20 }} />
                </button>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }} className="space-y-4">
                {/* Search Bar Input */}
                <div className="relative">
                    <SearchOutlinedIcon
                        sx={{ fontSize: 20 }}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nhập mã vé (VD: TK-92019-MEOW), đơn (CM-ORD-88219), SĐT..."
                        className="w-full pl-11 pr-10 py-3 text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 focus:outline-none transition placeholder:text-slate-400 text-slate-900 shadow-2xs font-mono"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                    )}
                </div>

                {/* Quick suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                    <span className="font-semibold text-slate-400 text-[11px]">Gợi ý thử nhanh:</span>
                    <button
                        type="button"
                        onClick={() => setQuery("TK-92019-MEOW")}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-violet-50 hover:text-violet-700 font-mono text-[11px] font-bold text-slate-700 border border-slate-200 cursor-pointer transition"
                    >
                        TK-92019-MEOW
                    </button>
                    <button
                        type="button"
                        onClick={() => setQuery("TK-92018-MEOW")}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-violet-50 hover:text-violet-700 font-mono text-[11px] font-bold text-slate-700 border border-slate-200 cursor-pointer transition"
                    >
                        TK-92018-MEOW
                    </button>
                    <button
                        type="button"
                        onClick={() => setQuery("0908123456")}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-violet-50 hover:text-violet-700 font-mono text-[11px] font-bold text-slate-700 border border-slate-200 cursor-pointer transition"
                    >
                        0908123456
                    </button>
                </div>

                {/* Matched Ticket Card */}
                {matchedBooking ? (
                    <div className="p-4 rounded-2xl bg-white border border-violet-200 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 block">
                                    Tìm thấy đơn vé
                                </span>
                                <span className="font-mono text-base font-black text-slate-900">
                                    {matchedBooking.ticketCode}
                                </span>
                            </div>

                            <StatusChip status={matchedBooking.orderStatus} configs={BOOKING_STATUS_CONFIG} />
                        </div>

                        {/* Movie info snippet */}
                        <div className="flex items-center gap-3">
                            <img
                                src={matchedBooking.movie?.poster}
                                alt={matchedBooking.movie?.title}
                                className="w-14 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                                <h4 className="text-sm font-black text-slate-900 truncate">
                                    {matchedBooking.movie?.title}
                                </h4>
                                <div className="text-xs text-slate-500 font-medium truncate">
                                    {matchedBooking.cinema?.name} • {matchedBooking.cinema?.roomName}
                                </div>
                                <div className="text-xs text-slate-700 font-bold">
                                    {matchedBooking.showtime?.startTime} •{" "}
                                    {dayjs(matchedBooking.showtime?.date).format("DD/MM/YYYY")}
                                </div>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                    <span className="text-[11px] font-semibold text-slate-500">Ghế:</span>
                                    {matchedBooking.seats?.map((s, idx) => (
                                        <span
                                            key={idx}
                                            className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 font-mono font-bold text-[11px] border border-violet-100"
                                        >
                                            {s.code}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Customer snippet */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black text-[11px] flex items-center justify-center shadow-xs shrink-0">
                                    {matchedBooking.customer?.name
                                        ? matchedBooking.customer.name
                                              .split(" ")
                                              .filter(Boolean)
                                              .slice(-2)
                                              .map((w) => w[0])
                                              .join("")
                                              .toUpperCase()
                                        : "KH"}
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1.5 ring-white bg-emerald-500" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 leading-none">
                                        <span className="font-bold text-slate-900 truncate">
                                            {matchedBooking.customer?.name}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/60 px-1 py-0.2 rounded shrink-0">
                                            {matchedBooking.customer?.membershipCode || "MEM"}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-medium truncate mt-1 leading-tight">
                                        {matchedBooking.customer?.phone} • {matchedBooking.customer?.email}
                                    </div>
                                </div>
                            </div>
                            <span className="font-black text-violet-700 shrink-0 text-xs">
                                {(matchedBooking.totalAmount || 0).toLocaleString("vi-VN")} ₫
                            </span>
                        </div>
                    </div>
                ) : query.trim() ? (
                    <div className="py-8 text-center text-slate-400 space-y-1">
                        <ConfirmationNumberOutlinedIcon sx={{ fontSize: 36 }} className="text-slate-300" />
                        <p className="text-xs font-bold text-slate-600">
                            Không tìm thấy vé nào khớp với từ khóa "{query}"
                        </p>
                        <p className="text-[11px]">
                            Vui lòng kiểm tra lại mã vé hoặc số điện thoại của khách hàng.
                        </p>
                    </div>
                ) : null}
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2.5,
                    px: 3,
                    borderTop: "1px solid #F1F5F9",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "12px",
                        borderRadius: "12px",
                        borderColor: "#E2E8F0",
                        color: "#64748B",
                        "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                    }}
                >
                    Đóng
                </Button>

                {matchedBooking && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                onSelectBooking(matchedBooking);
                                onClose();
                            }}
                            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "12px",
                                borderRadius: "12px",
                                borderColor: "#E2E8F0",
                                color: "#475569",
                                "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                            }}
                        >
                            Xem chi tiết
                        </Button>

                        {matchedBooking.orderStatus === "PAID" && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    onCheckIn(matchedBooking);
                                    onClose();
                                }}
                                startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 800,
                                    fontSize: "12px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                                    boxShadow: "0 10px 20px -5px rgba(124, 58, 237, 0.3)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)",
                                    },
                                }}
                            >
                                In vé & Check-in ngay
                            </Button>
                        )}
                    </div>
                )}
            </DialogActions>
        </Dialog>
    );
}
