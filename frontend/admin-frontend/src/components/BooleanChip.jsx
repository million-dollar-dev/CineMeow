import React from 'react';
import {Box, Chip, Tooltip} from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

const BooleanChip = (value) => {
    const isTrue = Boolean(value);

    const iconStyle = {
        fontSize: 22, // to hơn
        color: isTrue ? "#2e7d32" : "#c62828", // đậm hơn
    };

    const bgColor = isTrue ? "#e0f2f1" : "#ffebee"; // nền nhạt
    const hoverBg = isTrue ? "#b2dfdb" : "#ffcdd2"; // hover nhẹ (hoặc bỏ nếu không cần)

    return (
        <Tooltip title={isTrue ? "Có" : "Không"} arrow>
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    backgroundColor: bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                    "&:hover": {
                        backgroundColor: hoverBg,
                    },
                }}
            >
                {isTrue ? (
                    <DoneOutlinedIcon sx={iconStyle} />
                ) : (
                    <CloseOutlinedIcon sx={iconStyle} />
                )}
            </Box>
        </Tooltip>
    );
};

export default BooleanChip;