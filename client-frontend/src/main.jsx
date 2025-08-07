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
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
