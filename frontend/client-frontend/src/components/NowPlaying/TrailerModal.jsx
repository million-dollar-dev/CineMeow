import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faFilm } from "@fortawesome/free-solid-svg-icons";

const TrailerModal = ({ isOpen, onClose, movie }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !movie) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-violet-950/40"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header bar */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/90 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                            <FontAwesomeIcon icon={faFilm} className="text-xs" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                                Trailer: {movie.title}
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                                {movie.genres} • {movie.duration || "Đang chiếu"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-violet-600 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Đóng trailer"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-sm" />
                    </button>
                </div>

                {/* 16:9 Video Frame */}
                <div className="relative w-full aspect-video bg-black">
                    <iframe
                        src={`${movie.trailerUrl}?autoplay=1&rel=0`}
                        title={`Trailer ${movie.title}`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-zinc-900/60 text-xs text-zinc-400">
                    <span>Phát trailer chính thức từ CineMeow Cinema</span>
                    <button
                        onClick={onClose}
                        className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
                    >
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrailerModal;
