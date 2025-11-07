import React from 'react';
import {faCalendarAlt, faClock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import OverlayLoading from "../Booking/OverlayLoading.jsx";

export default function BookingHistory({history, isLoading}) {

    return (
        <section>
            <h1 className="text-2xl font-bold mb-6 uppercase tracking-wide text-[#eaeaea]">
                Lịch sử đặt vé
            </h1>

            <div
                className="p-4 h-[500px]
                 overflow-y-auto scrollbar-thin scrollbar-track-transparent"
            >
                {isLoading && <OverlayLoading />}
                {/* Mock dữ liệu */}
                {history.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="flex items-center gap-4 bg-[#1b1b1b] border border-[#2a2a2a]
                     rounded-lg p-4 mb-4 last:mb-0 transition-all duration-500
                     hover:shadow-[0_0_15px_rgba(127,90,240,0.25)] hover:border-[#7f5af0]/60"
                    >
                        {/* Ảnh phim */}
                        <div className="w-[70px] h-[100px] rounded-lg overflow-hidden flex-shrink-0">
                            <img
                                src={ticket.posterPath}
                                alt={ticket.movieTitle}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Thông tin vé */}
                        <div className="flex-1 text-gray-300">
                            <h3 className="text-lg font-semibold text-[#eaeaea]">
                                {ticket.movieTitle}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                                {ticket.cinemaName}
                            </p>
                            <p className="text-sm mt-1 flex items-center text-gray-300">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-[#7f5af0] mr-2" />
                                {new Date(ticket.startTime).toLocaleDateString("vi-VN")} |{" "}
                                <FontAwesomeIcon icon={faClock} className="ml-2 mr-1 text-[#7f5af0]" />
                                {new Date(ticket.startTime).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>

                            <p className="text-sm mt-1 text-gray-300">
                                Ghế:{" "}
                                <span
                                    className="text-[#7f5af0] font-medium"
                                >{ticket.seats.map((s) => s.seatLabel).join(", ")}</span>
                            </p>

                        </div>

                        {/* Tổng tiền + nút */}
                        <div className="flex flex-col items-end">
                            <p className="text-sm text-gray-400 mb-2">
                                Tổng tiền:{" "}
                                <span className="text-[#7f5af0] font-semibold">
                                {ticket.finalPrice?.toLocaleString("vi-VN", {style: "currency", currency: "VND",})}</span>
                            </p>

                            <button
                                className="text-sm px-4 py-1.5 rounded-md border border-[#7f5af0] text-[#7f5af0]
                         hover:bg-[#7f5af0] hover:text-white transition-all duration-300 active:scale-95"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

