import React from "react";
import { Chip } from "@mui/material";

export default function StatusChip({ status, configs }) {
    const config = configs[status] || { label: status, color: "default" };

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
