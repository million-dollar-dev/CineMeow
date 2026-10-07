import React, { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Dialog,
    Tooltip,
} from "@mui/material";
import { useDispatch } from "react-redux";

// Material Icons
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

// Components, Services & Mock
import StatCard from "../components/OverviewStats/StatCard.jsx";
import TicketPriceModal from "../components/CinemaManagement/TicketPriceModal.jsx";
import { useGetAllBrandsQuery } from "../services/brandService.js";
import { openSnackbar } from "../redux/slices/snackbarSlice.js";
import { MOCK_ADMIN_BRANDS } from "../mock/mockBrands.js";
import {
    ROOM_FORMAT_CONFIG,
    ROOM_TYPES,
    DEFAULT_BRAND_PRICING,
} from "../mock/mockPricing.js";

export default function PricingManagementPage() {
    const dispatch = useDispatch();

    // 1. Data queries
    const {
        data: brandResponse,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAllBrandsQuery();

    // Fallback merge
    const brands = useMemo(() => {
        const apiBrands = brandResponse?.data;
        if (apiBrands && apiBrands.length > 0) return apiBrands;
        return MOCK_ADMIN_BRANDS;
    }, [brandResponse]);

    // 2. Modals state
    const [openModal, setOpenModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);

    // Quick Preview Dialog state
    const [previewBrand, setPreviewBrand] = useState(null);

    // 3. Filter & Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("DEFAULT");

    // Table pagination state
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // 4. Statistics Calculation
    const totalBrands = brands.length;

    // Stat Cards Configuration
    const stats = useMemo(
        () => [
            {
                title: "Chuỗi rạp định giá",
                value: `${totalBrands} Chuỗi`,
                subtitle: "Áp dụng chính sách toàn quốc",
                icon: <StorefrontOutlinedIcon fontSize="medium" />,
                bigIcon: <StorefrontOutlinedIcon fontSize="inherit" />,
                bgColor: "#1976d2", // Indigo / Violet
            },
            {
                title: "Vé 2D tiêu chuẩn",
                value: "85.000 ₫",
                subtitle: "Định mức vé đơn 2D phổ thông",
                icon: <ConfirmationNumberOutlinedIcon fontSize="medium" />,
                bigIcon: <ConfirmationNumberOutlinedIcon fontSize="inherit" />,
                bgColor: "#2e7d32", // Emerald
            },
            {
                title: "Vé IMAX / 4DX",
                value: "190.000 ₫",
                subtitle: "Định mức phòng chiếu công nghệ cao",
                icon: <WorkspacePremiumOutlinedIcon fontSize="medium" />,
                bigIcon: <WorkspacePremiumOutlinedIcon fontSize="inherit" />,
                bgColor: "#f57c00", // Amber
            },
            {
                title: "Định dạng phòng chiếu",
                value: "4 Định dạng",
                subtitle: "Chuẩn 2D, 3D, IMAX & 4DX",
                icon: <TableChartOutlinedIcon fontSize="medium" />,
                bigIcon: <TableChartOutlinedIcon fontSize="inherit" />,
                bgColor: "#7c3aed", // Violet
            },
        ],
        [totalBrands]
    );

    // 5. Filter & Sort Logic
    const filteredBrands = useMemo(() => {
        let list = brands.filter((b) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            return (
                b.name?.toLowerCase().includes(q) ||
                b.description?.toLowerCase().includes(q)
            );
        });

        if (sortBy === "NAME_ASC") {
            list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (sortBy === "NAME_DESC") {
            list = [...list].sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        }

        return list;
    }, [brands, searchQuery, sortBy]);

    // Handle Toast for API errors
    useEffect(() => {
        if (isError) {
            dispatch(
                openSnackbar({
                    message: error?.data?.message || error?.error || "Không thể tải danh sách thương hiệu.",
                    type: "error",
                })
            );
        }
    }, [isError, error, dispatch]);

    // Handlers
    const handleOpenEditModal = (brand) => {
        setSelectedBrand(brand);
        setOpenModal(true);
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setSortBy("DEFAULT");
    };

    // 6. DataGrid Columns Definition
    const columns = [
        {
            field: "brandInfo",
            headerName: "Chuỗi Rạp Chiếu",
            flex: 1.4,
            minWidth: 280,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center gap-3.5 py-2 w-full min-w-0">
                        {/* Logo Thumbnail */}
                        <div
                            onClick={() => setPreviewBrand(row)}
                            className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs shrink-0 group/img cursor-pointer hover:shadow-md transition-all flex items-center justify-center p-1"
                        >
                            <img
                                src={row.logoUrl}
                                alt={row.name}
                                className="w-full h-full object-contain group-hover/img:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150";
                                }}
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            </div>
                        </div>

                        {/* Title & Badges */}
                        <div className="min-w-0 flex-1 py-1 flex flex-col justify-center">
                            <div className="flex items-center gap-1.5">
                                <h3
                                    onClick={() => setPreviewBrand(row)}
                                    className="text-sm font-extrabold text-slate-900 truncate hover:text-violet-600 cursor-pointer transition-colors leading-snug"
                                    title={row.name}
                                >
                                    {row.name}
                                </h3>
                                <VerifiedIcon sx={{ fontSize: 15 }} className="text-indigo-600 shrink-0" />
                            </div>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span
                                    className="inline-flex items-center justify-center text-[10px] font-black uppercase px-2 rounded-md bg-violet-50 text-violet-700 border border-violet-100 shadow-2xs shrink-0 select-none"
                                    style={{ height: "20px", minHeight: "20px", maxHeight: "20px", lineHeight: "1" }}
                                >
                                    ID: #{String(row.id).slice(-4)}
                                </span>
                                <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 select-none"
                                    style={{ height: "20px", minHeight: "20px", maxHeight: "20px", lineHeight: "1" }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Biểu phí hiệu lực</span>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "pricingOverview",
            headerName: "Biểu Phí Khái Quát Theo Định Dạng",
            flex: 1.8,
            minWidth: 360,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div className="flex items-center gap-2 py-2 w-full flex-wrap">
                        {/* 2D Tag */}
                        <div className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200/80 text-[11px] font-extrabold text-blue-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>2D: 80k - 180k ₫</span>
                        </div>
                        {/* 3D Tag */}
                        <div className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] font-extrabold text-emerald-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>3D: 110k - 250k ₫</span>
                        </div>
                        {/* IMAX Tag */}
                        <div className="px-2.5 py-1 rounded-xl bg-violet-50 border border-violet-200/80 text-[11px] font-extrabold text-violet-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                            <span>IMAX: 180k - 390k ₫</span>
                        </div>
                        {/* 4DX Tag */}
                        <div className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200/80 text-[11px] font-extrabold text-rose-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            <span>4DX: 200k - 420k ₫</span>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "seatClasses",
            headerName: "Hạng Ghế Áp Dụng",
            width: 180,
            sortable: false,
            headerAlign: "center",
            align: "center",
            renderCell: () => {
                return (
                    <div className="flex items-center justify-center gap-2 py-1 w-full">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/80">
                            <ChairOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Ghế Đơn</span>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200/80">
                            <WeekendOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Ghế Đôi</span>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 280,
            minWidth: 260,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center justify-center gap-2 w-full h-full pr-1">
                        {/* Quick View Button */}
                        <Tooltip title="Xem nhanh bảng giá" arrow>
                            <button
                                type="button"
                                onClick={() => setPreviewBrand(row)}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                            >
                                <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
                                <span>Xem nhanh</span>
                            </button>
                        </Tooltip>

                        {/* Edit Pricing Matrix Button */}
                        <Tooltip title="Thiết lập ma trận giá vé chi tiết" arrow>
                            <button
                                type="button"
                                onClick={() => handleOpenEditModal(row)}
                                className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200/80 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs shrink-0 whitespace-nowrap"
                            >
                                <EditOutlinedIcon sx={{ fontSize: 15 }} />
                                <span>Tùy chỉnh giá</span>
                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="py-6 space-y-6">
            {/* 1. PAGE HEADER (STANDARD PAGE HEADER BANNER) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <PaymentsOutlinedIcon className="text-violet-600" />
                        <span>Bảng Giá Vé Rạp</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Quản lý biểu phí vé xem phim theo từng chuỗi thương hiệu, định dạng phòng chiếu (2D, 3D, IMAX, 4DX) và phân hạng ghế
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            refetch();
                            dispatch(openSnackbar({ message: "Đang đồng bộ dữ liệu biểu giá vé...", type: "info" }));
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
                        onClick={() => handleOpenEditModal(brands[0] || null)}
                        startIcon={<PaymentsOutlinedIcon />}
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
                        Tùy chỉnh giá vé chuỗi rạp
                    </Button>
                </div>
            </div>

            {/* 2. STATS KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                        bigIcon={stat.bigIcon}
                        bgColor={stat.bgColor}
                        loading={isLoading}
                    />
                ))}
            </div>

            {/* 3. FILTER & SEARCH TOOLBAR */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search input */}
                <div className="relative flex-1 min-w-[240px] max-w-md w-full">
                    <SearchOutlinedIcon
                        sx={{ fontSize: 18 }}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Tìm chuỗi rạp theo tên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition shadow-2xs placeholder:text-slate-400 text-slate-800"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                        </button>
                    )}
                </div>

                {/* Sort selector & Actions */}
                <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 flex-wrap">
                    {/* Standard Sort Dropdown */}
                    <div className="relative min-w-[200px]">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <FilterListOutlinedIcon sx={{ fontSize: 16 }} />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full pl-8.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                        >
                            <option value="DEFAULT">Sắp xếp: Mặc định</option>
                            <option value="NAME_ASC">Tên chuỗi (A → Z)</option>
                            <option value="NAME_DESC">Tên chuỗi (Z → A)</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        </div>
                    </div>

                    {/* Reset Filters */}
                    {(searchQuery || sortBy !== "DEFAULT") && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                            <RestartAltOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Đặt lại</span>
                        </button>
                    )}

                    {/* Count badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-600 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>
                            Hiển thị: {filteredBrands.length}/{brands.length} chuỗi rạp
                        </span>
                    </div>
                </div>
            </div>

            {/* 4. DATAGRID TABLE */}
            <Box
                sx={{
                    width: "100%",
                    height: 640,
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    overflow: "hidden",
                }}
            >
                <DataGrid
                    rows={filteredBrands}
                    columns={columns}
                    loading={isLoading}
                    disableRowSelectionOnClick
                    rowHeight={100}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
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
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "1px solid #E2E8F0",
                        },
                    }}
                />
            </Box>

            {/* 5. TICKET PRICE MATRIX MODAL */}
            <TicketPriceModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                brand={selectedBrand}
            />

            {/* 6. QUICK PRICING MATRIX PREVIEW DIALOG */}
            <Dialog
                open={Boolean(previewBrand)}
                onClose={() => setPreviewBrand(null)}
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
                {previewBrand && (
                    <div className="p-6 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white p-1 border border-white/20 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={previewBrand.logoUrl}
                                        alt={previewBrand.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white leading-tight">
                                        Bảng Giá: {previewBrand.name}
                                    </h3>
                                    <span className="text-xs text-zinc-400 font-semibold">
                                        Biểu phí niêm yết theo định dạng & loại ghế
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewBrand(null)}
                                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                            </button>
                        </div>

                        {/* Matrix Table */}
                        <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/70">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-zinc-900 text-[11px] font-extrabold uppercase text-zinc-400 border-b border-zinc-800">
                                        <th className="p-3">Định Dạng</th>
                                        <th className="p-3 text-right">Ghế Đơn (Normal)</th>
                                        <th className="p-3 text-right">Ghế Đôi (Couple)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/80">
                                    {ROOM_TYPES.map((fmt) => {
                                        const cfg = ROOM_FORMAT_CONFIG[fmt];
                                        const norm = DEFAULT_BRAND_PRICING.find(
                                            (p) => p.roomType === fmt && p.seatType === "NORMAL"
                                        );
                                        const coup = DEFAULT_BRAND_PRICING.find(
                                            (p) => p.roomType === fmt && p.seatType === "COUPLE"
                                        );
                                        return (
                                            <tr key={fmt} className="hover:bg-zinc-900/50">
                                                <td className="p-3 font-bold text-white flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${cfg.pillColor}`} />
                                                    <span>{cfg.label}</span>
                                                </td>
                                                <td className="p-3 text-right font-extrabold text-zinc-200">
                                                    {(norm?.price || 85000).toLocaleString("vi-VN")} ₫
                                                </td>
                                                <td className="p-3 text-right font-extrabold text-rose-400">
                                                    {(coup?.price || 180000).toLocaleString("vi-VN")} ₫
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setPreviewBrand(null)}
                                className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-bold transition cursor-pointer"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const b = previewBrand;
                                    setPreviewBrand(null);
                                    handleOpenEditModal(b);
                                }}
                                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black shadow-md shadow-violet-500/20 flex items-center gap-1.5 transition cursor-pointer"
                            >
                                <EditOutlinedIcon sx={{ fontSize: 15 }} />
                                <span>Chỉnh Sửa Biểu Giá</span>
                            </button>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
