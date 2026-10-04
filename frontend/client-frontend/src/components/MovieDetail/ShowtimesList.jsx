import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faLocationDot, 
    faCalendarDays, 
    faFilm, 
    faBuilding, 
    faChevronDown,
    faClock
} from "@fortawesome/free-solid-svg-icons";
import MovieDateSelector from "./MovieDateSelector.jsx";
import CinemaBrandSelector from "./CinemaBrandSelector.jsx";
import ShowtimesSelector from "./ShowtimesSelector.jsx";
import CustomDropdown from "../common/CustomDropdown.jsx";
import { useGetAllBrandsQuery } from "../../services/brandService.js";
import { MOCK_BRANDS, MOCK_CINEMAS } from "../Showtimes/mockShowtimesData.js";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const CITIES = ["Tất cả khu vực", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];

const ShowtimesList = ({ showtimes = [], movieTitle = "Bộ phim", movieId }) => {
    // Generate next 7 days starting from TODAY (dynamic, no hardcoded past dates)
    const today = dayjs();
    const days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = today.add(i, "day");
            const weekday = i === 0 ? "Hôm nay" : date.format("dddd");
            return {
                iso: date.format("YYYY-MM-DD"),
                displayDate: date.format("MM/DD"),
                fullDate: date.format("YYYY-MM-DD"),
                weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
            };
        });
    }, []);

    const { data: brandsData = [] } = useGetAllBrandsQuery();
    const displayBrands = brandsData.length > 0 ? brandsData : MOCK_BRANDS;

    // Filters
    const [selectedDate, setSelectedDate] = useState(days[0].displayDate);
    const [selectedBrandId, setSelectedBrandId] = useState("all");
    const [selectedCity, setSelectedCity] = useState("Tất cả khu vực");

    // Compute or fallback showtimes
    const activeShowtimes = useMemo(() => {
        // If API showtimes provided and non-empty, use them
        if (Array.isArray(showtimes) && showtimes.length > 0) {
            return showtimes;
        }

        // Realistic Fallback Generation: create showtimes across MOCK_CINEMAS for the 7 days
        const generated = [];
        const baseSlots = [
            { startHour: "09:30", durationMin: 130, room: "Phòng chiếu 1", format: "2D Phụ đề" },
            { startHour: "12:15", durationMin: 130, room: "Phòng chiếu 2", format: "2D Phụ đề" },
            { startHour: "14:45", durationMin: 130, room: "Phòng IMAX Laser", format: "IMAX 2D" },
            { startHour: "17:30", durationMin: 130, room: "Phòng chiếu 1", format: "2D Phụ đề" },
            { startHour: "19:45", durationMin: 130, room: "Phòng IMAX Laser", format: "IMAX 2D" },
            { startHour: "22:15", durationMin: 130, room: "Phòng chiếu 3", format: "2D Lồng tiếng" },
        ];

        days.forEach((dayObj, dIdx) => {
            MOCK_CINEMAS.forEach((cinema, cIdx) => {
                // Vary slots slightly per cinema
                const cinemaSlots = baseSlots.slice((cIdx + dIdx) % 2, 6 - ((cIdx) % 2));
                cinemaSlots.forEach((slot, sIdx) => {
                    const start = dayjs(`${dayObj.fullDate}T${slot.startHour}:00`);
                    const end = start.add(slot.durationMin, "minute");
                    generated.push({
                        id: `st-${cinema.id}-${dayObj.displayDate.replace("/", "")}-${sIdx}`,
                        movieId: movieId || "movie-default",
                        cinemaId: cinema.id,
                        cinemaName: cinema.name,
                        cinemaAddress: cinema.address,
                        city: cinema.city,
                        brandId: cinema.brandId,
                        startTime: start.format("YYYY-MM-DDTHH:mm:ss"),
                        endTime: end.format("YYYY-MM-DDTHH:mm:ss"),
                        roomName: slot.room,
                        roomType: slot.format,
                        price: slot.format.includes("IMAX") ? 160000 : 95000,
                    });
                });
            });
        });

        return generated;
    }, [showtimes, days, movieId]);

    // Group showtimes by cinema based on active filters
    const groupedShowtimes = useMemo(() => {
        let filtered = [...activeShowtimes];

        // 1. Date filter
        if (selectedDate) {
            filtered = filtered.filter(
                (item) => dayjs(item.startTime).format("MM/DD") === selectedDate
            );
        }

        // 2. Brand filter
        if (selectedBrandId !== "all") {
            filtered = filtered.filter((item) => item.brandId === selectedBrandId);
        }

        // 3. City filter
        if (selectedCity !== "Tất cả khu vực") {
            filtered = filtered.filter((item) => item.city === selectedCity);
        }

        // Group by cinema
        const grouped = {};
        filtered.forEach((st) => {
            const cinemaId = st.cinemaId;
            if (!cinemaId) return;

            if (!grouped[cinemaId]) {
                const brandLogo =
                    displayBrands.find((b) => b.id === st.brandId)?.logoUrl ||
                    MOCK_CINEMAS.find((c) => c.id === cinemaId)?.brand?.logoUrl ||
                    null;

                grouped[cinemaId] = {
                    cinemaInfo: {
                        id: st.cinemaId,
                        name: st.cinemaName,
                        address: st.cinemaAddress,
                        logoUrl: brandLogo,
                        city: st.city,
                    },
                    showtimes: [],
                };
            }

            grouped[cinemaId].showtimes.push(st);
        });

        return grouped;
    }, [activeShowtimes, selectedDate, selectedBrandId, selectedCity, displayBrands]);

    const cinemaCount = Object.keys(groupedShowtimes).length;
    const totalSlotsCount = Object.values(groupedShowtimes).reduce((acc, curr) => acc + curr.showtimes.length, 0);

    return (
        <section id="showtimes-section" className="text-zinc-100 py-6 scroll-mt-24">
            {/* 1. Header Bar with City Picker & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
                        <span>Lịch Chiếu & Đặt Vé</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                        Chọn cụm rạp, suất chiếu phù hợp và đặt chỗ trực tuyến
                    </p>
                </div>

                {/* City Picker (Unified CustomDropdown) */}
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <CustomDropdown
                        icon={faLocationDot}
                        label={selectedCity}
                        options={CITIES}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        headerTitle="Khu Vực Chiếu"
                        align="right"
                        width="w-auto"
                        dropdownWidth="w-52"
                    />
                </div>
            </div>

            {/* 2. Main Box Container */}
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-4 sm:p-6 backdrop-blur-md shadow-2xl shadow-violet-950/20">
                {/* 2A. 7-Day Date Picker Slider */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-violet-400 text-xs" />
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                            Chọn Ngày Chiếu:
                        </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
                        {days.map((d) => (
                            <MovieDateSelector
                                key={d.iso}
                                date={d.displayDate}
                                day={d.weekday}
                                isSelected={selectedDate === d.displayDate}
                                handleClick={() => setSelectedDate(d.displayDate)}
                            />
                        ))}
                    </div>
                </div>

                {/* Subtle Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-6" />

                {/* 2B. Cinema Brand Chains Filter */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBuilding} className="text-violet-400 text-xs" />
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                                Chọn Chuỗi Rạp:
                            </span>
                        </div>
                        <span className="text-xs text-zinc-500">
                            {selectedBrandId === 'all' ? 'Tất cả các rạp' : displayBrands.find(b => b.id === selectedBrandId)?.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                        <CinemaBrandSelector
                            key="all"
                            name="Tất cả"
                            logoUrl="https://homepage.momocdn.net/next-js/_next/static/public/cinema/dexuat-icon.svg"
                            handleClick={() => setSelectedBrandId('all')}
                            isSelected={selectedBrandId === 'all'}
                        />
                        {displayBrands.map((b) => (
                            <CinemaBrandSelector
                                key={b.id}
                                name={b.name}
                                logoUrl={b.logoUrl}
                                handleClick={() => setSelectedBrandId(b.id)}
                                isSelected={selectedBrandId === b.id}
                            />
                        ))}
                    </div>
                </div>

                {/* Subtle Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-6" />

                {/* 2C. Showtimes List by Cinema */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Tìm thấy <strong className="text-white">{cinemaCount}</strong> rạp chiếu (
                            <strong className="text-violet-400">{totalSlotsCount}</strong> suất chiếu)
                        </span>
                    </div>

                    {cinemaCount === 0 ? (
                        <div className="text-center py-12 px-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
                            <div className="w-12 h-12 rounded-full bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto mb-3">
                                <FontAwesomeIcon icon={faFilm} className="text-lg" />
                            </div>
                            <h4 className="text-sm font-bold text-zinc-200">
                                Chưa có suất chiếu phù hợp
                            </h4>
                            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                                Hãy thử chọn ngày khác hoặc chọn tất cả chuỗi rạp để xem lịch chiếu sẵn có.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBrandId("all");
                                    setSelectedCity("Tất cả khu vực");
                                }}
                                className="mt-4 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {Object.values(groupedShowtimes).map(({ cinemaInfo, showtimes: slots }, idx) => (
                                <ShowtimesSelector
                                    key={cinemaInfo.id}
                                    name={cinemaInfo.name}
                                    address={cinemaInfo.address}
                                    logoUrl={cinemaInfo.logoUrl}
                                    showtimes={slots}
                                    defaultOpen={idx === 0 || cinemaCount <= 3}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ShowtimesList;