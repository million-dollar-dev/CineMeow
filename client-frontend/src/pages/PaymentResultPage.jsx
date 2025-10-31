import React, {useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import TicketCard from "../components/Booking/TicketCard.jsx";

const PaymentResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    var bookingId = '';
    const isLoading = false;
    const isError = false;
    const isLoggedIn = false;
    const booking = {
        movieTitle: "Batman 2",
        cinemaName: "CGV Sư Vạn Hạnh",
        roomName: "A1",
        totalPrice: 350000,
        showtime: "12/12/2022",
        seats: [{id: 1, label: "A1"}, {id: 2, label: "A2"}],
        bookingCode: bookingId,
        posterUrl: "https://media.posterstore.com/site_images/68631be292c536b9cc92b044_2010122803_WB0039-5.jpg?auto=compress%2Cformat&fit=max&w=3840"

    }

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        console.log(params);
        bookingId = params.get("bookingId");
    }, [location.search]);
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#010101] text-[#fffffe]">
                <div className="w-10 h-10 border-4 border-[#7f5af0] border-t-transparent rounded-full animate-spin"/>
                <p className="mt-4 text-[#94a1b2]">Đang tải thông tin vé...</p>
            </div>
        );
    }

    if (isError || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#010101] text-[#fffffe] px-4 animate-fadeIn">
                <div className="w-16 h-16 flex items-center justify-center bg-red-600/20 text-red-500 rounded-full text-4xl font-bold animate-pop">
                    ✕
                </div>
                <h2 className="text-2xl font-bold mt-4 animate-slideUp">Thanh toán thất bại</h2>
                <p className="text-[#94a1b2] mt-2 text-center animate-slideUp animation-delay-200">
                    Không thể tải thông tin vé. Vui lòng thử lại sau.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-6 px-6 py-2 bg-[#7f5af0] hover:bg-[#6b4ce0] rounded-lg text-white font-medium animate-slideUp animation-delay-400"
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    // Nếu thanh toán thành công
    return (
        <div className="min-h-screen bg-[#010101] text-[#fffffe] flex flex-col items-center justify-center py-12 px-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#7f5af0]/20 text-[#7f5af0] rounded-full text-4xl font-bold animate-pop">
                ✓
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#fffffe] animate-slideUp">
                Thanh toán thành công
            </h2>
            <p className="text-[#94a1b2] text-center max-w-md animate-slideUp animation-delay-200">
                Cảm ơn bạn đã đặt vé! Vui lòng kiểm tra{" "}
                <span className="text-[#7f5af0]">email</span> và{" "}
                <span className="text-[#7f5af0]">tin nhắn SMS</span> để nhận chi tiết vé xem phim.
            </p>

            <div className="animate-slideUp animation-delay-400">
                <TicketCard booking={booking} />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-10 animate-slideUp animation-delay-600">
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-[#7f5af0] text-white font-semibold rounded-xl hover:opacity-90 transition"
                >
                    Quay về trang chủ
                </button>

                {isLoggedIn && (
                    <button
                        onClick={() => navigate("/user/bookings")}
                        className="px-6 py-3 bg-transparent border border-[#7f5af0] text-[#7f5af0] font-semibold rounded-xl hover:bg-[#7f5af01a] transition"
                    >
                        Xem lịch sử đặt vé
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentResultPage;
