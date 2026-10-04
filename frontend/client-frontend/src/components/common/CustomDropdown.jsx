import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import RatingCard from "../RatingCard.jsx";

const CustomDropdown = ({
    icon,
    label,
    options = [],
    value,
    onChange,
    headerTitle,
    align = "left",
    className = "",
    width = "w-full",
    dropdownWidth = "w-56",
    variant = "default", // "default" (h-10 rounded-xl) | "pill" (py-1.5 px-3.5 rounded-full)
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Normalize option helpers
    const getOptionValue = (opt) =>
        typeof opt === "object" ? (opt.value !== undefined ? opt.value : opt.id) : opt;
    const getOptionLabel = (opt) => (typeof opt === "object" ? opt.label : opt);

    // Close on click outside or Escape
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Current selected option
    const currentOption = options.find((opt) => getOptionValue(opt) === value);
    const displayLabel = label || (currentOption ? getOptionLabel(currentOption) : "Chọn...");

    // Check if the current value is non-default (filtered)
    const defaultValue = options.length > 0 ? getOptionValue(options[0]) : "all";
    const isFiltered =
        value !== undefined &&
        value !== defaultValue &&
        value !== "all" &&
        value !== "Tất cả định dạng" &&
        value !== "Toàn quốc";

    const baseButtonClasses =
        variant === "pill"
            ? "py-1.5 px-3.5 rounded-full text-xs sm:text-sm font-semibold"
            : "w-full h-10 px-3.5 rounded-xl text-xs sm:text-sm font-medium";

    const filterClasses = isFiltered
        ? "bg-violet-950/60 border-violet-500/80 text-violet-300 shadow-[0_0_12px_rgba(127,90,240,0.35)] ring-1 ring-violet-500/50"
        : "bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-[#181826] hover:text-white";

    return (
        <div
            className={`relative ${isOpen ? "z-50" : "z-10"} ${variant === "pill" ? "inline-block" : width} ${className}`}
            ref={dropdownRef}
        >
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`transition-all duration-200 border flex items-center justify-between gap-2 cursor-pointer select-none active:scale-[0.98] ${baseButtonClasses} ${filterClasses}`}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2 truncate min-w-0">
                    {currentOption?.rating ? (
                        <RatingCard rating={currentOption.rating} />
                    ) : icon ? (
                        <FontAwesomeIcon
                            icon={icon}
                            className={`text-xs flex-shrink-0 ${
                                isFiltered ? "text-violet-400" : "text-violet-400/80"
                            }`}
                        />
                    ) : null}
                    <span className="truncate">
                        {currentOption?.rating && currentOption.shortLabel ? currentOption.shortLabel : displayLabel}
                    </span>
                </div>

                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-[10px] text-zinc-500 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-violet-400" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu Popover */}
            {isOpen && (
                <div
                    className={`absolute top-full mt-2 ${dropdownWidth} bg-[#161622]/98 backdrop-blur-2xl border border-zinc-700/80 rounded-xl shadow-2xl z-[100] py-1.5 animate-fadeIn ring-1 ring-violet-500/25 ${
                        align === "right" ? "right-0" : "left-0"
                    }`}
                >
                    {headerTitle && (
                        <div className="px-3.5 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/80 mb-1 flex items-center justify-between">
                            <span>{headerTitle}</span>
                            {isFiltered && (
                                <span className="text-[9px] text-violet-400 font-semibold lowercase">
                                    đang chọn
                                </span>
                            )}
                        </div>
                    )}

                    <div className="max-h-60 overflow-y-auto custom-scrollbar px-1 space-y-0.5">
                        {options.map((opt) => {
                            const optValue = getOptionValue(opt);
                            const optLabel = getOptionLabel(opt);
                            const isSelected = value === optValue;
                            const rating = typeof opt === "object" ? opt.rating : null;
                            const displayText = rating && opt.shortLabel ? opt.shortLabel : optLabel;

                            return (
                                <button
                                    key={String(optValue)}
                                    type="button"
                                    onClick={() => {
                                        onChange(optValue);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                        isSelected
                                            ? "bg-violet-600/25 text-violet-200 font-bold border border-violet-500/30"
                                            : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate min-w-0">
                                        {rating && <RatingCard rating={rating} />}
                                        <span className="truncate">{displayText}</span>
                                    </div>
                                    {isSelected && (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="text-violet-400 text-xs flex-shrink-0"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
