import React from "react";

export default function ResultCountBadge({
    count = 0,
    unit = "kết quả",
    label,
    className = "",
}) {
    return (
        <div
            className={`px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-600 flex items-center gap-2 shrink-0 ${className}`}
        >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{label || `Hiển thị: ${count} ${unit}`}</span>
        </div>
    );
}

