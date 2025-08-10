import React from 'react';
import {Link, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowTrendUp} from "@fortawesome/free-solid-svg-icons";
import BlogCard from "../components/Blog/BlogCard.jsx";
import ButtonMore from "../components/utils/ButtonMore.jsx";
import TrendCard from "../components/Blog/TrendCard.jsx";
import MainCard from "../components/Blog/MainCard.jsx";
import Promotions from "../components/PromotionSection.jsx";

const AllBlogPage = () => {
    const {category} = useParams();
    const subTitle = "Không phải ai đi xem phim cũng cần một người đi cùng. Có những bộ phim lẻ phù hợp để thưởng thức một mình – vì chúng cho bạn khoảng lặng, một thế giới riêng, hoặc đơn giản là vì bạn muốn nuông chiều chính mình mà không phải hỏi ai: “Muốn xem gì?”."
    return (
        <div className="bg-gray-sub pt-[6vw] text-white">
            <div className="max-w-screen-xl mx-auto ">
                <p className="font-bold text-[3vw]">Blog {category}</p>
                <p className="text-[1.4vw] text-gray-light my-[0.5vw]">Tổng hợp phim lẻ, phim bộ, Netflix,...hấp dẫn</p>
                <div className="flex gap-2 mt-[1vw]">
                    <Link to={"/blogs/cinema"}>
                        <button className={`text-[1.2vw] py-[1vw] px-[1vw] ${category === 'cinema' ? "border-b-2 border-b-violet font-bold text-violet" : ""} `}>
                            Blog điện ảnh
                        </button>
                    </Link>
                    <Link to={"/blogs/movie"}>
                        <button className={`text-[1.2vw] py-[1vw] px-[1vw] ${category === 'movie' ? "border-b-2 border-b-violet font-bold text-violet" : ""} `}>
                            Phim chiếu rạp
                        </button>
                    </Link>
                    <Link to={"/blogs/synthetic"}>
                        <button className={`text-[1.2vw] py-[1vw] px-[1vw] ${category === 'synthetic' ? "border-b-2 border-b-violet font-bold text-violet" : ""} `}>
                            Tổng hợp phim
                        </button>
                    </Link>
                    <Link to={"/blogs/neflix"}>
                        <button className={`text-[1.2vw] py-[1vw] px-[1vw] ${category === 'neflix' ? "border-b-2 border-b-violet font-bold text-violet" : ""} `}>
                            Phim Neflix
                        </button>
                    </Link>


                </div>
                {/*nổi bật*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 border-b py-[2vw]">
                    <Link to={"/blogs/cinema/123"}>
                        <MainCard subTitle={subTitle} />
                    </Link>
                    <MainCard subTitle={subTitle} />
                    <MainCard subTitle={subTitle} />
                </div>
                <div className="flex gap-8 mt-[2vw]">
                    <div className="flex-4 items-center justify-center w-full">
                        <p className="text-[1.4vw] font-bold">Bài viết mới nhất</p>
                        <BlogCard/>
                        <BlogCard/>
                        <BlogCard/>
                        <BlogCard/>
                        <div>
                            <ButtonMore/>
                        </div>
                    </div>
                    <div className="flex-2">
                        <p className="text-[1.4vw] font-bold">
                            <FontAwesomeIcon icon={faArrowTrendUp}/> Xem nhiều nhất
                        </p>
                        <div>
                            <TrendCard />
                            <TrendCard />
                            <TrendCard />
                            <TrendCard />
                        </div>
                    </div>
                </div>
            </div>
            <Promotions />
        </div>
    );
};

export default AllBlogPage;