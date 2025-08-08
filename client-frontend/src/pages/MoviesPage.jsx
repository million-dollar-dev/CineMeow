import React, {useEffect, useState} from 'react';
import Banner from "../components/Banner.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import MovieCard from "../components/MediaList/MovieCard.jsx";
import PaginationComponent from "../components/utils/PaginationComponent.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faSearch} from "@fortawesome/free-solid-svg-icons";

const MoviesPage = () => {
    const [openPanel, setOpenPanel] = useState(null);
    const categories = [
        "Tất cả", "Phim truyền hình", "Tiểu sử", "Chính kịch", "Hài", "Phiêu lưu",
        "Kinh dị", "Tài liệu", "Tội phạm", "Giật gân", "Ma", "Trinh thám",
        "Hack Não", "Siêu anh hùng", "Hồi hộp", "Tâm linh", "Bí ẩn", "Gay cấn",
        "Hành động", "Hoạt hình", "Lãng mạn", "Thảm hoạ", "Thể thao", "Drama",
        "Cổ trang", "Kiếm hiệp", "Vòng lặp", "Viễn Tây", "Nhạc kịch", "Thần thoại",
        "Chiến tranh", "Gia đình", "Hình sự", "Khoa học - Viễn tưởng", "Lịch sử",
        "Tình cảm", "Võ thuật", "Âm nhạc", "Tâm lý", "Anime", "Siêu trộm", "Giả tưởng"
    ];
    const countries = ["Tất cả", "Việt Nam", "Mỹ", "Hàn Quốc", "Nhật Bản", "Trung Quốc"];
    const years = ["Tất cả", "2025", "2024", "2023", "2022", "2021"];
    const handleToggle = (panel) => {
        setOpenPanel(openPanel === panel ? null : panel);
    };
    const [mediaList, setMediaList] = useState([]);
    const url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
    useEffect(() => {
        if (url) {
            fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjYzZGE3N2NiMGM3MjBhYzA5YWEyNzUwM2U2NWRlZiIsIm5iZiI6MTc1MTA5NzczMC4xODcsInN1YiI6IjY4NWZhMTgyMzllNDRlYmMxZWRlYmM0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lkquOyV3pva_h3EMIUppdPCWuLRHj9D-j-Wo3IOZFHk",

                },
            }).then(async (res) => {
                const data = await res.json();
                const nowPlayingList = data.results.slice(0, 10);
                console.log(nowPlayingList);
                setMediaList(nowPlayingList);
            })
        } else {
            console.log('fail')
        }
    }, [url]);
    return (
        <div className="bg-black text-white pt-[4vw]">
            <div className="mt-[2vw]">
                <Banner title={"Phim chiếu"} />
            </div>
            <MediaCarousel title={"Phim đang chiếu"} />
            <MediaCarousel title={"Phim sắp chiếu"} />
            <div className="bg-gray-dark">
                <div className="max-w-screen-xl mx-auto py-[2vw]">
                    <div className="flex space justify-between my-[2vw] items-center">
                        <p className="text-[2vw] font-bold">Tìm phim chiếu rạp trên <span className="text-violet">CineMeow</span></p>
                        <div className="flex gap-3 flex-wrap">
                            {/* Thể loại */}
                            <div className="relative inline-block">
                                <button
                                    onClick={() => handleToggle("category")}
                                    className="flex border-2 items-center gap-2 px-4 py-2 border rounded-md shadow-sm bg-white text-black hover:bg-gray-100"
                                >
                                    Thể loại
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        size={12}
                                        className={`transition-transform duration-300 ${openPanel === "category" ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {openPanel === "category" && (
                                    <div className="absolute left-0 mt-2 w-[600px] bg-white rounded-lg shadow-lg p-2 z-50 text-black">
                                        <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                                            {categories.map((cat, idx) => (
                                                <button
                                                    key={idx}
                                                    className="text-left px-2 py-1 hover:bg-gray-100 rounded-md w-full"
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative inline-block">
                                {/* Nút dropdown */}
                                <button
                                    onClick={() => handleToggle("country")}
                                    className="flex border-2 items-center gap-2 px-4 py-2 border rounded-md shadow-sm bg-white text-black hover:bg-gray-100"
                                >
                                    Quốc gia
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        size={12}
                                        className={`transition-transform duration-300 ${openPanel === "country" ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* Menu */}
                                {openPanel === "country" && (
                                    <div className="absolute left-0 mt-2 w-[400px] bg-white rounded-lg shadow-lg p-2 z-50 text-black">
                                        <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                                            {countries.map((cat, idx) => (
                                                <button
                                                    key={idx}
                                                    className="text-left px-2 py-1 hover:bg-gray-100 rounded-md w-full"
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Năm */}
                            <div className="relative inline-block">
                                <button
                                    onClick={() => handleToggle("year")}
                                    className="border-2 flex items-center gap-2 px-4 py-2 border rounded-md shadow-sm bg-white text-black hover:bg-gray-100"
                                >
                                    Năm
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        size={12}
                                        className={`transition-transform duration-300 ${openPanel === "year" ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {openPanel === "year" && (
                                    <div className="absolute left-0 mt-2 w-[100px] bg-white rounded-lg shadow-lg p-2 z-50 text-black">
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                                            {years.map((cat, idx) => (
                                                <button
                                                    key={idx}
                                                    className="text-left px-2 py-1 hover:bg-gray-100 rounded-md w-full"
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Ô tìm kiếm */}
                            <div className="flex items-center border-1 rounded-md px-3 py-2 w-[200px] relative">
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên phim ..."
                                    className="outline-none max-w-[160px]"
                                />
                                <FontAwesomeIcon icon={faSearch} className="text-gray-500 absolute right-2 text-white" />
                            </div>
                        </div>
                    </div>
                    <div >
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                            {
                                mediaList.map((item) => <MovieCard key={item.id} item={item}/>)
                            }

                        </div>
                    </div>
                    <div className="my-[4vw] flex justify-center items-center">
                        <PaginationComponent pageCount={12}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoviesPage;