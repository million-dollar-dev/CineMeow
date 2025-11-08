import React, {useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faDownload } from "@fortawesome/free-solid-svg-icons";
import TicketCard from "../Booking/TicketCard.jsx";
import { toPng } from 'html-to-image';

const PopupTicketDetail = ({ ticket, onClose }) => {
    const ticketRef = useRef(null);

    const handleDownload = async () => {
        if (!ticketRef.current) return;
        const dataUrl = await toPng(ticketRef.current, {
            cacheBust: true,
            backgroundColor: "black",
            pixelRatio: 3,
        });
        const link = document.createElement("a");
        link.download = `booking-${ticket.id}.png`;
        link.href = dataUrl;
        link.click();
    };

    if (!ticket) return null;

    return (
        // Nền mờ toàn màn hình + hiệu ứng fade-in
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            {/* Khối nội dung chính */}
            <div
                className="relative border border-[#2a2a2a] rounded-2xl
                w-[90%] max-w-[800px] text-[#eaeaea] p-6 transform transition-all duration-300 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Nút đóng */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                </button>

                {/* Nút tải về */}
                <button
                    className="absolute top-4 left-4 bg-[#7f5af0] hover:bg-[#9f7bff] text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300"
                    onClick={handleDownload}
                >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Tải vé
                </button>

                {/* Nội dung vé */}
                <div className="mt-10 bg-black" >
                    <div ref={ticketRef}>
                        <TicketCard booking={ticket} onClose={onClose} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupTicketDetail;
