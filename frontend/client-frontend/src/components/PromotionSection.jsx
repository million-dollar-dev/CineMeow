import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendarAlt, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { PROMOTIONS_DATA } from "../data/promotionsData.js";

const Promotions = () => {
    const featuredPromos = PROMOTIONS_DATA.slice(0, 4);

    return (
        <section className="bg-[#0B0B14] py-16 text-white border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
                            <FontAwesomeIcon icon={faTicketAlt} />
                            Đặc Quyền Rạp Phim
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Ưu Đãi & Khuyến Mãi Nổi Bật
                        </h2>
                    </div>

                    <Link
                        to="/promotions"
                        className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors group"
                    >
                        <span>Xem tất cả ưu đãi</span>
                        <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredPromos.map((promo) => (
                        <Link
                            key={promo.id}
                            to={`/promotions/${promo.id}`}
                            className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-[#141424] border border-white/10 hover:border-violet-500/40 shadow-lg hover:shadow-[0_8px_25px_rgba(127,90,240,0.18)] transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                                <img
                                    src={promo.bannerUrl}
                                    alt={promo.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-violet-600 text-white shadow">
                                    {promo.discount}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                                    {promo.title}
                                </h3>
                                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                                    <span className="flex items-center gap-1.5 truncate">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-violet-400 text-[10px]" />
                                        {promo.validDate}
                                    </span>
                                    <span className="font-mono text-violet-400 font-bold">
                                        {promo.code}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Promotions;
