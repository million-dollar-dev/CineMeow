import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

const MainCard = ({subTitle}) => {
    return (
        <div className="bg-gray-dark rounded-md">
            <div className="relative rounded-lg overflow-hidden shadow">
                <img
                    src="https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250805111632-638899893925265441.jpg"
                    alt="cover"
                    className="w-full h-[180px] object-cover"
                />
            </div>
            <div className="px-[2vw] pb-[2vw]">
                <h2 className="mt-3 text-[1.4vw] font-semibold text-white">Phim bộ hay nhất về băng đảng và thế
                    giới ngầm giống Peaky Blinders</h2>
                <p className="text-sm text-gray-light mt-1">
                    <FontAwesomeIcon icon={faEye}/> 577 lượt xem
                </p>
                <p className="text-gray-light mt-1 line-clamp-2">{subTitle}</p>
            </div>
        </div>
    );
};

export default MainCard;