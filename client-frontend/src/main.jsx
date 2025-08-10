import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './pages/HomePage.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import RootLayout from "./pages/RootLayout.jsx";
import ShowtimesPage from "./pages/ShowtimesPage.jsx";
import NowPlayingPage from "./pages/NowPlayingPage.jsx";
import CommingSoon from "./pages/CommingSoonPage.jsx";
import CinemaPage from "./pages/CinemaPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import MovieReviewPage from "./pages/MovieReviewPage.jsx";
import AllBlogPage from "./pages/AllBlogPage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";
import AllPromotionPage from "./pages/AllPromotionPage.jsx";
import PromotionDetailPage from "./pages/PromotionDetailPage.jsx";

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <HomePage/>,
            },
            {
                path: "/movie/:movieId",
                element: <MovieDetailPage />,
            },
            {
                path: "/showtimes/today",
                element: <ShowtimesPage />,
            },
            {
                path: "/now-playing",
                element: <NowPlayingPage />,
            },
            {
                path: "/comming-soon",
                element: <CommingSoon />,
            },
            {
                path: "/cinema/:cinemaId",
                element: <CinemaPage />,
            },
            {
                path: "/movies",
                element: <MoviesPage />,
            },
            {
                path: "/reviews",
                element: <ReviewPage />,
            },
            {
                path: "/movies/:movieId/review",
                element: <MovieReviewPage />,
            },
            {
                path: "/blogs/:category",
                element: <AllBlogPage />
            },
            {
                path: "/blogs/:category/:id",
                element: <BlogDetailPage />
            },
            {
                path: "/promotions",
                element: <AllPromotionPage />
            },
            {
                path: "/promotions/:id",
                element: <PromotionDetailPage />
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
