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
import BrandPage from "./pages/BrandPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import MovieReviewPage from "./pages/MovieReviewPage.jsx";
import AllBlogPage from "./pages/AllBlogPage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";
import AllPromotionPage from "./pages/AllPromotionPage.jsx";
import PromotionDetailPage from "./pages/PromotionDetailPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AuthLayout from "./pages/AuthLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import {persistor, store} from "./redux/store.js"
import {Provider} from "react-redux";
import {ToastContainer} from "react-toastify";
import ProtectedLayout from "./pages/ProtectedLayout.jsx";
import {PersistGate} from "redux-persist/integration/react";
import Loading from "./components/Loading.jsx";
import PaymentResultPage from "./pages/PaymentResultPage.jsx";
import ActiveAccountPage from "./pages/ActiveAccountPage.jsx";
import VerifyAccountPage from "./pages/VerifyAccountPage.jsx";
import UserProfile from "./pages/UserProfilePage.jsx";
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
                path: "/brands/:brandId",
                element: <BrandPage />,
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
            },
            {
                path: "/user-profile/:id",
                element: <UserProfile />
            },
            {
                path: "/showtimes/booking/:showtimeId",
                element: <BookingPage />,
            },
            {
                element: <ProtectedLayout />,
                children: [

                ]
            },
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "/register",
                        element: <RegisterPage />,
                    },
                    {
                        path: "/login",
                        element: <LoginPage />,
                    }
                ]
            }

        ],
    },
    {
        path: "/payment-result",
        element: <PaymentResultPage />,
    },
    {
        path: "/active-account",
        element: <ActiveAccountPage />,
    },
    {
        path: "/verify-account",
        element: <VerifyAccountPage />,
    },
]);

createRoot(document.getElementById('root')).render(
    <PersistGate persistor={persistor}  loading={<Loading />}>
        <Provider store={store}>
            <RouterProvider router={router}></RouterProvider>
            <ToastContainer position="bottom-right" autoClose={4000} />
        </Provider>
    </PersistGate>
)
