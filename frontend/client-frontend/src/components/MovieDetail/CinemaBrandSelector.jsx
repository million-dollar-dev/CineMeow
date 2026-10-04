import React from "react";

const CinemaBrandSelector = ({ name, logoUrl, handleClick, isSelected }) => (
    <button
        type="button"
        onClick={handleClick}
        className={`group relative flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 min-w-[80px] sm:min-w-[96px] rounded-xl transition-all duration-200 border cursor-pointer select-none
        ${isSelected
            ? "bg-gradient-to-b from-[#281f44] to-[#181524] border-violet-500 text-white ring-2 ring-violet-500/60 shadow-[0_0_12px_rgba(127,90,240,0.35)]"
            : "bg-[#151518] border-zinc-800 text-zinc-400 hover:bg-[#1e1e24] hover:border-zinc-700 hover:text-zinc-200"
        }
    `}
    >
        {/* Top Active Dot Indicator */}
        {isSelected && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        )}

        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center p-1.5 transition-transform duration-200 group-hover:scale-105 ${
            isSelected ? "bg-white/10 ring-1 ring-violet-400/30" : "bg-black/40"
        }`}>
            <img 
                src={logoUrl} 
                alt={name} 
                className="object-contain w-full h-full" 
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
            />
            <span className="hidden font-bold text-xs text-zinc-400">
                {name?.substring(0, 3)}
            </span>
        </div>

        <p className={`text-[11px] sm:text-xs font-semibold tracking-tight truncate max-w-[75px] sm:max-w-[86px] text-center ${
            isSelected ? "text-violet-200 font-bold" : "text-zinc-300"
        }`}>
            {name}
        </p>
    </button>
);

export default CinemaBrandSelector;
