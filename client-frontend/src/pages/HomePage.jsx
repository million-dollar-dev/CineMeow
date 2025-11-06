
import FeatureMovies from "../components/FeatureMovies/index.jsx";
import MediaList from "../components/MediaList/index.jsx";
import Promotions from "../components/PromotionSection.jsx";
import {useSearchMoviesQuery} from "../services/movieService.js";
import {useEffect} from "react";
import {toast} from "react-toastify";

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

    useEffect(() => {
        if (isNowPlayingError && nowPlayingError) {
            toast.error(nowPlayingError?.error || "Lỗi lấy dữ liệu");
        }
    }, [isNowPlayingError, nowPlayingError]);

    useEffect(() => {
        if (isCommingSoonError && commingSoonError) {
            toast.error(isCommingSoonError?.error || "Lỗi lấy dữ liệu");
        }
    }, [isCommingSoonError, commingSoonError]);

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
