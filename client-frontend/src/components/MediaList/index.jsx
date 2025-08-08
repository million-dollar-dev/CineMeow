import React, {useEffect, useState} from 'react';
import MovieCard from "./MovieCard.jsx";
import ButtonMore from "../utils/ButtonMore.jsx";
import PaginationComponent from "../utils/PaginationComponent.jsx";

const MediaList = ({title, url}) => {
    const [mediaList, setMediaList] = useState([]);
    useEffect(() => {
        if (url) {
            fetch(url, {
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
        } else {
            console.log('fail')
        }
    }, [url]);
    return (
        <div className="max-w-screen-xl mx-auto text-[1.2vw] py-[3vw] bg-black text-white">
            <div className="my-[2vw] text-[2vw] font-bold">
                <p className="text-[2vw] font-bold text-center">{title}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                {
                    mediaList.map((item) => <MovieCard key={item.id} item={item}/>)
                }

            </div>
            <PaginationComponent pageCount={12}/>
            <ButtonMore />
        </div>
    );
};

export default MediaList;