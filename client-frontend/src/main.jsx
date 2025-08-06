import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './pages/HomePage.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MovieDetail from "./pages/MovieDetail.jsx";
import RootLayout from "./pages/RootLayout.jsx";
import Showtimes from "./pages/Showtimes.jsx";

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
                element: <MovieDetail />,
            },
            {
                path: "/showtimes/today",
                element: <Showtimes />,
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
