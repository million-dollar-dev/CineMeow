import React, {useState} from "react";
import {faClockRotateLeft, faLock, faRightFromBracket, faUser,} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSelector} from "react-redux";
import UserProfileForm from "../components/UserProfile/UserProfileForm.jsx";
import BookingHistory from "../components/UserProfile/BookingHistory.jsx";
import {useSearchBookingQuery} from "../services/bookingService.js";

export default function UserProfile() {
    const [activeTab, setActiveTab] = useState("info");
    const user = useSelector((state) => state.user);
    const {
        data: historyResponse = [],
        isLoading,
        isError,
        errors
    } = useSearchBookingQuery(
        {
            sort: "createdAt,desc",
            filters: [`userId:"${user?.userId}"`],
        },
        {skip: !user?.userId,}
    );
    const handleHistoryClick = () => {
        setActiveTab("history")
    }

    console.log('hi', historyResponse);
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
                            onClick={() => handleHistoryClick()}
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
                            <UserProfileForm/>

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
                        <BookingHistory
                            history={historyResponse}
                            isLoading={isLoading}
                        />
                    )}

                </main>
            </div>
        </div>
    );
}
