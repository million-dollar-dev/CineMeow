// src/components/Header.jsx
import React from "react";
import {Box, IconButton, Avatar, TextField, InputAdornment, Typography, MenuItem, Menu} from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CustomIconButton from "./CustomIconButton.jsx";
import Badge from '@mui/material/Badge';

const Topbar = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleUserProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const renderMenu = (
        <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleMenuClose}>
            <MenuItem>Thông tin</MenuItem>
            <MenuItem>Đăng xuất</MenuItem>
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
            <div className="flex items-center gap-12">
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
                            borderRadius: "9999px", // full rounded
                            backgroundColor: "white", // bg-gray-100
                            "& fieldset": {
                                border: "none", // bỏ border mặc định
                            },
                            "&:hover fieldset": {
                                border: "none",
                            },
                            "&.Mui-focused fieldset": {
                                border: "none",
                            },
                        },
                    }}
                    className="w-72"
                />
                <Typography variant="subtitle2" gutterBottom>
                    {day}/{month}/{year}
                </Typography>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    <CustomIconButton>
                        <SettingsOutlinedIcon className="text-gray-700" />
                    </CustomIconButton>
                    <CustomIconButton>
                        <Badge badgeContent={4} color="primary">
                            <NotificationsNoneOutlinedIcon className="text-gray-700" />
                        </Badge>
                    </CustomIconButton>
                    <Avatar src="https://i.pravatar.cc/150?img=8" sx={{ width: 48, height: 48 }} onClick={handleUserProfileClick} />
                </div>
            </div>
            {renderMenu}
        </Box>
    );
};

export default Topbar;
