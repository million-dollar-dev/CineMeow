import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faPlay} from "@fortawesome/free-solid-svg-icons";
import ButtonMore from "./utils/ButtonMore.jsx";

const TopReviewSection = () => {
    const data = [
        {
            id: 1,
            title: "Thám Tử Lừng Danh Conan: Dư Âm Của Độc Dược",
            image: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
            rating: "9.6",
            commentsCount: "6.1K",
            comments: [
                {
                    user: "Huỳnh Ngọc Hùng",
                    time: "1 giờ trước",
                    content: "U40 sưu tập truyện và coi từ bé... Công nhận phê. Hay á.",
                },
                {
                    user: "Trần Trọng Hoàng",
                    time: "4 giờ trước",
                    content: "Phim có cốt truyện đơn giản dễ hiểu... nhạc phim hay.",
                },
            ],
        },
        {
            id: 2,
            title: "Bí Kíp Luyện Rồng",
            image: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
            rating: "9.6",
            commentsCount: "2.7K",
            comments: [
                {
                    user: "Phạm Lê Hoài Thanh",
                    time: "6 hôm trước",
                    content: "Siêu hay, siêu dễ thương. Răng Sún vẫn đáng yêu như ngày nào.",
                },
                {
                    user: "Lê Kim Thiện An",
                    time: "24/07/2025",
                    content: "Phim hay, hài hước, đoạn cuối đánh boss hơi nhanh.",
                },
            ],
        },
        {
            id: 3,
            title: "Mang Mẹ Đi Bỏ",
            image: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
            rating: "7.9",
            commentsCount: "2K",
            comments: [
                {
                    user: "Trịnh Tuấn Anh",
                    time: "6 hôm trước",
                    content: "Phim thật sự hay và ý nghĩa, cái kết rất nhân văn.",
                },
                {
                    user: "Nguyễn Tuấn Linh",
                    time: "6 hôm trước",
                    content: "Cứ nhìn cô Hồng Đào là thấy nước mắt rồi...",
                },
            ],
        },
        {
            id: 3,
            title: "Mang Mẹ Đi Bỏ",
            image: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
            rating: "7.9",
            commentsCount: "2K",
            comments: [
                {
                    user: "Trịnh Tuấn Anh",
                    time: "6 hôm trước",
                    content: "Phim thật sự hay và ý nghĩa, cái kết rất nhân văn.",
                },
                {
                    user: "Nguyễn Tuấn Linh",
                    time: "6 hôm trước",
                    content: "Cứ nhìn cô Hồng Đào là thấy nước mắt rồi...",
                },
            ],
        },
        {
            id: 3,
            title: "Mang Mẹ Đi Bỏ",
            image: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
            rating: "7.9",
            commentsCount: "2K",
            comments: [
                {
                    user: "Trịnh Tuấn Anh",
                    time: "6 hôm trước",
                    content: "Phim thật sự hay và ý nghĩa, cái kết rất nhân văn.",
                },
                {
                    user: "Nguyễn Tuấn Linh",
                    time: "6 hôm trước",
                    content: "Cứ nhìn cô Hồng Đào là thấy nước mắt rồi...",
                },
            ],
        },
        {
            id: 3,
            title: "Mang Mẹ Đi Bỏ",
            image: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
            rating: "7.9",
            commentsCount: "2K",
            comments: [
                {
                    user: "Trịnh Tuấn Anh",
                    time: "6 hôm trước",
                    content: "Phim thật sự hay và ý nghĩa, cái kết rất nhân văn.",
                },
                {
                    user: "Nguyễn Tuấn Linh",
                    time: "6 hôm trước",
                    content: "Cứ nhìn cô Hồng Đào là thấy nước mắt rồi...",
                },
            ],
        },
    ];

    return (
        <section className="px-4 py-[2vw] bg-gray-dark">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10">
                Bình luận nổi bật
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {data.map((movie) => (
                    <div key={movie.id} className="bg-gray-sub rounded-md shadow-md overflow-hidden">
                        {/* Movie Image + Info */}
                        <div className="relative">
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-48 object-cover opacity-85"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    className="bg-black bg-opacity-50 rounded-full w-10 h-10 text-white flex items-center justify-center">
                                    <FontAwesomeIcon icon={faPlay}/>
                                </button>
                            </div>
                            <div
                                className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-sm font-medium">
                                <p className="truncate font-bold text-[1.2vw]">{movie.title}</p>
                                <div className="flex gap-3 items-center text-sm">
                                    <span className="bg-violet text-white px-2 py-0.5 rounded">{movie.rating}</span>
                                    <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faComment} className="text-xs"/> {movie.commentsCount}
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="p-4 space-y-3">
                            {movie.comments.map((comment, idx) => (
                                <div key={idx}>
                                    <div className="flex items-center gap-2">
                                        <div className="h-[2.8vw] w-[2.8vw] rounded-full overflow-hidden flex items-center justify-center">
                                            <img
                                                src="https://avatar.momocdn.net/avatar/6b5b/146fcc7969c26281ebdbd36d154f1fbce6e2a4d5f38cc544f8cf306976df.png"
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <p className="text-sm font-bold text-white">
                                            {comment.user}
                                            <span className="text-xs font-normal text-gray-light ml-1">• {comment.time}</span>
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-light mt-1">{comment.content}</p>
                                </div>
                            ))}
                            <a href="#" className="text-sm text-violet font-semibold inline-flex items-center gap-1">
                                Xem thêm →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <ButtonMore />
        </section>
    );
};

export default TopReviewSection;