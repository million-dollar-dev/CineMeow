import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "./TimeSelector";

const ShowtimesSelector = ({ name, address, showtimes, logoUrl }) => {
    const [showTimeSelector, setShowTimeSelector] = React.useState(false);

    return (
        <div
            className="w-full border-b border-gray-800 bg-[#0d0d0d] rounded-xl overflow-hidden mb-[0.6vw]
                       transition-all duration-300 hover:bg-[#141414]"
        >
            {/* Header */}
            <div
                onClick={() => setShowTimeSelector(!showTimeSelector)}
                className="flex justify-between items-center px-[1.8vw] py-[1.2vw] cursor-pointer"
            >
                {/* Left: Logo + Info */}
                <div className="flex gap-[1vw] items-center">
                    <div
                        className="w-[3vw] h-[3vw] bg-[#1f1f1f] border border-gray-700 rounded-lg
                                   overflow-hidden flex items-center justify-center shadow-md"
                    >
                        <img
                            src={logoUrl}
                            alt={`${name} Logo`}
                            className="w-[2.6vw] h-[2.6vw] object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>

                    <div className="flex flex-col">
                        <p className="font-semibold text-[1.2vw] text-white leading-tight mb-[0.3vw]">
                            {name}
                        </p>
                        <div className="flex items-center gap-[0.5vw] text-[0.95vw]">
                            <p className="text-gray-400 truncate max-w-[20vw]">{address}</p>
                            <a
                                href="#"
                                className="text-[#7f5af0] font-medium hover:underline whitespace-nowrap"
                            >
                                <FontAwesomeIcon icon={faMapLocationDot} className="mr-[0.3vw]" />
                                Bản đồ
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right: Arrow */}
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-gray-300 text-[1vw] transition-transform duration-300 
                        ${showTimeSelector ? "rotate-90 text-[#7f5af0]" : "rotate-0"}`}
                />
            </div>

            {/* Showtimes List */}
            <div
                className={`transition-all duration-500 ease-out ${
                    showTimeSelector ? "max-h-[50vh] opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden bg-[#111111] border-t border-gray-800`}
            >
                <div className="pb-[1vw] pt-[1vw] ml-[2vw] grid grid-cols-5 gap-[1vw] justify-items-start">
                    {showtimes.map((s) => (
                        <TimeSelector
                            key={s.id}
                            showtimeId={s.id}
                            startTime={s.startTime}
                            endTime={s.endTime}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowtimesSelector;
