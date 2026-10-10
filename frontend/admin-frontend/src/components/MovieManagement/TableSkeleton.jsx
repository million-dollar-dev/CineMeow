import React from 'react';
import { Box, Skeleton } from "@mui/material";

const TableSkeleton = ({ paginationModel }) => {
    const rows = paginationModel?.pageSize || 5;

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm divide-y divide-slate-100">
            {/* Header skeleton */}
            <div className="flex items-center gap-6 pb-4">
                <Skeleton variant="rectangular" width={70} height={20} className="rounded-lg" />
                <Skeleton variant="rectangular" width="30%" height={20} className="rounded-lg" />
                <Skeleton variant="rectangular" width="20%" height={20} className="rounded-lg" />
                <Skeleton variant="rectangular" width="15%" height={20} className="rounded-lg" />
                <Skeleton variant="rectangular" width="15%" height={20} className="rounded-lg" />
                <Skeleton variant="rectangular" width="10%" height={20} className="rounded-lg" />
            </div>

            {/* Row skeletons */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-6 py-3.5">
                    {/* Poster skeleton 80x114px */}
                    <Skeleton variant="rectangular" width={80} height={114} className="rounded-xl shrink-0" />

                    {/* Movie Info (Title, Subtitle, Director) */}
                    <div className="flex-1 min-w-0 space-y-2 py-1">
                        <Skeleton variant="text" width="60%" height={26} className="rounded" />
                        <Skeleton variant="text" width="40%" height={16} className="rounded" />
                        <Skeleton variant="text" width="45%" height={16} className="rounded" />
                    </div>

                    {/* Duration & Rating (180px) */}
                    <div className="w-44 space-y-2 shrink-0">
                        <div className="flex items-center gap-2">
                            <Skeleton variant="rectangular" width={38} height={20} className="rounded-md" />
                            <Skeleton variant="text" width={70} height={18} className="rounded" />
                        </div>
                        <Skeleton variant="rectangular" width={85} height={24} className="rounded-lg" />
                    </div>

                    {/* Genre */}
                    <div className="w-48 flex gap-1.5 flex-wrap shrink-0">
                        <Skeleton variant="rectangular" width={68} height={26} className="rounded-lg" />
                        <Skeleton variant="rectangular" width={74} height={26} className="rounded-lg" />
                    </div>

                    {/* Release Date */}
                    <div className="w-32 shrink-0">
                        <Skeleton variant="rectangular" width={90} height={20} className="rounded-md" />
                    </div>

                    {/* Status */}
                    <div className="w-36 shrink-0">
                        <Skeleton variant="rectangular" width={110} height={28} className="rounded-full" />
                    </div>

                    {/* Actions */}
                    <div className="w-36 flex gap-2 shrink-0">
                        <Skeleton variant="circular" width={36} height={36} />
                        <Skeleton variant="circular" width={36} height={36} />
                        <Skeleton variant="circular" width={36} height={36} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;