import React, {useState} from 'react';
import {faPlay, faStar} from "@fortawesome/free-solid-svg-icons";
import CircularProgressBar from "../CircularProgressBar.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RatingCard from "../RatingCard.jsx";
import {Link} from "react-router-dom";

const Banner = ({movieInfo}) => {
    const [showAllOverview, setShowAllOverview] = useState(false);
    return (
        <div className="relative text-white overflow-hidden lg:h-[80vh] my-auto">
            <img className="absolute inset-0 brightness-[0.5]"
                 src={`https://image.tmdb.org/t/p/original${movieInfo?.backdrop_path}`} alt=""/>
            <div className="absolute inset-0 bg-dot-pattern opacity-60"></div>
            <div className="flex relative max-w-screen-xl mx-auto p-5 gap-6 lg:gap-8 py-10 lg:mt-14">
                <div className="flex-1 max-w-3xs">
                    <img src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieInfo?.poster_path}`} alt="poster"
                         className="border-1 border-gray-800 rounded-md"/>
                </div>
                <div className="flex-2 text-[1.2vw]">
                    <RatingCard rating={"K"}/>
                    <p className="font-bold mb-2 text-[3vw]">{movieInfo?.title}</p>
                    <div className="flex gap-4 items-center">
                        <p>{movieInfo?.release_date}</p>
                        <p>Trinh thám, Sci-Fi</p>
                        <p>134 phút</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <CircularProgressBar percent={90} size={3.5} strokeWidth={0.3}/>
                        </div>
                        <button className="mr-1">
                            <FontAwesomeIcon icon={faPlay} className="text-violet"/> Xem trailer
                        </button>
                        <Link to={`/movies/${movieInfo?.id}/review`}>
                            <button className="mr-1">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-300"/> Xem đánh giá
                            </button>
                        </Link>
                    </div>
                    <div className="mt-4">
                        <p className={`${showAllOverview ? "" : "line-clamp-2"} text-[1vw] transition-all`}>
                            {movieInfo?.overview}
                        </p>
                        {movieInfo?.overview?.length > 100 && (
                            <button
                                className="text-violet text-[0.9vw] mt-1 hover:underline"
                                onClick={() => setShowAllOverview(!showAllOverview)}
                            >
                                {showAllOverview ? "Ẩn bớt" : "Xem thêm"}
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div>
                            <p className="font-bold">Ngày chiếu</p>
                            <p>{movieInfo?.release_date}</p>
                        </div>
                        <div>
                            <p className="font-bold">Thể loại</p>
                            <p>Phiêu lưu, Khoa học - Viễn tưởng, Hành động</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;