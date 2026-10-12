import React from 'react';

const OverlayLoading = ({ message = "Đang tải dữ liệu..." }) => {
    return (
        <div className="fixed inset-0 bg-[#07070B]/80 backdrop-blur-md flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4 bg-zinc-900/95 border border-zinc-800 p-8 rounded-2xl shadow-2xl shadow-black/80 max-w-xs text-center">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 rounded-full blur-md bg-violet-500/20" />
                </div>
                <p className="text-zinc-200 text-sm font-medium animate-pulse">{message}</p>
            </div>
        </div>
    );
};

export default OverlayLoading;