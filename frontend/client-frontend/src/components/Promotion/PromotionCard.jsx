import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCalendarAlt, 
    faEye, 
    faCopy, 
    faCheck, 
    faArrowRight 
} from "@fortawesome/free-solid-svg-icons";

const PromotionCard = ({ promotion }) => {
    const [copied, setCopied] = useState(false);

    if (!promotion) return null;

    const {
        id,
        title,
        description,
        discount,
        code,
        bannerUrl,
        validDate,
        views,
        tag,
        badgeColor = "violet"
    } = promotion;

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getBadgeStyle = () => {
        switch (badgeColor) {
            case 'amber':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'emerald':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'indigo':
                return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
            case 'violet':
            default:
                return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
        }
    };

    return (
        <div className="group relative flex flex-col justify-between rounded-2xl bg-[#141424]/90 border border-white/10 hover:border-violet-500/40 shadow-lg hover:shadow-[0_10px_30px_rgba(127,90,240,0.18)] transition-all duration-300 overflow-hidden hover:-translate-y-1">
            {/* Image & Badges */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                    src={bannerUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141424] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-lg border backdrop-blur-md ${getBadgeStyle()}`}>
                        {tag}
                    </span>
                </div>

                <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 text-xs font-extrabold uppercase rounded-lg bg-violet-600 text-white shadow-md">
                        {discount}
                    </span>
                </div>

                {/* Date & Views overlay at bottom of banner */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-violet-400" />
                        {validDate}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                        <FontAwesomeIcon icon={faEye} />
                        {views}
                    </span>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div>
                    <Link to={`/promotions/${id}`}>
                        <h3 className="text-base md:text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                            {title}
                        </h3>
                    </Link>
                    <p className="mt-2 text-xs md:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Voucher Code Box & Actions (Violet button) */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-[#1c1c34] border border-dashed border-white/15 px-3 py-1.5 rounded-xl">
                        <span className="text-xs font-mono font-bold tracking-wider text-violet-300">
                            {code}
                        </span>
                        <button
                            onClick={handleCopy}
                            title="Sao chép mã"
                            className={`p-1.5 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                                copied 
                                    ? 'bg-emerald-500/20 text-emerald-400 font-bold' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                            <span className="text-[11px]">{copied ? 'Đã chép' : 'Chép'}</span>
                        </button>
                    </div>

                    <Link
                        to={`/promotions/${id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors group/btn"
                    >
                        <span>Chi tiết</span>
                        <FontAwesomeIcon 
                            icon={faArrowRight} 
                            className="transition-transform duration-200 group-hover/btn:translate-x-1" 
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PromotionCard;
