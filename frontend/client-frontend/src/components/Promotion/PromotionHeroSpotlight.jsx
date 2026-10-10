import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFire, 
    faCopy, 
    faCheck, 
    faClock
} from "@fortawesome/free-solid-svg-icons";

const PromotionHeroSpotlight = ({ featuredPromo }) => {
    const [copied, setCopied] = useState(false);

    if (!featuredPromo) return null;

    const handleCopy = () => {
        if (featuredPromo.code) {
            navigator.clipboard.writeText(featuredPromo.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative mb-12 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1b122c] via-[#121226] to-[#0d0d1a] shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 md:p-10 relative z-10">
                {/* Left Content */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-violet-500/20 text-violet-400 border border-violet-500/30">
                            <FontAwesomeIcon icon={faFire} className="text-violet-400 animate-pulse" />
                            Đặc quyền CineMeow
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <FontAwesomeIcon icon={faClock} />
                            {featuredPromo.validDate}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        {featuredPromo.title}
                    </h1>

                    <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
                        {featuredPromo.description}
                    </p>

                    {/* Voucher Code & Action Buttons (Violet CTA) */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-black/50 border border-white/15 px-4 py-2.5 rounded-2xl backdrop-blur-md">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Mã ưu đãi:</span>
                            <span className="text-sm sm:text-base font-mono font-black text-amber-400 tracking-wider">
                                {featuredPromo.code}
                            </span>
                            <button
                                onClick={handleCopy}
                                className={`ml-1 px-2.5 py-1 text-xs rounded-xl font-medium transition-all ${
                                    copied
                                        ? 'bg-emerald-500 text-white font-bold'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="mr-1" />
                                {copied ? 'Đã sao chép' : 'Sao chép'}
                            </button>
                        </div>

                        <Link
                            to={`/promotions/${featuredPromo.id}`}
                            className="px-5 py-2.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-900/40 transition-all hover:scale-105"
                        >
                            Xem chi tiết điều kiện
                        </Link>
                    </div>
                </div>

                {/* Right Banner Image Showcase */}
                <div className="lg:col-span-5 relative">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                        <img
                            src={featuredPromo.bannerUrl}
                            alt={featuredPromo.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14]/80 via-transparent to-transparent" />
                        
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-violet-600/90 backdrop-blur-md text-white font-black text-sm shadow-lg">
                            {featuredPromo.discount}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionHeroSpotlight;
