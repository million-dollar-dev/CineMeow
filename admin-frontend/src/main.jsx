import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./pages/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import {ThemeProvider} from "@mui/material";
import theme from "./configs/muiConfig.js";
import AuthPage from "./pages/AuthPage.jsx";
const router = createBrowserRouter([
    {
        element: <RootLayout/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            },
            {
                path: "/auth",
                element: <AuthPage />
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
        <RouterProvider router={router}/>
    </ThemeProvider>
)
