import React from 'react';

const RATING_MAP = {
    P: { bg: "bg-emerald-500", text: "text-white", label: "P" },
    G: { bg: "bg-emerald-500", text: "text-white", label: "P" },
    K: { bg: "bg-sky-500", text: "text-white", label: "K" },
    PG: { bg: "bg-sky-500", text: "text-white", label: "PG" },
    PG13: { bg: "bg-amber-500", text: "text-white", label: "13+" },
    "13+": { bg: "bg-amber-500", text: "text-white", label: "13+" },
    C13: { bg: "bg-amber-500", text: "text-white", label: "T13" },
    T13: { bg: "bg-amber-500", text: "text-white", label: "T13" },
    "16+": { bg: "bg-orange-500", text: "text-white", label: "16+" },
    C16: { bg: "bg-orange-500", text: "text-white", label: "T16" },
    T16: { bg: "bg-orange-500", text: "text-white", label: "T16" },
    "18+": { bg: "bg-rose-600", text: "text-white", label: "18+" },
    C18: { bg: "bg-rose-600", text: "text-white", label: "T18" },
    T18: { bg: "bg-rose-600", text: "text-white", label: "T18" },
    R: { bg: "bg-rose-600", text: "text-white", label: "R" },
    NC17: { bg: "bg-purple-600", text: "text-white", label: "18+" },
};

const RatingCard = ({ rating = "P" }) => {
    const key = String(rating).toUpperCase().trim();
    const info = RATING_MAP[key] || { bg: "bg-zinc-700", text: "text-zinc-200", label: rating };

    return (
        <span className={`inline-flex items-center justify-center font-bold text-[11px] sm:text-xs px-1.5 py-0.5 rounded shadow-sm leading-none tracking-tight ${info.bg} ${info.text}`}>
            {info.label}
        </span>
    );
};

export default RatingCard;