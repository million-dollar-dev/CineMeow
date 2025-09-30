import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Grid
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useState} from "react";
import StatCard from "../components/OverviewStats/StatCard.jsx";
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CustomToolbar from "../components/CustomToolbar.jsx";
import MovieStatusChip from "../components/moviesManagement/MovieStatusChip.jsx";

export default function ShowtimePage() {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const columns = [
        {
            field: "poster",
            headerName: "Poster",
            headerClassName: "custom-header",
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <img
                        src={params.value}
                        alt="poster"
                        style={{
                            width: 100,
                            height: 140,
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                </Box>
            ),
        },
        { field: "movieTitle", headerName: "Phim", flex: 1, minWidth: 200 },
        { field: "cinemaName", headerName: "Rạp", width: 200 },
        { field: "roomName", headerName: "Phòng", width: 100 },
        { field: "startTime", headerName: "Bắt đầu (min)", width: 120 },
        {
            field: "status",
            headerName: "Status",
            width: 160,
            renderCell: (params) => <MovieStatusChip status={params.value} />,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: () => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        startIcon={<EditOutlinedIcon />}
                        variant="text"
                        sx={{ color: "black" }}
                    >
                        Tùy chỉnh
                    </Button>
                    <span style={{ color: "black" }}>|</span>
                    <Button
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        variant="text"
                        sx={{ color: "red" }}
                        // onClick={() => handleDeleteClick(params.row)}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    const stats = [
        {
            title: "Phim",
            value: 11,
            icon: <MovieCreationOutlinedIcon fontSize="medium" />,
            bigIcon: <MovieCreationOutlinedIcon fontSize="inherit" />,
            bgColor: "#1976d2",
            iconColor: "#1976d2",
            loading: true
        },
        {
            title: "Đang chiếu",
            value: 11,
            icon: <PlayCircleOutlinedIcon fontSize="medium" />,
            bigIcon: <PlayCircleOutlinedIcon fontSize="inherit" />,
            bgColor: "#2e7d32",
            iconColor: "#2e7d32",
        },
        {
            title: "Sắp chiếu",
            value: 11,
            icon: <FiberNewOutlinedIcon fontSize="medium" />,
            bigIcon: <FiberNewOutlinedIcon fontSize="inherit" />,
            bgColor: "#f57c00",
            iconColor: "#f57c00",
        },
        {
            title: "Đã phát hành",
            value: 11,
            icon: <ScheduleOutlinedIcon fontSize="medium" />,
            bigIcon: <ScheduleOutlinedIcon fontSize="inherit" />,
            bgColor: 'black',
            iconColor: 'black',
        },
    ];

    const showtimes = [
        {
            "id": "showtime-1",
            "poster": "https://static.nutscdn.com/vimg/300-0/5b50f729f259f428490d4bc9fb27d213.webp",
            "movieTitle": "Avengers: Endgame",
            "cinemaName": "CGV Aeon Mall Tân Phú",
            "roomName": "Phòng chiếu 1",
            "startTime": "2025-10-01T14:00:00",
            "endTime": "2025-10-01T16:45:00",
            "status": "ACTIVE"
        },
        {
            "id": "showtime-2",
            "poster": "https://static.nutscdn.com/vimg/300-0/5b50f729f259f428490d4bc9fb27d213.webp",
            "movieTitle": "Inside Out 2",
            "cinemaName": "BHD Star Bitexco",
            "roomName": "Phòng chiếu 2",
            "startTime": "2025-10-01T17:00:00",
            "endTime": "2025-10-01T18:40:00",
            "status": "ACTIVE"
        },
        {
            "id": "showtime-3",
            "poster": "https://static.nutscdn.com/vimg/300-0/5b50f729f259f428490d4bc9fb27d213.webp",
            "movieTitle": "The Batman",
            "cinemaName": "Lotte Cinema Gò Vấp",
            "roomName": "Phòng chiếu IMAX",
            "startTime": "2025-10-02T19:00:00",
            "endTime": "2025-10-02T21:45:00",
            "status": "CANCELLED"
        },
        {
            "id": "showtime-4",
            "poster": "https://static.nutscdn.com/vimg/300-0/5b50f729f259f428490d4bc9fb27d213.webp",
            "movieTitle": "Kung Fu Panda 4",
            "cinemaName": "Galaxy Nguyễn Du",
            "roomName": "Phòng chiếu 5",
            "startTime": "2025-10-03T09:30:00",
            "endTime": "2025-10-03T11:10:00",
            "status": "UPCOMING"
        },
        {
            "id": "showtime-5",
            "poster": "https://static.nutscdn.com/vimg/300-0/5b50f729f259f428490d4bc9fb27d213.webp",
            "movieTitle": "Oppenheimer",
            "cinemaName": "CGV Vincom Đồng Khởi",
            "roomName": "Phòng chiếu 3",
            "startTime": "2025-10-03T20:00:00",
            "endTime": "2025-10-03T23:00:00",
            "status": "ACTIVE"
        }
    ]


    return (
        <Box className="py-2 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-extrabold text-black">Quản Lý Xuất Chiếu</h2>
            </div>

            <Box sx={{ py: 3 }}>
                <Grid container
                      spacing={3}

                      sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    {stats.map((stat, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <StatCard {...stat} loading={false}/>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ height: 630, width: "100%" }}>
                    <DataGrid
                        sx={{borderRadius: 4}}
                        rows={showtimes}
                        columns={columns}
                        disableRowSelectionOnClick
                        rowHeight={160}
                        slots={{ toolbar: () => <CustomToolbar /> }}
                        showToolbar
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20]}
                        pagination
                    />

            </Box>
        </Box>
    );
}
