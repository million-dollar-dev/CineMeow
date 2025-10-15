import React from 'react';
import {Box, Skeleton} from "@mui/material";

const TableSkeleton = ({paginationModel}) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.from({ length: paginationModel.pageSize }).map((_, i) => (
                <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                    <Skeleton variant="rectangular" width={100} height={140} />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="20%" />
                    <Skeleton variant="text" width="20%" />
                    <Skeleton variant="text" width="10%" />
                </Box>
            ))}
        </Box>
    );
};

export default TableSkeleton;