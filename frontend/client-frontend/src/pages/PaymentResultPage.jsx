import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {useGetBookingQuery} from "../services/bookingService.js";
import TicketCard from "../components/Booking/TicketCard.jsx";

const PaymentResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const [bookingId, setBookingId] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(2000);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("bookingId");
        if (id) setBookingId(id);
    }, [location.search]);

    const {
        data: booking,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useGetBookingQuery(bookingId, {
        skip: !bookingId,
        pollingInterval: pollingInterval,
    });

    // Xử lý logic dừng Polling khi có kết quả cuối cùng
    useEffect(() => {
        if (isSuccess && booking) {
            if (booking.status === 'PAID') {
                setPollingInterval(0);
            } else if (booking.status === 'CANCELLED' || booking.status === 'FAILED') {
                setPollingInterval(0);
            }
        }

        if (isError) {
            setPollingInterval(0);
            toast.error(error?.message || "Lỗi kết nối");
        }
    }, [isSuccess, booking, isError, error]);

    const isVerifying = isSuccess && booking && (booking.status === 'PENDING' || booking.status === 'UNPAID');

    if (isLoading || isVerifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#010101] text-[#fffffe]">
                <div className="w-10 h-10 border-4 border-[#7f5af0] border-t-transparent rounded-full animate-spin"/>
                <p className="mt-4 text-[#94a1b2]">
                    {isLoading ? "Đang tải thông tin vé..." : "Đang xác thực giao dịch với ngân hàng..."}
                </p>
                {isVerifying && <p className="text-xs text-gray-500 mt-2">Vui lòng không tắt trình duyệt</p>}
            </div>
        );
    }

    const isPaymentFailed = isSuccess && booking && (booking.status === 'FAILED' || booking.status === 'CANCELLED');

    if (isError || isPaymentFailed || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#010101] text-[#fffffe] px-4 animate-fadeIn">
                <div className="w-16 h-16 flex items-center justify-center bg-red-600/20 text-red-500 rounded-full text-4xl font-bold animate-pop">
                    ✕
                </div>
                <h2 className="text-2xl font-bold mt-4 animate-slideUp">Thanh toán thất bại</h2>
                <p className="text-[#94a1b2] mt-2 text-center animate-slideUp animation-delay-200">
                    {isPaymentFailed
                        ? "Giao dịch bị hủy hoặc thanh toán không thành công."
                        : (error?.message || "Không thể tải thông tin vé. Vui lòng thử lại sau.")}
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

                {user?.userId && (
                    <button
                        onClick={() => navigate(`/user-profile/${user?.userId}`)}
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