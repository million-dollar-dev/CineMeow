import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";
import ReviewItem from "./ReviewItem.jsx";

const ReviewList = () => {
    return (
        <div className="text-white my-[2vw]">
            <p className="font-bold text-[1.8vw] my-[2vw]">Bình luận từ người xem</p>
            <div className="border border-2 border-gray-light bg-gray-sub rounded-xl p-[2vw]">
                <div className="flex items-center gap-2  my-[2vw]">
                    <CircularProgressBar percent={90} size={3.5} strokeWidth={0.3}/>
                    <p>1K đánh giá</p>
                </div>
                <div className="gap-[2vw] flex flex-col">
                    <ReviewItem/>
                    <ReviewItem/>
                    <ReviewItem/>
                    <div className="flex justify-center">
                        <button
                            className="rounded-full px-[1.6vw] py-[0.6vw] font-semibold bg-white bg-opacity-10 flex items-center text-black"
                        >
                            Xem thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewList;