import React, {useEffect, useState} from 'react';
import {faCat, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 150);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`mx-auto px-8 py-6 flex items-center justify-between fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-black bg-opacity-90' : 'bg-transparent'
            }`}
        >
            <Link to={"/"} className="font-bold text-black text-xl text-white"><FontAwesomeIcon icon={faCat} /> CineMeow</Link>
            <nav>
                <ul className="text-white flex items-center justify-center font-semibold">
                    <li className="relative group px-3 py-2">
                        <button className="flex items-center space-x-1 hover:text-neutral-300 transition-colors duration-300">
                            <span>Lịch chiếu</span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="text-xs transition-transform duration-300 group-hover:rotate-180"
                            />
                        </button>
                        <div
                            className="absolute top-0 -left-2 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[200px] transform">
                            <div className="relative top-6 p-4 bg-white rounded-xl shadow-xl w-full">
                                <div
                                    className="w-10 h-10 bg-white transform rotate-45 absolute top-0 z-0 -translate-x-4 transition-transform group-hover:translate-x-3 duration-500 ease-in-out rounded-sm">
                                </div>
                                <div className="relative z-10">
                                    <ul className="text-[15px]">
                                        <Link to={"/showtimes/today"}>
                                            <li>
                                                <a href="#"
                                                   className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-300">
                                                    Lịch chiếu hôm nay
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to={"/now-playing"}>
                                            <li>
                                                <a href="#"
                                                   className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-300">
                                                    Phim đang chiếu
                                                </a>
                                            </li>
                                        </Link>
                                        <Link to={"/comming-soon"}>
                                            <li>
                                                <a href="#"
                                                   className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-300">
                                                    Phim sắp chiếu
                                                </a>
                                            </li>
                                        </Link>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="relative group px-3 py-2">
                        <button className="flex items-center space-x-1 hover:text-neutral-300 transition-colors duration-300">
                            <span>Rạp chiếu</span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="text-xs transition-transform duration-300 group-hover:rotate-180"
                            />
                        </button>
                        <div
                            className="absolute top-0 -left-48 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[560px] transform">
                            <div className="relative top-6 p-4 bg-white rounded-xl shadow-xl w-full">
                                <div
                                    className="w-10 h-10 bg-white transform rotate-45 absolute top-0 z-0 translate-x-0 transition-transform group-hover:translate-x-[12rem] duration-500 ease-in-out rounded-sm">
                                </div>

                                <div className="relative z-10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <ul className="mt-3 text-[15px]">
                                                <Link to={"/cinema/cgv"}>
                                                    <li>
                                                        <a href="#"
                                                           className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-300">
                                                            CGV
                                                        </a>
                                                    </li>
                                                </Link>
                                                <li>
                                                    <a href="#"
                                                       className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                        Galaxy Cinema

                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#"
                                                       className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                        CineStar
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <ul className="mt-3 text-[15px]">
                                                <li>
                                                    <a href="#"
                                                       className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                        Lotte Cinema

                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#"
                                                       className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                        Beta Cinemas

                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#"
                                                       className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                        BHD Star
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <Link to={"/movies"}>
                        <li className="relative group px-3 py-2">
                            <button className="hover:opacity-50 cursor-default">Phim chiếu</button>
                        </li>
                    </Link>
                    <li className="relative group px-3 py-2">
                        <button className="hover:opacity-50 cursor-default">Review Phim</button>
                    </li>
                    <li className="relative group px-3 py-2">
                        <button className="flex items-center space-x-1 hover:text-neutral-300 transition-colors duration-300">
                            <span>Blog Phim</span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="text-xs transition-transform duration-300 group-hover:rotate-180"
                            />
                        </button>
                        <div
                            className="absolute top-0 -left-2 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[200px] transform">
                            <div className="relative top-6 p-4 bg-white rounded-xl shadow-xl w-full">
                                <div
                                    className="w-10 h-10 bg-white transform rotate-45 absolute top-0 z-0 -translate-x-4 transition-transform group-hover:translate-x-3 duration-500 ease-in-out rounded-sm">
                                </div>
                                <div className="relative z-10">
                                    <ul className="text-[15px]">
                                        <li>
                                            <a href="#"
                                               className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                Blog điện ảnh
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                               className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                Phim chiếu rạp
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                               className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                Tổng hợp phim
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                               className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                Phim Netflix
                                            </a>
                                        </li>
                                    </ul>


                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="relative group px-3 py-2">
                        <a href="#" className="hover:opacity-50 cursor-default">Ưu đãi
                        </a>
                    </li>
                </ul>
            </nav>
            <nav>
                <ul>
                    <li>
                        <a href="#"
                           className="rounded-full px-3 py-2 font-semibold bg-white bg-opacity-10 flex items-center group">
                            <span className="mr-2">Đăng nhập</span>
                            <svg className="stroke-current" width="10" height="10" strokeWidth="2" viewBox="0 0 10 10"
                                 aria-hidden="true">
                                <g fillRule="evenodd">
                                    <path
                                        className="opacity-0 group-hover:opacity-100 transition ease-in-out duration-200"
                                        d="M0 5h7"></path>
                                    <path
                                        className="opacity-100 group-hover:transform group-hover:translate-x-1 transition ease-in-out duration-200"
                                        d="M1 1l4 4-4 4"></path>
                                </g>
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;