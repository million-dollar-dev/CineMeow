import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faLocationDot, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "./TimeSelector.jsx";

const ShowtimesSelector = ({ name, address, showtimes = [], logoUrl, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Group showtimes by format / roomType
    const groupedByFormat = React.useMemo(() => {
        const groups = {};
        showtimes.forEach((st) => {
            const format = st.roomType || st.format || "2D Phụ đề";
            if (!groups[format]) groups[format] = [];
            groups[format].push(st);
        });
        return groups;
    }, [showtimes]);

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${name}, ${address}`
    )}`;

    return (
        <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800/80 mb-3.5 overflow-hidden transition-all duration-300 shadow-sm hover:border-zinc-700/80">
            {/* Accordion Cinema Header Bar */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-zinc-900/60 cursor-pointer transition-colors border-b border-zinc-800/40 select-none"
            >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Cinema Brand Logo */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-900 border border-zinc-800 p-2 flex items-center justify-center shrink-0 shadow-inner">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                }}
                            />
                        ) : null}
                        <span className={`${logoUrl ? "hidden" : ""} text-xs font-black text-violet-400`}>
                            {name?.substring(0, 3)}
                        </span>
                    </div>

                    {/* Cinema Name & Address */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-bold text-white truncate hover:text-violet-300 transition-colors">
                                {name}
                            </h4>
                            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30">
                                {showtimes.length} suất chiếu
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-400">
                            <span className="truncate max-w-xs sm:max-w-md">{address}</span>
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 hover:underline shrink-0 text-[11px]"
                            >
                                <FontAwesomeIcon icon={faMapLocationDot} className="text-[10px]" />
                                <span>Bản đồ</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Dropdown Chevron Toggle */}
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0 ml-3">
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-xs text-violet-400 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </div>
            </div>

            {/* Showtimes Time Slots Container */}
            {isOpen && (
                <div className="p-4 sm:p-5 bg-black/40 space-y-4">
                    {Object.entries(groupedByFormat).map(([format, slots]) => (
                        <div key={format} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-400" />
                                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                                    {format}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                {slots.map((s) => (
                                    <TimeSelector
                                        key={s.id}
                                        showtimeId={s.id}
                                        startTime={s.startTime}
                                        endTime={s.endTime}
                                        roomName={s.roomName}
                                        roomType={s.roomType}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowtimesSelector;
