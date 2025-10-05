import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";

const ReviewItem = () => {
    return (
        <div className="border-t border-[#2a2a2a] pt-[1.4vw]">
            <div className="flex flex-col gap-[0.8vw]">

                {/* Avatar + Name + Date */}
                <div className="flex items-center gap-[1vw]">
                    <div className="h-[3vw] w-[3vw] rounded-full overflow-hidden
                          flex items-center justify-center border border-[#2a2a2a]">
                        <img
                            src="https://avatar.momocdn.net/avatar/6b5b/146fcc7969c26281ebdbd36d154f1fbce6e2a4d5f38cc544f8cf306976df.png"
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-semibold text-[1.1vw] text-[#eaeaea]">Mạc Hải Minh</p>
                        <p className="text-gray-500 text-[0.9vw]">12/12/2025</p>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <CircularProgressBar percent={90} size={2.6} strokeWidth={0.24}/>
                    <p className="text-[#7f5af0] font-medium">Đáng Xem</p>
                </div>

                {/* Nội dung */}
                <div>
                    <p className="text-gray-300 leading-relaxed">
                        Xem phim này buồn ngủ ghê, nhân vật chính đóng tệ hơn nhiều so với các nhân vật phụ.
                        Cái kết lãng xẹt.
                    </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
          <span className="px-[0.6vw] py-[0.2vw] text-[0.9vw] border border-[#7f5af0] text-[#7f5af0] rounded-md bg-[#7f5af0]/10">
            Đáng Tiền
          </span>
                    <span className="px-[0.6vw] py-[0.2vw] text-[0.9vw]
                           border border-[#7f5af0] text-[#7f5af0]
                           rounded-md bg-[#7f5af0]/10">
            Hài Hước
          </span>
                    <span className="px-[0.6vw] py-[0.2vw] text-[0.9vw]
                           border border-[#7f5af0] text-[#7f5af0]
                           rounded-md bg-[#7f5af0]/10">
            Kịch Tính
          </span>
                </div>
            </div>
        </div>
    );
};


export default ReviewItem;