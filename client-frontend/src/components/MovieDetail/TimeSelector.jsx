import React from 'react';

const TimeSelector = () => {
    return (
        <button className="flex gap-[0.5vw] bg-violet text-white border border-2 border-white rounded-3xl px-[1vw] py-[0.4vw] text-[1vw] my-[1vw]">
            <p>12:05</p>
            <p>~</p>
            <p>14:15</p>
        </button>

    );
};

export default TimeSelector;