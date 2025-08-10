import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faLocationCrosshairs, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import MovieDateSelector from "./MovieDateSelector.jsx";
import CinemaBrandSelector from "./CinemaBrandSelector.jsx";
import ShowtimesSelector from "./ShowtimesSelector.jsx";
import ButtonMore from "../utils/ButtonMore.jsx";

const ShowtimesList = () => {
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
    const showtimesData = [
        {
            id: 1,
            name: "CGV Aeon Bình Tân",
            address: "Tầng 5 | Vincom Mega Mall Thảo Điền, số 159 đường Xa Lộ Hà Nội, Quận 2, thành phố Hồ Chí Minh"
        },
        {
            id: 2,
            name: "CGV GigaMall Thủ Đức",
            address: "Tầng 6 | GigaMall, 240-242 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, TP.HCM"
        },
        {
            id: 3,
            name: "Lotte Cinema Nam Sài Gòn",
            address: "Lầu 3 | Lotte Mart Nam Sài Gòn, 469 Nguyễn Hữu Thọ, Quận 7, TP.HCM"
        },
        {
            id: 4,
            name: "Galaxy Nguyễn Du",
            address: "116 Nguyễn Du, Phường Bến Thành, Quận 1, TP.HCM"
        }
    ];

    // const [selectedShowtimes, setSelectedShowtimes] = React.useState(showtimesData[0]);
    return (
        <div className="text-white bg-black my-[2vw] bg-jet">
            <div className="">
                <div className="flex justify-between items-center my-[0.6vw]">
                    <p className="font-bold text-[1.8vw]">Lịch chiếu</p>
                    <div className="flex gap-[0.4vw]">
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
                </div>
                <div className="border border-2 border-gray-light bg-gray-sub rounded-xl my-[2vw]">
                    <div className="flex gap-[1vw] space-between justify-between my-[2vw] mx-[2vw]">
                        {
                            dateData.map((d) => {
                                return <MovieDateSelector date={d.date} day={d.day} key={d.day}/>
                            })
                        }
                    </div>
                    <div className="flex gap-[0.5vw] gap-[1vw] justify-center m-[2vw]">
                        {
                            cinemaData.map((c) => {
                                return <CinemaBrandSelector key={c.id} name={c.name} logoUrl={c.logoUrl}/>
                            })
                        }
                    </div>
                    <div className="mb-[2vw] text-black">
                        {
                            showtimesData.map((aShowtime) => {
                                return <ShowtimesSelector key={aShowtime.id} name={aShowtime.name}
                                                          address={aShowtime.address}/>
                            })
                        }
                        <ButtonMore />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShowtimesList;