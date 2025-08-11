import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Banner from "../components/MovieDetail/Banner.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Promotions from "../components/PromotionSection.jsx";

const BookingPage = () => {
    const {movieId} = useParams();
    const [movieInfo, setMovieInfo] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const rows = ["A", "B", "C", "D", "E", "F"];
    const seatsPerRow = 12;
    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeat = (seat) => {
        setSelectedSeats((prev) =>
            prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
        );
    };
    useEffect(() => {
        window.scrollTo({
            top: 500,
            behavior: "smooth", // cuộn mượt
        });
    }, []);
    useEffect(() => {
        console.log(movieId);
        setIsLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjYzZGE3N2NiMGM3MjBhYzA5YWEyNzUwM2U2NWRlZiIsIm5iZiI6MTc1MTA5NzczMC4xODcsInN1YiI6IjY4NWZhMTgyMzllNDRlYmMxZWRlYmM0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lkquOyV3pva_h3EMIUppdPCWuLRHj9D-j-Wo3IOZFHk",

            },
        }).then(async (res) => {
            const data = await res.json();
            console.log(data);
            setMovieInfo(data);
        }).catch((err) => {
            console.log(err);
        }).finally(() => setIsLoading(false));
    }, [movieId]);

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className="bg-black text-white">
            <Banner movieInfo={movieInfo}/>
            <div className="bg-gray-dark flex items-center justify-center py-[1vw]" >
                <div className="px-[2vw] py-[1vw]">
                    <p>Rạp</p>
                    <p className="text-gray-light">CGV Hùng Vương Plaza</p>
                </div>
                <div className="px-[2vw] py-[1vw] border-x">
                    <p>Rạp</p>
                    <p className="text-gray-light">CGV Hùng Vương Plaza</p>
                </div>
                <div className="px-[2vw] py-[1vw]">
                    <p>Rạp</p>
                    <p className="text-gray-light">CGV Hùng Vương Plaza</p>
                </div>
            </div>
            <p className="text-center font-bold text-[2vw] py-[2vw]">Chọn ghế</p>
            <div className="max-w-screen-xl mx-auto flex pt-[2vw] pb-[4vw]">
                {/* Cột phải - Sơ đồ */}
                <div className="w-3/4 flex flex-col items-center">
                    {/* Legend */}
                    <div className="flex gap-6 mb-6 justify-between">
                        <div className="flex gap-4">
                            <Legend color="border-blue-400" label="Normal"/>
                            <Legend color="border-green-400" label="Deluxe"/>
                            <Legend color="border-yellow-400" label="Super"/>
                        </div>
                        <div className="flex gap-4">
                            <Legend color="bg-blue-800" label="Sold"/>
                            <Legend color="border-white" label="Available"/>
                            <Legend color="bg-violet" label="Selected"/>
                        </div>
                    </div>

                    {/* Màn hình cong */}
                    <div className="w-full max-w-3xl mb-6">
                        <div className="bg-gradient-to-b from-white to-transparent h-8 rounded-t-full"></div>
                        <p className="text-center text-sm mt-1">MÀN HÌNH</p>
                    </div>

                    {/* Ghế */}
                    <div className="space-y-2">
                        {rows.map((row) => (
                            <div key={row} className="flex items-center gap-2">
                                <span className="w-4">{row}</span>
                                <div className="flex gap-2">
                                    {Array.from({length: seatsPerRow}, (_, i) => {
                                        const seatNumber = `${row}${i + 1}`;
                                        const isSelected = selectedSeats.includes(seatNumber);
                                        const isSold = false;
                                        return (
                                            <button
                                                key={seatNumber}
                                                onClick={() => !isSold && toggleSeat(seatNumber)}
                                                className={`w-10 h-10 border rounded-sm text-sm flex items-center justify-center
                        ${
                                                    isSold
                                                        ? "bg-blue-800 cursor-not-allowed"
                                                        : isSelected
                                                            ? "bg-violet text-white"
                                                            : "border-white hover:bg-white hover:text-black"
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className="w-4">{row}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/4 bg-gray-sub p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Ghế đã chọn</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedSeats.map((s) => (
                            <span
                                key={s}
                                className="bg-violet text-white px-3 py-1 rounded-md text-sm font-semibold"
                            >
              {s}
            </span>
                        ))}
                    </div>
                    <button className="my-4 w-full bg-gray-light text-white py-2 rounded-full">
                        <FontAwesomeIcon icon={faPlus}/> Thêm bawps nước
                    </button>
                    <hr/>
                    <div className="space-y-2 text-[1.4vw] my-4">
                        <div className="flex justify-between font-bold">
                            <span>Tổng đơn hàng</span>
                            <span>
                                100000đ
                            </span>
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-white text-black py-2 rounded-full font-semibold">
                        Tiếp tục
                    </button>
                </div>
            </div>
            <Promotions />
        </div>
    );
};

function Legend({color, label}) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded-sm border ${color}`}></div>
            <span>{label}</span>
        </div>
    );
}

export default BookingPage;