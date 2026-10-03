import React from 'react';

const RATING_COLORS = {
    G: "bg-green-500",       // General
    PG: "bg-blue-400",       // Parental Guidance
    PG13: "bg-yellow-400",   // Parents Strongly Cautioned
    R: "bg-red-500",         // Restricted
    NC17: "bg-purple-600",   // Adults Only
    C13: "bg-orange-500",    // C13 (Việt Nam phân loại)
};

const RatingCard = ({rating}) => {
    const colorClass = RATING_COLORS[rating] || "bg-gray-400";
    return (
        <div className="flex">
            <div className={`py-[0.1vw] px-[0.5vw] rounded-md ${colorClass}`}>
                <p className="text-[1vw]">{rating}</p>
            </div>
        </div>
    );
};

export default RatingCard;