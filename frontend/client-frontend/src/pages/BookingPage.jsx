import React, {useEffect, useMemo, useState} from "react";
import {useParams, Link} from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

import {useGetShowtimeQuery, useGetShowtimeSeatsQuery} from "../services/showtimeService.js";
import {useGetMovieQuery} from "../services/movieService.js";
import {useGetSeatMapQuery} from "../services/cinemaService.js";
import {useGetFnbsByBrandQuery} from "../services/brandService.js";
import {useCreateBookingMutation, useGetAllPriceByBrandQuery} from "../services/bookingService.js";
import {useValidateVoucherMutation} from "../services/promotionService.js";
import {useInitPaymentMutation} from "../services/paymentService.js";

import SeatSelection from "../components/Booking/SeatSelection.jsx";
import ComboPopup from "../components/Booking/ComboPopup.jsx";
import BookingSummary from "../components/Booking/BookingSummary.jsx";
import PaymentStep from "../components/Booking/PaymentStep.jsx";
import TicketCard from "../components/Booking/TicketCard.jsx";
import OverlayLoading from "../components/Booking/OverlayLoading.jsx";
import Promotions from "../components/PromotionSection.jsx";

// Import rich mock data for frontend testing
import {
    MOCK_SHOWTIME,
    MOCK_MOVIE,
    MOCK_PRICES,
    MOCK_FNBS,
    MOCK_SEAT_MAP,
    MOCK_VOUCHERS,
} from "../data/bookingMockData.js";

const BookingPage = () => {
    const {showtimeId} = useParams();
    const isExplicitMock = showtimeId === "demo" || showtimeId === "mock";

    const {
        data: showtime,
        isLoading: loadingShowtime,
    } = useGetShowtimeQuery(showtimeId, {skip: isExplicitMock});

    const activeShowtime = showtime || MOCK_SHOWTIME;

    const {
        data: movie,
    } = useGetMovieQuery(activeShowtime?.movieId, {
        skip: isExplicitMock || !activeShowtime?.movieId,
    });

    const activeMovie = movie || MOCK_MOVIE;

    const {
        data: fnbs,
    } = useGetFnbsByBrandQuery(activeShowtime?.brandId, {
        skip: isExplicitMock || !activeShowtime?.brandId,
    });

    const activeFnbs = (fnbs && fnbs.length > 0) ? fnbs : MOCK_FNBS;

    const {
        data: price,
    } = useGetAllPriceByBrandQuery(activeShowtime?.brandId, {
        skip: isExplicitMock || !activeShowtime?.brandId,
    });

    const activePrices = (price && price.length > 0) ? price : MOCK_PRICES;

    const {
        data: seatMapResponse,
    } = useGetSeatMapQuery(activeShowtime?.roomId, {
        skip: isExplicitMock || !activeShowtime?.roomId,
    });

    const {
        data: showtimeSeats,
    } = useGetShowtimeSeatsQuery(showtimeId, {
        skip: isExplicitMock || !showtime?.id,
    });

    const [
        validateVoucher,
        {
            isLoading: isValidatingVoucher,
        },
    ] = useValidateVoucherMutation();

    const [
        createBooking,
        {
            isLoading: isBooking,
        },
    ] = useCreateBookingMutation();

    const [
        initPayment,
        {
            data: initPaymentResponse,
            isLoading: isInitingPayment,
            isSuccess: isInitingPaymentSuccess,
            isError: isInitPaymentError,
            error: initPaymentError,
        },
    ] = useInitPaymentMutation();

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedCombos, setSelectedCombos] = useState([]);

    const [voucherCode, setVoucherCode] = useState("");
    const [voucherInfo, setVoucherInfo] = useState(null);
    const [voucherErrorMsg, setVoucherErrorMsg] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("VNPAY");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const user = useSelector((state) => state.user);
    const [step, setStep] = useState("summary");

    const isUsingMock = isExplicitMock || (!showtime && !loadingShowtime);

    // Initialize phone and email when user is loaded
    useEffect(() => {
        if (user) {
            if (user.phoneNumber && !phone) setPhone(user.phoneNumber);
            if (user.email && !email) setEmail(user.email);
        }
    }, [user, email, phone]);

    const handleConfirmCombo = (combos) => {
        setSelectedCombos(combos);
        setOpenPopup(false);
    };

    // Combine seat map with availability, fallback to mock seats
    const seats = useMemo(() => {
        if (seatMapResponse?.seats && seatMapResponse.seats.length > 0) {
            return seatMapResponse.seats.map((seat) => {
                const showtimeSeat = showtimeSeats?.find((status) => status.seatId === seat.id);
                return {
                    ...seat,
                    status: showtimeSeat?.status || "AVAILABLE",
                    reservedUntil: showtimeSeat?.reservedUntil || null,
                    bookingId: showtimeSeat?.bookingId || null,
                };
            });
        }
        return MOCK_SEAT_MAP.seats;
    }, [seatMapResponse, showtimeSeats]);

    const handleToggleSeat = (seat) => {
        if (seat.type === "EMPTY" || seat.status !== "AVAILABLE") return;

        setSelectedSeats((prev) =>
            prev.some((s) => s.id === seat.id)
                ? prev.filter((s) => s.id !== seat.id)
                : [...prev, seat]
        );
    };

    const comboTotalPrice = useMemo(() => {
        return selectedCombos.reduce(
            (sum, combo) => sum + (combo.price || 0) * (combo.quantity || 0),
            0
        );
    }, [selectedCombos]);

    // Group selected seats with fallback pricing
    const groupedSeats = useMemo(() => {
        return selectedSeats.reduce((acc, seat) => {
            const matchedPrice = Array.isArray(activePrices)
                ? activePrices.find((p) => p.seatType === seat.type && p.roomType === activeShowtime?.roomType)
                : null;
            const fallbackPrice = seat.type === "VIP" ? 95000 : seat.type === "COUPLE" ? 160000 : 75000;
            const unitPrice = matchedPrice?.price ?? fallbackPrice;
            const key = `${seat.type}-${activeShowtime?.roomType || "STD"}`;

            if (!acc[key]) {
                acc[key] = {
                    seatType: seat.type,
                    roomType: activeShowtime?.roomType || "STD",
                    price: unitPrice,
                    seats: [],
                };
            }
            acc[key].seats.push(seat);
            return acc;
        }, {});
    }, [selectedSeats, activePrices, activeShowtime]);

    const seatTotalPrice = useMemo(() => {
        return Object.values(groupedSeats).reduce(
            (sum, g) => sum + g.price * g.seats.length,
            0
        );
    }, [groupedSeats]);

    const totalPrice = seatTotalPrice + comboTotalPrice;

    // Quick pick helper for testers
    const handleQuickPickSeats = () => {
        const availableVipSeats = seats.filter((s) => s.type === "VIP" && s.status === "AVAILABLE").slice(0, 2);
        if (availableVipSeats.length > 0) {
            setSelectedSeats(availableVipSeats);
            toast.info("Đã chọn nhanh 2 ghế VIP!");
        }
    };

    const handleQuickPickCombo = () => {
        if (activeFnbs.length > 0) {
            setSelectedCombos([{...activeFnbs[0], quantity: 1}]);
            toast.info("Đã thêm nhanh combo bắp nước!");
        }
    };

    const handleApplyVoucher = async (codeToApply) => {
        const code = (codeToApply || "").trim().toUpperCase();
        if (!code) {
            setVoucherErrorMsg("Vui lòng nhập mã voucher");
            return;
        }

        // 1. Check local mock vouchers (CINEMEOW20, MEOW50K, VIP2026)
        if (MOCK_VOUCHERS[code]) {
            const mockRes = MOCK_VOUCHERS[code];
            const discountAmt = Math.min(mockRes.discountAmount, totalPrice);
            setVoucherInfo({
                valid: true,
                code,
                discountAmount: discountAmt,
                finalPrice: Math.max(0, totalPrice - discountAmt),
                message: mockRes.message,
            });
            setVoucherErrorMsg("");
            toast.success(`Áp dụng mã ${code}: -${discountAmt.toLocaleString("vi-VN")}₫!`);
            return;
        }

        // 2. Try backend voucher validation if not explicit mock
        if (!isExplicitMock) {
            const payload = {
                code,
                userId: user?.userId || null,
                showtimeId,
                cinemaId: activeShowtime?.cinemaId,
                brandName: activeShowtime?.brandName,
                roomType: activeShowtime?.roomType,
                paymentMethod: "selectedPayment",
                seats: selectedSeats,
                fnbItemIds: selectedCombos.map((i) => i.id),
                totalPrice,
                bookingTime: new Date().toISOString(),
            };

            try {
                const res = await validateVoucher(payload).unwrap();
                if (res?.valid) {
                    setVoucherInfo(res);
                    setVoucherErrorMsg("");
                    toast.success("Áp dụng mã voucher thành công!");
                    return;
                } else {
                    setVoucherInfo(null);
                    setVoucherErrorMsg(res?.message || "Mã voucher không hợp lệ");
                    return;
                }
            } catch (err) {
                console.warn("Backend voucher error:", err);
            }
        }

        setVoucherInfo(null);
        setVoucherErrorMsg("Mã không hợp lệ. Gợi ý mã thử nghiệm: CINEMEOW20, MEOW50K, VIP2026");
    };

    const handleCreateBooking = async () => {
        try {
            const fnbItems = selectedCombos.map((item) => ({
                fnbItemId: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
            }));

            const guestInfo = {
                name: user?.username || "Khách hàng",
                email: email || user?.email || "guest@cinemeow.vn",
                phone: phone || user?.phoneNumber || "0988888888",
            };

            const payload = {
                userId: user?.userId || null,
                showtimeId: showtimeId,
                discountAmount: voucherInfo?.discountAmount || 0,
                totalPrice: totalPrice,
                finalPrice: voucherInfo?.finalPrice || totalPrice,
                voucherCode: voucherCode || null,
                paymentMethod: paymentMethod,
                guestInfo: guestInfo,
                seatIds: selectedSeats.map((i) => i.id),
                fnbItems,
            };

            // Attempt backend if live showtime
            if (!isExplicitMock && showtime?.id) {
                try {
                    const bookingResult = await createBooking(payload).unwrap();
                    if (bookingResult?.id) {
                        const paymentPayload = {
                            bookingId: bookingResult.id,
                            amount: voucherInfo?.finalPrice || totalPrice,
                            paymentMethod: paymentMethod,
                        };
                        await initPayment(paymentPayload);
                        return;
                    }
                } catch (backendError) {
                    console.warn("Backend booking failed, falling back to mock flow simulation:", backendError);
                }
            }

            // Fallback simulation for frontend testing
            setIsSimulatingPayment(true);
            setTimeout(() => {
                setIsSimulatingPayment(false);
                setShowSuccessModal(true);
            }, 800);

        } catch (error) {
            console.error("Lỗi khi tạo booking:", error);
            toast.error(error?.data?.message || "Tạo đơn hàng thất bại!");
        }
    };

    useEffect(() => {
        if (isInitingPaymentSuccess && initPaymentResponse?.paymentUrl) {
            window.location.href = initPaymentResponse.paymentUrl;
        }

        if (isInitPaymentError && initPaymentError) {
            console.error("init payment error: ", initPaymentError);
            toast.error(initPaymentError?.data?.message || "Khởi tạo cổng thanh toán thất bại!");
        }
    }, [isInitingPaymentSuccess, isInitPaymentError, initPaymentResponse, initPaymentError]);

    useEffect(() => {
        setVoucherInfo(null);
        setVoucherCode("");
        setVoucherErrorMsg("");
    }, [selectedSeats, selectedCombos]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [step]);

    // Only block screen if actively querying a real non-mock showtime
    const isActivelyQuerying = !isExplicitMock && loadingShowtime && !showtime;
    if (isActivelyQuerying) {
        return <OverlayLoading />;
    }

    const formattedTime = activeShowtime?.startTime
        ? dayjs(activeShowtime.startTime).locale("vi").format("HH:mm - dddd, DD/MM/YYYY")
        : "19:30 - Thứ Bảy, 11/10/2026";

    return (
        <div className="bg-[#07070B] text-zinc-100 min-h-screen pt-20 sm:pt-24">
            {(isInitingPayment || isSimulatingPayment) && <OverlayLoading />}

            {/* Demo Ribbon for easy frontend testing */}
            {isUsingMock && (
                <div className="bg-gradient-to-r from-violet-950/90 via-indigo-950/90 to-violet-950/90 border-b border-violet-800/40 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 text-zinc-300">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white font-bold text-[10px] uppercase tracking-wider">
                            Demo Mode
                        </span>
                        <span>
                            Đang dùng dữ liệu mẫu. Thử mã giảm giá:{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setVoucherCode("CINEMEOW20");
                                    handleApplyVoucher("CINEMEOW20");
                                }}
                                className="font-semibold text-violet-300 hover:text-white underline underline-offset-2 ml-1"
                            >
                                CINEMEOW20 (-20k)
                            </button>
                            ,{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setVoucherCode("MEOW50K");
                                    handleApplyVoucher("MEOW50K");
                                }}
                                className="font-semibold text-violet-300 hover:text-white underline underline-offset-2"
                            >
                                MEOW50K (-50k)
                            </button>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={handleQuickPickSeats}
                            className="px-2.5 py-1 rounded-lg bg-zinc-850 hover:bg-violet-700/80 text-violet-200 border border-violet-500/30 text-[11px] font-medium transition cursor-pointer"
                        >
                            Chọn nhanh 2 ghế VIP
                        </button>
                        <button
                            type="button"
                            onClick={handleQuickPickCombo}
                            className="px-2.5 py-1 rounded-lg bg-zinc-850 hover:bg-violet-700/80 text-violet-200 border border-violet-500/30 text-[11px] font-medium transition cursor-pointer"
                        >
                            Thêm Combo bắp nước
                        </button>
                    </div>
                </div>
            )}

            {/* Popup combo */}
            <ComboPopup
                open={openPopup}
                onClose={() => setOpenPopup(false)}
                combos={activeFnbs}
                selectedCombos={selectedCombos}
                onConfirm={handleConfirmCombo}
            />

            {/* Topbar: Cinema Booking Header */}
            <div className="relative border-b border-zinc-850 bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-zinc-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 relative z-10">
                    {/* Breadcrumbs & Step Indicator */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
                        <Link
                            to={activeMovie?.id ? `/movies/${activeMovie.id}` : "/"}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            <span>← Quay lại chi tiết phim</span>
                        </Link>

                        {/* Booking Steps Indicator (Clean typography, minimal icons) */}
                        <div className="flex items-center gap-2 sm:gap-4 text-xs">
                            <div
                                className={`flex items-center gap-2 font-semibold ${
                                    step === "summary" ? "text-violet-400" : "text-emerald-400"
                                }`}
                            >
                                <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        step === "summary"
                                            ? "bg-violet-600 text-white shadow-sm shadow-violet-500/50"
                                            : "bg-emerald-600/30 text-emerald-400 border border-emerald-500/40"
                                    }`}
                                >
                                    {step === "summary" ? "1" : "✓"}
                                </span>
                                <span className="hidden sm:inline">Chọn ghế & Bắp nước</span>
                            </div>

                            <div className="w-6 sm:w-10 h-px bg-zinc-800" />

                            <div
                                className={`flex items-center gap-2 font-semibold ${
                                    step === "payment" ? "text-violet-400" : "text-zinc-500"
                                }`}
                            >
                                <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        step === "payment"
                                            ? "bg-violet-600 text-white shadow-sm shadow-violet-500/50"
                                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                    }`}
                                >
                                    2
                                </span>
                                <span className="hidden sm:inline">Thanh toán</span>
                            </div>

                            <div className="w-6 sm:w-10 h-px bg-zinc-800" />

                            <div className="flex items-center gap-2 font-semibold text-zinc-600">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-zinc-900 text-zinc-600 border border-zinc-800">
                                    3
                                </span>
                                <span className="hidden sm:inline">Nhận vé</span>
                            </div>
                        </div>
                    </div>

                    {/* Movie Info & Showtime Pills */}
                    <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {activeMovie?.posterUrl ? (
                                <img
                                    src={activeMovie.posterUrl}
                                    alt={activeMovie?.title}
                                    className="w-14 h-20 sm:w-16 sm:h-24 rounded-2xl object-cover border border-zinc-750 shadow-lg shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-xs shrink-0 font-medium">
                                    Poster
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h1 className="text-lg sm:text-2xl font-black text-white tracking-wide">
                                        {activeMovie?.title || "Đang tải thông tin phim..."}
                                    </h1>
                                    {activeShowtime?.roomType && (
                                        <span className="px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 border border-violet-500/30 text-[11px] font-bold">
                                            {activeShowtime.roomType.replace("_", "")}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400 line-clamp-1">
                                    {activeMovie?.genres?.join?.(" • ") || activeMovie?.duration
                                        ? `${activeMovie?.duration} phút • Phụ đề tiếng Việt`
                                        : "Suất chiếu rạp chuẩn quốc tế"}
                                </p>
                            </div>
                        </div>

                        {/* Badges / Showtime details (Clean, no decorative icons) */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl px-3.5 py-2">
                                <span className="text-[10px] text-zinc-500 block uppercase font-medium">Rạp</span>
                                <span className="text-xs font-semibold text-zinc-200">
                                    {activeShowtime?.cinemaName || "Rạp CineMeow"}
                                </span>
                            </div>

                            <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl px-3.5 py-2">
                                <span className="text-[10px] text-zinc-500 block uppercase font-medium">Phòng</span>
                                <span className="text-xs font-semibold text-zinc-200">
                                    {activeShowtime?.roomName || "Phòng chiếu"}
                                </span>
                            </div>

                            <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl px-3.5 py-2">
                                <span className="text-[10px] text-zinc-500 block uppercase font-medium">Suất chiếu</span>
                                <span className="text-xs font-semibold text-violet-300">
                                    {formattedTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Booking Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column (8 cols): Seat Map OR TicketCard Preview */}
                    <div className="lg:col-span-8">
                        {step === "summary" ? (
                            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800/80 p-4 sm:p-6 shadow-2xl">
                                <SeatSelection
                                    seats={seats}
                                    selectedSeats={selectedSeats}
                                    onToggleSeat={handleToggleSeat}
                                    priceList={activePrices}
                                    roomType={activeShowtime?.roomType || "_2D"}
                                />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                                            Xác Nhận Vé Đặt
                                        </h2>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            Kiểm tra thông tin vé điện tử trước khi thanh toán
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep("summary")}
                                        className="text-xs font-semibold text-violet-400 hover:text-violet-300 underline underline-offset-4 transition cursor-pointer"
                                    >
                                        Đổi ghế / Combo
                                    </button>
                                </div>

                                {/* Component TicketCard used in Payment Step (Pre-paid mode) */}
                                <TicketCard
                                    movie={activeMovie}
                                    showtime={activeShowtime}
                                    selectedSeats={selectedSeats}
                                    selectedCombos={selectedCombos}
                                    totalPrice={voucherInfo?.finalPrice || totalPrice}
                                    isPaid={false}
                                    showQr={false}
                                    bookingId="CMW-PREVIEW"
                                />

                                {/* Cinema guidelines notice */}
                                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs space-y-1.5 text-zinc-300">
                                    <p className="font-semibold text-violet-300">Lưu ý khi đến rạp:</p>
                                    <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[11px]">
                                        <li>Vui lòng có mặt tại rạp trước giờ chiếu 15 phút để lấy vé hoặc quét mã QR.</li>
                                        <li>Vé đã thanh toán thành công không hỗ trợ hoàn tiền hoặc đổi suất chiếu theo quy định rạp.</li>
                                        <li>Khán giả vui lòng xuất trình CCCD nếu phim có giới hạn độ tuổi (T13, T16, T18).</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (4 cols): Sticky Summary OR Payment Form */}
                    <div className="lg:col-span-4">
                        {step === "summary" ? (
                            <BookingSummary
                                selectedSeats={selectedSeats}
                                selectedCombos={selectedCombos}
                                setSelectedCombos={setSelectedCombos}
                                setOpenPopup={setOpenPopup}
                                seatGroups={groupedSeats}
                                onContinue={() => setStep("payment")}
                            />
                        ) : (
                            <PaymentStep
                                user={user}
                                selectedSeats={selectedSeats}
                                selectedCombos={selectedCombos}
                                seatTotalPrice={seatTotalPrice}
                                comboTotalPrice={comboTotalPrice}
                                errorMsg={voucherErrorMsg}
                                voucherCode={voucherCode}
                                setVoucherCode={setVoucherCode}
                                handleApplyVoucher={handleApplyVoucher}
                                discount={voucherInfo?.discountAmount || 0}
                                finalPrice={voucherInfo?.finalPrice || totalPrice}
                                phone={phone}
                                setPhone={setPhone}
                                email={email}
                                setEmail={setEmail}
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                onBack={() => setStep("summary")}
                                handleCreateBooking={handleCreateBooking}
                                isBooking={isBooking || isSimulatingPayment}
                                isValidatingVoucher={isValidatingVoucher}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Promotions */}
            <div className="border-t border-zinc-850 bg-zinc-950/60 py-10">
                <Promotions />
            </div>

            {/* Simulated Payment Success Modal: Clean, high-end e-ticket presentation */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
                    <div className="w-full max-w-3xl my-auto py-6 flex flex-col items-center text-center space-y-5 animate-fadeIn">
                        {/* Celebration Header */}
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                                ✓ Đặt Vé Thành Công
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                                Vé Xem Phim Điện Tử
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                                Vé của bạn đã được xác nhận. Vui lòng xuất trình mã QR tại cổng phòng chiếu rạp.
                            </p>
                        </div>

                        {/* Hero TicketCard with QR Code */}
                        <TicketCard
                            movie={activeMovie}
                            showtime={activeShowtime}
                            selectedSeats={selectedSeats}
                            selectedCombos={selectedCombos}
                            totalPrice={voucherInfo?.finalPrice || totalPrice}
                            isPaid={true}
                            showQr={true}
                            bookingId="CMW-98241"
                            notchBg="#09090b"
                            className="shadow-[0_0_50px_rgba(127,90,240,0.15)]"
                        />

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setSelectedSeats([]);
                                    setSelectedCombos([]);
                                    setStep("summary");
                                }}
                                className="flex-1 py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs border border-zinc-800 transition cursor-pointer"
                            >
                                Đặt vé khác
                            </button>
                            <Link
                                to="/"
                                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition flex items-center justify-center"
                            >
                                Về trang chủ
                            </Link>
                        </div>

                        <p className="text-[11px] text-zinc-500 italic">
                            Thông tin vé và hóa đơn điện tử cũng đã được gửi tới email của bạn.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingPage;
