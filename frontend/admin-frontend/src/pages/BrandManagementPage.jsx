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
    TextField,
    InputAdornment,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";

// Material Icons
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Components, Services & Mock
import StatCard from "../components/OverviewStats/StatCard.jsx";
import BrandModal from "../components/CinemaManagement/BrandModal.jsx";
import {
    useGetAllBrandsQuery,
    useDeleteBrandMutation,
} from "../services/brandService.js";
import { openSnackbar } from "../redux/slices/snackbarSlice.js";
import { MOCK_ADMIN_BRANDS } from "../mock/mockBrands.js";

export default function BrandManagementPage() {
    const dispatch = useDispatch();

    // 1. Data queries & mutations
    const {
        data: brandResponse,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAllBrandsQuery();

    const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

    // 2. Data fallback & dataset merge
    const brands = useMemo(() => {
        const apiBrands = brandResponse?.data;
        if (apiBrands && apiBrands.length > 0) return apiBrands;
        return MOCK_ADMIN_BRANDS;
    }, [brandResponse]);

    // 3. Modals & Dialogs state
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedBrand, setSelectedBrand] = useState(null);

    // Quick Preview Dialog state
    const [previewBrand, setPreviewBrand] = useState(null);

    // Safe Delete Dialog state
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);

    // 4. Filter & Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("DEFAULT");

    // Table pagination state
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // 5. Statistics Calculation
    const totalBrands = brands.length;
    const totalEmployees = useMemo(
        () => brands.reduce((acc, curr) => acc + (Number(curr.employeeCount) || 0), 0),
        [brands]
    );
    const topBrand = useMemo(() => {
        if (!brands.length) return null;
        return [...brands].sort((a, b) => (Number(b.employeeCount) || 0) - (Number(a.employeeCount) || 0))[0];
    }, [brands]);
    const avgEmployees = totalBrands > 0 ? Math.round(totalEmployees / totalBrands) : 0;

    // Stat Cards Configuration
    const stats = useMemo(
        () => [
            {
                title: "Tổng thương hiệu",
                value: totalBrands,
                subtitle: "Chuỗi rạp đối tác đang vận hành",
                icon: <BrandingWatermarkOutlinedIcon fontSize="medium" />,
                bigIcon: <BrandingWatermarkOutlinedIcon fontSize="inherit" />,
                bgColor: "#1976d2", // Indigo / Violet
            },
            {
                title: "Tổng nhân sự toàn hệ thống",
                value: totalEmployees.toLocaleString("vi-VN"),
                subtitle: "Lực lượng vận hành & phục vụ khách",
                icon: <PeopleOutlineOutlinedIcon fontSize="medium" />,
                bigIcon: <PeopleOutlineOutlinedIcon fontSize="inherit" />,
                bgColor: "#2e7d32", // Emerald
            },
            {
                title: "Quy mô dẫn đầu",
                value: topBrand ? `${Number(topBrand.employeeCount || 0).toLocaleString("vi-VN")}` : "0",
                subtitle: topBrand ? `${topBrand.name}` : "Chưa có dữ liệu",
                icon: <WorkspacePremiumOutlinedIcon fontSize="medium" />,
                bigIcon: <WorkspacePremiumOutlinedIcon fontSize="inherit" />,
                bgColor: "#f57c00", // Amber
            },
            {
                title: "Trung bình / Chuỗi",
                value: avgEmployees.toLocaleString("vi-VN"),
                subtitle: "Mức nhân sự bình quân mỗi thương hiệu",
                icon: <StorefrontOutlinedIcon fontSize="medium" />,
                bigIcon: <StorefrontOutlinedIcon fontSize="inherit" />,
                bgColor: "#e11d48", // Rose
            },
        ],
        [totalBrands, totalEmployees, topBrand, avgEmployees]
    );

    // 6. Filter & Sort Logic
    const filteredBrands = useMemo(() => {
        let list = brands.filter((b) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            const matchName = b.name?.toLowerCase().includes(q);
            const matchDesc = b.description?.toLowerCase().includes(q);
            return matchName || matchDesc;
        });

        if (sortBy === "NAME_ASC") {
            list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (sortBy === "EMP_DESC") {
            list = [...list].sort((a, b) => (Number(b.employeeCount) || 0) - (Number(a.employeeCount) || 0));
        } else if (sortBy === "EMP_ASC") {
            list = [...list].sort((a, b) => (Number(a.employeeCount) || 0) - (Number(b.employeeCount) || 0));
        }

        return list;
    }, [brands, searchQuery, sortBy]);

    // Handle Toast for API errors
    useEffect(() => {
        if (isError) {
            dispatch(
                openSnackbar({
                    message: error?.data?.message || error?.error || "Không thể kết nối đến máy chủ lấy danh sách thương hiệu.",
                    type: "error",
                })
            );
        }
    }, [isError, error, dispatch]);

    // Handlers
    const handleAddClick = () => {
        setModalMode("add");
        setSelectedBrand(null);
        setOpenModal(true);
    };

    const handleEditClick = (brand) => {
        setModalMode("edit");
        setSelectedBrand(brand);
        setOpenModal(true);
    };

    const handleOpenDeleteConfirm = (brand) => {
        setBrandToDelete(brand);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!brandToDelete) return;
        try {
            await deleteBrand(brandToDelete.id).unwrap();
            dispatch(openSnackbar({ message: `Đã xóa thương hiệu "${brandToDelete.name}" thành công!`, type: "success" }));
            setOpenDeleteDialog(false);
            setBrandToDelete(null);
        } catch (err) {
            dispatch(
                openSnackbar({
                    message: err?.data?.message || "Không thể xóa thương hiệu. Có thể rạp chiếu đang liên kết.",
                    type: "error",
                })
            );
        }
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setSortBy("DEFAULT");
    };

    // 7. DataGrid Columns Definition
    const columns = [
        {
            field: "brandInfo",
            headerName: "Thương hiệu & Biểu trưng",
            flex: 1.4,
            minWidth: 280,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center gap-3.5 py-2 w-full min-w-0">
                        {/* Logo Thumbnail with interactive quick view */}
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

                        {/* Title & Brand Badges */}
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
                                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 shrink-0 select-none"
                                    style={{ height: "20px", minHeight: "20px", maxHeight: "20px", lineHeight: "1" }}
                                >
                                    <StorefrontOutlinedIcon sx={{ fontSize: 11 }} className="text-slate-400" />
                                    <span>Hệ thống chuỗi rạp</span>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "backgroundUrl",
            headerName: "Ảnh bìa nhận diện",
            width: 170,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div
                        onClick={() => setPreviewBrand(row)}
                        className="relative w-32 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs group cursor-pointer shrink-0"
                    >
                        <img
                            src={row.backgroundUrl}
                            alt={`${row.name} cover`}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </div>
                    </div>
                );
            },
        },
        {
            field: "employeeCount",
            headerName: "Quy mô nhân sự",
            width: 180,
            sortable: true,
            renderCell: (params) => {
                const count = Number(params.value) || 0;
                return (
                    <div className="flex flex-col justify-center gap-1 py-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-50 text-violet-700 border border-violet-100 font-extrabold text-xs">
                            <PeopleOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                            <span>{count.toLocaleString("vi-VN")} nhân sự</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold pl-1">
                            Vận hành & Dịch vụ
                        </span>
                    </div>
                );
            },
        },
        {
            field: "description",
            headerName: "Mô tả & Tầm nhìn",
            flex: 1.8,
            minWidth: 320,
            sortable: false,
            renderCell: (params) => {
                const text = params.value || "Chưa có mô tả tóm tắt.";
                return (
                    <Tooltip title={text} arrow disableInteractive>
                        <div className="py-2 pr-3 cursor-help">
                            <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                                {text}
                            </p>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 190,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center gap-1">
                        {/* Quick View Button */}
                        <Tooltip title="Xem chi tiết thương hiệu" arrow>
                            <button
                                type="button"
                                onClick={() => setPreviewBrand(row)}
                                className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                            >
                                <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                            </button>
                        </Tooltip>

                        {/* Edit Button */}
                        <Tooltip title="Hiệu chỉnh thông tin" arrow>
                            <button
                                type="button"
                                onClick={() => handleEditClick(row)}
                                className="w-8 h-8 rounded-lg text-violet-600 hover:text-violet-800 hover:bg-violet-50 flex items-center justify-center transition cursor-pointer"
                            >
                                <EditOutlinedIcon sx={{ fontSize: 17 }} />
                            </button>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Xóa thương hiệu" arrow>
                            <button
                                type="button"
                                onClick={() => handleOpenDeleteConfirm(row)}
                                className="w-8 h-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                            >
                                <DeleteOutlineOutlinedIcon sx={{ fontSize: 17 }} />
                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <Box className="py-4 px-1 sm:px-2 min-h-screen space-y-6">
            {/* 1. PAGE HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Hệ Thống</span>
                        <span>/</span>
                        <span>Quản Lý Cụm Rạp</span>
                        <span>/</span>
                        <span className="text-violet-600 font-bold">Thương Hiệu Rạp</span>
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <span>Quản Lý Thương Hiệu Rạp</span>
                        <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                            Đối tác chuỗi rạp
                        </span>
                    </h1>

                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Hệ thống nhận diện thương hiệu rạp chiếu, biểu trưng đối tác và phân bổ quy mô nhân sự vận hành
                    </p>
                </div>

                {/* Main Action Button */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="contained"
                        onClick={handleAddClick}
                        startIcon={<AddCircleOutlineOutlinedIcon />}
                        sx={{
                            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                            textTransform: "none",
                            borderRadius: "14px",
                            px: 3,
                            py: 1.2,
                            fontWeight: 800,
                            fontSize: "13px",
                            boxShadow: "0 10px 20px -5px rgba(124, 58, 237, 0.35)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)",
                                transform: "translateY(-1px)",
                            },
                            transition: "all 0.2s ease",
                        }}
                    >
                        Thêm Thương Hiệu Mới
                    </Button>
                </div>
            </div>

            {/* 2. STATS KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        placeholder="Tìm theo tên thương hiệu, mô tả..."
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
                            <option value="NAME_ASC">Tên thương hiệu (A → Z)</option>
                            <option value="EMP_DESC">Nhân sự (Nhiều → Ít)</option>
                            <option value="EMP_ASC">Nhân sự (Ít → Nhiều)</option>
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
                            Hiển thị: {filteredBrands.length}/{brands.length} thương hiệu
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

            {/* 5. MODAL CREATE / EDIT BRAND */}
            <BrandModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                mode={modalMode}
                brandData={selectedBrand}
            />

            {/* 6. QUICK BRAND PROFILE PREVIEW DIALOG */}
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
                    <div className="relative">
                        {/* Banner Image */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                            <img
                                src={previewBrand.backgroundUrl}
                                alt={previewBrand.name}
                                className="w-full h-full object-cover opacity-65 filter blur-[1px] scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/50 to-transparent" />

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setPreviewBrand(null)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                            </button>

                            {/* Status Tag */}
                            <div className="absolute top-4 left-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/40 text-violet-300 border border-violet-500/40 text-xs font-bold backdrop-blur-md">
                                <StorefrontOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>Chuỗi rạp đối tác</span>
                            </div>
                        </div>

                        {/* Brand Details */}
                        <div className="p-6 space-y-4">
                            {/* Logo & Title Header */}
                            <div className="flex gap-4 -mt-14 relative z-10 items-end">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white p-2 border-2 border-white/20 shadow-2xl shrink-0 flex items-center justify-center">
                                    <img
                                        src={previewBrand.logoUrl}
                                        alt={previewBrand.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="min-w-0 flex-1 pb-1">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-lg font-black text-white leading-tight">
                                            {previewBrand.name}
                                        </h3>
                                        <VerifiedIcon sx={{ fontSize: 16 }} className="text-indigo-400 shrink-0" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-violet-600/30 text-violet-300 border border-violet-500/40">
                                            {Number(previewBrand.employeeCount || 0).toLocaleString("vi-VN")} nhân sự
                                        </span>
                                        <span className="text-xs text-zinc-400 font-semibold">
                                            ID: #{String(previewBrand.id).slice(-4)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashed Separator */}
                            <div className="border-b border-dashed border-zinc-700/80 my-3" />

                            {/* Description block */}
                            <div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">
                                    Tầm nhìn & Giới thiệu
                                </span>
                                <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                                    {previewBrand.description || "Chưa có thông tin mô tả chi tiết."}
                                </p>
                            </div>

                            {/* Dialog Actions */}
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
                                        handleEditClick(b);
                                    }}
                                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black shadow-md shadow-violet-500/20 flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <EditOutlinedIcon sx={{ fontSize: 15 }} />
                                    <span>Hiệu Chỉnh</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* 7. SAFE DELETE CONFIRMATION DIALOG */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "20px",
                            p: 1,
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        },
                    },
                }}
            >
                <div className="p-4 flex flex-col items-center text-center">
                    {/* Warning Icon Box */}
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-3">
                        <WarningAmberOutlinedIcon sx={{ fontSize: 32 }} />
                    </div>

                    <h3 className="text-base font-black text-slate-900 mb-1">
                        Xác nhận xóa thương hiệu?
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        Bạn có chắc chắn muốn xóa thương hiệu{" "}
                        <strong className="text-slate-800">"{brandToDelete?.name}"</strong>? Hành động này có thể ảnh hưởng đến các cụm rạp đang trực thuộc thương hiệu này.
                    </p>

                    <div className="flex items-center gap-2.5 w-full">
                        <button
                            type="button"
                            onClick={() => setOpenDeleteDialog(false)}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={handleConfirmDelete}
                            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <>
                                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                                    <span>Xác Nhận Xóa</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Dialog>
        </Box>
    );
}
