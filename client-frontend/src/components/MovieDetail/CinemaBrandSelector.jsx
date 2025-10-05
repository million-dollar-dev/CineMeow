import React from "react";

const CinemaBrandSelector = ({ name, logoUrl, handleClick, isSelected }) => (
    <button
        onClick={handleClick}
        className={`flex flex-col items-center gap-[0.4vw] p-[0.6vw] w-[7vw] h-[7.5vw] rounded-xl t
        ransition-all duration-300 border-white border-[0.5]
        ${isSelected
            ? "bg-[#1e1e1e] ring-2 ring-[#7f5af0] shadow-[0_0_8px_rgba(127,90,240,0.6)] scale-105"
            : "bg-[#181818] hover:bg-[#202020] hover:scale-105"
        }
    `}
    >
        <div className="w-[4vw] h-[4vw] overflow-hidden rounded-lg flex items-center justify-center bg-[#0d0d0d]">
            <img src={logoUrl} alt={name} className="object-contain w-full h-full" />
        </div>
        <p className="text-[0.9vw] text-[#eaeaea] truncate text-center">{name}</p>
    </button>
);


export default CinemaBrandSelector;
