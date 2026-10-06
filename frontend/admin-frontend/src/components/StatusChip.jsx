import React from "react";

const statusStyles = {
    NOW_PLAYING: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200/60",
        dot: "bg-emerald-500",
        pulse: true,
        defaultLabel: "Đang chiếu",
    },
    COMING_SOON: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200/60",
        dot: "bg-amber-500",
        pulse: false,
        defaultLabel: "Sắp chiếu",
    },
    RELEASED: {
        bg: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200/60",
        dot: "bg-violet-500",
        pulse: false,
        defaultLabel: "Đã phát hành",
    },
    POST_PRODUCTION: {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-500",
        pulse: false,
        defaultLabel: "Đang hậu kỳ",
    },
    AVAILABLE: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200/60",
        dot: "bg-emerald-500",
        pulse: false,
        defaultLabel: "Đang mở bán",
    },
    UNAVAILABLE: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200/60",
        dot: "bg-rose-500",
        pulse: false,
        defaultLabel: "Ngưng chiếu",
    },
};

export default function StatusChip({ status, configs }) {
    const customConfig = configs?.[status];
    const style = statusStyles[status] || {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-400",
        pulse: false,
        defaultLabel: status,
    };

    const label = customConfig?.label || style.defaultLabel || status;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs select-none ${style.bg} ${style.text} ${style.border}`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full ${style.dot} ${
                    style.pulse ? "animate-pulse" : ""
                }`}
            />
            {label}
        </span>
    );
}
