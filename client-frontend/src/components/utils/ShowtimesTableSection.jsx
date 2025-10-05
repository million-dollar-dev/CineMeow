import React, {useMemo} from 'react';
import {faChevronDown, faChevronRight, faLocationCrosshairs, faLocationDot,} from "@fortawesome/free-solid-svg-icons";
import MovieAndShowtimeCard from "../Showtimes/MovieAndShowtimeCard.jsx";
import MovieDateSelector from "../MovieDetail/MovieDateSelector.jsx";
import CinemaBrandSelector from "../MovieDetail/CinemaBrandSelector.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import {useGetAllBrandsQuery} from "../../services/brandService.js";
const ShowtimesTableSection = () => {
    const startDate = dayjs("2025-10-04T16:10:00");

    const days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = startDate.add(i, "day");
            return {
                iso: date.format("YYYY-MM-DDTHH:mm:ss"),
                displayDate: date.format("MM/DD"),
                weekday: date.format("dddd"),
            };
        });
    }, [startDate]);

    const { data: brandsData = [] } = useGetAllBrandsQuery();

    return (
        <div className="my-[3vw] text-white ">
            {/* Tiêu đề */}
            <p className="font-extrabold text-[1.8vw] text-center mb-[1.6vw] tracking-wide text-[#eaeaea]">
                🎞️ Lịch chiếu phim
            </p>

            {/* Khung chính */}
            <div className="max-w-screen-xl mx-auto bg-[#141414] rounded-2xl border border-[#1f1f1f] shadow-[0_0_20px_rgba(127,90,240,0.1)] overflow-hidden">

                {/* Bộ chọn vị trí */}
                <div className="border-b border-[#2a2a2a] py-[1vw] px-[1.4vw] flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-[0.8vw]">
                        <p className="text-[0.95vw] text-gray-300">Vị trí:</p>

                        <button
                            className="flex items-center gap-[0.6vw] bg-[#7f5af0] text-white px-[0.8vw] py-[0.45vw]
            rounded-full font-medium transition-all duration-300 hover:bg-[#9f7bff] active:scale-95 shadow-[0_0_8px_rgba(127,90,240,0.4)]"
                        >
                            <FontAwesomeIcon icon={faLocationDot} />
                            Hồ Chí Minh
                            <FontAwesomeIcon icon={faChevronDown} className="ml-[0.2vw]" />
                        </button>

                        <button
                            className="flex items-center gap-[0.5vw] bg-transparent border border-[#7f5af0] text-[#7f5af0]
            px-[0.9vw] py-[0.45vw] rounded-full font-medium transition-all duration-300 hover:bg-[#7f5af0] hover:text-white active:scale-95"
                        >
                            <FontAwesomeIcon icon={faLocationCrosshairs} />
                            Gần bạn
                        </button>
                    </div>
                </div>

                {/* Bộ chọn thương hiệu */}
                <div className="py-[0.4vw] border-b border-[#2a2a2a] bg-[#181818]">
                    <div className="flex flex-wrap justify-center gap-[1vw] px-[1.4vw]">
                        {brandsData.map((c) => (
                            <CinemaBrandSelector key={c.id} name={c.name} logoUrl={c.logoUrl} />
                        ))}
                    </div>
                </div>

                {/* Nội dung 2 cột */}
                <div className="flex flex-col lg:flex-row">
                    {/* Cột trái (thu nhỏ hợp lý) */}
                    <div className="flex-[0.45] border-r border-[#2a2a2a] bg-[#121212] p-[1.1vw]">
                        {/* Thanh tìm kiếm */}
                        <div className="relative mb-[1vw]">
                            <input
                                type="text"
                                placeholder="🔍 Tìm theo rạp..."
                                className="w-full py-[0.5vw] px-[0.7vw] rounded-md bg-[#1b1b1b] border border-[#2a2a2a]
              text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition-all duration-300 text-[0.85vw]"
                            />
                        </div>

                        {/* Một rạp */}
                        <button
                            className="flex items-center justify-between w-full bg-[#1b1b1b] hover:bg-[#222222]
            border border-[#2a2a2a] rounded-md px-[0.9vw] py-[0.6vw] transition-all duration-300"
                        >
                            <div className="flex items-center gap-[0.6vw]">
                                <div className="w-[2.4vw] h-[2.4vw] rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"
                                        alt="CGV Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <p className="text-[0.8vw] font-medium text-gray-200 truncate">CGV Thủ Đức</p>
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-[0.75vw]" />
                        </button>
                    </div>

                    {/* Cột phải */}
                    <div className="flex-[2.55] bg-[#141414]">
                        {/* Tiêu đề rạp */}
                        <div className="flex items-center gap-[0.8vw] py-[1vw] px-[1.2vw] border-b border-[#2a2a2a]">
                            <div className="w-[2.6vw] h-[2.6vw] rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"
                                    alt="CGV Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div>
                                <a
                                    href="#"
                                    className="text-[1vw] font-semibold hover:text-[#7f5af0] transition"
                                >
                                    Lịch chiếu phim CGV Hùng Vương Plaza
                                </a>
                                <p className="text-gray-400 text-[0.85vw]">
                                    Tầng 7 | Hùng Vương Plaza 126 Hùng Vương, Q.5, TP.HCM
                                    <a href="#" className="text-[#7f5af0] hover:underline ml-[0.3vw]">
                                        [Bản đồ]
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Ngày chiếu */}
                        <div className="flex justify-center gap-[0.8vw] flex-wrap px-[1.6vw] py-[1.2vw] border-b border-[#2a2a2a]">
                            {days.map((d) => (
                                <MovieDateSelector key={d.iso} date={d.displayDate} day={d.weekday} />
                            ))}
                        </div>

                        {/* Danh sách phim */}
                        <div className="max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2f2f2f] scrollbar-track-transparent px-[1.6vw] py-[1.2vw]">
                            <MovieAndShowtimeCard />
                            <MovieAndShowtimeCard />
                            <MovieAndShowtimeCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default ShowtimesTableSection;