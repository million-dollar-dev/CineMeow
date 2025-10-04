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
            <div
                className="absolute inset-0 bg-center bg-cover opacity-20 blur-[50px]"
                style={{ backgroundImage: `url(${movieInfo?.backdropPath})` }}
            />

            <img
                className="absolute inset-0 brightness-50 transition-opacity duration-700 w-full object-cover
               [mask-image:linear-gradient(90deg,transparent_10px,rgba(0,0,0,.2)_15%,black_40%,black_80%,transparent_99%)]
               [mask-repeat:no-repeat] [mask-size:cover] [mask-position:center]
               [-webkit-mask-image:linear-gradient(90deg,transparent_10px,rgba(0,0,0,.2)_15%,black_40%,black_80%,transparent_99%)]"
                src={movieInfo?.backdropPath}
                alt={movieInfo?.title}
                loading="lazy"
            />

            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1900px] h-full
                   [mask-image:linear-gradient(0deg,transparent_0,black_20%,black_80%,transparent)]
                   [-webkit-mask-image:linear-gradient(0deg,transparent_0,black_20%,black_80%,transparent)]"
            ></div>

            {/* Overlay chấm bi */}
            <div className="absolute inset-0 bg-[url('/img/dotted.png')] opacity-20 pointer-events-none"></div>

            <div className="flex relative max-w-screen-xl mx-auto p-5 gap-6 lg:gap-8 py-10 lg:mt-14">
                <div className="flex-1 max-w-3xs">
                    <img src={movieInfo?.posterPath} alt="poster"
                         className="border-1 border-gray-800 rounded-md"/>
                </div>
                <div className="flex-2 text-[1.2vw]">
                    <RatingCard rating={"K"}/>
                    <p className="font-bold mb-2 text-[3vw]">{movieInfo?.title}</p>
                    <div className="flex gap-4 items-center">
                        {
                            movieInfo?.genres.map((g) => (
                                <p
                                    key={g.id}
                                    className="px-2 py-1 text-sm text-white border border-white/40 rounded-full bg-white/10 backdrop-blur-sm"
                                >
                                    {g.name}
                                </p>

                            ))
                        }
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
                            <p>{movieInfo?.releaseDate}</p>
                        </div>
                        <div>
                            <p className="font-bold">Thời lượng</p>
                            <p>{movieInfo?.duration} phút</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;