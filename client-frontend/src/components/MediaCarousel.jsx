import React, {useCallback} from 'react';
import useEmblaCarousel from "embla-carousel-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faPlay} from "@fortawesome/free-solid-svg-icons";
import CircularProgressBar from "./CircularProgressBar.jsx";
import RatingCard from "./RatingCard.jsx";

const MediaCarousel = ({title}) => {
    const movies = [


        {
            id: 5,
            title: 'Toàn Trí Độc Giả',
            genre: 'Phiêu Lưu, Hành Động',
            rating: 9.1,
            image: 'https://cinema.momocdn.net/img/89095550954397120-cothienlac.png?size=M'
        },


        {
            id: 5,
            title: 'Toàn Trí Độc Giả',
            genre: 'Phiêu Lưu, Hành Động',
            rating: 9.1,
            image: 'https://cinema.momocdn.net/img/89095550954397120-cothienlac.png?size=M'
        },


        {
            id: 5,
            title: 'Toàn Trí Độc Giả',
            genre: 'Phiêu Lưu, Hành Động',
            rating: 9.1,
            image: 'https://cinema.momocdn.net/img/89095550954397120-cothienlac.png?size=M'
        },


        {
            id: 5,
            title: 'Toàn Trí Độc Giả',
            genre: 'Phiêu Lưu, Hành Động',
            rating: 9.1,
            image: 'https://cinema.momocdn.net/img/89095550954397120-cothienlac.png?size=M'
        },

        {
            id: 5,
            title: 'Toàn Trí Độc Giả',
            genre: 'Phiêu Lưu, Hành Động',
            rating: 9.1,
            image: 'https://cinema.momocdn.net/img/89095550954397120-cothienlac.png?size=M'
        },

        {
            id: 5,
            title: 'Toàn Trí Độc Giả',
            genre: 'Phiêu Lưu, Hành Động',
            rating: 9.1,
            image: 'https://cinema.momocdn.net/img/89095550954397120-cothienlac.png?size=M'
        },

        {
            id: 5,
            title: 'Toàn Trí Độc Giả',
            genre: 'Phiêu Lưu, Hành Động',
            rating: 9.1,
            image: 'https://cinema.momocdn.net/img/89095550954397120-cothienlac.png?size=M'
        },


        {
            id: 5,
            title: 'Toàn Trí Độc Giả',
            genre: 'Phiêu Lưu, Hành Động',
            rating: 9.1,
            image: 'https://cinema.momocdn.net/img/89095550954397120-cothienlac.png?size=M'
        },



    ]

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    return (
        <section className="my-[2vw] bg-cover bg-center bg-no-repeat py-20 px-4 w-full bg-[url('https://homepage.momocdn.net/img/momo-upload-api-230912110927-638301137672516955.jpeg')]" >
            <div className="relative">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-10 text-center">{title}</h2>
                <div className="overflow-hidden relative max-w-screen-xl mx-auto" ref={emblaRef}>
                    <div className="flex gap-6">
                        {movies.map((movie, index) => (
                            <div
                                key={movie.id}
                                className="min-w-[70%] sm:min-w-[50%] md:min-w-[25%] lg:min-w-[20%] shrink-0 group"
                            >
                                <div className="relative rounded-md overflow-hidden shadow-md">
                                    <p className="absolute bottom-1 left-1 text-white font-bold px-2 py-1 rounded-full z-10 text-[3vw] italic">
                                        {index + 1}
                                    </p>

                                    <img
                                        src={movie.image}
                                        alt={movie.title}
                                        className="w-full h-[300px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center opacity-80">
                                        <button className="bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center border border-white border-2 transform transition-transform duration-300 group-hover:scale-90">
                                            <FontAwesomeIcon icon={faPlay} className="text-white" />
                                        </button>
                                    </div>

                                    <div className="absolute inset-2">
                                        <RatingCard rating={"13+"} />
                                    </div>
                                </div>

                                <div className="text-white mt-2 px-1">
                                    <h3 className="text-base font-semibold">{movie.title}</h3>
                                    <p className="text-sm text-gray-400">{movie.genre}</p>
                                </div>
                            </div>

                        ))}
                    </div>

                </div>
                <button onClick={scrollPrev} className="bg-white text-black px-4 py-2 rounded-full shadow absolute left-20 top-[50%] opacity-90">
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </button>
                <button onClick={scrollNext} className="bg-white text-black px-4 py-2 rounded-full shadow absolute right-20 top-[50%] opacity-90">
                    <FontAwesomeIcon icon={faChevronRight}/>
                </button>
            </div>

            {/* Nút điều hướng */}

        </section>
    )
};

export default MediaCarousel;