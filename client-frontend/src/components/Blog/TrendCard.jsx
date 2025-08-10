import React from 'react';

const TrendCard = () => {
    return (
        <div className="flex gap-4 items-center w-full py-[1vw] group">
            <div className="w-[155px] h-[75px] overflow-hidden rounded-md flex-shrink-0 relative">
                <img
                    src="https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250619151231-638859427517941018.png"
                    alt="cover"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute bottom-1 left-1 text-white italic text-[1.4vw] font-bold px-2 py-1 bg-black/50 rounded-lg shadow-lg">
                                        01
                                    </span>
            </div>
            <p className="font-bold line-clamp-3 hover:underline">
                Top 12 phim ngôn tình Trung Quốc hay không nên bỏ qua
            </p>
        </div>
    );
};

export default TrendCard;