import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

const ButtonMore = () => {
    return (
        <div className="flex justify-center py-[2vw]">
            <button className="rounded-full px-6 py-2 border-2 border-white text-black bg-white flex items-center gap-2 hover:text-white hover:bg-transparent transition-all group">
                <FontAwesomeIcon
                    icon={faArrowDown}
                    className="animate-bounce group-hover:animate-none"
                />
                <span>Xem thêm</span>
            </button>
        </div>
    );
};

export default ButtonMore;