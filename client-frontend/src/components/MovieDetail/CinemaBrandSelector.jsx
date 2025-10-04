import React from "react";

const CinemaBrandSelector = ({ name, logoUrl, handleClick, isSelected = false }) => {
    return (
        <button
            onClick={handleClick}
            className={`relative group transition-all duration-300 ease-out rounded-2xl 
                flex flex-col items-center justify-between p-[1vw] w-[7.6vw] h-[7.6vw] 
                ${isSelected
                ? "bg-[#1f1f1f] ring-2 ring-[#7f5af0] scale-105"
                : "bg-[#121212] hover:bg-[#1a1a1a] hover:scale-105"
            }`}
        >
            {/* Hiệu ứng viền phát sáng nhẹ */}
            <div
                className={`absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-all duration-300 
                    ${isSelected ? "bg-[#7f5af0]" : "bg-transparent"}`}
            />

            {/* Nội dung */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-[0.5vw]">
                <div className="w-[4vw] h-[4vw] bg-white/10 rounded-xl flex items-center justify-center overflow-hidden border border-gray-700">
                    <img
                        src={logoUrl}
                        alt={name}
                        className="w-[3.5vw] h-[3.5vw] object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                <p
                    className={`text-[0.9vw] font-semibold text-center truncate transition-all duration-300 
                        ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}
                >
                    {name}
                </p>
            </div>
        </button>
    );
};

export default CinemaBrandSelector;
