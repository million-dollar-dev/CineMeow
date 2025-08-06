import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronDown, faChevronRight,
    faLocationCrosshairs,
    faLocationDot,
    faMagnifyingGlass,

} from "@fortawesome/free-solid-svg-icons";
import MovieDateSelector from "../components/MovieDetail/MovieDateSelector.jsx";
import CinemaBrandSelector from "../components/MovieDetail/CinemaBrandSelector.jsx";
import ShowtimesSelector from "../components/MovieDetail/ShowtimesSelector.jsx";
import Banner from "../components/Banner.jsx";
import MovieAndShowtimeCard from "../components/Showtimes/MovieAndShowtimeCard.jsx";
import Promotions from "../components/PromotionSection.jsx";

const Showtimes = () => {
    const dateData = [
        {date: "11/07", day: "MON"},
        {date: "12/12", day: "TUE"},
        {date: "12/12", day: "WED"},
        {date: "12/12", day: "THU"},
        {date: "12/12", day: "FRI"},
        {date: "12/12", day: "SAT"},
        {date: "12/12", day: "SUN"},
    ]
    const cinemaData = [
        {
            id: 1,
            name: "CVG",
            logoUrl: "123"
        },
        {
            id: 2,
            name: "Lotte Cinema",
            logoUrl: "123"
        },
        {
            id: 3,
            name: "CineStar",
            logoUrl: "123"
        },
        {
            id: 4,
            name: "Galaxy Cinema",
            logoUrl: "123"
        },
        {
            id: 5,
            name: "Beta Cinemas",
            logoUrl: "123"
        },
        {
            id: 6,
            name: "BHD Star",
            logoUrl: "123"
        },
    ]
    // const showtimesData = [
    //     {
    //         id: 1,
    //         name: "CGV Aeon Bình Tân",
    //         address: "Tầng 5 | Vincom Mega Mall Thảo Điền, số 159 đường Xa Lộ Hà Nội, Quận 2, thành phố Hồ Chí Minh"
    //     },
    //     {
    //         id: 2,
    //         name: "CGV GigaMall Thủ Đức",
    //         address: "Tầng 6 | GigaMall, 240-242 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, TP.HCM"
    //     },
    //     {
    //         id: 3,
    //         name: "Lotte Cinema Nam Sài Gòn",
    //         address: "Lầu 3 | Lotte Mart Nam Sài Gòn, 469 Nguyễn Hữu Thọ, Quận 7, TP.HCM"
    //     },
    //     {
    //         id: 4,
    //         name: "Galaxy Nguyễn Du",
    //         address: "116 Nguyễn Du, Phường Bến Thành, Quận 1, TP.HCM"
    //     }
    // ];

    // const [selectedShowtimes, setSelectedShowtimes] = React.useState(showtimesData[0]);
    return (
        <div className="bg-black text-white pt-[5vw]">
            <Banner title={"Lịch chiếu phim hôm nay"}/>
            <p className="font-bold text-[2vw] text-center my-[2vw]">Lịch Chiếu phim</p>
            <div className="border border-gray-light rounded-md max-w-screen-xl mx-auto bg-gray-dark">
                <div className="border-b p-[2vw]">
                    <div className="flex gap-[0.4vw] items-center">
                        <p>Vị trí</p>
                        <button
                            className="bg-white text-black px-[1vw] py-[0.6vw] border rounded-full flex items-center gap-[2vw]">
                            <div>
                                <FontAwesomeIcon icon={faLocationDot} className="mr-[0.6vw]"/>
                                Hồ Chí Minh
                            </div>
                            <FontAwesomeIcon icon={faChevronDown}/>
                        </button>
                        <button className="bg-white text-black px-[1vw] py-[0.6vw] border rounded-full">
                            <FontAwesomeIcon icon={faLocationCrosshairs} className="mr-[0.6vw]"/>
                            Gần bạn
                        </button>
                    </div>
                    <div>
                        <div className="flex gap-[0.5vw] gap-[1vw] justify-center m-[2vw]">
                            {
                                cinemaData.map((c) => {
                                    return <CinemaBrandSelector key={c.id} name={c.name} logoUrl={c.logoUrl}/>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex-col gap-[0.4vw] items-center flex-1">
                        <div>
                            <input
                                type="text"
                                placeholder="Tìm theo rạp "
                                className="w-full py-[0.8vw] px-[1vw]"
                            />

                        </div>
                        <button className="bg-gray-sub flex items-center gap-[2vw] px-[1.4vw] py-[1vw] w-full border border-gray-light justify-between">
                            <div className="flex items-center gap-[1vw]">
                                <div className="w-[3.2vw] h-[3.2vw] border-2 border-gray-400 rounded-lg overflow-hidden flex items-center justify-center">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"
                                        alt="CGV Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <p>CGV Thủ Đức</p>
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                    <div className="flex-[2] border-l">
                        <div className="flex gap-[1vw] items-center py-[2vw] px-[2vw] bg-gray-sub">
                            <div className="flex items-center gap-[1vw] ">
                                <div className="w-[3.2vw] h-[3.2vw] border-2 border-gray-400 rounded-lg overflow-hidden flex items-center justify-center">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"
                                        alt="CGV Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                            <div>
                                <a href="" className="hover:text-violet font-bold">Lịch chiếu phim CGV Hùng Vương Plaza</a>
                                <div className="text-gray-light">Tầng 7 | Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh
                                    <a href="" className="text-violet"> [ Bản đồ ]</a></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-[1vw] space-between justify-between my-[2vw] mx-[2vw]">
                                {
                                    dateData.map((d) => {
                                        return <MovieDateSelector date={d.date} day={d.day} key={d.day}/>
                                    })
                                }
                            </div>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto pl-[2vw]">
                            <MovieAndShowtimeCard />
                            <MovieAndShowtimeCard />
                            <MovieAndShowtimeCard />

                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-screen-xl mx-auto">
                <Promotions />
            </div>
        </div>
    );
};

export default Showtimes;