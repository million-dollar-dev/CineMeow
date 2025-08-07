import React from 'react';
import MediaCarousel from "../components/MediaCarousel.jsx";
import Banner from "../components/Banner.jsx";
import TopReviewSection from "../components/TopReviewSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";

const NowPlayingPage = () => {
    return (
        <div className="bg-black pt-[4vw]">
            <div className="mt-[2vw] ">
                <Banner title={"Phim đang chiếu"}/>
            </div>
            <MediaCarousel title={"Phim đang chiếu"}/>
            <TopReviewSection />
            <MovieBlogSection />
            <PromotionSection />

        </div>
    );
};

export default NowPlayingPage;