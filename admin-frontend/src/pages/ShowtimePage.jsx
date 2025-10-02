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
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CustomToolbar from "../components/CustomToolbar.jsx";
import StatusChip from "../components/StatusChip.jsx";
import ShowtimeModal from "../components/ShowtimeManagement/ShowtimeModal.jsx";
import {useGetAllShowtimesQuery} from "../services/showtimeService.js";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import {SHOWTIME_STATUS_CONFIG} from "../constants/showtimeStatus.js";

export default function ShowtimePage() {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const [openModal, setOpenModal] = useState(false);

    const [mode, setMode] = useState("add");

    const [selectedShowtime, setselectedShowtime] = useState(null);

    const columns = [
        {
            field: "posterPath",
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
            renderCell: (params) => <StatusChip status={params.value} configs={SHOWTIME_STATUS_CONFIG}/>,
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

    const {data: showtimeResponse, isError, error, isLoading} = useGetAllShowtimesQuery();
    const showtimes = showtimeResponse?.data ?? [];

    const todayDate = new Date().toISOString().split("T")[0];

    const total = showtimes.length;
    const available = showtimes.filter(s => s.status === "AVAILABLE").length;
    const todayShowtimes = showtimes.filter(s => {
        const startDate = new Date(s.startTime).toISOString().split("T")[0];
        return startDate === todayDate;
    });

    const finishedToday = todayShowtimes.filter(s => s.status === "FINISHED").length;

    const stats = [
        {
            title: "Tổng suất chiếu",
            value: total,
            icon: <CalendarMonthOutlinedIcon fontSize="medium" />,
            bigIcon: <CalendarMonthOutlinedIcon fontSize="inherit" />,
            bgColor: "#1976d2",
            iconColor: "#1976d2",
            loading: true
        },
        {
            title: "Đang mở bán",
            value: available,
            icon: <SlideshowOutlinedIcon fontSize="medium" />,
            bigIcon: <SlideshowOutlinedIcon fontSize="inherit" />,
            bgColor: "#2e7d32",
            iconColor: "#2e7d32",
        },
        {
            title: "Tổng suất chiếu hôm nay",
            value: todayShowtimes.length,
            icon: <ScheduleOutlinedIcon fontSize="medium" />,
            bigIcon: <ScheduleOutlinedIcon fontSize="inherit" />,
            bgColor: 'black',
            iconColor: 'black',
        },
        {
            title: "Hoàn thành hôm nay",
            value: finishedToday,
            icon: <EventAvailableOutlinedIcon fontSize="medium" />,
            bigIcon: <EventAvailableOutlinedIcon fontSize="inherit" />,
            bgColor: "#f57c00",
            iconColor: "#f57c00",
        },

    ];





    const handleAddClick = () => {
        setMode("add");
        setselectedShowtime(null);
        setOpenModal(true);
    }
    return (
        <Box className="py-2 min-h-screen">
            <ShowtimeModal open={openModal}
                           onClose={() => setOpenModal(false)}
                           mode={mode}
                           showtimeData={selectedShowtime}
            />
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
                        slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} /> }}
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
