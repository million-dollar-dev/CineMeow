import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";

const ButtonPlay = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-80 z-3">
            <button className="rounded-full w-12 h-12 flex items-center justify-center border border-white border-2 transform transition-transform duration-300 group-hover:scale-90">
                <FontAwesomeIcon icon={faPlay} className="text-white" />
            </button>
        </div>
    );
};

export default ButtonPlay;