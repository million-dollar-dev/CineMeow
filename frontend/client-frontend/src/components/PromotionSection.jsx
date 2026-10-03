import React from 'react';
import ButtonMore from "./utils/ButtonMore.jsx";

const promotionSection = [{
    id: 1,
    title: "Mua 1 Tặng 1",
    date: "Áp dụng đến 30/06/2025",
    image: "https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250512175307-638826691875533384.jpg",
}, {
    id: 2,
    title: "Ưu đãi sinh nhật",
    date: "Áp dụng cả tháng sinh nhật",
    image: "https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250512175307-638826691875533384.jpg",
}, {
    id: 3,
    title: "Combo Học Sinh - Sinh Viên",
    date: "Từ 01/07/2025 đến 31/07/2025",
    image: "https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250512175307-638826691875533384.jpg",
}, {
    id: 4,
    title: "Thành viên VIP",
    date: "Dành riêng cho hội viên",
    image: "https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250512175307-638826691875533384.jpg",
},];

const Promotions = () => {
    return (
        <section className="bg-gray-dark">
            <div className="py-[3vw] bg-gray-dark text-white max-w-screen-xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-10">Ưu đãi & Khuyến mãi</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {promotionSection.map((promo) => (<a
                        key={promo.id}
                        href="#"
                        className="group rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300 bg-gray-sub"
                    >
                        <div className="overflow-hidden">
                            <img
                                src={promo.image}
                                alt={promo.title}
                                className="w-full h-32 object-cover transform group-hover:scale-105 transition duration-300"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white group-hover:text-gray-500 transition">
                                {promo.title}
                            </h3>
                            <p className="text-sm text-gray-light mt-1">{promo.date}</p>
                        </div>
                    </a>))}
                </div>
                <ButtonMore />
            </div>
        </section>
    );
};

export default Promotions;
