import React from 'react';

const RatingCard = ({rating}) => {
    return (
        <div className="flex">
            <div className="py-[0.1vw] px-[0.5vw] bg-yellow-300 rounded-md">
                <p className="text-[1vw]">{rating}</p>
            </div>
        </div>
    );
};

export default RatingCard;