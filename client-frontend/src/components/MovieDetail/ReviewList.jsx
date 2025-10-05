import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";
import ReviewItem from "./ReviewItem.jsx";
import ButtonMore from "../utils/ButtonMore.jsx";

const ReviewList = () => {
    return (
        <div className="text-white my-[2vw]">
            {/* Header */}
            <p className="font-bold text-[1.8vw] mb-[1.4vw] text-[#eaeaea] tracking-wide">
                💬 Bình luận từ người xem
            </p>

            {/* Container */}
            <div className="border border-[#1f1f1f] bg-[#141414] rounded-2xl
                      shadow-[0_0_20px_rgba(127,90,240,0.1)] p-[2vw]">

                {/* Tổng quan rating */}
                <div className="flex items-center gap-4 mb-[2vw]">
                    <CircularProgressBar percent={90} size={3.5} strokeWidth={0.3}/>
                    <p className="text-[1.2vw] text-gray-300">1K đánh giá</p>
                </div>

                {/* Danh sách review */}
                <div className="flex flex-col gap-[1.6vw]">
                    <ReviewItem />
                    <ReviewItem />
                    <ReviewItem />

                    <div className="flex justify-center mt-[1vw]">
                        <ButtonMore />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ReviewList;