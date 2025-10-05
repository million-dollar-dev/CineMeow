import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "./TimeSelector";

const ShowtimesSelector = ({ name, address, showtimes, logoUrl }) => {
    const [showTimeSelector, setShowTimeSelector] = React.useState(false);
    return (
        <div className="rounded-xl bg-[#1a1a1a] mb-[1vw] overflow-hidden transition-all duration-300">
            <div
                onClick={() => setShowTimeSelector(!showTimeSelector)}
                className="flex justify-between items-center px-[1.6vw] py-[1vw] border-b border-[#2a2a2a] hover:bg-[#202020] cursor-pointer transition"
            >
                <div className="flex items-center gap-[1vw]">
                    <div className="w-[3vw] h-[3vw] bg-[#0d0d0d] rounded-lg flex items-center justify-center">
                        <img src={logoUrl} alt={name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <p className="text-[1.2vw] font-semibold text-[#fff]">{name}</p>
                        <div className="flex items-center gap-[0.5vw] text-[0.9vw] text-[#bfbfbf]">
                            <p>{address}</p>
                            <a href="#" className="text-[#7f5af0] hover:underline">[Bản đồ]</a>
                        </div>
                    </div>
                </div>
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-[#7f5af0] text-[1.2vw] transition-transform duration-300 ${showTimeSelector ? "rotate-90" : ""}`}
                />
            </div>

            {showTimeSelector && (
                <div className="grid grid-cols-5 justify-items-start px-[1.6vw] py-[1vw] transition-all duration-500 ease-out animate-slide-down">
                    {showtimes.map((s) => (
                        <TimeSelector key={s.id} showtimeId={s.id} startTime={s.startTime} endTime={s.endTime} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowtimesSelector;
