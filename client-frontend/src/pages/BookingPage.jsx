import React, {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Banner from "../components/MovieDetail/Banner.jsx";
import Promotions from "../components/PromotionSection.jsx";
import {useGetShowtimeQuery} from "../services/showtimeService.js";
import {useGetMovieQuery} from "../services/movieService.js";
import {useGetSeatMapQuery} from "../services/cinemaService.js";
import {useGetFnbsByBrandQuery} from "../services/brandService.js";
import SeatSelection from "../components/Booking/SeatSelection.jsx";
import ComboPopup from "../components/Booking/ComboPopup.jsx";
import BookingSummary from "../components/Booking/BookingSummary.jsx";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {useGetAllPriceByBrandQuery} from "../services/bookingService.js";
import {useValidateVoucherMutation} from "../services/promotionService.js";
import PaymentStep from "../components/Booking/PaymentStep.jsx";

const BookingPage = () => {
    const {showtimeId} = useParams();

    const {
        data: showtime,
        isLoading: loadingShowtime,
    } = useGetShowtimeQuery(showtimeId);

    const {
        data: movie,
        isLoading: loadingMovie,
    } = useGetMovieQuery(showtime?.movieId, {skip: !showtime?.movieId});

    const {
        data: fnbs,
        isLoading: loadingFnb,
    } = useGetFnbsByBrandQuery(showtime?.brandId, {skip: !showtime?.brandId});

    const {
        data: price
    } = useGetAllPriceByBrandQuery(showtime?.brandId, {skip: !showtime?.brandId});

    const {
        data: seatMapResponse,
        isLoading: loadingSeatMap,
    } = useGetSeatMapQuery(showtime?.roomId, {skip: !showtime?.roomId});

    const [
        validateVoucher,
        {
            data: voucherValidateResponse,
            isLoading: isValidatingVoucher,
            isError: isVoucherValidateError,
            error: voucherValidateError
        }] = useValidateVoucherMutation();

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedCombos, setSelectedCombos] = useState([]);

    const [voucherCode, setVoucherCode] = useState("");
    const [voucherInfo, setVoucherInfo] = useState(null);
    const [voucherErrorMsg, setVoucherErrorMsg] = useState("");

    const [step, setStep] = useState("summary");

    const handleConfirmCombo = (combos) => {
        setSelectedCombos(combos);
        setOpenPopup(false);
    };

    const handleToggleSeat = (seat) => {
        if (seat.type === "EMPTY" || seat.status !== "ACTIVE") return;

        setSelectedSeats((prev) =>
            prev.includes(seat)
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

    //Gom nhóm ghế theo seatType + roomType
    const groupedSeats = selectedSeats.reduce((acc, seat) => {
        const matchedPrice = price.find((p) => p.seatType === seat.type && p.roomType === showtime.roomType);
        console.log("matchedPrice", matchedPrice);
        const key = `${seat.type}-${showtime.roomType}`;

        if (!acc[key]) {
            acc[key] = {seatType: seat.type, roomType: showtime.roomType, price: matchedPrice?.price || 0, seats: [],};
        }
        acc[key].seats.push(seat);
        return acc;
    }, {});

    //Tổng tiền ghế
    const seatTotalPrice = useMemo(() => {
        return Object.values(groupedSeats).reduce(
            (sum, g) => sum + g.price * g.seats.length,
            0
        );
    }, [groupedSeats]);

    const totalPrice = seatTotalPrice + comboTotalPrice;

    const handleApplyVoucher = async (voucherCode) => {
        const code = voucherCode.trim();
        if (!code) {
            setVoucherErrorMsg("Vui lòng nhập mã voucher");
            return;
        }

        const payload = {
            code,
            userId: null,
            showtimeId,
            cinemaId: showtime?.cinemaId,
            brandName: showtime?.brandName,
            roomType: showtime?.roomType,
            paymentMethod: "selectedPayment",
            seats: selectedSeats,
            fnbItemIds: selectedCombos.map(i => i.id),
            totalPrice,
            bookingTime: new Date().toISOString(),
        };
        validateVoucher(payload);
    };

    useEffect(() => {
        setVoucherInfo(null);
        setVoucherCode("");
        setVoucherErrorMsg("");
    }, [selectedSeats, selectedCombos]);


    useEffect(() => {
        if (voucherValidateResponse) {
            if (voucherValidateResponse.valid) {
                setVoucherInfo(voucherValidateResponse);
                setVoucherErrorMsg("");
            } else {
                setVoucherInfo(null);
                setVoucherErrorMsg(voucherValidateResponse.message);
            }
        }
        if (isVoucherValidateError && voucherValidateError) {
            console.error("Voucher error:", voucherValidateError);
            setVoucherErrorMsg(voucherValidateError.data.message);
        }
    }, [voucherValidateResponse, isVoucherValidateError, voucherValidateError]);

    useEffect(() => {
        window.scrollTo({
            top: 500,
            behavior: "smooth",
        });
    }, []);

    if (loadingShowtime || loadingMovie || loadingSeatMap || loadingFnb) {
        return <Loading/>;
    }

    console.log('selected seat', selectedSeats);
    console.log('grouped', groupedSeats);

    return (
        <div className="bg-[#0b0b0b] text-white min-h-screen">
            {/* Banner phim */}
            <Banner movieInfo={movie}/>

            {/* Popup combo */}
            <ComboPopup
                open={openPopup}
                onClose={() => setOpenPopup(false)}
                combos={fnbs || []}
                selectedCombos={selectedCombos}
                onConfirm={handleConfirmCombo}
            />


            {/* Thông tin suất chiếu */}
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
                Chọn ghế ngồi
            </p>

            {/* Bố cục chính */}
            <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-[2vw] pt-[1vw] pb-[4vw] px-[2vw]">
                {/* Cột trái - Sơ đồ ghế */}
                <div
                    className="lg:w-3/5 w-full flex flex-col items-center bg-[#121212] rounded-2xl p-[2vw] shadow-[0_0_25px_rgba(127,90,240,0.05)] border border-[#1f1f1f]">
                    <SeatSelection
                        seats={seatMapResponse?.seats}
                        selectedSeats={selectedSeats}
                        onToggleSeat={handleToggleSeat}
                    />
                </div>
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
                        onBack={() => setStep("summary")}
                    />
                )}
            </div>

            <Promotions/>
        </div>
    );
};

export default BookingPage;
