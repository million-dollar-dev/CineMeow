import React from 'react';
import MediaCarousel from "../components/MediaCarousel.jsx";
import Banner from "../components/Banner.jsx";
import TopReviewSection from "../components/TopReviewSection.jsx";
import PromotionSection from "../components/PromotionSection.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";

const NowPlaying = () => {
    return (
        <div className="bg-black pt-[4vw]">
            <div className="mt-[2vw] ">
                <Banner title={"Phim sắp chiếu"}/>
            </div>
            <MediaCarousel title={"Phim sắp chiếu"}/>
            <TopReviewSection />
            <MovieBlogSection />
            <PromotionSection />

        </div>
    );
};

export default NowPlaying;