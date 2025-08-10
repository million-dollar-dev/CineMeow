import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const RecomendedPromotion = () => {
    return (
        <div className="my-[2vw] flex items-center justify-center gap-4">
            <div className="max-w-[120px]">
                <img
                    src="https://homepage.momocdn.net/img/momo-amazone-s3-api-241017171805-638647822851461045.jpg"
                    className="hover:opacity-85"
                />
            </div>
            <div className=" flex-col group">
                <p className="font-bold group-hover:underline">Nhập HELLOMOMO - Nhập hội rước quà xịn 1 TRIỆU</p>
                <p className="text-sm text-gray-light ">01/01/2025</p>
            </div>
        </div>
    );
};

export default RecomendedPromotion;