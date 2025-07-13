import React from 'react';
import CircularProgressBar from "../CircularProgressBar.jsx";
import MiniCardList from "../MediaList/MiniCardList.jsx";

const NowPlayingList = () => {
    return (
        <div className="text-white my-[2vw] ml-[4vw]">
            <p className="font-bold text-[1.8vw]">Phim đang chiếu</p>
            <MiniCardList/>
            <MiniCardList/>
            <MiniCardList/>
            <MiniCardList/>


        </div>
    );
};

export default NowPlayingList;