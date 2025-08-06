
import Header from "../components/Header.jsx";
import FeatureMovies from "../components/FeatureMovies/index.jsx";
import MediaList from "../components/MediaList/index.jsx";
import Promotions from "../components/PromotionSection.jsx";
import Footer from "../components/Footer.jsx";

function HomePage() {

    return (
        <div className="bg-black">

            <FeatureMovies/>
            <MediaList
                title="Phim đang chiếu"
                url="https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"/>
            <MediaList
                title="Phim sắp chiếu"
                url="https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1"/>
            <Promotions/>

        </div>
    );
}

export default HomePage
