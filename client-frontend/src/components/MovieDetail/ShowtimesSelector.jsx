import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "./TimeSelector.jsx";

const ShowtimesSelector = () => {
    return (
        <div>
            <div  className="flex gap-[0.5vw] justify-between items-center px-[1.6vw] py-[1.2vw]">
                <div className="flex gap-[1vw]">
                    <div className="w-[4vw] h-[4vw] border-2 border-gray-400 rounded-lg  overflow-hidden flex items-center justify-center">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"
                            alt="CGV Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <p>CGV Tân Phú</p>
                        <p>Tân Phú Thành phố Hồ Chí Minh <a>[Bản đồ]</a></p>
                    </div>
                </div>
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
            <div className="grid grid-cols-5 justify-items-start">
                <TimeSelector/>
                <TimeSelector/>
                <TimeSelector/>
            </div>
        </div>
    );
};

export default ShowtimesSelector;