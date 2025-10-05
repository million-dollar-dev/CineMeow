import React from 'react';
import MiniCardList from "../MediaList/MiniCardList.jsx";
import {useSearchMoviesQuery} from "../../services/movieService.js";

const NowPlayingList = () => {
    const { data: nowPlayingList = [],
        isError: isNowPlayingError,
        error: nowPlayingError,
        isLoading: nowPlayingLoading,
    } = useSearchMoviesQuery({
        page: 0,
        size: 10,
        sort: "releaseDate,desc",
        filters: ['status:"NOW_PLAYING"'],
    });

    return (
        <div className="text-white my-[2vw] ml-[4vw]">
            <p className="font-bold text-[1.8vw]">Phim đang chiếu</p>
            {
                nowPlayingList.map((item, index) => (
                    <MiniCardList movie={item} key={item.id} index={index} />
                ))
            }




        </div>
    );
};

export default NowPlayingList;