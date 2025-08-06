import React from "react";

const Banner = ({title}) => {
    return (
        <div className="bg-gray-sub py-10 px-6 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {title} <span className="text-violet">CineMeow</span>
                    </h2>
                    <p className="text-gray-light mb-6 max-w-lg">
                        Khám phá thế giới điện ảnh tại những rạp chiếu phim hàng đầu, cùng
                        với thông tin lịch chiếu mới nhất và những bộ phim đang hot nhất hiện nay.
                    </p>
                    <ul className="space-y-3 text-left text-gray-light font-medium">
                        <li>✔️ Lịch chiếu luôn <span className="font-semibold text-white">cập nhật sớm nhất</span></li>
                        <li>✔️ <span className="font-semibold text-white">Suất chiếu đầy đủ </span>các rạp</li>
                        <li>✔️ Đặt lịch chiếu <span className="font-semibold text-white">mua vé siêu nhanh</span></li>
                        <li>✔️ <span className="font-semibold text-white"> Đặt vé lịch chiếu phim </span>yêu thích mọi nơi</li>
                    </ul>
                </div>
                <div className="flex-1 w-full max-w-md">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-bold text-black mb-2">
                            {title} trên CineMeow
                        </h3>
                        <p className="text-sm font-medium text-gray-800">
                            Ghế đẹp, giá hời, vào rạp{" "}
                            <span className="italic font-semibold text-black">không chờ đợi</span>
                        </p>
                        <div className="mt-4">
                            <img
                                src="/src/assets/img/banner_1.jpg"
                                alt="movie banner"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
