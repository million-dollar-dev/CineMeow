import React from "react";
import { Chip } from "@mui/material";

const STATUS_CONFIG = {
    NOW_PLAYING: {
        label: "Đang chiếu",
        color: "success", // xanh
    },
    COMING_SOON: {
        label: "Sắp chiếu",
        color: "warning", // vàng cam
    },
    RELEASED: {
        label: "Đã phát hành",
        color: "primary", // xanh dương
    },
    POST_PRODUCTION: {
        label: "Đang hậu kỳ",
        color: "default", // xám
    },
};

export default function MovieStatusChip({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, color: "default" };

    return (
        <Chip
            label={config.label}
            color={config.color}
            variant="filled"
            sx={{
                fontWeight: 600,
                fontSize: "0.85rem",
                px: 1,
                py: 0.5,
                borderRadius: "8px",
            }}
        />
    );
}
