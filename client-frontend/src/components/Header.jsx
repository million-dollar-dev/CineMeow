import React, {useEffect, useState} from 'react';
import {faCat, faChevronDown, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useNavigate} from "react-router-dom";
import {useGetAllBrandsQuery} from "../services/brandService.js";
import {useGetMeQuery, useLogoutMutation} from "../services/authService.js";
import {useDispatch, useSelector} from "react-redux";
import {clearTokens} from "../redux/slices/authSlice.js";
import OverlayLoading from "./Booking/OverlayLoading.jsx";
import {rootApi} from "../services/rootApi.js";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.auth.accessToken);

    const [logout, { isLoading: isLogOut }] = useLogoutMutation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 150);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { data: brandData = [] } = useGetAllBrandsQuery();

    const handleLogout = async () => {
        try {
            await logout(accessToken);
        } finally {
            dispatch(clearTokens());
            dispatch(rootApi.util.resetApiState());
            navigate("/");
        }
    };

    const { data: user, isLoading } = useGetMeQuery(undefined, {
        skip: !accessToken,
    });

    if (isLogOut || isLoading) return <OverlayLoading />;

    return (
        <header
            className={`mx-auto px-8 py-6 flex items-center justify-between fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-black bg-opacity-90' : 'bg-transparent'
            }`}
        >
            <Link to={"/"} className="font-bold text-black text-xl text-white"><FontAwesomeIcon icon={faCat}/> CineMeow</Link>
            <nav>
                <ul className="text-white flex items-center justify-center font-semibold">
                    <li className="relative group px-3 py-2">
                        <button
                            className="flex items-center space-x-1 hover:text-neutral-300 transition-colors duration-300">
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
                                                <p
                                                    className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-300">
                                                    Lịch chiếu hôm nay
                                                </p>
                                            </li>
                                        </Link>
                                        <Link to={"/now-playing"}>
                                            <li>
                                                <p
                                                    className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-300">
                                                    Phim đang chiếu
                                                </p>
                                            </li>
                                        </Link>
                                        <Link to={"/comming-soon"}>
                                            <li>
                                                <p
                                                    className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors duration-300">
                                                    Phim sắp chiếu
                                                </p>
                                            </li>
                                        </Link>
                                    </ul>
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
                        <button
                            className="flex items-center space-x-1 hover:text-neutral-300 transition-colors duration-300">
                            <span>Rạp chiếu</span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="text-xs transition-transform duration-300 group-hover:rotate-180"
                            />
                        </button>
                        <div
                            className="absolute top-0 -left-24 transition group-hover:translate-y-5
                            translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            duration-500 ease-in-out group-hover:transform z-50 min-w-[360px] transform"
                        >
                            <div className="relative top-6 p-4 bg-white rounded-xl shadow-xl w-full">
                                <div
                                    className="w-8 h-8 bg-white transform rotate-45 absolute top-0 z-0
                                     translate-x-0 transition-transform
                                     group-hover:translate-x-[8rem]
                                     duration-500 ease-in-out rounded-sm"
                                ></div>

                                {/* Nội dung menu */}
                                <div className="relative z-10">
                                    <div className="grid grid-cols-2 gap-3">
                                        {brandData.map((brand) => (
                                            <Link key={brand.id} to={`/brands/${brand.id}`}>
                                                <p
                                                    className="block p-2 rounded-md text-gray-700 hover:text-black
                                                    hover:bg-gray-100 ransition-colors duration-300 text-[15px]"
                                                >
                                                    {brand.name}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </li>
                    <Link to={"/reviews"}>
                        <li className="relative group px-3 py-2">
                            <button className="hover:opacity-50 cursor-default">Review Phim</button>
                        </li>
                    </Link>

                    <Link to={"/promotions"}>
                        <li className="relative group px-3 py-2">
                            <p className="hover:opacity-50 cursor-default">Ưu đãi</p>
                        </li>
                    </Link>
                    <li className="relative group px-3 py-2">
                        <button
                            className="flex items-center space-x-1 hover:text-neutral-300 transition-colors duration-300">
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
                                        <Link to={"/blogs/cinema"}>
                                            <li>
                                                <p
                                                    className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                    Blog điện ảnh
                                                </p>
                                            </li>
                                        </Link>
                                        <Link to={"/blogs/movie"}>
                                            <li>
                                                <p
                                                    className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                    Phim chiếu rạp
                                                </p>
                                            </li>
                                        </Link>
                                        <Link to={"/blogs/movie"}>
                                            <li>
                                                <p
                                                    className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                    Tổng hợp phim
                                                </p>
                                            </li>
                                        </Link>
                                        <li>
                                            <p
                                                className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                Phim Netflix
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
            <nav>
                {accessToken ? (
                    <ul className="text-white">
                        <li className="relative group px-3 py-2">
                            <button
                                className="flex items-center gap-1 space-x-1 hover:text-neutral-300 transition-colors duration-300">
                                <div className="rounded-full px-3 py-2 font-semibold bg-white bg-opacity-10">
                                    <FontAwesomeIcon icon={faUser} className="text-black"/>
                                </div>
                                <span>{user?.username}</span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="text-xs transition-transform duration-300 group-hover:rotate-180"
                                />
                            </button>
                            <div
                                className="absolute top-0 -left-10 transition group-hover:translate-y-7 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 min-w-[180px] transform">
                                <div className="relative top-6 p-4 bg-white rounded-xl shadow-xl w-full">
                                    <div
                                        className="w-10 h-10 bg-white transform rotate-45 absolute top-0 z-0 -translate-x-4 transition-transform group-hover:translate-x-20 duration-500 ease-in-out rounded-sm">
                                    </div>
                                    <div className="relative z-10">
                                        <ul className="text-[15px]">
                                            <Link to={`/user-profile/${user?.id}`}>
                                                <li>
                                                    <p
                                                        className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                        Thông tin tài khoản
                                                    </p>
                                                </li>
                                            </Link>

                                            <li onClick={() => handleLogout()}>
                                                <p
                                                    className="block p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300">
                                                    Đăng xuất
                                                </p>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <Link to={"/login"}>
                            <li>
                                <p
                                    className="rounded-full px-3 py-2 font-semibold bg-white bg-opacity-10 flex items-center group">
                                    <span className="mr-2">Đăng nhập</span>
                                    <svg className="stroke-current" width="10" height="10" strokeWidth="2"
                                         viewBox="0 0 10 10"
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
                                </p>
                            </li>
                        </Link>
                    </ul>
                )}
            </nav>
        </header>
    );
};

export default Header;