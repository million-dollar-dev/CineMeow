import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

// Material Icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

// Components, Services & Constants
import StatCard from "../components/OverviewStats/StatCard.jsx";
import StatusChip from "../components/StatusChip.jsx";
import ShowtimeModal from "../components/ShowtimeManagement/ShowtimeModal.jsx";
import { useGetAllShowtimesQuery } from "../services/showtimeService.js";
import { useGetAllCinemasQuery } from "../services/cinemaService.js";
import { openSnackbar } from "../redux/slices/snackbarSlice.js";
import { SHOWTIME_STATUS_CONFIG } from "../constants/showtimeStatus.js";
import { MOCK_SHOWTIMES, MOCK_CINEMAS } from "../mock/mockShowtimes.js";

// Helper: Format Date & Time safely
const formatShowtimeDate = (raw) => {
    if (!raw) return { date: "--/--/----", isToday: false, isTomorrow: false };
    const d = dayjs(raw);
    if (!d.isValid()) return { date: String(raw), isToday: false, isTomorrow: false };

    const today = dayjs().format("YYYY-MM-DD");
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    const itemDate = d.format("YYYY-MM-DD");

    return {
        date: d.format("DD/MM/YYYY"),
        isToday: itemDate === today,
        isTomorrow: itemDate === tomorrow,
    };
};

const formatShowtimeHours = (startRaw, endRaw) => {
    const s = startRaw ? dayjs(startRaw) : null;
    const e = endRaw ? dayjs(endRaw) : null;

    const startText = s && s.isValid() ? s.format("HH:mm") : "--:--";
    const endText = e && e.isValid() ? e.format("HH:mm") : "--:--";

    return { startText, endText };
};

// Rating badge renderer
const renderRatingBadge = (rating) => {
    const str = String(rating || "P").toUpperCase().trim();
    let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (str.includes("18") || str === "T18") badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
    else if (str.includes("16") || str === "T16") badgeClass = "bg-orange-50 text-orange-700 border-orange-200";
    else if (str.includes("13") || str === "T13" || str === "PG13") badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    else if (str === "K" || str === "PG") badgeClass = "bg-sky-50 text-sky-700 border-sky-200";

    return (
        <span
            className={`inline-flex items-center justify-center text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border shadow-2xs select-none ${badgeClass}`}
            style={{ height: "20px" }}
        >
            {str}
        </span>
    );
};

export default function ShowtimePage() {
    const dispatch = useDispatch();

    // Data fetching
    const { data: showtimeResponse, isLoading: isLoadingShowtimes, refetch } = useGetAllShowtimesQuery();
    const { data: cinemaResponse } = useGetAllCinemasQuery();

    const cinemas = useMemo(() => {
        const apiData = cinemaResponse?.data;
        if (apiData && apiData.length > 0) return apiData;
        return MOCK_CINEMAS;
    }, [cinemaResponse]);

    // State management
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setMode] = useState("add");
    const [selectedShowtime, setSelectedShowtime] = useState(null);

    // Detail Ticket Pass Preview State
    const [previewShowtime, setPreviewShowtime] = useState(null);

    // Delete Confirmation State
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [showtimeToDelete, setShowtimeToDelete] = useState(null);

    // Filter and Search States
    const [selectedStatusTab, setSelectedStatusTab] = useState("ALL");
    const [selectedCinemaFilter, setSelectedCinemaFilter] = useState("ALL");
    const [selectedDateFilter, setSelectedDateFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Merged & Standardized Showtimes Dataset
    const showtimes = useMemo(() => {
        const apiList = showtimeResponse?.data || [];
        const baseList = apiList.length > 0 ? apiList : MOCK_SHOWTIMES;

        return baseList.map((st, idx) => {
            const timeInfo = formatShowtimeHours(st.startTime, st.endTime);
            const dateInfo = formatShowtimeDate(st.startTime);

            return {
                ...st,
                id: st.id || `st-item-${idx}`,
                timeInfo,
                dateInfo,
                cinemaAddress: st.cinemaAddress || st.cinema?.address || "Toàn quốc",
                roomType: st.roomType || st.room?.roomType || "2D",
            };
        });
    }, [showtimeResponse]);

    // Statistics Calculation
    const todayDate = dayjs().format("YYYY-MM-DD");
    const totalCount = showtimes.length;
    const availableCount = showtimes.filter((s) => s.status === "AVAILABLE").length;
    const todayCount = showtimes.filter((s) => {
        const d = s.startTime ? dayjs(s.startTime).format("YYYY-MM-DD") : "";
        return d === todayDate;
    }).length;
    const finishedCount = showtimes.filter((s) => s.status === "FINISHED" || s.status === "SOLD_OUT").length;

    const stats = useMemo(
        () => [
            {
                title: "Tổng suất chiếu",
                value: totalCount,
                subtitle: "Tất cả khung giờ phát hành",
                icon: <CalendarMonthOutlinedIcon fontSize="medium" />,
                bigIcon: <CalendarMonthOutlinedIcon fontSize="inherit" />,
                bgColor: "#1976d2", // Indigo / Blue
            },
            {
                title: "Đang mở bán vé",
                value: availableCount,
                subtitle: "Sẵn sàng đón khán giả",
                icon: <PlayCircleOutlinedIcon fontSize="medium" />,
                bigIcon: <PlayCircleOutlinedIcon fontSize="inherit" />,
                bgColor: "#2e7d32", // Emerald green
            },
            {
                title: "Suất chiếu hôm nay",
                value: todayCount,
                subtitle: `Lịch chiếu ngày ${dayjs().format("DD/MM/YYYY")}`,
                icon: <ScheduleOutlinedIcon fontSize="medium" />,
                bigIcon: <ScheduleOutlinedIcon fontSize="inherit" />,
                bgColor: "#7c3aed", // Violet gradient
            },
            {
                title: "Hoàn tất / Hết vé",
                value: finishedCount,
                subtitle: "Đã chiếu xong hoặc kín chỗ",
                icon: <EventAvailableOutlinedIcon fontSize="medium" />,
                bigIcon: <EventAvailableOutlinedIcon fontSize="inherit" />,
                bgColor: "#f57c00", // Amber
            },
        ],
        [totalCount, availableCount, todayCount, finishedCount]
    );

    // Filtered showtimes
    const filteredShowtimes = useMemo(() => {
        return showtimes.filter((st) => {
            // Status Tab Filter
            const matchesStatus =
                selectedStatusTab === "ALL" || st.status === selectedStatusTab;

            // Cinema Filter
            const matchesCinema =
                selectedCinemaFilter === "ALL" ||
                st.cinemaId === selectedCinemaFilter ||
                st.cinemaName?.toLowerCase().includes(selectedCinemaFilter.toLowerCase());

            // Date Filter
            let matchesDate = true;
            if (selectedDateFilter === "TODAY") {
                matchesDate = st.dateInfo.isToday;
            } else if (selectedDateFilter === "TOMORROW") {
                matchesDate = st.dateInfo.isTomorrow;
            }

            // Search Query Filter
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !q ||
                st.movieTitle?.toLowerCase().includes(q) ||
                st.cinemaName?.toLowerCase().includes(q) ||
                st.roomName?.toLowerCase().includes(q);

            return matchesStatus && matchesCinema && matchesDate && matchesSearch;
        });
    }, [showtimes, selectedStatusTab, selectedCinemaFilter, selectedDateFilter, searchQuery]);

    // Handlers
    const handleAddClick = () => {
        setMode("add");
        setSelectedShowtime(null);
        setOpenModal(true);
    };

    const handleEditClick = (showtime) => {
        setMode("edit");
        setSelectedShowtime(showtime);
        setOpenModal(true);
    };

    const handleDeleteClick = (showtime) => {
        setShowtimeToDelete(showtime);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        dispatch(
            openSnackbar({
                message: `Yêu cầu hủy suất chiếu "${showtimeToDelete?.movieTitle}" (${showtimeToDelete?.timeInfo?.startText}) đã được ghi nhận.`,
                type: "info",
            })
        );
        setOpenDeleteDialog(false);
        setShowtimeToDelete(null);
    };

    // DataGrid Columns Definition
    const columns = [
        {
            field: "movieInfo",
            headerName: "Phim điện ảnh",
            flex: 1.5,
            minWidth: 320,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center gap-3.5 py-2 w-full min-w-0">
                        {/* Poster Thumbnail */}
                        <div
                            onClick={() => setPreviewShowtime(row)}
                            className="relative w-14 h-[82px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs shrink-0 group/img cursor-pointer hover:shadow-md transition-all"
                        >
                            <img
                                src={row.posterPath}
                                alt={row.movieTitle}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/120x170?text=CineMeow";
                                }}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            </div>
                        </div>

                        {/* Title, Rating & Duration */}
                        <div className="min-w-0 flex-1 py-1 flex flex-col justify-center">
                            <h3
                                onClick={() => setPreviewShowtime(row)}
                                className="text-sm font-extrabold text-slate-900 truncate hover:text-violet-600 cursor-pointer transition-colors leading-snug"
                                title={row.movieTitle}
                            >
                                {row.movieTitle}
                            </h3>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {renderRatingBadge(row.rating)}
                                {row.duration && (
                                    <span
                                        className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 rounded-md inline-flex items-center gap-1 shrink-0 select-none"
                                        style={{
                                            height: "20px",
                                            minHeight: "20px",
                                            maxHeight: "20px",
                                            lineHeight: "1",
                                        }}
                                    >
                                        <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400 shrink-0" />
                                        <span>{row.duration} phút</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "cinemaAndRoom",
            headerName: "Cụm rạp & Phòng chiếu",
            flex: 1.3,
            minWidth: 260,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div
                        className="flex flex-col justify-center gap-1.5 py-1 min-w-0 w-full"
                        style={{ lineHeight: "1.4" }}
                    >
                        {/* Cinema Name */}
                        <div className="flex items-center gap-1.5 min-w-0">
                            <StorefrontOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600 shrink-0" />
                            <Tooltip title={row.cinemaAddress} arrow disableInteractive>
                                <span className="text-xs font-bold text-slate-800 truncate cursor-help">
                                    {row.cinemaName}
                                </span>
                            </Tooltip>
                        </div>

                        {/* Room & RoomType */}
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 truncate">
                                <MeetingRoomOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400 shrink-0" />
                                <span className="truncate">{row.roomName}</span>
                            </span>
                            {row.roomType && (
                                <span
                                    className="inline-flex items-center justify-center text-[10px] font-black uppercase px-2 rounded-md bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs shrink-0 select-none"
                                    style={{
                                        height: "20px",
                                        minHeight: "20px",
                                        maxHeight: "20px",
                                        lineHeight: "1",
                                    }}
                                >
                                    {row.roomType}
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            field: "showtimeSlot",
            headerName: "Thời gian chiếu",
            width: 240,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                const { date, isToday, isTomorrow } = row.dateInfo;
                const { startText, endText } = row.timeInfo;

                return (
                    <div
                        className="flex flex-col justify-center gap-1.5 py-1 w-full"
                        style={{ lineHeight: "1.4" }}
                    >
                        {/* Date badge */}
                        <div className="flex items-center">
                            <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 rounded-md border shadow-2xs select-none shrink-0 ${
                                    isToday
                                        ? "bg-violet-50 text-violet-700 border-violet-200"
                                        : isTomorrow
                                        ? "bg-sky-50 text-sky-700 border-sky-200"
                                        : "bg-slate-100 text-slate-600 border-slate-200/80"
                                }`}
                                style={{
                                    height: "22px",
                                    minHeight: "22px",
                                    maxHeight: "22px",
                                    lineHeight: "1",
                                }}
                            >
                                <CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} className="shrink-0" />
                                <span>
                                    {isToday ? `Hôm nay (${date})` : isTomorrow ? `Ngày mai (${date})` : date}
                                </span>
                            </span>
                        </div>

                        {/* Time range: 19:30 -> 22:16 */}
                        <div className="flex items-center gap-1.5">
                            <span
                                className="inline-flex items-center justify-center text-xs font-black text-slate-900 bg-slate-100 border border-slate-200/80 px-2 rounded-md shadow-2xs shrink-0 select-none"
                                style={{
                                    height: "22px",
                                    minHeight: "22px",
                                    maxHeight: "22px",
                                    lineHeight: "1",
                                }}
                            >
                                {startText}
                            </span>
                            <ArrowForwardOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400 shrink-0" />
                            <span
                                className="inline-flex items-center justify-center text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 px-2 rounded-md shrink-0 select-none"
                                style={{
                                    height: "22px",
                                    minHeight: "22px",
                                    maxHeight: "22px",
                                    lineHeight: "1",
                                }}
                            >
                                {endText}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <div className="flex items-center h-full">
                    <StatusChip status={params.value} configs={SHOWTIME_STATUS_CONFIG} />
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 170,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div className="flex items-center gap-1 h-full">
                    <Tooltip title="Xem vé suất chiếu" arrow>
                        <button
                            type="button"
                            onClick={() => setPreviewShowtime(params.row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition cursor-pointer"
                        >
                            <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa thông số" arrow>
                        <button
                            type="button"
                            onClick={() => handleEditClick(params.row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                        >
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Hủy suất chiếu" arrow>
                        <button
                            type="button"
                            onClick={() => handleDeleteClick(params.row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <Box className="py-2 min-h-screen">
            {/* Modal Lập lịch / Chỉnh sửa suất chiếu */}
            <ShowtimeModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                mode={modalMode}
                showtimeData={selectedShowtime}
            />

            {/* 1. PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <CalendarMonthOutlinedIcon className="text-violet-600" />
                        <span>Quản Lý Suất Chiếu</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Lập lịch phát sóng, phân bổ phòng chiếu và đồng bộ trạng thái mở bán vé tại cụm rạp CineMeow
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            refetch();
                            dispatch(openSnackbar({ message: "Đang đồng bộ dữ liệu suất chiếu...", type: "info" }));
                        }}
                        startIcon={<RefreshOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#E2E8F0",
                            color: "#475569",
                            "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                        }}
                    >
                        Làm mới
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleAddClick}
                        startIcon={<AddOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: "12px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                            boxShadow: "0 10px 20px -5px rgba(124, 58, 237, 0.3)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)",
                            },
                        }}
                    >
                        Lập suất chiếu mới
                    </Button>
                </div>
            </div>

            {/* 2. STATS OVERVIEW CARDS */}
            <Box sx={{ pb: 3.5 }}>
                <Grid container spacing={3}>
                    {stats.map((stat, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <StatCard {...stat} loading={isLoadingShowtimes} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* 3. MULTI-FILTER BAR & STATUS TABS */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3.5 mb-5">
                {/* Top Row: Status Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                        {[
                            { key: "ALL", label: "Tất cả", count: totalCount },
                            { key: "AVAILABLE", label: "Đang mở bán", count: availableCount },
                            { key: "SOLD_OUT", label: "Hết vé", count: showtimes.filter((s) => s.status === "SOLD_OUT").length },
                            { key: "FINISHED", label: "Đã kết thúc", count: showtimes.filter((s) => s.status === "FINISHED").length },
                            { key: "CANCELLED", label: "Đã hủy", count: showtimes.filter((s) => s.status === "CANCELLED").length },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedStatusTab(tab.key)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                    selectedStatusTab === tab.key
                                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        selectedStatusTab === tab.key
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <span className="text-xs text-slate-400 font-semibold hidden md:block">
                        Tìm thấy <strong className="text-slate-800">{filteredShowtimes.length}</strong> suất chiếu
                    </span>
                </div>

                {/* Bottom Row: Cinema Dropdown + Date Quick Filters + Search Box */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[220px]">
                        <SearchOutlinedIcon
                            sx={{ fontSize: 18 }}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm phim, rạp, phòng chiếu..."
                            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-violet-500 focus:outline-none transition"
                        />
                    </div>

                    {/* Cinema Filter */}
                    <div className="min-w-[170px]">
                        <select
                            value={selectedCinemaFilter}
                            onChange={(e) => setSelectedCinemaFilter(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-violet-500 focus:outline-none transition cursor-pointer"
                        >
                            <option value="ALL">Tất cả cụm rạp</option>
                            {cinemas.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Quick Filter */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        {[
                            { key: "ALL", label: "Tất cả ngày" },
                            { key: "TODAY", label: "Hôm nay" },
                            { key: "TOMORROW", label: "Ngày mai" },
                        ].map((d) => (
                            <button
                                key={d.key}
                                type="button"
                                onClick={() => setSelectedDateFilter(d.key)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                                    selectedDateFilter === d.key
                                        ? "bg-white text-violet-700 shadow-2xs"
                                        : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. MAIN DATAGRID TABLE */}
            <Box
                sx={{
                    height: 650,
                    width: "100%",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid #E2E8F0",
                    background: "#ffffff",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                }}
            >
                <DataGrid
                    rows={filteredShowtimes}
                    columns={columns}
                    disableRowSelectionOnClick
                    rowHeight={100}
                    loading={isLoadingShowtimes}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 20, 50]}
                    pagination
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#F8FAFC",
                            borderBottom: "1px solid #E2E8F0",
                            color: "#475569",
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        },
                        "& .MuiDataGrid-row": {
                            borderBottom: "1px solid #F1F5F9",
                            "&:hover": {
                                backgroundColor: "#F8FAFC",
                            },
                        },
                        "& .MuiDataGrid-cell": {
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid #F1F5F9",
                            lineHeight: "normal !important",
                        },
                        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                            outline: "none !important",
                        },
                    }}
                />
            </Box>

            {/* 5. QUICK TICKET PASS PREVIEW MODAL */}
            <Dialog
                open={Boolean(previewShowtime)}
                onClose={() => setPreviewShowtime(null)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "24px",
                            overflow: "hidden",
                            background: "#090A10",
                            color: "#ffffff",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        },
                    },
                }}
            >
                {previewShowtime && (
                    <div className="relative">
                        {/* Backdrop banner */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                            {previewShowtime.backdropPath || previewShowtime.posterPath ? (
                                <img
                                    src={previewShowtime.backdropPath || previewShowtime.posterPath}
                                    alt="Backdrop"
                                    className="w-full h-full object-cover opacity-60 filter blur-[1px] scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 opacity-80" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/50 to-transparent" />

                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setPreviewShowtime(null)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                            </button>

                            {/* Status chip */}
                            <div className="absolute top-4 left-5">
                                <StatusChip status={previewShowtime.status} configs={SHOWTIME_STATUS_CONFIG} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Poster & Movie Title */}
                            <div className="flex gap-4 -mt-16 relative z-10 items-end">
                                <div className="w-24 h-34 rounded-xl overflow-hidden bg-zinc-900 border-2 border-white/20 shadow-2xl shrink-0">
                                    <img
                                        src={previewShowtime.posterPath}
                                        alt={previewShowtime.movieTitle}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1 pb-1">
                                    <h3 className="text-lg font-black text-white leading-tight">
                                        {previewShowtime.movieTitle}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        {renderRatingBadge(previewShowtime.rating)}
                                        <span className="text-xs text-zinc-400 font-semibold">
                                            {previewShowtime.duration} phút
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashed line */}
                            <div className="border-b border-dashed border-zinc-700/80 my-3" />

                            {/* Showtime Grid */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                        Cụm rạp
                                    </span>
                                    <p className="font-bold text-zinc-200 mt-0.5">{previewShowtime.cinemaName}</p>
                                    <p className="text-[11px] text-zinc-500">{previewShowtime.cinemaAddress}</p>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                        Phòng chiếu
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="font-bold text-zinc-200">{previewShowtime.roomName}</p>
                                        <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-violet-600/30 text-violet-300 border border-violet-500/40">
                                            {previewShowtime.roomType}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/60 to-indigo-950/60 border border-violet-800/40 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider block">
                                            Giờ chiếu chính thức
                                        </span>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-2xl font-black text-white tracking-tight">
                                                {previewShowtime.timeInfo?.startText}
                                            </span>
                                            <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} className="text-violet-400" />
                                            <span className="text-base font-bold text-zinc-300">
                                                {previewShowtime.timeInfo?.endText}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                                            Ngày khởi chiếu
                                        </span>
                                        <span className="text-sm font-black text-amber-300 mt-1 block">
                                            {previewShowtime.dateInfo?.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Barcode Footer */}
                            <div className="pt-3 flex items-center justify-between border-t border-zinc-800/80 text-[11px] text-zinc-500">
                                <div className="flex items-center gap-1.5">
                                    <QrCode2OutlinedIcon sx={{ fontSize: 22 }} className="text-zinc-400" />
                                    <span className="font-mono">TICKET-PASS-{previewShowtime.id}</span>
                                </div>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        const st = previewShowtime;
                                        setPreviewShowtime(null);
                                        handleEditClick(st);
                                    }}
                                    sx={{ textTransform: "none", color: "#a78bfa", fontWeight: 700 }}
                                >
                                    Hiệu chỉnh suất chiếu
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* 6. DELETE CONFIRMATION DIALOG */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "16px",
                            p: 1,
                            maxWidth: 420,
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: "16px", color: "#0F172A" }}>
                    Xác nhận hủy suất chiếu?
                </DialogTitle>
                <DialogContent>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Bạn có chắc chắn muốn hủy suất chiếu phim{" "}
                        <span className="font-bold text-slate-900">"{showtimeToDelete?.movieTitle}"</span> lúc{" "}
                        <span className="font-bold text-violet-700">{showtimeToDelete?.timeInfo?.startText}</span> tại{" "}
                        <span className="font-bold text-slate-900">{showtimeToDelete?.cinemaName}</span> không?
                    </p>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        sx={{ textTransform: "none", fontWeight: 600, color: "#64748B" }}
                    >
                        Đóng
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDelete}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: "10px",
                            boxShadow: "none",
                        }}
                    >
                        Xác nhận hủy suất
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
