import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faClock,
    faTicket,
    faFilm,
    faQrcode,
    faMagnifyingGlass,
    faXmark,
    faArrowRight,
    faLocationDot,
    faCouch,
    faRotateLeft,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import OverlayLoading from "../Booking/OverlayLoading.jsx";
import PopupTicketDetail from "./PopupTicketDetail.jsx";

export default function BookingHistory({ history = [], isLoading }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all"); // "all" | "upcoming" | "past"
    const [searchQuery, setSearchQuery] = useState("");

    // Categorize tickets into upcoming and past
    const now = useMemo(() => new Date(), []);

    const filteredTickets = useMemo(() => {
        if (!Array.isArray(history)) return [];

        return history.filter((ticket) => {
            const ticketTime = new Date(ticket.startTime);
            const isUpcoming = ticketTime >= now;

            // Filter by status tab
            if (statusFilter === "upcoming" && !isUpcoming) return false;
            if (statusFilter === "past" && isUpcoming) return false;

            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const movieMatch = ticket.movieTitle?.toLowerCase().includes(q);
                const cinemaMatch = ticket.cinemaName?.toLowerCase().includes(q);
                const idMatch = ticket.id?.toLowerCase().includes(q);
                if (!movieMatch && !cinemaMatch && !idMatch) return false;
            }

            return true;
        });
    }, [history, statusFilter, searchQuery, now]);

    const upcomingCount = useMemo(() => {
        if (!Array.isArray(history)) return 0;
        return history.filter((t) => new Date(t.startTime) >= now).length;
    }, [history, now]);

    return (
        <div className="space-y-6">
            {/* Header & Status Tabs */}
            <div className="bg-[#12121e]/90 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                            <FontAwesomeIcon icon={faTicket} className="text-violet-400" />
                            <span>Lịch Sử Đặt Vé</span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1">
                            Xem lại các vé xem phim đã đặt, xuất trình mã QR và theo dõi lịch chiếu
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 bg-[#0B0B14] p-1.5 rounded-xl border border-white/5 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setStatusFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                statusFilter === "all"
                                    ? "bg-violet-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Tất cả ({history.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("upcoming")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                statusFilter === "upcoming"
                                    ? "bg-violet-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            <span>Sắp chiếu</span>
                            {upcomingCount > 0 && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter("past")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                statusFilter === "past"
                                    ? "bg-violet-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Đã xem
                        </button>
                    </div>
                </div>

                {/* Search Bar inside Ticket History */}
                {history.length > 0 && (
                    <div className="relative w-full max-w-md">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm vé theo tên phim, cụm rạp, mã vé..."
                            className="w-full h-10 pl-9 pr-9 bg-[#0B0B14] border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer p-1"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Ticket List Area */}
            <div className="space-y-4">
                {isLoading && (
                    <div className="py-12 text-center">
                        <OverlayLoading />
                    </div>
                )}

                {!isLoading && filteredTickets.length === 0 && (
                    <div className="py-16 px-4 text-center rounded-2xl bg-[#12121e]/80 border border-white/10 backdrop-blur-md shadow-xl">
                        <div className="w-16 h-16 rounded-2xl bg-violet-600/15 text-violet-400 border border-violet-500/20 flex items-center justify-center mx-auto text-2xl mb-4 shadow-lg">
                            <FontAwesomeIcon icon={faFilm} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            {history.length === 0
                                ? "Bạn chưa có vé xem phim nào"
                                : "Không tìm thấy vé phù hợp"}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
                            {history.length === 0
                                ? "Hãy khám phá các siêu phẩm điện ảnh đang chiếu tại rạp và đặt vé ngay để nhận ưu đãi hấp dẫn cùng tích điểm CinePoints!"
                                : "Không có vé nào khớp với tiêu chí tìm kiếm hoặc trạng thái đã chọn. Vui lòng thử từ khóa khác."}
                        </p>
                        {history.length === 0 ? (
                            <Link
                                to="/now-playing"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-900/40 transition cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faTicket} />
                                <span>Khám phá phim đang chiếu ngay</span>
                                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("");
                                    setStatusFilter("all");
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                                <span>Xem tất cả vé</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Render Ticket Cards */}
                {!isLoading &&
                    filteredTickets.map((ticket) => {
                        const ticketTime = new Date(ticket.startTime);
                        const isUpcoming = ticketTime >= now;

                        return (
                            <div
                                key={ticket.id}
                                className="group relative bg-[#12121e]/90 hover:bg-[#161626] border border-white/10 hover:border-violet-500/60 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl hover:shadow-[0_8px_30px_rgba(127,90,240,0.25)] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                            >
                                {/* Left Section: Poster + Movie Info */}
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    {/* Poster Image */}
                                    <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-white/10 shadow-md">
                                        <img
                                            src={
                                                ticket.posterPath ||
                                                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60"
                                            }
                                            alt={ticket.movieTitle}
                                            className="w-full h-full object-cover transform transition duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                                            }}
                                        />
                                    </div>

                                    {/* Movie Meta Information */}
                                    <div className="space-y-1.5 min-w-0">
                                        {/* Status Badge */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${
                                                    isUpcoming
                                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                        : "bg-zinc-800 text-zinc-400 border border-white/5"
                                                }`}
                                            >
                                                {isUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                                                <span>{isUpcoming ? "Sắp chiếu" : "Đã hoàn thành"}</span>
                                            </span>

                                            <span className="text-[11px] font-mono text-zinc-500 truncate">
                                                #{ticket.id ? ticket.id.slice(0, 8) : "TICKET"}
                                            </span>
                                        </div>

                                        {/* Movie Title */}
                                        <h3
                                            className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition line-clamp-1"
                                            title={ticket.movieTitle}
                                        >
                                            {ticket.movieTitle}
                                        </h3>

                                        {/* Cinema & Hall */}
                                        <p className="text-xs text-zinc-400 flex items-center gap-1.5 truncate">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-violet-400 text-xs shrink-0" />
                                            <span className="truncate">
                                                {ticket.cinemaName || "Cụm rạp đối tác"} {ticket.roomName ? `— ${ticket.roomName}` : ""}
                                            </span>
                                        </p>

                                        {/* Showtime */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 pt-1">
                                            <span className="flex items-center gap-1 text-violet-300 font-medium">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-[11px]" />
                                                <span>
                                                    {ticket.startTime
                                                        ? new Date(ticket.startTime).toLocaleDateString("vi-VN")
                                                        : "N/A"}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-1 text-zinc-400">
                                                <FontAwesomeIcon icon={faClock} className="text-[11px]" />
                                                <span>
                                                    {ticket.startTime
                                                        ? new Date(ticket.startTime).toLocaleTimeString("vi-VN", {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          })
                                                        : "N/A"}
                                                </span>
                                            </span>
                                        </div>

                                        {/* Seats */}
                                        {ticket.seats && ticket.seats.length > 0 && (
                                            <p className="text-xs text-zinc-300 flex items-center gap-1.5 pt-0.5">
                                                <FontAwesomeIcon icon={faCouch} className="text-amber-400 text-xs shrink-0" />
                                                <span>
                                                    Ghế:{" "}
                                                    <span className="text-amber-300 font-bold">
                                                        {ticket.seats.map((s) => s.seatLabel).join(", ")}
                                                    </span>
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Section: Total Price + Action Buttons */}
                                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5 gap-3 shrink-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
                                            Tổng thanh toán
                                        </p>
                                        <p className="text-base sm:text-lg font-black text-violet-400">
                                            {(ticket.finalPrice || ticket.totalPrice || 0).toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-violet-900/40 transition cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faQrcode} className="text-xs" />
                                            <span>Xem Vé Điện Tử</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Single Popup Ticket Detail Modal (Fixes previous bug) */}
            {selectedTicket && (
                <PopupTicketDetail
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </div>
    );
}
