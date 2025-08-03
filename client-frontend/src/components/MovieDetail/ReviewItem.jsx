import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";

const ReviewItem = () => {
    return (
        <div className="py-[1.4vw] border-t">
            <div className="flex flex-col gap-[0.8vw]">
                <div className="flex gap-[1vw]">
                    <div className="h-[3.2vw] w-[3.2vw] rounded-full overflow-hidden flex items-center justify-center">
                        <img
                            src="https://avatar.momocdn.net/avatar/6b5b/146fcc7969c26281ebdbd36d154f1fbce6e2a4d5f38cc544f8cf306976df.png"
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <p>Mạc Hải Minh</p>
                        <p>12/12/2025</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <CircularProgressBar percent={90} size={2.6} strokeWidth={0.24}/>
                    <p>Đáng Xem</p>
                </div>
                <div>
                    <p>
                        Xem phim này buồn ngủ ghê, nhân vật chính đóng tệ hơn nhiều so với các nhân vật phụ. Cái kết
                        lãng xẹt.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="border p-[0.12vw] rounded-md">Đáng Tiền</div>
                    <div className="border p-[0.12vw] rounded-md">Đáng Tiền</div>
                    <div className="border p-[0.12vw] rounded-md">Đáng Tiền</div>
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;