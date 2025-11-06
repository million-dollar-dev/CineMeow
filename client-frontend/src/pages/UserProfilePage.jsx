import React, {useState} from "react";
import {
    faClock,
    faClockRotateLeft,
    faEnvelope,
    faLock,
    faPhone,
    faRightFromBracket,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSelector} from "react-redux";
import UserProfileForm from "../components/UserProfile/UserProfileForm.jsx";

export default function UserProfile() {
    const [activeTab, setActiveTab] = useState("info");
    const user = useSelector((state) => state.user);

    return (
        <div className="py-[6vw] bg-[#141414]">
            <div className="min-h-screen bg-[#141414] text-[#eaeaea] flex max-w-screen-xl mx-auto">
                {/* SIDEBAR */}
                <aside
                    className="w-1/4 bg-[#1b1b1b] rounded-2xl p-6 flex flex-col items-center shadow-[0_0_15px_rgba(127,90,240,0.1)] border border-[#2a2a2a]">
                    {/* Avatar */}
                    <div className="text-center mb-5">
                        <h2 className="font-semibold text-[#eaeaea]">{user.name}</h2>
                    </div>

                    {/* C'Friends card */}
                    <div
                        className="w-full bg-[#7f5af0] text-white font-semibold py-2 text-center rounded-md mb-3 shadow-[0_0_10px_rgba(127,90,240,0.4)]">
                        C'Friends
                    </div>

                    {/* Progress bar */}
                    <div className="w-full mb-8">
                        <p className="text-xs text-gray-400 mb-1">Tích điểm C'Friends</p>
                        <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                            <div className="w-1/4 bg-[#7f5af0] h-2 rounded-full"></div>
                        </div>
                        <p className="text-xs mt-1 text-gray-500">0/10K</p>
                    </div>

                    {/* NAV */}
                    <nav className="flex flex-col gap-2 w-full">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm border border-transparent transition-all duration-300 ${
                                activeTab === "info"
                                    ? "bg-[#7f5af0]/20 border-[#7f5af0] text-[#7f5af0]"
                                    : "hover:bg-[#1f1f1f] text-gray-300"
                            }`}
                        >
                            <FontAwesomeIcon icon={faUser}/>
                            Thông tin khách hàng
                        </button>

                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm border border-transparent transition-all duration-300 ${
                                activeTab === "history"
                                    ? "bg-[#7f5af0]/20 border-[#7f5af0] text-[#7f5af0]"
                                    : "hover:bg-[#1f1f1f] text-gray-300"
                            }`}
                        >
                            <FontAwesomeIcon icon={faClockRotateLeft}/>
                            Lịch sử đặt vé
                        </button>

                        {/* Logout */}
                        <button
                            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm border border-transparent transition-all duration-300 text-[#ff5c5c] hover:text-[#ff7676]">
                            <FontAwesomeIcon icon={faRightFromBracket}/>
                            Đăng xuất
                        </button>
                    </nav>


                </aside>

                {/* MAIN CONTENT */}
                <main
                    className="flex-1 bg-[#1b1b1b] rounded-2xl p-8 ml-6 border border-[#2a2a2a] shadow-[0_0_20px_rgba(127,90,240,0.1)]">
                    {activeTab === "info" && (
                        <>
                            <h1 className="text-2xl font-bold mb-6 uppercase tracking-wide text-[#eaeaea]">
                                Thông tin khách hàng
                            </h1>

                            {/* Personal Info */}
                            <UserProfileForm />

                            {/* Change Password */}
                            <section
                                className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 shadow-[0_0_10px_rgba(127,90,240,0.05)]">
                                <h2 className="font-bold text-lg mb-4 text-[#eaeaea]">Đổi mật khẩu</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faLock}
                                            className="absolute right-3 top-3 text-gray-500"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu cũ"
                                            className="w-full bg-[#1b1b1b] border border-[#2a2a2a] text-[#eaeaea] rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faLock}
                                            className="absolute right-3 top-3 text-gray-500"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu mới"
                                            className="w-full bg-[#1b1b1b] border border-[#2a2a2a] text-[#eaeaea] rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faLock}
                                            className="absolute right-3 top-3 text-gray-500"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Xác nhận mật khẩu mới"
                                            className="w-full bg-[#1b1b1b] border border-[#2a2a2a] text-[#eaeaea] rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                                        />
                                    </div>
                                </div>

                                <button
                                    className="mt-4 bg-[#7f5af0] text-white px-6 py-2 rounded-md font-medium hover:bg-[#9f7bff] active:scale-95 transition">
                                    Đổi mật khẩu
                                </button>
                            </section>
                        </>
                    )}

                    {activeTab === "history" && (
                        <section>
                            <h1 className="text-2xl font-bold mb-6 uppercase tracking-wide text-[#eaeaea]">
                                Lịch sử đặt vé
                            </h1>

                            <div
                                className="p-4 h-[500px]
                 overflow-y-auto scrollbar-thin scrollbar-track-transparent
                 shadow-[0_0_15px_rgba(127,90,240,0.08)]"
                            >
                                {/* Mock dữ liệu */}
                                {[
                                    {
                                        id: 1,
                                        movie: "Avengers: Endgame",
                                        cinema: "CGV Hùng Vương Plaza",
                                        date: "25/10/2025",
                                        time: "19:30",
                                        seats: ["E7", "E8"],
                                        total: "240,000₫",
                                        poster:
                                            "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_UF894,1000_QL80_.jpg",
                                    },
                                    {
                                        id: 2,
                                        movie: "Doraemon: Nobita và Vũ trụ phiêu lưu ký",
                                        cinema: "Lotte Cinema Gò Vấp",
                                        date: "14/09/2025",
                                        time: "14:00",
                                        seats: ["C3"],
                                        total: "120,000₫",
                                        poster:
                                            "https://upload.wikimedia.org/wikipedia/vi/2/22/Doraemon_Movie_2019_poster.jpg",
                                    },
                                    {
                                        id: 3,
                                        movie: "Inside Out 2",
                                        cinema: "BHD Star Bitexco",
                                        date: "12/08/2025",
                                        time: "16:45",
                                        seats: ["G5", "G6", "G7"],
                                        total: "360,000₫",
                                        poster:
                                            "https://lumiere-a.akamaihd.net/v1/images/p_insideout2_639b8d4e.jpeg",
                                    },
                                    {
                                        id: 4,
                                        movie: "Venom: The Last Dance",
                                        cinema: "Galaxy Nguyễn Du",
                                        date: "05/07/2025",
                                        time: "20:00",
                                        seats: ["B4", "B5"],
                                        total: "220,000₫",
                                        poster:
                                            "https://m.media-amazon.com/images/I/81Wf0kk6FAL._AC_UF894,1000_QL80_.jpg",
                                    },
                                ].map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="flex items-center gap-4 bg-[#1b1b1b] border border-[#2a2a2a]
                     rounded-lg p-4 mb-4 last:mb-0 transition-all duration-500
                     hover:shadow-[0_0_15px_rgba(127,90,240,0.25)] hover:border-[#7f5af0]/60"
                                    >
                                        {/* Ảnh phim */}
                                        <div className="w-[70px] h-[100px] rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={ticket.poster}
                                                alt={ticket.movie}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Thông tin vé */}
                                        <div className="flex-1 text-gray-300">
                                            <h3 className="text-lg font-semibold text-[#eaeaea]">
                                                {ticket.movie}
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {ticket.cinema}
                                            </p>
                                            <p className="text-sm mt-1">
                                                {ticket.date} |{" "}
                                                <FontAwesomeIcon
                                                    icon={faClock}
                                                    className="ml-2 mr-1 text-[#7f5af0]"
                                                />
                                                {ticket.time}
                                            </p>
                                            <p className="text-sm mt-1">
                                                Ghế:{" "}
                                                <span className="text-[#7f5af0] font-medium">
                {ticket.seats.join(", ")}
              </span>
                                            </p>
                                        </div>

                                        {/* Tổng tiền + nút */}
                                        <div className="flex flex-col items-end">
                                            <p className="text-sm text-gray-400 mb-2">
                                                Tổng tiền:{" "}
                                                <span className="text-[#7f5af0] font-semibold">
                {ticket.total}
              </span>
                                            </p>
                                            <button
                                                className="text-sm px-4 py-1.5 rounded-md border border-[#7f5af0] text-[#7f5af0]
                         hover:bg-[#7f5af0] hover:text-white transition-all duration-300 active:scale-95"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </main>
            </div>
        </div>
    );
}
