import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCopy, faCheck, faFire } from "@fortawesome/free-solid-svg-icons";

const TopPromotionCard = ({ promotion, rank }) => {
    const [copied, setCopied] = useState(false);

    if (!promotion) return null;

    const { id, title, discount, code, bannerUrl, validDate } = promotion;

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="group relative flex gap-3.5 p-3 rounded-xl bg-[#141424]/90 border border-white/5 hover:border-rose-500/40 hover:bg-[#1a1a32] transition-all duration-300">
            {/* Thumbnail with Rank Badge */}
            <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900">
                <img
                    src={bannerUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <div className="absolute top-1 left-1 w-5 h-5 rounded-md bg-rose-600/90 text-white font-extrabold text-[10px] flex items-center justify-center shadow">
                    #{rank}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between flex-grow min-w-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {discount}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                            {validDate}
                        </span>
                    </div>
                    <Link to={`/promotions/${id}`}>
                        <h4 className="text-xs font-semibold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-tight">
                            {title}
                        </h4>
                    </Link>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <button
                        onClick={handleCopy}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                            copied
                                ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                        title="Sao chép mã"
                    >
                        <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="text-[9px]" />
                        <span>{copied ? 'Đã chép' : code}</span>
                    </button>

                    <Link
                        to={`/promotions/${id}`}
                        className="text-[11px] font-medium text-rose-400 hover:text-rose-300 inline-flex items-center gap-1"
                    >
                        Chi tiết <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopPromotionCard;
