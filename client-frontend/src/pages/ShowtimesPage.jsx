import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import MovieDateSelector from "../components/MovieDetail/MovieDateSelector.jsx";
import CinemaBrandSelector from "../components/MovieDetail/CinemaBrandSelector.jsx";
import Banner from "../components/Banner.jsx";
import MovieAndShowtimeCard from "../components/Showtimes/MovieAndShowtimeCard.jsx";
import Promotions from "../components/PromotionSection.jsx";
import MovieBlogSection from "../components/MovieBlogSection.jsx";
import ShowtimesTableSection from "../components/utils/ShowtimesTableSection.jsx";

const ShowtimesPage = () => {
    return (
        <>
            <div className="bg-black text-white pt-[5vw] py-[2vw]">
                <Banner title={"Lịch chiếu phim hôm nay"}/>
                <ShowtimesTableSection />
            </div>
            <MovieBlogSection />
            <Promotions />

        </>

    );
};

export default ShowtimesPage;