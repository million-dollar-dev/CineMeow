import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCat} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import TopReviewSection from "../components/TopReviewSection.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import Promotions from "../components/PromotionSection.jsx";

const ReviewPage = () => {
    return (
        <div className="bg-black pt-[6vw]">
            <div className="bg-gray-sub py-10 px-6 md:px-16 lg:px-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">

                        <h2 className="text-[2.6vw]  font-bold text-white mb-4">
                            Review Phim chiếu rạp trên <span className="text-violet"><FontAwesomeIcon icon={faCat} /> CineMeow</span>
                        </h2>
                        <p className="text-gray-light mb-6 max-w-lg text-[1.2vw]">
                            Nền tảng đánh giá, review phim chiếu rạp uy tín, chất lượng từ các nhà phê bình và hàng triệu người dùng <span className="text-violet">CineMeow</span>.
                        </p>
                        <div className="flex gap-4 text-white">
                            <div>
                                <p className="font-bold text-[1.4vw]">368+</p>
                                <p className="text-gray-light">Phim có review</p>
                            </div>
                            <div>
                                <p className="font-bold text-[1.4vw]">32K+</p>
                                <p className="text-gray-light">Số lượng bình luận</p>
                            </div>
                            <div>
                                <p className="font-bold text-[1.4vw]">13K+</p>
                                <p className="text-gray-light">Người bình luận</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-bold text-black mb-2">
                                    Review Phim chiếu rạp trên <span className="text-violet">CineMeow</span>
                            </h3>
                            <div className="mt-4">
                                <img
                                    src="/src/assets/img/review_banner.png"
                                    alt="movie banner"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TopReviewSection />
            <MediaCarousel title={"Phim đang chiếu"} />
            <Promotions />
        </div>
    );
};

export default ReviewPage;
