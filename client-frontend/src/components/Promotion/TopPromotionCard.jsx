import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

const TopPromotionCard = () => {
    return (
        <div className="rounded-lg overflow-hidden bg-gray-sub my-[2vw] shadow-lg">
            <div>
                <img
                    src="https://homepage.momocdn.net/img/momo-amazone-s3-api-241017171805-638647822851461045.jpg"
                    className="hover:opacity-85"
                />
            </div>
            <div className="py-[1vw] flex-col gap-8 px-[1vw] group">
                <p className="font-bold text-[1.2vw] group-hover:text-violet">Nhập HELLOMOMO - Nhập hội rước quà xịn 1 TRIỆU</p>
                <p className="text-sm text-gray-light my-[0.8vw] ">Nhập HELLOMOMO và liên kết ngân hàng để nhận gói quà đến 1 TRIỆU</p>
                <a className="text-[1vw] text-violet">Xem chi tiết <FontAwesomeIcon icon={faChevronRight}/></a>
            </div>
        </div>
    );
};

export default TopPromotionCard;