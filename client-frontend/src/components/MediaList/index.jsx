import React, {useEffect, useState} from 'react';
import MovieCard from "./MovieCard.jsx";

const MediaList = () => {
    const [mediaList, setMediaList] = useState([]);
    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjYzZGE3N2NiMGM3MjBhYzA5YWEyNzUwM2U2NWRlZiIsIm5iZiI6MTc1MTA5NzczMC4xODcsInN1YiI6IjY4NWZhMTgyMzllNDRlYmMxZWRlYmM0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lkquOyV3pva_h3EMIUppdPCWuLRHj9D-j-Wo3IOZFHk",

            },
        }).then(async (res) => {
            const data = await res.json();
            const nowPlayingList = data.results.slice(0, 10);
            console.log(nowPlayingList);
            setMediaList(nowPlayingList);
        })
    }, []);
    return (
        <div className="px-8 text-[1.2vw] py-10 bg-black text-white">
            <div className="my-4 text-[2vw] font-bold flex justify-between">
                <p className="text-[2vw] font-bold">Đang chiếu</p>
                <a href="#" className="hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {
                    mediaList.map((item) => <MovieCard key={item.id} item={item}/>)
                }

            </div>
        </div>
    );
};

export default MediaList;