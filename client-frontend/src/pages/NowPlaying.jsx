import React from 'react';
import MediaCarousel from "../components/MediaCarousel.jsx";
import Banner from "../components/Banner.jsx";

const NowPlaying = () => {
    return (
        <div className="bg-black pt-[4vw]">
            <div className="mt-[2vw] ">
                <Banner title={"Phim đang chiếu"}/>
            </div>
            <MediaCarousel title={"Phim đang chiếu"}/>
        </div>
    );
};

export default NowPlaying;