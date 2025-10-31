import React from "react";

const TicketCard = ({ booking }) => {
    console.log('TicketCard', booking);
    return (
        <div className="flex justify-center items-center py-6">
            <div className="relative bg-[#16161a] text-[#fffffe] rounded-3xl shadow-xl flex flex-row w-full max-w-2xl overflow-hidden">

                {/* 2 lỗ tròn */}
                <div className="absolute top-0 right-25 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-[#010101] rounded-full z-10"></div>
                <div className="absolute bottom-0 right-25 -translate-x-1/2 translate-y-1/2 w-9 h-9 bg-[#010101] rounded-full z-10"></div>

                {/* Poster phim */}
                <div className="flex items-center justify-center bg-[#16161a]">
                    {booking.posterPath ? (
                        <img
                            src={booking.posterPath}
                            alt={booking.movieTitle}
                            className="w-42 h-54 object-cover shadow-md"
                        />
                    ) : (
                        <div className="text-[#94a1b2] text-sm">Poster</div>
                    )}
                </div>

                {/* Nội dung vé */}
                <div className="flex-1 p-6 relative border-l border-dashed border-[#2a2a2a]">
                    <h2 className="text-2xl font-bold text-[#7f5af0] mb-1">
                        {booking.movieTitle}
                    </h2>
                    <p className="text-sm text-[#94a1b2] mb-3">
                        {booking.cinemaName} — Phòng{" "}
                        <span className="text-[#fffffe] font-medium">{booking.roomName}</span>
                    </p>

                    <div className="grid grid-cols-[auto_1fr] gap-y-1 text-sm">
                        <p className="text-[#94a1b2]">Suất chiếu: </p>
                        <p className="font-medium">{booking.startTime}</p>

                        <p className="text-[#94a1b2]">Ghế:</p>
                        <p className="font-medium">{booking.seats?.map((s) => s.seatLabel).join(", ")}</p>

                        <p className="text-[#94a1b2]">Tổng tiền:</p>
                        <p className="font-medium text-[#7f5af0]">{booking.totalPrice?.toLocaleString()}₫</p>

                        {/*<p className="text-[#94a1b2]">Mã vé:</p>*/}
                        {/*<p className="font-small">{booking.id}</p>*/}
                    </div>

                </div>

                {/* QR Code */}
                <div className="bg-[#242629] flex flex-col items-center justify-center p-5 border-l border-dashed border-[#fffffe]">
                    <div className="bg-white p-2 rounded-md shadow-md">
                        <img
                            src={
                                booking.qrCodeUrl
                            }
                            alt="QR Code"
                            className="w-20 h-20"
                        />
                    </div>
                    <p className="text-xs text-[#94a1b2] mt-3">Quét để vào rạp</p>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
