import React from 'react';
//import {useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faShare} from "@fortawesome/free-solid-svg-icons";
import BlogCard from "../components/Blog/BlogCard.jsx";
import ButtonMore from "../components/utils/ButtonMore.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import Promotions from "../components/PromotionSection.jsx";

const BlogDetailPage = () => {
    //const {category, id} = useParams();
    const content = "Mở đầu bằng chiếc quan tài và cú sốc tâm lý\n" +
        "Phần ba bắt đầu ngay sau cú twist cuối cùng của phần hai: cuộc nổi dậy thất bại. Một số người chơi bị hành quyết, kẻ phản bội Kang Dae-ho vẫn sống nhăn, còn trò chơi thì… tiếp tục như chưa hề có cuộc chia tay nào. Gi-hun (Lee Jung-jae) – nhân vật trung tâm – được mang về trong… một chiếc quan tài. Anh còn sống, nhưng trong trạng thái kiệt quệ tâm lý. Mở đầu mùa ba bằng một nhân vật chính bị còng tay, mê man – đó là cách Hwang Dong-hyuk tuyên bố rằng lần này, cuộc chơi sẽ tàn khốc hơn bao giờ hết.";
    return (
        <div className="bg-black text-white pt-[6vw]">
            <div className="max-w-screen-xl mx-auto bg-black text-white">
                <div className="rounded-lg overflow-hidden">
                    <img
                        src="https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250627195752-638866510728643657.jpg"
                    />
                </div>
                <div className="px-[2.4vw] py-[2vw]">
                    <div className="flex gap-12">
                        {/*Content*/}
                        <div className="flex-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-col items-center">
                                    <p className="font-bold text-violet">Netflix</p>
                                    <div className="flex gap-4 text-sm text-gray-light">
                                        <p className="">3 phút đọc</p>
                                        <span><FontAwesomeIcon icon={faEye}/> 5.5K</span>
                                    </div>
                                </div>
                                <div>
                                    <button className="border-2 py-1 px-3 rounded-full bg-white text-black hover:bg-transparent hover:text-white shadow-md">
                                        Chia sẻ <FontAwesomeIcon icon={faShare} className="font-bold"/>
                                    </button>
                                </div>
                            </div>
                            <p className="font-bold text-[2.4vw] my-[2vw]">Review phim Squid Game 3 (2025) – Màn kết thúc đẫm máu và dữ dội cho loạt phim sinh tồn Hàn Quốc</p>
                            <p className="text-gray-light italic text-[1.3vw]">Squid Game đã đi tới mùa cuối cùng sau bốn năm tạo nên cơn sốt toàn cầu. Và giờ đây, phần 3 không chỉ tiếp nối sự đẫm máu của phần 2, mà còn đẩy mọi thứ lên cao trào tột độ – nơi cái giá của sự sống còn được định bằng phản bội, lựa chọn, và lòng người.</p>
                            <div className="my-[2vw]">
                                <p>
                                    {content}
                                </p>
                            </div>
                        </div>
                        {/*Mục lục*/}
                        <div className="flex-2 mt-[0.8vw]">
                            <div className="sticky top-[6vw]">
                                <p className="font-bold text-[1.2vw] uppercase">Mục Lục</p>
                                <div className="border-l-1 my-[1vw]">
                                    <p className="py-[0.8vw] px-[1vw]">
                                        Mở đầu bằng chiếc quan tài và cú sốc tâm lý
                                    </p>
                                    <p className="py-[0.8vw] px-[1vw]">
                                        Mở đầu bằng chiếc quan tài và cú sốc tâm lý
                                    </p>
                                    <p className="py-[0.8vw] px-[1vw]">
                                        Mở đầu bằng chiếc quan tài và cú sốc tâm lý
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Bài viết liên quan*/}
                    <div>
                        <p className="font-bold text-[1.4vw]">Bài viết liên quan</p>
                        <BlogCard />
                        <BlogCard />
                        <BlogCard />
                        <ButtonMore />
                    </div>
                </div>
            </div>
            <MediaCarousel title={"Phim đang chiếu"} />
            <Promotions />
        </div>
    );
};

export default BlogDetailPage;