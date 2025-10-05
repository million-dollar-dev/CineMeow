import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot, faUser} from "@fortawesome/free-solid-svg-icons";
import ShowtimesTableSection from "../components/utils/ShowtimesTableSection.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";
import {useParams} from "react-router-dom";
import {useGetBrandQuery} from "../services/brandService.js";

const BrandPage = () => {
    const {brandId} = useParams();

    const {data: brandData} = useGetBrandQuery(brandId);

    return (
        <div className="bg-black text-white pt-[6vw]">
            <div
                className="mb-[2vw] relative bg-cover bg-center bg-no-repeat w-full rounded-xl overflow-hidden shadow-lg"
                style={{
                    backgroundImage: `url(${brandData?.backgroundUrl})`,
                }}
            >
                {/* Overlay tối + gradient giúp chữ nổi bật hơn */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/90 via-[#0d0d0d]/50 to-transparent z-0"></div>

                {/* Nội dung */}
                <div className="relative z-10 flex gap-[1.6vw] max-w-screen-xl mx-auto pt-[14vw] pb-[3vw] px-[2vw] items-end">
                    {/* Logo thương hiệu */}
                    <div className="w-[9vw] h-[9vw] rounded-xl overflow-hidden shadow-[0_0_25px_rgba(127,90,240,0.6)] bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <img
                            src={brandData?.logoUrl}
                            alt={brandData?.name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Thông tin thương hiệu */}
                    <div className="flex flex-col gap-[0.6vw] text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
                        <p className="font-extrabold text-[2.2vw] text-[#ffffff] tracking-wide">
                            {brandData?.name}
                        </p>
                        <p className="text-gray-200 text-[1vw] max-w-[40vw] leading-snug">
                            {brandData?.description}
                        </p>
                        <div className="flex gap-[1.4vw] mt-[0.8vw] text-[0.95vw] text-gray-300">
                            <p className="flex items-center gap-[0.5vw]">
                                <FontAwesomeIcon icon={faUser} className="text-[#7f5af0]" />
                                {brandData?.employeeCount} nhân viên
                            </p>
                            <p className="flex items-center gap-[0.5vw]">
                                <FontAwesomeIcon icon={faLocationDot} className="text-[#7f5af0]" />
                                8 rạp trong hệ thống
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ShowtimesTableSection />
            <MediaCarousel title={"Phim đang chiếu"}/>
            <MovieBlogSection />
            <PromotionSection />
        </div>

    );
};

export default BrandPage;