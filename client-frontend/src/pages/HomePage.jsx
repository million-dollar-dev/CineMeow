
import FeatureMovies from "../components/FeatureMovies/index.jsx";
import MediaList from "../components/MediaList/index.jsx";
import Promotions from "../components/PromotionSection.jsx";
import {useSearchMoviesQuery} from "../services/movieService.js";

function HomePage() {
    const { data: nowPlayingList = [],
        isError: isNowPlayingError,
        error: nowPlayingError,
        isLoading: nowPlayingLoading,
    } = useSearchMoviesQuery({
        page: 0,
        size: 15,
        sort: "releaseDate,desc",
        filters: ['status:"NOW_PLAYING"'],
    });

    const { data: commingSoonList = [],
        isError: isCommingSoonError,
        error: commingSoonError,
        isLoading: commingSoonLoading,
    } = useSearchMoviesQuery({
        page: 0,
        size: 10,
        sort: "releaseDate,desc",
        filters: ['status:"COMING_SOON"'],
    });

    

    return (
        <div className="bg-black">

            <FeatureMovies/>
            <MediaList
                title="Phim đang chiếu"
                mediaList={nowPlayingList}/>
            <MediaList
                title="Phim sắp chiếu"
                mediaList={commingSoonList}/>
            <Promotions/>

        </div>
    );
}

export default HomePage
