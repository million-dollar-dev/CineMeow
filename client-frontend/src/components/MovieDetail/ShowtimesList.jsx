import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faLocationCrosshairs, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import MovieDateSelector from "./MovieDateSelector.jsx";
import CinemaBrandSelector from "./CinemaBrandSelector.jsx";
import ShowtimesSelector from "./ShowtimesSelector.jsx";

const ShowtimesList = () => {
    const dateData = [
        {date: "11/07", day: "MON"},
        {date: "12/12", day: "Tue"},
        {date: "12/12", day: "Wed"},
        {date: "12/12", day: "Thu"},
        {date: "12/12", day: "Fri"},
        {date: "12/12", day: "Sat"},
        {date: "12/12", day: "Sun"},
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
    return (
        <div className="text-white my-[2vw]">
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
                <div className="border border-2 border-white">
                    <div className="flex gap-[1vw] space-between justify-between my-[1vw] mx-[1vw]">
                        {
                            dateData.map((d) => {
                                return <MovieDateSelector date={d.date} day={d.day} key={d.day}/>
                            })
                        }
                    </div>
                    <div className="flex gap-[0.5vw] gap-[1vw] justify-center m-[2vw]">
                        {
                            cinemaData.map((c) => {
                                return <CinemaBrandSelector key={c.id}/>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="bg-white text-black">
                <ShowtimesSelector/>
            </div>
        </div>
    );
};

export default ShowtimesList;