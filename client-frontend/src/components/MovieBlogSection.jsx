import React, {useState} from 'react';
import ButtonMore from "./utils/ButtonMore.jsx";

const blogData = {
    latest: [
        {
            id: 1,
            title: "Phim bộ hay nhất về băng đảng và thế giới ngầm giống Peaky Blinders",
            category: "TV Series về băng đảng tội phạm",
            views: null,
            image: "https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250627195752-638866510728643657.jpg",
        },
        {
            id: 2,
            title: "Review phim Squid Game 3 (2025) – Màn kết thúc đẫm máu và dữ dội cho loạt phim sinh tồn Hàn Quốc",
            category: "Review phim Squid Game 3 (2025)",
            views: "5.5K",
            image: "https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250627195752-638866510728643657.jpg",
        },
        {
            id: 3,
            title: "Top phim lẻ dành cho người thích xem một mình",
            category: "Top phim lẻ",
            views: "548",
            image: "https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250627195752-638866510728643657.jpg",
        },
        {
            id: 4,
            title: "Review phim Ironheart (2025): Khi Công Nghệ Chạm Trán Phép Thuật Trong MCU",
            category: "Review phim Ironheart (2025)",
            views: "382",
            image: "https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250627195752-638866510728643657.jpg",
        },
    ],
    mostViewed: [],
};

export default function MovieBlogSection() {
    const [activeTab, setActiveTab] = useState("latest");

    return (
        <section className="bg-black py-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-white">Blog phim ảnh</h2>
                <p className="text-center text-gray-light mt-2 mb-6">
                    Tổng hợp và Review các bộ phim hot, bom tấn, phim chiếu rạp hay mỗi ngày
                </p>

                {/* Tabs */}
                <div className="flex justify-center gap-8 mb-6 font-medium text-lg">
                    <button
                        onClick={() => setActiveTab("latest")}
                        className={`pb-1 border-b-2 ${
                            activeTab === "latest" ? "border-violet text-violet" : "border-transparent text-gray-light"
                        }`}
                    >
                        Mới nhất
                    </button>
                    <button
                        onClick={() => setActiveTab("mostViewed")}
                        className={`pb-1 border-b-2 ${
                            activeTab === "mostViewed" ? "border-violet text-violet" : "border-transparent text-gray-light"
                        }`}
                    >
                        Xem nhiều nhất
                    </button>
                </div>

                {/* Blog cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {blogData[activeTab].map((post) => (
                        <div key={post.id}>
                            <div className="relative rounded-lg overflow-hidden shadow">
                                <img src={post.image} alt={post.title} className="w-full h-[180px] object-cover" />

                            </div>
                            <h3 className="mt-3 font-semibold text-white">{post.title}</h3>
                            {post.views && (
                                <p className="text-sm text-gray-light mt-1">{post.views} lượt xem</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Xem thêm */}
                <ButtonMore/>
            </div>
        </section>
    );
}