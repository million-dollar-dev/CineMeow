import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilm,
    faLocationDot,
    faCalendarDays,
    faClock,
    faTicket,
    faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import CustomDropdown from "../common/CustomDropdown.jsx";
import { NOW_PLAYING_MOVIES } from "../NowPlaying/nowPlayingData.js";
import { MOCK_BRANDS } from "../Showtimes/mockShowtimesData.js";
import dayjs from "dayjs";

const QuickBookingWidget = () => {
    const navigate = useNavigate();

    const [selectedMovie, setSelectedMovie] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // Movie options
    const movieOptions = useMemo(() => {
        return [
            { value: "", label: "Chọn Phim Bạn Muốn Xem" },
            ...NOW_PLAYING_MOVIES.map((m) => ({
                value: m.id,
                label: m.title,
                rating: m.rating,
            })),
        ];
    }, []);

    // Brand options
    const brandOptions = useMemo(() => {
        return [
            { value: "", label: "Chọn Hệ Thống Rạp" },
            ...MOCK_BRANDS.map((b) => ({
                value: b.id,
                label: b.name,
            })),
        ];
    }, []);

    // Next 5 days options
    const dateOptions = useMemo(() => {
        const list = [{ value: "", label: "Chọn Ngày Xem" }];
        for (let i = 0; i < 5; i++) {
            const d = dayjs().add(i, "day");
            const label =
                i === 0
                    ? `Hôm nay (${d.format("DD/MM")})`
                    : i === 1
                    ? `Ngày mai (${d.format("DD/MM")})`
                    : `${d.format("dddd, DD/MM")}`;
            list.push({
                value: d.format("YYYY-MM-DD"),
                label: label,
            });
        }
        return list;
    }, []);

    // Showtimes slots options
    const timeOptions = useMemo(() => {
        return [
            { value: "", label: "Chọn Suất Chiếu" },
            { value: "09:30", label: "09:30 (Sáng - 2D Phụ đề)" },
            { value: "11:45", label: "11:45 (Trưa - 2D Phụ đề)" },
            { value: "14:15", label: "14:15 (Chiều - 2D Lồng tiếng)" },
            { value: "17:00", label: "17:00 (Chiều - IMAX 2D)" },
            { value: "19:30", label: "19:30 (Tối - Giờ Vàng)" },
            { value: "20:45", label: "20:45 (Tối - IMAX 2D)" },
            { value: "22:15", label: "22:15 (Khuya - Suất muộn)" },
        ];
    }, []);

    const handleQuickBook = () => {
        if (!selectedMovie) {
            toast.warning("Vui lòng chọn phim bạn muốn xem!");
            return;
        }

        // Navigate to the selected movie detail / booking
        navigate(`/movie/${selectedMovie}`);
        toast.info("Đang chuyển đến trang chọn ghế và lịch chiếu rạp...");
    };

    return (
        <section className="relative -mt-10 sm:-mt-14 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#11101d]/95 backdrop-blur-xl border border-violet-500/30 p-4 sm:p-6 md:p-8 shadow-2xl shadow-black/80">
                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                            <FontAwesomeIcon icon={faBolt} className="text-amber-400 text-sm" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                                <span>Đặt Vé Nhanh Trong 1 Phút</span>
                                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-violet-600/25 border border-violet-500/40 text-violet-300 text-[10px] font-bold">
                                    Tiện Lợi & Giữ Chỗ Sớm
                                </span>
                            </h2>
                        </div>
                    </div>
                    <span className="text-xs text-zinc-400 hidden md:block">
                        Chọn nhanh phim, rạp và giờ chiếu để nhận ưu đãi vé từ 45.000đ
                    </span>
                </div>

                {/* 4 Dropdown Selectors + 1 Action Button Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
                    {/* Step 1: Movie */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                            <FontAwesomeIcon icon={faFilm} className="text-violet-400 text-[10px]" />
                            <span>1. Chọn Phim</span>
                        </label>
                        <CustomDropdown
                            options={movieOptions}
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            placeholder="Chọn phim đang chiếu"
                        />
                    </div>

                    {/* Step 2: Cinema Brand */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                            <FontAwesomeIcon icon={faLocationDot} className="text-rose-400 text-[10px]" />
                            <span>2. Chọn Rạp</span>
                        </label>
                        <CustomDropdown
                            options={brandOptions}
                            value={selectedBrand}
                            onChange={setSelectedBrand}
                            placeholder="Chọn cụm rạp đối tác"
                        />
                    </div>

                    {/* Step 3: Date */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-amber-400 text-[10px]" />
                            <span>3. Chọn Ngày</span>
                        </label>
                        <CustomDropdown
                            options={dateOptions}
                            value={selectedDate}
                            onChange={setSelectedDate}
                            placeholder="Chọn ngày xem"
                        />
                    </div>

                    {/* Step 4: Time Slot */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} className="text-sky-400 text-[10px]" />
                            <span>4. Suất Chiếu</span>
                        </label>
                        <CustomDropdown
                            options={timeOptions}
                            value={selectedTime}
                            onChange={setSelectedTime}
                            placeholder="Chọn giờ chiếu"
                        />
                    </div>

                    {/* Action Button */}
                    <div className="sm:col-span-2 lg:col-span-1 pt-2 sm:pt-0 sm:self-end">
                        <button
                            type="button"
                            onClick={handleQuickBook}
                            className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-violet-600/40 hover:shadow-violet-600/60 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                            <FontAwesomeIcon icon={faTicket} className="text-xs" />
                            <span>Mua Vé Ngay</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickBookingWidget;
