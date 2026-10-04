import React, {useEffect, useState} from 'react';
import Banner from "../components/Banner.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import MovieCard from "../components/MediaList/MovieCard.jsx";
import PaginationComponent from "../components/utils/PaginationComponent.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faTags, faGlobe, faCalendarDays, faXmark} from "@fortawesome/free-solid-svg-icons";
import CustomDropdown from "../components/common/CustomDropdown.jsx";

const MoviesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [selectedCountry, setSelectedCountry] = useState("Tất cả");
    const [selectedYear, setSelectedYear] = useState("Tất cả");
    const [searchMovieQuery, setSearchMovieQuery] = useState("");
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
                        <div className="flex gap-3 flex-wrap items-center">
                            {/* Thể loại */}
                            <CustomDropdown
                                icon={faTags}
                                label={selectedCategory}
                                options={categories}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                headerTitle="Thể Loại Phim"
                                width="w-auto"
                                dropdownWidth="w-56"
                            />

                            {/* Quốc gia */}
                            <CustomDropdown
                                icon={faGlobe}
                                label={selectedCountry}
                                options={countries}
                                value={selectedCountry}
                                onChange={setSelectedCountry}
                                headerTitle="Quốc Gia"
                                width="w-auto"
                                dropdownWidth="w-48"
                            />

                            {/* Năm */}
                            <CustomDropdown
                                icon={faCalendarDays}
                                label={selectedYear}
                                options={years}
                                value={selectedYear}
                                onChange={setSelectedYear}
                                headerTitle="Năm Phát Hành"
                                width="w-auto"
                                dropdownWidth="w-40"
                            />

                            {/* Ô tìm kiếm */}
                            <div className="relative h-10 w-52">
                                <input
                                    type="text"
                                    value={searchMovieQuery}
                                    onChange={(e) => setSearchMovieQuery(e.target.value)}
                                    placeholder="Tìm theo tên phim..."
                                    className="w-full h-full pl-9 pr-8 bg-zinc-950/80 rounded-xl border border-zinc-800 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/40 transition-all"
                                />
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                                />
                                {searchMovieQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchMovieQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                )}
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