import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function SearchInput({
    value = "",
    onChange,
    placeholder = "Tìm kiếm...",
    className = "relative flex-1 w-full min-w-[240px]",
    inputClassName = "",
}) {
    const handleClear = () => {
        if (typeof onChange === "function") {
            onChange("");
        }
    };

    const handleChange = (e) => {
        if (typeof onChange === "function") {
            onChange(e.target.value);
        }
    };

    return (
        <div className={className}>
            <SearchOutlinedIcon
                sx={{ fontSize: 18 }}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition shadow-2xs placeholder:text-slate-400 text-slate-800 ${inputClassName}`}
            />
            {Boolean(value) && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Xóa tìm kiếm"
                >
                    <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                </button>
            )}
        </div>
    );
}

