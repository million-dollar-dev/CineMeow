import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot, faUser} from "@fortawesome/free-solid-svg-icons";
import ShowtimesTableSection from "../components/utils/ShowtimesTableSection.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";

const CinemaPage = () => {
    return (
        <div className="bg-black text-white pt-[2vw]">
            <div className="mb-[2vw] relative bg-cover bg-center bg-no-repeat w-full bg-[url('https://homepage.momocdn.net/cinema/momo-upload-api-210812191129-637643922898236024.jpg')]">
                <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
                <div className="relative z-10 flex gap-4 max-w-screen-xl mx-auto pt-[16vw] pb-[2vw] items-center">
                    <div className="max-w-[9vw] max-h-[9vw] rounded-md overflow-hidden">
                        <img
                            src="https://gigamall.vn/data/2019/05/06/11365490_logo-cgv-500x500.jpg"
                            alt="Cinema"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-[2vw]">CGV</p>
                        <p className="text-gray-300">Hệ thống rạp chiếu phim giá rẻ, hiện đại bậc nhất</p>
                        <p>
                            <FontAwesomeIcon icon={faUser} /> 6666
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faLocationDot} /> 8 cửa hàng trong hệ thống
                        </p>
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

export default CinemaPage;