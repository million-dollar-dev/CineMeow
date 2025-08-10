import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

const BlogCard = () => {
    return (
        <div className="flex gap-4 cursor-pointer py-[2vw] border-b">
            <div className="w-[200px] h-[120px] overflow-hidden rounded-md flex-shrink-0">
                <img
                    src="https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250619151231-638859427517941018.png"
                    alt="cover"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-[1.2vw] font-semibold leading-snug hover:underline">
                    Top 11 phim có doanh thu cao nhất mọi thời đại
                </h3>
                <div className="flex items-center text-gray-light text-sm gap-2">
                    <FontAwesomeIcon icon={faEye} className="text-gray-400" />
                    <span>121.6K lượt xem</span>
                </div>
                <p className="text-gray-light leading-snug line-clamp-2">
                    Cùng khám phá xem 11 bộ phim nào có doanh thu cao nhất mọi thời đại nhé,
                    sẽ có cả những cái tên vừa quen nhưng cũng có cả vừa lạ đó!
                </p>
            </div>
        </div>
    );
};

export default BlogCard;