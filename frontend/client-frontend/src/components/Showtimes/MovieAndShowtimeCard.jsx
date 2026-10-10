import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import RatingCard from "../RatingCard.jsx";
import TimeSelector from "../MovieDetail/TimeSelector.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFilm, faCirclePlay } from "@fortawesome/free-solid-svg-icons";

const MovieAndShowtimeCard = ({
    movie,
    showtimes = [],
    index,
}) => {
    // Fallback info if movie prop is missing (for backward compatibility)
    const movieData = movie || {
        id: "default-movie",
        title: "Bộ Tứ Siêu Đẳng: Bước Đi Đầu Tiên",
        posterPath: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg",
        genres: "Khoa học viễn tưởng, Phiêu lưu",
        duration: "115 phút",
        rating: "T13",
    };

    // Group showtimes by format/roomType
    const groupedByFormat = useMemo(() => {
        if (!showtimes || showtimes.length === 0) return {};

        return showtimes.reduce((acc, st) => {
            const format = st.roomType || "2D Phụ đề";
            if (!acc[format]) {
                acc[format] = [];
            }
            acc[format].push(st);
            return acc;
        }, {});
    }, [showtimes]);

    const formatKeys = Object.keys(groupedByFormat);

    return (
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 hover:bg-[#18181c]/60 transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                {/* Poster phim */}
                <div className="relative w-24 sm:w-28 md:w-32 flex-shrink-0 self-start group">
                    <Link to={`/movie/${movieData.id}`} className="block overflow-hidden rounded-xl aspect-[2/3] bg-zinc-900 shadow-lg border border-zinc-800">
                        <img
                            src={movieData.posterPath || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60"}
                            alt={movieData.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="w-10 h-10 rounded-full bg-[#7f5af0]/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                                <FontAwesomeIcon icon={faCirclePlay} className="text-lg" />
                            </span>
                        </div>
                    </Link>

                    {/* Numeric index or rating badge */}
                    {index !== undefined && (
                        <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-violet-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                            {index + 1}
                        </span>
                    )}
                </div>

                {/* Thông tin phim & Suất chiếu */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        {/* Title & Ratings */}
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <RatingCard rating={movieData.rating || movieData.ageRating || "P"} />
                            <Link 
                                to={`/movie/${movieData.id}`}
                                className="font-bold text-base sm:text-lg text-white hover:text-violet-400 transition-colors line-clamp-1"
                            >
                                {movieData.title}
                            </Link>
                        </div>

                        {/* Meta: Genres, Duration */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-3.5">
                            {movieData.genres && (
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faFilm} className="text-violet-400 text-[11px]" />
                                    {movieData.genres}
                                </span>
                            )}
                            {movieData.duration && (
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faClock} className="text-violet-400 text-[11px]" />
                                    {movieData.duration}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Suất chiếu theo định dạng */}
                    <div className="space-y-3 mt-1">
                        {formatKeys.length > 0 ? (
                            formatKeys.map((format) => (
                                <div key={format} className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-violet-300 bg-violet-950/60 border border-violet-800/40 px-2 py-0.5 rounded">
                                            {format}
                                        </span>
                                        <div className="h-[1px] flex-1 bg-zinc-800/60" />
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {groupedByFormat[format].map((st) => (
                                            <TimeSelector
                                                key={st.id}
                                                showtimeId={st.id}
                                                startTime={st.startTime}
                                                endTime={st.endTime}
                                                roomName={st.roomName}
                                                roomType={st.roomType}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Fallback showtimes if none provided */
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-violet-300 bg-violet-950/60 border border-violet-800/40 px-2 py-0.5 rounded">
                                        2D Phụ đề
                                    </span>
                                    <div className="h-[1px] flex-1 bg-zinc-800/60" />
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <TimeSelector startTime="2026-10-04T09:30:00" endTime="2026-10-04T11:45:00" showtimeId="demo-1" roomName="Rạp 1" />
                                    <TimeSelector startTime="2026-10-04T12:15:00" endTime="2026-10-04T14:30:00" showtimeId="demo-2" roomName="Rạp 2" />
                                    <TimeSelector startTime="2026-10-04T15:00:00" endTime="2026-10-04T17:15:00" showtimeId="demo-3" roomName="Rạp 1" />
                                    <TimeSelector startTime="2026-10-04T18:30:00" endTime="2026-10-04T20:45:00" showtimeId="demo-4" roomName="Rạp 3" />
                                    <TimeSelector startTime="2026-10-04T21:15:00" endTime="2026-10-04T23:30:00" showtimeId="demo-5" roomName="Rạp 2" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieAndShowtimeCard;