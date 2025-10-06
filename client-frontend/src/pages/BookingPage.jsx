import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Banner from "../components/MovieDetail/Banner.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Promotions from "../components/PromotionSection.jsx";
import {useGetShowtimeQuery} from "../services/showtimeService.js";
import {useGetMovieQuery} from "../services/movieService.js";
import {useGetSeatMapQuery} from "../services/cinemaService.js";
import SeatSelection from "../components/Booking/SeatSelection.jsx";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const BookingPage = () => {
    const {showtimeId} = useParams();

    const {
        data: showtime,
        isLoading: loadingShowtime,
        isError: isShowtimeError,
        error: showtimeError
    } = useGetShowtimeQuery(showtimeId);

    const {
        data: movie,
        isLoading: loadingMovie,
        isError: isMovieError,
        error: movieError
    } = useGetMovieQuery(showtime?.movieId, {skip: !showtime?.movieId});

    const {
        data: seatMapResponse,
        isLoading: loadingSeatMap,
        isError: isSeatMapError,
        error: setMapError
    } = useGetSeatMapQuery(showtime?.roomId, {skip: !showtime?.roomId});

    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleToggleSeat = (seat) => {
        if (seat.type === "EMPTY" || seat.status !== "ACTIVE") return;

        setSelectedSeats((prev) =>
            prev.includes(seat.id)
                ? prev.filter((id) => id !== seat.id)
                : [...prev, seat.id]
        );
    };

    useEffect(() => {
        window.scrollTo({
            top: 500,
            behavior: "smooth",
        });
    }, []);

    if (loadingShowtime) {
        return <Loading/>
    }

    return (
        <div className="bg-[#0b0b0b] text-white min-h-screen">
            {/* Banner phim */}
            <Banner movieInfo={movie} />

            {/* Thông tin rạp */}
            <div className="bg-[#141414] flex items-center justify-center py-[1vw] border-b border-[#1f1f1f]">
                <div className="px-[2vw] py-[1vw] text-center">
                    <p className="text-gray-400 text-[0.9vw]">Rạp</p>
                    <p className="font-semibold text-[1vw] text-[#eaeaea]">
                        {showtime?.cinemaName}
                    </p>
                </div>
                <div className="px-[2vw] py-[1vw] border-x border-[#2a2a2a] text-center">
                    <p className="text-gray-400 text-[0.9vw]">Phòng chiếu</p>
                    <p className="font-semibold text-[1vw] text-[#eaeaea]">
                        {showtime?.roomName}
                    </p>
                </div>
                <div className="px-[2vw] py-[1vw] text-center">
                    <p className="text-gray-400 text-[0.9vw]">Suất chiếu</p>
                    <p className="font-semibold text-[1vw] text-[#eaeaea]">
                        {dayjs(showtime?.startTime).format("HH:mm DD/MM/YYYY")}
                    </p>
                </div>
            </div>

            {/* Tiêu đề */}
            <p className="text-center font-extrabold text-[1.8vw] py-[2vw] tracking-wide text-[#f5f5f5]">
                🎟️ Chọn ghế ngồi
            </p>

            {/* Bố cục chính */}
            <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-[2vw] pt-[1vw] pb-[4vw] px-[2vw]">
                {/* Cột trái - Sơ đồ ghế */}
                <div className="lg:w-3/4 w-full flex flex-col items-center bg-[#121212] rounded-2xl p-[2vw] shadow-[0_0_25px_rgba(127,90,240,0.05)] border border-[#1f1f1f]">
                    <SeatSelection
                        seats={seatMapResponse?.seats}
                        selectedSeats={selectedSeats}
                        onToggleSeat={handleToggleSeat}
                    />
                </div>

                {/* Cột phải - Thông tin & thanh toán */}
                <div className="lg:w-1/4 w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl p-[1.8vw] flex flex-col justify-between shadow-[0_0_20px_rgba(127,90,240,0.08)]">
                    <div>
                        <h2 className="text-[1.2vw] font-semibold mb-4 text-[#f1f1f1]">
                            🎫 Ghế bạn đã chọn
                        </h2>

                        <div className="flex flex-wrap gap-[0.6vw] mb-6 min-h-[2.4vw]">
                            {selectedSeats.length > 0 ? (
                                selectedSeats.map((s) => (
                                    <div
                                        key={s}
                                        className="flex items-center justify-center bg-gradient-to-br from-[#7f5af0] to-[#9f7bff] text-white px-[0.8vw] py-[0.3vw] rounded-md text-[0.85vw] font-semibold"
                                    >
                                        <p>{s}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-[0.9vw]">
                                    Chưa chọn ghế nào.
                                </p>
                            )}
                        </div>

                        <button
                            className="w-full bg-[#2a2a2a] hover:bg-[#323232] text-white py-[0.8vw] rounded-xl text-[0.9vw] font-medium mb-6 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-[0.5vw]"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Thêm bắp nước
                        </button>

                        <div className="border-t border-[#333] my-4"></div>

                        {/* Tổng đơn */}
                        <div className="space-y-3 text-[1vw]">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Giá vé</span>
                                <span className="font-semibold text-[#f5f5f5]">45.000đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Số ghế</span>
                                <span className="font-semibold">{selectedSeats.length}</span>
                            </div>
                            <div className="flex justify-between font-bold text-[1.1vw] pt-2 border-t border-[#2a2a2a]">
                                <span>Tổng cộng</span>
                                <span className="text-[#7f5af0]">
                {(selectedSeats.length * 45000).toLocaleString()}đ
              </span>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={selectedSeats.length === 0}
                        className={`mt-6 w-full py-[0.9vw] rounded-xl font-semibold text-[1vw] transition-all duration-300 ${
                            selectedSeats.length === 0
                                ? "bg-[#2a2a2a] text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#7f5af0] to-[#9f7bff] text-white hover:shadow-[0_0_20px_rgba(127,90,240,0.6)] active:scale-95"
                        }`}
                    >
                        Tiếp tục thanh toán
                    </button>
                </div>
            </div>

            <Promotions />
        </div>
    );

};

function Legend({color, label}) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded-sm border ${color}`}></div>
            <span>{label}</span>
        </div>
    );
}

export default BookingPage;