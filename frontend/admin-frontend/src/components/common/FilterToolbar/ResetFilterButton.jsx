import React from "react";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

export default function ResetFilterButton({
    onClick,
    label = "Đặt lại bộ lọc",
    hasActiveFilters = true,
    className = "",
}) {
    if (!hasActiveFilters) return null;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap ${className}`}
        >
            <RestartAltOutlinedIcon sx={{ fontSize: 15 }} />
            <span>{label}</span>
        </button>
    );
}

