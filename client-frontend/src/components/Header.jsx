import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    return (
        <header className="h-16 bg-slate-950 flex justify-between text-white items-center px-8">
            <div className="flex items-center gap-4">
                <img src="./logo-black.png" alt="" className="w-10 sm:w-14"/>
                <a href="#">Phim truyền hình</a>
                <a href="#">Phim lẻ</a>
            </div>
            <div>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="cursor-pointer"/>
            </div>
        </header>
    );
};

export default Header;