import React from 'react';

const MovieDateSelector = ({day, date}) => {
    return (
        <button
            className="p-[1.8vw] bg-white text-black hover:opacity-95 max-w-[8vw] max-h-[8vw]"
        >
            <div className="flex items-center justify-between flex-col gap-[0.4vw]">
                <p className="text-[1.2vw]">{date}</p>
                <p className="font-bold text-[1.8vw]">{day}</p>
            </div>
        </button>

    );
};

export default MovieDateSelector;