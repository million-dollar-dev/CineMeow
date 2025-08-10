import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFire} from "@fortawesome/free-solid-svg-icons";
import PromotionCard from "../components/Promotion/PromotionCard.jsx";
import ButtonMore from "../components/utils/ButtonMore.jsx";
import TopPromotionCard from "../components/Promotion/TopPromotionCard.jsx";

const AllPromotionPage = () => {
    return (
        <div className="bg-black text-white pt-[6vw]">
            <div className="max-w-screen-lg mx-auto flex gap-8">
                <div className="flex-6">
                    <p className="font-bold text-[3vw]">Khuyến Mãi & Tin tức</p>
                    <div className="mt-[1vw]">
                        <PromotionCard />
                        <div className="mt-[1vw] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            <PromotionCard />
                            <PromotionCard />
                            <PromotionCard />
                            <PromotionCard />
                            <PromotionCard />
                            <PromotionCard />
                        </div>
                        <ButtonMore />
                    </div>
                </div>
            {/*    Nổi bật*/}
                <div className="flex-3">
                    <div className=" border-l pl-[2vw] mt-[2vw]">
                        <p className="font-bold text-[1.4vw]"><FontAwesomeIcon icon={faFire} /> Ưu đãi nổi bật</p>
                        <TopPromotionCard />
                        <TopPromotionCard />
                        <TopPromotionCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllPromotionPage;