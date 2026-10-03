import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faLocationCrosshairs, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import MovieDateSelector from "./MovieDateSelector.jsx";
import CinemaBrandSelector from "./CinemaBrandSelector.jsx";
import ShowtimesSelector from "./ShowtimesSelector.jsx";
import ButtonMore from "../utils/ButtonMore.jsx";
import {useGetAllBrandsQuery} from "../../services/brandService.js";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const ShowtimesList = ({showtimes = []}) => {
    const startDate = dayjs("2025-10-04T16:10:00");

    const days = useMemo(() => {
        return Array.from({length: 7}, (_, i) => {
            const date = startDate.add(i, "day");
            return {
                iso: date.format("YYYY-MM-DDTHH:mm:ss"),
                displayDate: date.format("MM/DD"),
                weekday: date.format("dddd"),
            };
        });
    }, [startDate]);

    const {data: brandsData = []} = useGetAllBrandsQuery();

    const [selectedBrandId, setSelectedBrandId] = useState("all");
    const [selectedDate, setSelectedDate] = useState(days[0].displayDate);
    const [groupedShowtimes, setGroupedShowtimes] = useState({});

    const memoizedShowtimes = useMemo(() => showtimes, [JSON.stringify(showtimes)]);
    const memoizedBrands = useMemo(() => brandsData, [JSON.stringify(brandsData)]);

    const filterShowtimes = useCallback(() => {
        let filtered = [...memoizedShowtimes];

        // Filter theo ngày
        if (selectedDate) {
            filtered = filtered.filter(
                (item) => dayjs(item.startTime).format("MM/DD") === selectedDate
            );
        }

        // Filter theo thương hiệu
        if (selectedBrandId !== "all") {
            filtered = filtered.filter((item) => item.brandId === selectedBrandId);
        }

        // Gom nhóm theo rạp
        const grouped = filtered.reduce((acc, showtime) => {
            const cinemaId = showtime.cinemaId;
            if (!cinemaId) return acc;

            if (!acc[cinemaId]) {
                const brandLogo = memoizedBrands.find((b) => b.id === showtime.brandId)?.logoUrl || null;

                acc[cinemaId] = {
                    cinemaInfo: {
                        id: showtime.cinemaId,
                        name: showtime.cinemaName,
                        address: showtime.cinemaAddress,
                        logoUrl: brandLogo,
                    },
                    showtimes: [],
                };
            }

            acc[cinemaId].showtimes.push(showtime);
            return acc;
        }, {});

        setGroupedShowtimes(grouped);
    }, [memoizedShowtimes, memoizedBrands, selectedBrandId, selectedDate]);

    // ✅ useEffect an toàn: chỉ chạy khi filterShowtimes thay đổi thực sự
    useEffect(() => {
        filterShowtimes();
    }, [filterShowtimes]);

    const handleSelectDate = (date) => setSelectedDate(date);
    const handleSelectBrand = (brand) =>
        setSelectedBrandId(brand === "all" ? "all" : brand.id);

    console.log(groupedShowtimes);

    return (
        <div className="text-white min-h-screen py-[2vw]">
            {/* Header */}
            <div className="flex justify-between items-center mb-[1vw]">
                <p className="font-bold text-[1.8vw] text-[#eaeaea] tracking-wide flex items-center gap-[0.6vw]">
                    Lịch chiếu
                </p>

                <div className="flex gap-[0.6vw]">
                    <button className="flex items-center gap-[0.8vw] bg-[#7f5af0] text-white px-[1vw] py-[0.6vw]
                    rounded-full font-medium transition-all duration-300 hover:bg-[#9f7bff] active:scale-95
                    shadow-[0_0_10px_rgba(127,90,240,0.5)]"
                    >
                        <FontAwesomeIcon icon={faLocationDot}/>
                        Hồ Chí Minh
                        <FontAwesomeIcon icon={faChevronDown} className="ml-[0.4vw]"/>
                    </button>

                    <button className="flex items-center gap-[0.6vw] bg-transparent border border-[#7f5af0]
                    text-[#7f5af0] px-[1vw] py-[0.6vw] rounded-full font-medium transition-all duration-300
                    hover:bg-[#7f5af0] hover:text-white active:scale-95"
                    >
                        <FontAwesomeIcon icon={faLocationCrosshairs}/>
                        Gần bạn
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="border border-[#1f1f1f] bg-[#141414] rounded-2xl shadow-[0_0_20px_rgba(127,90,240,0.15)] my-[2vw]">
                {/* Bộ chọn ngày */}
                <div className="flex justify-between gap-[1vw] overflow-x-auto px-[2vw] py-[1.6vw] scrollbar-hide">
                    {days.map((d) => (
                        <MovieDateSelector
                            key={d.iso}
                            date={d.displayDate}
                            day={d.weekday}
                            isSelected={selectedDate === d.displayDate}
                            handleClick={() => handleSelectDate(d.displayDate)}
                        />
                    ))}
                </div>

                {/* Divider */}
                <div className="mx-[2vw] my-[0.6vw] h-[1px] bg-gradient-to-r from-transparent via-[#7f5af0]/40 to-transparent"/>

                {/* Bộ chọn brand */}
                <div className="flex flex-wrap justify-center gap-[1.2vw]
                      px-[2vw] pb-[2vw] pt-[1vw]">
                    <CinemaBrandSelector
                        key="all"
                        name="Tất cả"
                        logoUrl="https://homepage.momocdn.net/next-js/_next/static/public/cinema/dexuat-icon.svg"
                        handleClick={() => handleSelectBrand('all')}
                        isSelected={selectedBrandId === 'all'}
                    />
                    {brandsData.map((c) => (
                        <CinemaBrandSelector
                            key={c.id}
                            name={c.name}
                            logoUrl={c.logoUrl}
                            handleClick={() => handleSelectBrand(c)}
                            isSelected={selectedBrandId === c.id}
                        />
                    ))}
                </div>

                {/* Danh sách suất chiếu */}
                <div className="text-white px-[2vw] pb-[2vw]">
                    {Object.keys(groupedShowtimes).length === 0 ? (
                        <div className="text-center py-[3vw] text-gray-500 text-[1.1vw] italic">
                            Chưa có suất chiếu nào cho ngày này 🎭
                        </div>
                    ) : (
                        Object.values(groupedShowtimes).map(({cinemaInfo, showtimes}) => (
                            <ShowtimesSelector
                                key={cinemaInfo.id}
                                name={cinemaInfo.name}
                                address={cinemaInfo.address}
                                logoUrl={cinemaInfo.logoUrl}
                                showtimes={showtimes}
                            />
                        ))
                    )}

                    <div className="flex justify-center mt-[2vw]">
                        <ButtonMore/>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ShowtimesList;