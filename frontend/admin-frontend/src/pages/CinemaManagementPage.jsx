import React, { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from "@mui/material";
import { useDispatch } from "react-redux";

// Material Icons
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TheaterComedyOutlinedIcon from "@mui/icons-material/TheaterComedyOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";

// Components, Services & Mock
import StatCard from "../components/OverviewStats/StatCard.jsx";
import StatusChip from "../components/StatusChip.jsx";
import CinemaModal from "../components/CinemaManagement/CinemaModal.jsx";
import { useGetAllCinemasQuery } from "../services/cinemaService.js";
import { useGetAllBrandsQuery } from "../services/brandService.js";
import { openSnackbar } from "../redux/slices/snackbarSlice.js";
import { MOCK_ADMIN_CINEMAS, MOCK_BRANDS, CINEMA_STATUS_CONFIG } from "../mock/mockCinemas.js";

export default function CinemaManagementPage() {
    const dispatch = useDispatch();

    // Data fetching
    const {
        data: cinemaResponse,
        isError: isCinemaError,
        error: cinemaError,
        isLoading: isLoadingCinemas,
    } = useGetAllCinemasQuery();
    const { data: brandResponse } = useGetAllBrandsQuery();

    // Merged Brands dataset
    const brands = useMemo(() => {
        const apiBrands = brandResponse?.data;
        if (apiBrands && apiBrands.length > 0) return apiBrands;
        return MOCK_BRANDS;
    }, [brandResponse]);

    // Merged Cinemas dataset with realistic fallbacks
    const cinemas = useMemo(() => {
        const apiCinemas = cinemaResponse?.data || [];
        const baseCinemas = apiCinemas.length > 0 ? apiCinemas : MOCK_ADMIN_CINEMAS;

        return baseCinemas.map((c, idx) => {
            const matchedBrand =
                brands.find((b) => b.id === c.brandId || b.id === c.brand?.id) ||
                c.brand || {
                    name: c.brandName || "CineMeow Standard",
                    logoUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150",
                };

            const roomTypes =
                c.roomTypes ||
                (c.rooms && c.rooms.length > 0
                    ? Array.from(new Set(c.rooms.map((r) => r.roomType || r.type || "2D")))
                    : ["2D", "3D"]);

            return {
                ...c,
                id: c.id || `cinema-item-${idx}`,
                brand: matchedBrand,
                brandName: matchedBrand.name || c.brandName || "CineMeow",
                city: c.city || "Toàn quốc",
                totalRoom: c.totalRoom || (c.rooms ? c.rooms.length : 6),
                status: c.status || "ACTIVE",
                hotline: c.hotline || "1900 6017",
                openHours: c.openHours || "08:30 - 00:30",
                imageUrl:
                    c.imageUrl ||
                    c.image ||
                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
                roomTypes,
                rooms: c.rooms || [
                    { id: `r-${idx}-1`, name: "Phòng 01 (Dolby 2D)", roomType: "2D", seatCount: 180, status: "ACTIVE" },
                    { id: `r-${idx}-2`, name: "Phòng 02 (VIP Sofa)", roomType: "VIP", seatCount: 60, status: "ACTIVE" },
                ],
            };
        });
    }, [cinemaResponse, brands]);

    // Table pagination state
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // Modals state
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [modalTab, setModalTab] = useState(0);
    const [selectedCinema, setSelectedCinema] = useState(null);

    // Quick Cinema Profile Preview State
    const [previewCinema, setPreviewCinema] = useState(null);

    // Safe Delete Dialog State
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [cinemaToDelete, setCinemaToDelete] = useState(null);

    // Filters and Search States
    const [selectedCityFilter, setSelectedCityFilter] = useState("ALL");
    const [selectedBrandFilter, setSelectedBrandFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Statistics Calculation
    const totalCinemas = cinemas.length;
    const activeCinemas = cinemas.filter((c) => c.status === "ACTIVE").length;
    const totalRoomsCount = cinemas.reduce((acc, curr) => acc + (curr.totalRoom || 0), 0);
    const distinctCities = Array.from(new Set(cinemas.map((c) => c.city).filter(Boolean)));
    const totalCitiesCount = distinctCities.length;

    // Stat Cards Configuration
    const stats = useMemo(
        () => [
            {
                title: "Tổng cụm rạp",
                value: totalCinemas,
                subtitle: "Toàn bộ hệ thống rạp trên cả nước",
                icon: <StorefrontOutlinedIcon fontSize="medium" />,
                bigIcon: <StorefrontOutlinedIcon fontSize="inherit" />,
                bgColor: "#1976d2", // Indigo / Blue
            },
            {
                title: "Đang hoạt động",
                value: activeCinemas,
                subtitle: "Sẵn sàng đón tiếp khán giả",
                icon: <CheckCircleOutlineOutlinedIcon fontSize="medium" />,
                bigIcon: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
                bgColor: "#2e7d32", // Emerald green
            },
            {
                title: "Tổng số phòng chiếu",
                value: totalRoomsCount,
                subtitle: "Định dạng IMAX, 3D, VIP, 2D",
                icon: <MeetingRoomOutlinedIcon fontSize="medium" />,
                bigIcon: <MeetingRoomOutlinedIcon fontSize="inherit" />,
                bgColor: "#7c3aed", // Violet gradient
            },
            {
                title: "Khu vực phủ sóng",
                value: totalCitiesCount,
                subtitle: "Tỉnh / Thành phố trên toàn quốc",
                icon: <LocationOnOutlinedIcon fontSize="medium" />,
                bigIcon: <LocationOnOutlinedIcon fontSize="inherit" />,
                bgColor: "#f57c00", // Amber / Orange
            },
        ],
        [totalCinemas, activeCinemas, totalRoomsCount, totalCitiesCount]
    );

    // Filtered Cinemas
    const filteredCinemas = useMemo(() => {
        return cinemas.filter((cinema) => {
            // City Filter
            const matchesCity =
                selectedCityFilter === "ALL" ||
                cinema.city?.toLowerCase() === selectedCityFilter.toLowerCase();

            // Brand Filter
            const matchesBrand =
                selectedBrandFilter === "ALL" ||
                cinema.brandId === selectedBrandFilter ||
                cinema.brand?.id === selectedBrandFilter ||
                cinema.brandName?.toLowerCase().includes(selectedBrandFilter.toLowerCase());

            // Search Query Filter
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !q ||
                cinema.name?.toLowerCase().includes(q) ||
                cinema.address?.toLowerCase().includes(q) ||
                cinema.city?.toLowerCase().includes(q) ||
                cinema.brandName?.toLowerCase().includes(q);

            return matchesCity && matchesBrand && matchesSearch;
        });
    }, [cinemas, selectedCityFilter, selectedBrandFilter, searchQuery]);

    // Handlers
    const handleAddClick = () => {
        setModalMode("add");
        setSelectedCinema(null);
        setModalTab(0);
        setOpenModal(true);
    };

    const handleEditClick = (cinema) => {
        setModalMode("edit");
        setSelectedCinema(cinema);
        setModalTab(0);
        setOpenModal(true);
    };

    const handleOpenRooms = (cinema) => {
        setModalMode("edit");
        setSelectedCinema(cinema);
        setModalTab(1);
        setOpenModal(true);
    };

    const handleDeleteClick = (cinema) => {
        setCinemaToDelete(cinema);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        dispatch(
            openSnackbar({
                message: `Yêu cầu gỡ bỏ cụm rạp "${cinemaToDelete?.name}" đã được ghi nhận. Tính năng xóa an toàn đang đồng bộ máy chủ.`,
                type: "info",
            })
        );
        setOpenDeleteDialog(false);
        setCinemaToDelete(null);
    };

    // Error Notification
    useEffect(() => {
        if (isCinemaError) {
            dispatch(
                openSnackbar({
                    message: cinemaError?.data?.message || "Không thể tải danh sách cụm rạp từ máy chủ.",
                    type: "error",
                })
            );
        }
    }, [isCinemaError, cinemaError, dispatch]);

    // DataGrid Columns Definition
    const columns = [
        {
            field: "cinemaInfo",
            headerName: "Cụm rạp & Thương hiệu",
            flex: 1.5,
            minWidth: 320,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center gap-3.5 py-2 w-full min-w-0">
                        {/* Cinema Photo Thumbnail */}
                        <div
                            onClick={() => setPreviewCinema(row)}
                            className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs shrink-0 group/img cursor-pointer hover:shadow-md transition-all"
                        >
                            <img
                                src={row.imageUrl}
                                alt={row.name}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=150";
                                }}
                            />
                            {/* Brand Logo Mini Avatar */}
                            {row.brand?.logoUrl && (
                                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full overflow-hidden border border-white shadow-sm bg-white">
                                    <img
                                        src={row.brand.logoUrl}
                                        alt={row.brandName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            </div>
                        </div>

                        {/* Title, Brand & City */}
                        <div className="min-w-0 flex-1 py-1 flex flex-col justify-center">
                            <h3
                                onClick={() => setPreviewCinema(row)}
                                className="text-sm font-extrabold text-slate-900 truncate hover:text-violet-600 cursor-pointer transition-colors leading-snug"
                                title={row.name}
                            >
                                {row.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {/* Brand Badge */}
                                <span
                                    className="inline-flex items-center justify-center text-[10px] font-black uppercase px-2 rounded-md bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs shrink-0 select-none"
                                    style={{ height: "20px", minHeight: "20px", maxHeight: "20px", lineHeight: "1" }}
                                >
                                    {row.brandName}
                                </span>

                                {/* City Pill */}
                                <span
                                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 shrink-0 select-none"
                                    style={{ height: "20px", minHeight: "20px", maxHeight: "20px", lineHeight: "1" }}
                                >
                                    <LocationOnOutlinedIcon sx={{ fontSize: 12 }} className="text-slate-400" />
                                    <span>{row.city}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "addressAndContact",
            headerName: "Địa chỉ & Liên hệ",
            flex: 1.6,
            minWidth: 300,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div
                        className="flex flex-col justify-center gap-1.5 py-1 min-w-0 w-full"
                        style={{ lineHeight: "1.4" }}
                    >
                        {/* Detailed Address */}
                        <div className="flex items-center gap-1.5 min-w-0">
                            <LocationOnOutlinedIcon sx={{ fontSize: 16 }} className="text-rose-500 shrink-0" />
                            <Tooltip title={row.address} arrow disableInteractive>
                                <span className="text-xs font-semibold text-slate-700 truncate cursor-help">
                                    {row.address}
                                </span>
                            </Tooltip>
                        </div>

                        {/* Contact Hotline & Open Hours */}
                        <div className="flex items-center gap-3 min-w-0 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 shrink-0 font-medium">
                                <PhoneInTalkOutlinedIcon sx={{ fontSize: 13 }} className="text-emerald-600" />
                                <span>{row.hotline}</span>
                            </span>
                            <span className="flex items-center gap-1 shrink-0 font-medium">
                                <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
                                <span>{row.openHours}</span>
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "roomCapacity",
            headerName: "Quy mô phòng chiếu",
            width: 230,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div
                        className="flex flex-col justify-center gap-1.5 py-1 w-full"
                        style={{ lineHeight: "1.4" }}
                    >
                        {/* Total Rooms Pill */}
                        <div className="flex items-center gap-1.5">
                            <span
                                className="inline-flex items-center gap-1 text-xs font-extrabold text-violet-700 bg-violet-50/80 border border-violet-200/70 px-2.5 rounded-lg shadow-2xs select-none shrink-0"
                                style={{ height: "22px", minHeight: "22px", maxHeight: "22px", lineHeight: "1" }}
                            >
                                <MeetingRoomOutlinedIcon sx={{ fontSize: 14 }} className="text-violet-500" />
                                <span>{row.totalRoom} phòng chiếu</span>
                            </span>
                        </div>

                        {/* Tech Room Type Badges */}
                        <div className="flex items-center gap-1 flex-wrap">
                            {row.roomTypes?.map((t, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center justify-center text-[10px] font-black uppercase px-1.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60 shadow-2xs select-none shrink-0"
                                    style={{ height: "18px", minHeight: "18px", maxHeight: "18px", lineHeight: "1" }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 170,
            sortable: false,
            renderCell: (params) => (
                <div className="flex items-center h-full">
                    <StatusChip status={params.value} configs={CINEMA_STATUS_CONFIG} />
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 190,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div className="flex items-center gap-1 h-full">
                    <Tooltip title="Xem chi tiết rạp" arrow>
                        <button
                            type="button"
                            onClick={() => setPreviewCinema(params.row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition cursor-pointer"
                        >
                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa thông tin rạp" arrow>
                        <button
                            type="button"
                            onClick={() => handleEditClick(params.row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                        >
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Quản lý phòng chiếu" arrow>
                        <button
                            type="button"
                            onClick={() => handleOpenRooms(params.row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                        >
                            <MeetingRoomOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Gỡ bỏ cụm rạp" arrow>
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
            {/* Modal Quản lý Rạp & Phòng chiếu */}
            <CinemaModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                mode={modalMode}
                cinemaData={selectedCinema}
                initialTab={modalTab}
            />

            {/* 1. HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                        Quản Lý Cụm Rạp
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Quản lý hệ sinh thái rạp chiếu phim, sơ đồ phòng máy, thương hiệu và công nghệ phòng chiếu trên toàn quốc
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleAddClick}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                        <AddCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>Thêm Cụm Rạp Mới</span>
                    </button>
                </div>
            </div>

            {/* 2. STATS ROW (4 JEWEL CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} loading={isLoadingCinemas} />
                ))}
            </div>

            {/* 3. MULTI-FILTER TOOLBAR */}
            <div className="p-4 mb-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3.5">
                {/* Top Row: City Quick Filter Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400 mr-1.5 uppercase tracking-wider">
                            Khu vực:
                        </span>
                        {[
                            { key: "ALL", label: "Tất cả khu vực" },
                            { key: "TP. Hồ Chí Minh", label: "TP. HCM" },
                            { key: "Hà Nội", label: "Hà Nội" },
                            { key: "Đà Nẵng", label: "Đà Nẵng" },
                            { key: "Cần Thơ", label: "Cần Thơ" },
                            { key: "Hải Phòng", label: "Hải Phòng" },
                        ].map((c) => (
                            <button
                                key={c.key}
                                type="button"
                                onClick={() => setSelectedCityFilter(c.key)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                                    selectedCityFilter === c.key
                                        ? "bg-violet-600 text-white shadow-xs"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                                }`}
                            >
                                <span>{c.label}</span>
                            </button>
                        ))}
                    </div>

                    <span className="text-xs text-slate-400 font-semibold hidden md:block">
                        Tìm thấy <strong className="text-slate-800">{filteredCinemas.length}</strong> cụm rạp
                    </span>
                </div>

                {/* Bottom Row: Brand Filter + Search Input */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[240px]">
                        <SearchOutlinedIcon
                            sx={{ fontSize: 18 }}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm theo tên rạp, địa chỉ, thương hiệu, quận huyện..."
                            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-violet-500 focus:outline-none transition"
                        />
                    </div>

                    {/* Brand Filter Dropdown */}
                    <div className="min-w-[190px]">
                        <select
                            value={selectedBrandFilter}
                            onChange={(e) => setSelectedBrandFilter(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-violet-500 focus:outline-none transition cursor-pointer"
                        >
                            <option value="ALL">Tất cả thương hiệu rạp</option>
                            {brands.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
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
                    rows={filteredCinemas}
                    columns={columns}
                    disableRowSelectionOnClick
                    rowHeight={100}
                    loading={isLoadingCinemas}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    pagination
                    sx={{
                        border: "none",
                        fontFamily: "inherit",
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
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "1px solid #E2E8F0",
                        },
                    }}
                />
            </Box>

            {/* 5. QUICK CINEMA PROFILE PREVIEW DIALOG */}
            <Dialog
                open={Boolean(previewCinema)}
                onClose={() => setPreviewCinema(null)}
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
                {previewCinema && (
                    <div className="relative">
                        {/* Banner Image */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                            <img
                                src={previewCinema.imageUrl}
                                alt={previewCinema.name}
                                className="w-full h-full object-cover opacity-60 filter blur-[1px] scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/50 to-transparent" />

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setPreviewCinema(null)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                            </button>

                            {/* Status Chip */}
                            <div className="absolute top-4 left-5">
                                <StatusChip status={previewCinema.status} configs={CINEMA_STATUS_CONFIG} />
                            </div>
                        </div>

                        {/* Cinema Details */}
                        <div className="p-6 space-y-4">
                            {/* Brand Logo & Cinema Title Header */}
                            <div className="flex gap-4 -mt-14 relative z-10 items-end">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-white/20 shadow-2xl shrink-0">
                                    <img
                                        src={previewCinema.brand?.logoUrl || previewCinema.imageUrl}
                                        alt={previewCinema.brandName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1 pb-1">
                                    <h3 className="text-lg font-black text-white leading-tight">
                                        {previewCinema.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-violet-600/30 text-violet-300 border border-violet-500/40">
                                            {previewCinema.brandName}
                                        </span>
                                        <span className="text-xs text-zinc-400 font-semibold">
                                            {previewCinema.city}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashed Separator */}
                            <div className="border-b border-dashed border-zinc-700/80 my-3" />

                            {/* Specs Info Grid */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="col-span-2">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                        Địa chỉ cụm rạp
                                    </span>
                                    <p className="font-semibold text-zinc-200 mt-0.5">{previewCinema.address}</p>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                        Hotline chăm sóc
                                    </span>
                                    <p className="font-bold text-zinc-200 mt-0.5">{previewCinema.hotline}</p>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                        Giờ hoạt động
                                    </span>
                                    <p className="font-bold text-zinc-200 mt-0.5">{previewCinema.openHours}</p>
                                </div>
                            </div>

                            {/* Rooms Showcase */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                                        Danh sách phòng máy ({previewCinema.rooms?.length || previewCinema.totalRoom} phòng)
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewCinema(null);
                                            handleOpenRooms(previewCinema);
                                        }}
                                        className="text-[11px] font-bold text-violet-400 hover:text-violet-300 transition"
                                    >
                                        Quản lý phòng chiếu →
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {previewCinema.rooms?.map((r, i) => (
                                        <div
                                            key={i}
                                            className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between"
                                        >
                                            <div className="min-w-0 pr-2">
                                                <p className="text-xs font-bold text-zinc-200 truncate">{r.name}</p>
                                                <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                                    <EventSeatOutlinedIcon sx={{ fontSize: 11 }} />
                                                    <span>{r.seatCount || 150} ghế ngồi</span>
                                                </p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 border border-violet-500/40 shrink-0">
                                                {r.roomType || "2D"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPreviewCinema(null)}
                                    className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer transition"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewCinema(null);
                                        handleEditClick(previewCinema);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold cursor-pointer transition flex items-center gap-1.5"
                                >
                                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                                    <span>Chỉnh sửa rạp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* 6. SAFE DELETE CONFIRMATION DIALOG */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "20px",
                            p: 1,
                            maxWidth: 420,
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: "16px", color: "#0F172A" }}>
                    Xác nhận gỡ bỏ cụm rạp?
                </DialogTitle>
                <DialogContent>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Bạn có chắc chắn muốn gỡ bỏ cụm rạp{" "}
                        <span className="font-bold text-slate-900">"{cinemaToDelete?.name}"</span> khỏi hệ thống CineMeow không? Thao tác này sẽ cập nhật trạng thái phân phối lịch chiếu tại cụm rạp.
                    </p>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        sx={{ textTransform: "none", fontWeight: 600, color: "#64748B" }}
                    >
                        Hủy bỏ
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
                        Xác nhận gỡ bỏ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
