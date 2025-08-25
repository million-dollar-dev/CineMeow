// src/components/Header.jsx
import React from "react";
import {
    Box,
    IconButton,
    Avatar,
    TextField,
    InputAdornment,
    Typography,
    MenuItem,
    Menu,
    Button,
    ListItemIcon,
    Divider,
    Badge,
    ListItemText
} from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CustomIconButton from "./CustomIconButton.jsx";
import Logout from '@mui/icons-material/Logout';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {useDispatch, useSelector} from "react-redux";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {toggle} from "../redux/slices/sidebarSlice.js";

const Topbar = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const dispatch = useDispatch();
    const expanded = useSelector((state) => state.sidebar.expanded);


    // Quản lý state riêng biệt
    const [anchorAcc, setAnchorAcc] = React.useState(null);
    const [anchorNotif, setAnchorNotif] = React.useState(null);

    // Account Menu
    const handleAccMenuOpen = (event) => setAnchorAcc(event.currentTarget);
    const handleAccMenuClose = () => setAnchorAcc(null);

    // Notification Menu
    const handleNotifMenuClose = () => setAnchorNotif(null);

    const renderAccMenu = (
        <Menu
            anchorEl={anchorAcc}
            id="account-menu"
            open={Boolean(anchorAcc)}
            onClose={handleAccMenuClose}
            onClick={handleAccMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem>
                <ListItemIcon>
                    <PersonOutlineOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Tài khoản
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <VerifiedUserOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Đổi mật khẩu
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Đăng xuất
            </MenuItem>
        </Menu>
    );

    const renderNotifiactionMenu = (
        <Menu
            className="mt-2"
            anchorEl={anchorNotif}
            id="notification-menu"
            open={Boolean(anchorNotif)}
            onClose={handleNotifMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
                sx: { width: 320}, // giới hạn chiều cao
            }}
        >
            <Typography variant="h6" sx={{ px: 2, py: 1 }}>
                Thông báo (4)
            </Typography>
            <Divider />

            {/* List cuộn */}
            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                {[
                    { id: 1, text: "Bạn có đơn đặt vé mới", time: "2 phút trước" },
                    { id: 2, text: "Lịch chiếu phim Avatar cập nhật", time: "10 phút trước" },
                    { id: 3, text: "Tài khoản admin đăng nhập", time: "1 giờ trước" },
                    { id: 4, text: "Báo cáo doanh thu đã sẵn sàng", time: "2 giờ trước" },
                    { id: 5, text: "Báo cáo doanh thu đã sẵn sàng", time: "2 giờ trước" },
                    { id: 6, text: "Báo cáo doanh thu đã sẵn sàng", time: "2 giờ trước" },
                    { id: 7, text: "Báo cáo doanh thu đã sẵn sàng", time: "2 giờ trước" },
                    { id: 8, text: "Báo cáo doanh thu đã sẵn sàng", time: "2 giờ trước" },
                ].map((notif) => (
                    <MenuItem key={notif.id} sx={{ alignItems: "center" }}>
                        <ListItemIcon>
                            <NotificationsNoneOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <Box>
                            <Typography variant="body2">{notif.text}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {notif.time}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Box>

            <Divider />

            {/* Footer */}
            <Box sx={{ textAlign: "center", py: 1 }}>
                <Button size="small">Xem tất cả thông báo</Button>
            </Box>
        </Menu>
    );

    return (
        <Box
            className="flex items-center justify-between px-6 py-3 bg-transparent text-gray-800 rounded-lg"
            sx={{
                height: "64px",
                borderBottom: "1px solid #eee",
            }}
        >
            {/* Left */}
            <div className="flex items-center gap-12">
                <CustomIconButton onClick={() => dispatch(toggle())}>
                    {expanded ? (
                        <MenuOpenOutlinedIcon className="text-gray-700" />
                    ) : (
                        <MenuOutlinedIcon/>
                    )}
                </CustomIconButton>

                <TextField
                    placeholder="Search"
                    size="small"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlinedIcon className="text-gray-400" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "9999px",
                            backgroundColor: "white",
                            "& fieldset": { border: "none" },
                        },
                    }}
                    className="w-72"
                />

                <Typography variant="subtitle2" gutterBottom>
                    {day}/{month}/{year}
                </Typography>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <CustomIconButton>
                    <SettingsOutlinedIcon className="text-gray-700" />
                </CustomIconButton>

                {/* Notification Button */}
                <CustomIconButton onClick={(e) => setAnchorNotif(e.currentTarget)}>
                    <Badge badgeContent={4} color="primary">
                        <NotificationsNoneOutlinedIcon className="text-gray-700" />
                    </Badge>
                </CustomIconButton>

                {/* Account Button */}
                <Button onClick={handleAccMenuOpen}>
                    <Avatar src="https://i.pravatar.cc/150?img=8" sx={{ width: 48, height: 48 }} />
                    <div className="ml-2 text-left">
                        <Typography variant="body2">Admin</Typography>
                    </div>
                </Button>
            </div>

            {/* Render Menu */}
            {renderAccMenu}
            {renderNotifiactionMenu}
        </Box>
    );
};

export default Topbar;
