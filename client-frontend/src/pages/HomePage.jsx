
import Header from "../components/Header.jsx";
import FeatureMovies from "../components/FeatureMovies/index.jsx";
import MediaList from "../components/MediaList/index.jsx";
import Promotions from "../components/Promotions.jsx";
import Footer from "../components/Footer.jsx";

function HomePage() {

    return (
        <div className="bg-black">

            <FeatureMovies/>
            <MediaList
                title="Đang chiếu"
                url="https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"/>
            <MediaList
                title="Sắp chiếu"
                url="https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1"/>
            <Promotions/>

        </div>
    );
}

export default HomePage
