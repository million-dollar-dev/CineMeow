import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./pages/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import {ThemeProvider} from "@mui/material";
import theme from "./configs/muiConfig.js";
import AuthPage from "./pages/AuthPage.jsx";
import {Provider} from "react-redux";
import {store} from "./redux/store.js";
import {PersistGate} from "redux-persist/integration/react";
import {persistor} from "./redux/store.js";
import ProtectedLayout from "./pages/ProtectedLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import MovieManagement from "./pages/MovieManagementPage.jsx";
import MovieManagementPage from "./pages/MovieManagementPage.jsx";

const router = createBrowserRouter([
    {
        element: <RootLayout/>,
        children: [
            {
                element: <ProtectedLayout/>,
                children: [
                    {
                        path: "/",
                        element: <HomePage/>
                    },
                    {
                        path: "/dashboard",
                        element: <DashboardPage/>
                    },
                    {
                        path: "/movies",
                        element: <MovieManagementPage/>
                    }
                ]
            },
            {
                path: "/auth",
                element: <AuthPage/>
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <PersistGate persistor={persistor} loading={<p>Loading...</p>}>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router}/>
            </ThemeProvider>
        </Provider>
    </PersistGate>
)
