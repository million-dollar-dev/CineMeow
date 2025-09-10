import React, {useEffect, useState} from "react";
import {Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Tooltip,} from "@mui/material";
import {ExpandLess, ExpandMore, Settings,} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggle} from "../redux/slices/sidebarSlice.js";
import CustomIconButton from "./CustomIconButton";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import CameraOutdoorOutlinedIcon from '@mui/icons-material/CameraOutdoorOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

const menuItems = [
    {icon: <DashboardOutlinedIcon/>, label: "Dashboard", path: "/dashboard"},
    {
        icon: <MovieOutlinedIcon/>,
        label: "Phim",
        path: "/movies"
    },
    {
        icon: <CameraOutdoorOutlinedIcon/>,
        label: "Rạp",
        children: [
            {label: "Thương hiệu", path: "/brands"},
            {label: "Rạp", path: "/cinemas"},
            {label: "Phòng vé", path: "/rooms"},
        ]
    },
    {icon: <ConfirmationNumberOutlinedIcon/>, label: "Tickets", path: "/reports"},
    {icon: <LoyaltyOutlinedIcon/>, label: "Promotions", path: "/promotions"},
    {icon: <LibraryBooksOutlinedIcon/>, label: "Reviews", path: "/reviews"},
    {icon: <PeopleOutlinedIcon/>, label: "Accounts", path: "/reports"},
    {
        icon: <Settings/>,
        label: "Settings",
        children: [
            {label: "Profile", path: "/settings/profile"},
            {label: "Security", path: "/settings/security"},
        ],
    },
];

const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const expanded = useSelector((state) => state.sidebar.expanded);
    const dispatch = useDispatch();

    const handleMenuClick = (label) => {
        if (!expanded) {
            // Nếu sidebar đang đóng thì mở rộng trước
            dispatch(toggle());
        } else {
            // Toggle submenu
            setOpenMenu((prev) => (prev === label ? null : label));
        }
    };

    useEffect(() => {
        if (!expanded) {
            setOpenMenu(null);
        }
    }, [expanded]);

    return (
        <Box
            className="!bg-white !text-black shadow-lg transition-all duration-300"
            sx={{
                width: expanded ? 240 : 80,
                height: "100vh",
                borderRight: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* Logo */}
            <div className="flex items-center justify-center px-4 py-6">
                <div
                    className="w-10 h-10 text-black rounded-xl flex items-center justify-center text-lg font-bold shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path
                            d="M96 160C149 160 192 203 192 256L192 341.8C221.7 297.1 269.8 265.6 325.4 257.8C351 317.8 410.6 359.9 480 359.9C490.9 359.9 501.6 358.8 512 356.8L512 544C512 561.7 497.7 576 480 576C462.3 576 448 561.7 448 544L448 403.2L312 512L368 512C385.7 512 400 526.3 400 544C400 561.7 385.7 576 368 576L224 576C171 576 128 533 128 480L128 256C128 239.4 115.4 225.8 99.3 224.2L92.7 223.9C76.6 222.2 64 208.6 64 192C64 174.3 78.3 160 96 160zM565.8 67.2C576.2 58.5 592 65.9 592 79.5L592 192C592 253.9 541.9 304 480 304C418.1 304 368 253.9 368 192L368 79.5C368 65.9 383.8 58.5 394.2 67.2L448 112L512 112L565.8 67.2zM432 172C421 172 412 181 412 192C412 203 421 212 432 212C443 212 452 203 452 192C452 181 443 172 432 172zM528 172C517 172 508 181 508 192C508 203 517 212 528 212C539 212 548 203 548 192C548 181 539 172 528 172z"/>
                    </svg>

                </div>
                {
                    expanded && (<p className="text-xl font-bold">CineMeow</p>)
                }
            </div>

            {/* Menu */}
            <List component="nav" className="flex-1 px-2 space-y-1">
                {menuItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                        {item.children ? (
                            <>
                                <Tooltip title={!expanded ? item.label : ""} placement="right">
                                    <ListItemButton
                                        onClick={() => handleMenuClick(item.label)}
                                        className="rounded-lg hover:bg-blue-50 transition !text-black !bg-red"
                                    >
                                        {expanded ? (
                                            <>
                                                <ListItemIcon className="!text-black">
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    sx={{color: "black"}}
                                                    primary={item.label}
                                                />
                                                {openMenu === item.label ? <ExpandLess/> : <ExpandMore/>}
                                            </>
                                        ) : (
                                            <CustomIconButton>{item.icon}</CustomIconButton>
                                        )}
                                    </ListItemButton>
                                </Tooltip>

                                <Collapse in={openMenu === item.label && expanded} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.children.map((child, cIdx) => (
                                            <NavLink
                                                key={cIdx}
                                                to={child.path}
                                                end
                                                className="block"
                                            >
                                                {({ isActive }) => (
                                                    <ListItemButton
                                                        sx={{ pl: expanded ? 6 : 2 }}
                                                        className={`!rounded-lg !transition !relative ${
                                                            isActive
                                                                ? "!bg-gray-100 !font-semibold !text-black" // nền xám nhạt + chữ đen đậm
                                                                : "!hover:bg-gray-100 !text-gray-700"
                                                        }`}
                                                    >
                                                        {/* Border bên phải khi active */}
                                                        {isActive && (
                                                            <span className="absolute right-0 top-0 h-full w-1 bg-black rounded-l"></span>
                                                        )}

                                                        {expanded && (
                                                            <ListItemText
                                                                primary={child.label}
                                                                primaryTypographyProps={{
                                                                    className: `!text-[1vw] ${
                                                                        isActive ? "!text-black !font-bold" : "!text-gray-800"
                                                                    }`,
                                                                }}
                                                            />
                                                        )}
                                                    </ListItemButton>
                                                )}
                                            </NavLink>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        ) : (
                            <Tooltip title={!expanded ? item.label : ""} placement="right">
                                <NavLink
                                    to={item.path}
                                    end
                                    className="block"
                                >
                                    {({ isActive }) => (
                                        <ListItemButton
                                            className={`rounded-lg transition relative ${
                                                isActive
                                                    ? "!bg-gray-100 !text-black !font-semibold"
                                                    : "!hover:bg-blue-50 !text-black"
                                            }`}
                                        >
                                            {/* Border phải màu đen khi active */}
                                            {isActive && (
                                                <span className="absolute right-0 top-0 h-full w-1 bg-black rounded-l"></span>
                                            )}

                                            {expanded ? (
                                                <>
                                                    <ListItemIcon className="!text-black">{item.icon}</ListItemIcon>
                                                    <ListItemText
                                                        primary={item.label}
                                                        primaryTypographyProps={{
                                                            className: isActive
                                                                ? "!text-black !font-bold"
                                                                : "text-black",
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <CustomIconButton>{item.icon}</CustomIconButton>
                                            )}
                                        </ListItemButton>
                                    )}
                                </NavLink>
                            </Tooltip>
                        )}
                    </React.Fragment>
                ))}
            </List>

            {/* Footer */}
            {expanded && (
                <div className="p-4 text-center text-sm text-gray-400 border-t">
                    © 2025 CineMeow
                </div>
            )}
        </Box>
    );
};

export default Sidebar;
