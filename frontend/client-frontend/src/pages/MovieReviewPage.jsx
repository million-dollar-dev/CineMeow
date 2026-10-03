import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import Loading from "../components/Loading.jsx";
import ReviewList from "../components/MovieDetail/ReviewList.jsx";
import ButtonPlay from "../components/utils/ButtonPlay.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faMessage} from "@fortawesome/free-solid-svg-icons";
import RatingCard from "../components/RatingCard.jsx";
import CircularProgressBar from "../components/CircularProgressBar.jsx";
import Promotions from "../components/PromotionSection.jsx";

const MovieReviewPage = () => {
    const {movieId} = useParams();
    const [movieInfo, setMovieInfo] = useState();
    const [isExpanded, setIsExpanded] = useState(false);
    const maxChars = 600;
    const toggleExpand = () => setIsExpanded(!isExpanded);

    const review = "Bối cảnh và khởi điểm\n" +
        "Ra mắt năm 2025, bản live-action của How to Train Your Dragon (Bí Kíp Luyện Rồng) do Dean DeBlois – cha đẻ của bản hoạt hình gốc – chỉ đạo. Phim đánh dấu lần đầu tiên Toothless và Hiccup được tái hiện bằng diễn viên thật và CGI trong bối cảnh Bắc Âu giả tưởng. Câu chuyện vẫn trung thành với nguyên tác: Hiccup – một cậu bé gầy gò, yếu ớt nhưng giàu lòng trắc ẩn – vô tình làm bị thương một con rồng Night Fury, và từ đó bắt đầu hành trình thay đổi vận mệnh cả ngôi làng.\n" +
        "\n" +
        "Điểm mạnh của bản chuyển thể\n" +
        "Dù không đổi mới kịch bản, phim vẫn tạo được cảm xúc nhờ sự đầu tư chỉn chu vào hiệu ứng hình ảnh. Toothless – chú rồng bóng đêm – trở thành điểm sáng nhất với CGI mượt mà, linh hoạt, không quá hoạt hình cũng không quá máy móc. Các cảnh bay lượn giữa trời mây được dàn dựng mãn nhãn, mang lại cảm giác choáng ngợp tương tự bản gốc, nhưng với độ chân thực cao hơn.\n" +
        "\n" +
        "Về diễn xuất, Mason Thames hóa thân thành Hiccup với sự rụt rè, nhút nhát đúng chất, trong khi Nico Parker (Astrid) mang lại một Astrid mạnh mẽ, lanh lợi, khác biệt hơn bản hoạt hình. Đặc biệt, Gerard Butler quay trở lại trong vai Stoick – người cha nghiêm khắc – tạo nên những khoảnh khắc lặng giữa hành động sôi động, gợi nhớ đến mối quan hệ cha con từng khiến khán giả rơi nước mắt ở phần hoạt hình.\n" +
        "\n" +
        "Những hạn chế rõ rệt\n" +
        "Tuy nhiên, chính vì bám sát nguyên tác nên phim không tạo được nhiều bất ngờ. Các nút thắt, cao trào gần như được tái dựng y hệt khiến khán giả trung thành với phiên bản hoạt hình dễ cảm thấy thiếu mới mẻ. Hơn nữa, một vài cảnh hành động – đặc biệt là lúc Toothless bay lần đầu với Hiccup – bị cắt dựng hơi vội, làm giảm phần nào cảm xúc kỳ diệu vốn có.\n" +
        "\n" +
        "Một điểm trừ nhẹ khác là tông màu phim hơi lạnh, làm giảm sự ấm áp, tươi sáng của thế giới rồng từng quen thuộc.";
    const [isLoading, setIsLoading] = useState(false);
    const displayText = isExpanded ? review : review.slice(0, maxChars) + (review.length > maxChars ? "..." : "");
    useEffect(() => {
        setIsLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjYzZGE3N2NiMGM3MjBhYzA5YWEyNzUwM2U2NWRlZiIsIm5iZiI6MTc1MTA5NzczMC4xODcsInN1YiI6IjY4NWZhMTgyMzllNDRlYmMxZWRlYmM0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lkquOyV3pva_h3EMIUppdPCWuLRHj9D-j-Wo3IOZFHk",

            },
        }).then(async (res) => {
            const data = await res.json();
            console.log(data);
            setMovieInfo(data);
        }).catch((err) => {
            console.log(err);
        }).finally(() => setIsLoading(false));
    }, [movieId]);

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="bg-gray-dark pt-[6vw] text-white">
            <div className="max-w-screen-xl mx-auto flex gap-20">
                <div className="flex-1">
                    <div className="sticky top-[6vw] mb-[2vw]">
                        <div className="text-center">
                            <div className="relative group">
                                <img src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieInfo?.poster_path}`} alt="poster"
                                     className="border-1 border-gray-800 rounded-md"/>
                                <ButtonPlay />
                                <div className="absolute inset-2">
                                    <RatingCard rating={"K"} />
                                </div>
                            </div>
                            <p className="font-bold text-[1.8vw] mt-[1vw]">{movieInfo?.title}</p>
                        </div>
                        <p className="text-gray-light">Thể loại: Gia đình, Phiêu lưu, Giả tưởng, Hành động</p>
                        <p className="text-gray-light">Ngày chiếu: {movieInfo?.release_date}</p>
                        <div className="flex justify-center mt-[1vw]">
                            <Link to={`/movie/${movieId}`}>
                                <button className="rounded-full px-6 py-2 border-2 border-white text-black bg-white flex items-center gap-2 hover:text-white hover:bg-transparent transition-all group">
                                    <span>Đặt vé ngay</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex-4">
                    <div className="max-h-[300px] w-full overflow-hidden rounded-md relative">
                        <img className=""
                             src={`https://image.tmdb.org/t/p/original${movieInfo?.backdrop_path}`} alt="poster"/>
                        <div className="absolute bottom-3 left-3 flex gap-4">
                            <CircularProgressBar percent={90} size={3.5} strokeWidth={0.3}/>
                            <div className="flex items-center gap-2 font-bold text-[1.4vw]">
                                <FontAwesomeIcon icon={faMessage} />
                                <p>2.4K</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-[2vw] my-[1.8vw]">Review phim Bí Kíp Luyện Rồng (2025) – Khi Toothless cất cánh bằng da thịt thật sự</p>
                        <p className="text-gray-light leading-relaxed">{displayText}</p>
                        <div className="flex justify-center my-[1vw]">
                            {review.length > maxChars && (
                                <button
                                    onClick={toggleExpand}
                                    className="text-violet hover:border-2 py-2 px-3 rounded-md mt-2 flex items-center gap-1"
                                >
                                    {isExpanded ? "Rút gọn" : "Xem thêm"}
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`${isExpanded ? "rotate-180" : ""}`}
                                    />
                                </button>
                            )}
                        </div>
                        <hr/>
                    </div>
                    <div>
                        <ReviewList />
                    </div>
                </div>
            </div>
            <Promotions />
        </div>
    );
};

export default MovieReviewPage;