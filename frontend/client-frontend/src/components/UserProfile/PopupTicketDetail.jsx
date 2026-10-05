import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faDownload, faTicket, faCheck } from "@fortawesome/free-solid-svg-icons";
import TicketCard from "../Booking/TicketCard.jsx";
import { toPng } from "html-to-image";
import { toast } from "react-toastify";

const PopupTicketDetail = ({ ticket, onClose }) => {
    const ticketRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleDownload = async () => {
        if (!ticketRef.current) return;
        try {
            setIsDownloading(true);
            const dataUrl = await toPng(ticketRef.current, {
                cacheBust: true,
                backgroundColor: "#0d0d14",
                pixelRatio: 3,
            });
            const link = document.createElement("a");
            link.download = `CineMeow-Ticket-${ticket.id || Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Đã tải vé điện tử về máy thành công!");
        } catch (error) {
            console.error("Lỗi khi tải ảnh vé:", error);
            toast.error("Không thể tải ảnh vé. Vui lòng thử lại!");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!ticket) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl bg-[#12121e] border border-white/10 rounded-3xl shadow-2xl shadow-violet-950/40 overflow-hidden transform transition-all my-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center text-sm shadow">
                            <FontAwesomeIcon icon={faTicket} />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                <span>Vé Xem Phim Điện Tử</span>
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Đã xác nhận
                                </span>
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                                Mã vé: <span className="text-violet-300 font-mono font-medium">{ticket.id || "CM-TICKET"}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Download button */}
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-md shadow-violet-900/40 cursor-pointer disabled:opacity-60"
                        >
                            <FontAwesomeIcon icon={faDownload} className="text-xs" />
                            <span>{isDownloading ? "Đang tạo..." : "Tải vé"}</span>
                        </button>

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>

                {/* Ticket Printable Body */}
                <div className="p-4 sm:p-6 bg-[#0B0B14]">
                    <div ref={ticketRef} className="rounded-2xl overflow-hidden shadow-inner">
                        <TicketCard booking={ticket} onClose={onClose} />
                    </div>
                </div>

                {/* Modal Footer Note */}
                <div className="px-6 py-3 bg-[#12121e] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
                    <p className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCheck} className="text-emerald-400 text-xs" />
                        <span>Xuất trình mã vé này tại quầy soát vé rạp để vào phòng chiếu.</span>
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs text-zinc-400 hover:text-white transition font-medium cursor-pointer"
                    >
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupTicketDetail;
