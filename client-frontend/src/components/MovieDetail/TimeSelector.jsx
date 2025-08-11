import React from 'react';
import {Link} from "react-router-dom";

const TimeSelector = () => {
    return (
        <Link to={"/showtimes/booking/1106289"}>
            <button className="flex gap-[0.5vw] bg-violet text-white rounded-3xl px-[1vw] py-[0.4vw] text-[1vw] my-[1vw] mx-[0.4vw]">
                <p>12:05</p>
                <p>~</p>
                <p>14:15</p>
            </button>
        </Link>

    );
};

export default TimeSelector;