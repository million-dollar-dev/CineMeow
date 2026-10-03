import MovieCard from "./MovieCard.jsx";
import ButtonMore from "../utils/ButtonMore.jsx";


const MediaList = ({title, mediaList}) => {

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
            <ButtonMore />
        </div>
    );
};

export default MediaList;