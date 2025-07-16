import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "./TimeSelector.jsx";

const ShowtimesSelector = ({name, address}) => {
    const [showTimeSelector, setShowTimeSelector] = React.useState(false);
    return (
        <div onClick={() => setShowTimeSelector(!showTimeSelector)}>
            <div className="flex gap-[0.5vw] justify-between items-center px-[1.8vw] py-[1.2vw] bg-gray-dark border-1 border-gray-dark border-t-gray-light">
                <div className="flex gap-[1vw]">
                    <div
                        className="w-[3.2vw] h-[3.2vw] border-2 border-gray-400 rounded-lg bg-white overflow-hidden flex items-center justify-center">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"
                            alt="CGV Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="">
                        <p className="font-bold text-[1.2vw] text-white">{name}</p>
                        <p className="font-light text-gray-light text-[1vw] truncate overflow-hidden max-w-[90%] inline-block align-bottom">{address}</p>
                        <a href="http://localhost:8080" className="text-sky-500 ml-[vw]"> [Bản đồ]</a>
                    </div>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className={`p-[1vw] transform transition-transform text-white duration-300 ease-in-out ${showTimeSelector && 'rotate-90'}`} />
            </div>
            <div className=" bg-gray-dark">
                {showTimeSelector &&
                    (<div className="pb-[1vw] pt-[1vw] ml-[2vw] grid grid-cols-5 justify-items-start transition-all duration-500 ease-out animate-slide-down">
                        <TimeSelector/>
                        <TimeSelector/>
                        <TimeSelector/>
                        <TimeSelector/>
                        <TimeSelector/>
                        <TimeSelector/>
                        <TimeSelector/>
                    </div>)}
            </div>
        </div>
    );
};

export default ShowtimesSelector;