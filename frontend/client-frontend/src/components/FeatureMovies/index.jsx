import React, { useEffect, useState, useMemo } from "react";
import PaginateIndicator from "./PaginateIndicator.jsx";
import Movie from "./Movie.jsx";
import { useSearchMoviesQuery } from "../../services/movieService.js";
import Loading from "../Loading.jsx";

// Verified TMDB blockbuster fallbacks for Hero Carousel
const HERO_FALLBACK_MOVIES = [
    {
        id: "dune-2",
        title: "Dune: Hành Tinh Cát - Phần Hai",
        originalTitle: "Dune: Part Two",
        releaseDate: "01/03/2026",
        rating: "T16",
        score: 9.3,
        duration: "166 phút",
        genres: "Khoa học viễn tưởng, Phiêu lưu",
        backdropPath: "https://image.tmdb.org/t/p/w1280/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
        overview: "Paul Atreides hợp lực cùng Chani và tộc người Fremen trong hành trình báo thù những kẻ đã hủy hoại gia tộc, đối mặt với sự giằng xé giữa tình yêu và số phận định đoạt tương lai của vũ trụ.",
    },
    {
        id: "deadpool-wolverine",
        title: "Deadpool & Wolverine",
        originalTitle: "Deadpool & Wolverine",
        releaseDate: "26/07/2026",
        rating: "T18",
        score: 9.1,
        duration: "128 phút",
        genres: "Hành động, Hài hước, Viễn tưởng",
        backdropPath: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
        overview: "Cặp bài trùng lầy lội tái xuất khi Cơ quan Quản lý Phương sai Thời gian lôi kéo Wade Wilson vào một sứ mệnh giải cứu đa vũ trụ cùng người đồng đội bất đắc dĩ Wolverine.",
    },
    {
        id: "gladiator-2",
        title: "Võ Sĩ Giác Đấu II",
        originalTitle: "Gladiator II",
        releaseDate: "15/11/2026",
        rating: "T18",
        score: 9.3,
        duration: "148 phút",
        genres: "Hành động, Lịch sử, Sử thi",
        backdropPath: "https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
        trailerUrl: "https://www.youtube.com/embed/4rgYUipGJNo",
        overview: "Tiếp nối thiên sử thi của đạo diễn Ridley Scott, Lucius bước vào Đấu trường La Mã khốc liệt để giành lại tự do và vinh quang cho người dân thành Rome.",
    },
    {
        id: "conan-million-dollar-star",
        title: "Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh 1 Triệu Đô",
        originalTitle: "Detective Conan: The Million-dollar Pentagram",
        releaseDate: "02/08/2026",
        rating: "P",
        score: 9.4,
        duration: "110 phút",
        genres: "Hoạt hình, Trinh thám, Hành động",
        backdropPath: "https://image.tmdb.org/t/p/w1280/unthV1mq9llhEinIMPcCUImFodt.jpg",
        posterPath: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
        trailerUrl: "https://www.youtube.com/embed/K84CjJ6Z6rI",
        overview: "Cuộc đối đầu kịch tính tại Hakodate giữa siêu đạo chích Kaito Kid, thám tử miền Tây Heiji Hattori và Conan với bí mật chấn động về thanh kiếm cổ và thân thế gia tộc.",
    },
];

const FeatureMovies = ({ onPlayTrailer }) => {
    const { data: apiMovies = [], isLoading } = useSearchMoviesQuery({
        page: 0,
        size: 5,
        sort: "releaseDate,desc",
        filters: ['status:"NOW_PLAYING"'],
    });

    // Merge API movies with rich fallback
    const movies = useMemo(() => {
        if (Array.isArray(apiMovies) && apiMovies.length > 0) {
            return apiMovies.map((m, idx) => {
                const fb = HERO_FALLBACK_MOVIES[idx % HERO_FALLBACK_MOVIES.length];
                return {
                    id: m.id || fb.id,
                    title: m.title || fb.title,
                    originalTitle: m.originalTitle || fb.originalTitle,
                    releaseDate: m.releaseDate || fb.releaseDate,
                    rating: m.ageRating || m.rating || fb.rating,
                    score: m.voteAverage || fb.score,
                    duration: m.duration ? `${m.duration} phút` : fb.duration,
                    genres: m.genres || fb.genres,
                    backdropPath: m.backdropPath || m.imageUrl || fb.backdropPath,
                    posterPath: m.posterPath || fb.posterPath,
                    trailerUrl: m.trailerUrl || fb.trailerUrl,
                    overview: m.synopsis || m.overview || fb.overview,
                };
            });
        }
        return HERO_FALLBACK_MOVIES;
    }, [apiMovies]);

    const [activeMovieId, setActiveMovieId] = useState(movies[0]?.id || "dune-2");
    const [isFading, setIsFading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (movies.length > 0 && !movies.some((m) => m.id === activeMovieId)) {
            setActiveMovieId(movies[0].id);
        }
    }, [movies, activeMovieId]);

    const activeMovie = movies.find((m) => m.id === activeMovieId) || movies[0];

    // Auto-slide every 6 seconds if not paused
    useEffect(() => {
        if (movies.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setIsFading(true);

            setTimeout(() => {
                setActiveMovieId((prevId) => {
                    const currentIndex = movies.findIndex((m) => m.id === prevId);
                    const nextIndex = (currentIndex + 1) % movies.length;
                    return movies[nextIndex].id;
                });
                setIsFading(false);
            }, 350);
        }, 6000);

        return () => clearInterval(interval);
    }, [movies, isPaused]);

    // Preload next image
    useEffect(() => {
        if (movies.length === 0) return;
        const currentIndex = movies.findIndex((m) => m.id === activeMovieId);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % movies.length;
        const nextMovie = movies[nextIndex];
        if (nextMovie?.backdropPath) new Image().src = nextMovie.backdropPath;
    }, [activeMovieId, movies]);

    if (!activeMovie) return null;

    return (
        <section
            className="relative overflow-hidden w-full bg-black select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {isLoading && !movies ? (
                <div className="min-h-[500px] flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <>
                    <div
                        className={`transition-opacity duration-500 ease-in-out ${
                            isFading ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        <Movie data={activeMovie} onPlayTrailer={onPlayTrailer} />
                    </div>

                    <PaginateIndicator
                        movies={movies}
                        activeMovieId={activeMovieId}
                        setActiveMovieId={(id) => {
                            setIsFading(true);
                            setTimeout(() => {
                                setActiveMovieId(id);
                                setIsFading(false);
                            }, 250);
                        }}
                    />
                </>
            )}
        </section>
    );
};

export default FeatureMovies;