import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Dialog,
    Tooltip,
} from "@mui/material";
import { useDispatch } from "react-redux";

// Material Icons
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

// Components, Services & Mock
import StatCard from "../components/OverviewStats/StatCard.jsx";
import TableSkeleton from "../components/MovieManagement/TableSkeleton.jsx";
import FnBModal from "../components/CinemaManagement/FnBModal.jsx";
import {
    useGetAllFnBsQuery,
    useDeleteFnBMutation,
} from "../services/cinemaService.js";
import { useGetAllBrandsQuery } from "../services/brandService.js";
import { openSnackbar } from "../redux/slices/snackbarSlice.js";
import { FNB_AVAILABLE, FNB_CATEGORY } from "../constants/fnbConstants.js";
import { MOCK_ADMIN_FNBS } from "../mock/mockFnB.js";
import { MOCK_ADMIN_BRANDS } from "../mock/mockBrands.js";

export default function FnBManagementPage() {
    const dispatch = useDispatch();

    // 1. Data queries
    const {
        data: itemResponse,
        isLoading: isItemsLoading,
        refetch: refetchItems,
    } = useGetAllFnBsQuery();

    const {
        data: brandResponse,
        isLoading: isBrandsLoading,
    } = useGetAllBrandsQuery();

    // Delete Mutation
    const [deleteFnB, { isLoading: isDeleting }] = useDeleteFnBMutation();

    // Fallback data
    const items = useMemo(() => {
        const apiItems = itemResponse?.data;
        if (apiItems && apiItems.length > 0) return apiItems;
        return MOCK_ADMIN_FNBS;
    }, [itemResponse]);

    const brands = useMemo(() => {
        const apiBrands = brandResponse?.data;
        if (apiBrands && apiBrands.length > 0) return apiBrands;
        return MOCK_ADMIN_BRANDS;
    }, [brandResponse]);

    // 2. Local State
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // Filters & Sorting state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("ALL");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [sortBy, setSortBy] = useState("DEFAULT");

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedItem, setSelectedItem] = useState(null);

    // Quick View item
    const [previewItem, setPreviewItem] = useState(null);

    // Delete Confirmation state
    const [itemToDelete, setItemToDelete] = useState(null);

    // 3. Filtered & Sorted items calculation
    const filteredItems = useMemo(() => {
        let result = [...items];

        // Search by name or description
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (item) =>
                    item.name?.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query) ||
                    item.cinemaBrand?.name?.toLowerCase().includes(query)
            );
        }

        // Filter by Brand
        if (selectedBrand !== "ALL") {
            result = result.filter(
                (item) =>
                    item.cinemaBrand?.id === selectedBrand ||
                    item.brandId === selectedBrand
            );
        }

        // Filter by Category
        if (selectedCategory !== "ALL") {
            result = result.filter((item) => item.category === selectedCategory);
        }

        // Filter by Status (available)
        if (selectedStatus !== "ALL") {
            const isAvail = selectedStatus === "AVAILABLE";
            result = result.filter((item) => item.available === isAvail);
        }

        // Sorting
        switch (sortBy) {
            case "NAME_ASC":
                result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
                break;
            case "NAME_DESC":
                result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
                break;
            case "PRICE_ASC":
                result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
                break;
            case "PRICE_DESC":
                result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
                break;
            default:
                break;
        }

        return result;
    }, [items, searchQuery, selectedBrand, selectedCategory, selectedStatus, sortBy]);

    // 4. KPI Calculations
    const stats = useMemo(() => {
        const total = items.length;
        const combos = items.filter((i) => i.category === "COMBO").length;
        const available = items.filter((i) => i.available === true).length;
        const unavailable = items.filter((i) => i.available === false).length;

        return [
            {
                title: "Tổng Thực Đơn F&B",
                value: `${total} Món`,
                subtitle: "Combo, bắp rang & đồ uống",
                icon: <FastfoodOutlinedIcon sx={{ fontSize: 24, color: "white" }} />,
                bigIcon: <FastfoodOutlinedIcon sx={{ fontSize: 80, color: "white" }} />,
                bgColor: "primary.main",
            },
            {
                title: "Gói Combo Ưu Đãi",
                value: `${combos} Gói`,
                subtitle: "Combo đôi & nhóm tiết kiệm",
                icon: <LocalActivityOutlinedIcon sx={{ fontSize: 24, color: "white" }} />,
                bigIcon: <LocalActivityOutlinedIcon sx={{ fontSize: 80, color: "white" }} />,
                bgColor: "warning.main",
            },
            {
                title: "Đang Mở Bán",
                value: `${available} Món`,
                subtitle: "Sẵn sàng phục vụ tại quầy",
                icon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 24, color: "white" }} />,
                bigIcon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 80, color: "white" }} />,
                bgColor: "success.main",
            },
            {
                title: "Tạm Ngưng Phục Vụ",
                value: `${unavailable} Món`,
                subtitle: "Đang hết hàng hoặc tạm ẩn",
                icon: <HighlightOffOutlinedIcon sx={{ fontSize: 24, color: "white" }} />,
                bigIcon: <HighlightOffOutlinedIcon sx={{ fontSize: 80, color: "white" }} />,
                bgColor: "rose",
            },
        ];
    }, [items]);

    // 5. Handlers
    const handleAddClick = () => {
        setModalMode("add");
        setSelectedItem(null);
        setOpenModal(true);
    };

    const handleEditClick = (item) => {
        setModalMode("edit");
        setSelectedItem(item);
        setOpenModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        try {
            await deleteFnB(itemToDelete.id).unwrap();
            dispatch(openSnackbar({ message: "Xóa sản phẩm F&B thành công!", type: "success" }));
            setItemToDelete(null);
            refetchItems?.();
        } catch (err) {
            const msg = err?.data?.message || err?.message || "Không thể xóa sản phẩm F&B!";
            dispatch(openSnackbar({ message: msg, type: "error" }));
        }
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedBrand("ALL");
        setSelectedCategory("ALL");
        setSelectedStatus("ALL");
        setSortBy("DEFAULT");
    };

    const hasActiveFilters =
        searchQuery ||
        selectedBrand !== "ALL" ||
        selectedCategory !== "ALL" ||
        selectedStatus !== "ALL" ||
        sortBy !== "DEFAULT";

    // 6. DataGrid Columns Definition
    const columns = [
        {
            field: "name",
            headerName: "Sản phẩm / Món ăn",
            flex: 2,
            minWidth: 260,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div
                        className="flex items-center gap-3 h-full cursor-pointer"
                        onClick={() => setPreviewItem(row)}
                    >
                        {/* Thumbnail: compact 48x48 rounded-xl, no overflow */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs shrink-0 group">
                            <img
                                src={row.imageUrl}
                                alt={row.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=200";
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                            </div>
                        </div>

                        {/* Title Only - Removed category badge as requested */}
                        <div className="flex flex-col min-w-0 justify-center">
                            <span className="text-xs font-black text-slate-800 hover:text-violet-600 transition truncate leading-snug">
                                {row.name}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "cinemaBrand",
            headerName: "Chuỗi cụm rạp",
            width: 190,
            sortable: false,
            renderCell: (params) => {
                const brand = params.row.cinemaBrand;
                if (!brand) return <span className="text-xs text-slate-400 italic">Áp dụng chung</span>;
                return (
                    <div className="flex items-center gap-2 h-full">
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                            {brand.logoUrl ? (
                                <img
                                    src={brand.logoUrl}
                                    alt={brand.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100";
                                    }}
                                />
                            ) : (
                                <StorefrontOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                            )}
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[130px]">
                            {brand.name}
                        </span>
                    </div>
                );
            },
        },
        {
            field: "category",
            headerName: "Phân loại",
            width: 160,
            renderCell: (params) => {
                const catCfg = FNB_CATEGORY.find((c) => c.value === params.value) || {
                    label: params.value || "Khác",
                    icon: "🍿",
                    badgeBg: "bg-slate-50",
                    badgeText: "text-slate-700",
                    badgeBorder: "border-slate-200",
                };
                return (
                    <div className="flex items-center h-full">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border ${catCfg.badgeBg} ${catCfg.badgeText} ${catCfg.badgeBorder}`}>
                            <span>{catCfg.icon}</span>
                            <span>{catCfg.label}</span>
                        </span>
                    </div>
                );
            },
        },
        {
            field: "price",
            headerName: "Đơn giá",
            width: 140,
            headerAlign: "right",
            align: "right",
            renderCell: (params) => {
                const price = Number(params.value) || 0;
                return (
                    <div className="flex items-center justify-end h-full">
                        <span className="text-xs font-black text-violet-700 bg-violet-50/70 border border-violet-100 px-2.5 py-1 rounded-lg">
                            {price.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>
                );
            },
        },
        {
            field: "available",
            headerName: "Trạng thái",
            width: 150,
            renderCell: (params) => {
                const isAvail = Boolean(params.value);
                const availCfg = FNB_AVAILABLE.find((a) => a.value === isAvail) || FNB_AVAILABLE[0];
                return (
                    <div className="flex items-center h-full">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border ${availCfg.badgeBg} ${availCfg.badgeText} ${availCfg.badgeBorder}`}>
                            <span className={`w-2 h-2 rounded-full ${availCfg.dotColor} ${isAvail ? "animate-pulse" : ""}`} />
                            <span>{availCfg.label}</span>
                        </span>
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 160,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerAlign: "right",
            align: "right",
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center justify-end gap-1.5 h-full">
                        {/* Quick View Button */}
                        <Tooltip title="Xem chi tiết món" arrow>
                            <button
                                type="button"
                                onClick={() => setPreviewItem(row)}
                                className="w-8 h-8 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shadow-2xs cursor-pointer"
                            >
                                <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                            </button>
                        </Tooltip>

                        {/* Edit Button */}
                        <Tooltip title="Chỉnh sửa sản phẩm" arrow>
                            <button
                                type="button"
                                onClick={() => handleEditClick(row)}
                                className="w-8 h-8 rounded-xl border border-violet-200/80 bg-violet-50/50 hover:bg-violet-100/60 text-violet-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                            >
                                <EditOutlinedIcon sx={{ fontSize: 16 }} />
                            </button>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Xóa món ăn" arrow>
                            <button
                                type="button"
                                onClick={() => setItemToDelete(row)}
                                className="w-8 h-8 rounded-xl border border-rose-200/80 bg-rose-50/50 hover:bg-rose-100/60 text-rose-600 flex items-center justify-center transition shadow-2xs cursor-pointer"
                            >
                                <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <Box className="space-y-6 pb-12">
            {/* Modal Edit/Add */}
            <FnBModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                mode={modalMode}
                itemData={selectedItem}
            />

            {/* 1. PAGE HEADER (STANDARD PAGE HEADER BANNER) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <FastfoodOutlinedIcon className="text-violet-600" />
                        <span>Quản Lý Bắp Nước F&B</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Thiết lập combo bắp nước, kiểm soát đơn giá niêm yết và trạng thái phục vụ trên toàn bộ hệ thống chuỗi rạp
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            refetchItems();
                            dispatch(openSnackbar({ message: "Đang đồng bộ thực đơn bắp nước...", type: "info" }));
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
                        Thêm món / combo mới
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
                        loading={isItemsLoading}
                    />
                ))}
            </div>

            {/* 3. FILTER & SEARCH TOOLBAR (STRUCTURED 2-ROW TO PREVENT LAYOUT SHIFT) */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3.5 mb-5">
                {/* HÀNG 1: Category Quick Tabs (Trái) & Nút Đặt Lại + Count Badge (Phải) */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    {/* Category Tabs: 1-touch quick filtering */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory("ALL")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                selectedCategory === "ALL"
                                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                        >
                            <span>Tất cả</span>
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedCategory === "ALL"
                                        ? "bg-white/20 text-white"
                                        : "bg-slate-200 text-slate-600"
                                }`}
                            >
                                {items.length}
                            </span>
                        </button>

                        {FNB_CATEGORY.map((cat) => {
                            const count = items.filter((i) => i.category === cat.value).length;
                            const isSelected = selectedCategory === cat.value;
                            return (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                        isSelected
                                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                                >
                                    <span>{cat.icon} {cat.label}</span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                            isSelected
                                                ? "bg-white/20 text-white"
                                                : "bg-slate-200 text-slate-600"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right side of Row 1: Reset Filters & Count Badge */}
                    <div className="flex items-center gap-2.5">
                        {/* Reset Filters */}
                        {hasActiveFilters && (
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
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-600 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                                Hiển thị: {filteredItems.length}/{items.length} món
                            </span>
                        </div>
                    </div>
                </div>

                {/* HÀNG 2: Search Input + Brand Dropdown + Status Dropdown + Sort Dropdown */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Search input */}
                    <div className="relative flex-1 min-w-[240px] w-full">
                        <SearchOutlinedIcon
                            sx={{ fontSize: 18 }}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Tìm theo tên món, mô tả, chuỗi rạp..."
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

                    {/* Dropdowns on the right */}
                    <div className="w-full sm:w-auto flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                        {/* Brand Filter */}
                        <div className="relative min-w-[170px] flex-1 sm:flex-none">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <StorefrontOutlinedIcon sx={{ fontSize: 16 }} />
                            </div>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full pl-8.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                            >
                                <option value="ALL">Tất cả chuỗi rạp</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div className="relative min-w-[140px] flex-1 sm:flex-none">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="AVAILABLE">Đang mở bán</option>
                                <option value="UNAVAILABLE">Tạm ngưng</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative min-w-[170px] flex-1 sm:flex-none">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <FilterListOutlinedIcon sx={{ fontSize: 16 }} />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-8.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                            >
                                <option value="DEFAULT">Sắp xếp: Mặc định</option>
                                <option value="NAME_ASC">Tên món (A → Z)</option>
                                <option value="NAME_DESC">Tên món (Z → A)</option>
                                <option value="PRICE_DESC">Giá (Cao → Thấp)</option>
                                <option value="PRICE_ASC">Giá (Thấp → Cao)</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. DATAGRID TABLE */}
            <Box
                sx={{
                    width: "100%",
                    "& .MuiDataGrid-root": {
                        border: "1px solid #E2E8F0",
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#F8FAFC",
                        borderBottom: "1px solid #E2E8F0",
                        fontSize: "11px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#475569",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #F1F5F9",
                        fontSize: "12px",
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#F8FAFC",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid #E2E8F0",
                        backgroundColor: "#FAFAFA",
                    },
                }}
            >
                {isItemsLoading ? (
                    <TableSkeleton paginationModel={paginationModel} />
                ) : (
                    <DataGrid
                        rows={filteredItems}
                        columns={columns}
                        rowHeight={66}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20]}
                        disableRowSelectionOnClick
                        autoHeight
                    />
                )}
            </Box>

            {/* 5. QUICK PREVIEW MODAL (LIGHT THEME - ADMIN MODAL STANDARD) */}
            <Dialog
                open={Boolean(previewItem)}
                onClose={() => setPreviewItem(null)}
                maxWidth="md"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "24px",
                            overflow: "hidden",
                            background: "#ffffff",
                            boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
                            maxHeight: "92vh",
                            display: "flex",
                            flexDirection: "column",
                        },
                    },
                }}
            >
                {previewItem && (
                    <div className="flex flex-col flex-1 overflow-hidden">
                        {/* Top Gradient Stripe */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 shrink-0" />

                        {/* Modal Header */}
                        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 bg-violet-50 text-violet-600 border border-violet-100">
                                    <FastfoodOutlinedIcon sx={{ fontSize: 24 }} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                            Chi Tiết Thực Đơn F&B
                                        </h2>
                                        <span
                                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${
                                                previewItem.available
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                            }`}
                                        >
                                            {previewItem.available ? "Đang mở bán" : "Tạm ngưng"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        Hồ sơ chi tiết sản phẩm, đơn giá niêm yết và chuỗi rạp phục vụ
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setPreviewItem(null)}
                                className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-100/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
                                title="Đóng cửa sổ"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5 overflow-y-auto flex-1">
                            {/* Large Image Showcase */}
                            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs group">
                                <img
                                    src={previewItem.imageUrl}
                                    alt={previewItem.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=600";
                                    }}
                                />

                                {/* Brand badge top-left */}
                                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-xs">
                                    <StorefrontOutlinedIcon sx={{ fontSize: 15 }} className="text-violet-600" />
                                    <span>{previewItem.cinemaBrand?.name || "Áp dụng chung toàn hệ thống"}</span>
                                </div>

                                {/* Price badge bottom-right */}
                                <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-violet-600 text-white font-black text-sm shadow-md">
                                    {Number(previewItem.price || 0).toLocaleString("vi-VN")} ₫
                                </div>

                                {!previewItem.available && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                                        <span className="px-4 py-1.5 rounded-full bg-rose-500 text-white font-black text-xs tracking-wider uppercase shadow-md">
                                            Tạm Ngưng Phục Vụ
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Product Title */}
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    {previewItem.name}
                                </h3>
                            </div>

                            {/* 3 Info Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Phân loại */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                                        Phân Loại
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        {(() => {
                                            const catCfg = FNB_CATEGORY.find((c) => c.value === previewItem.category) || FNB_CATEGORY[0];
                                            return (
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold ${catCfg.badgeText}`}>
                                                    <span>{catCfg.icon}</span>
                                                    <span>{catCfg.label}</span>
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Đơn giá */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                                        Đơn Giá Niêm Yết
                                    </span>
                                    <span className="text-xs font-black text-violet-700 block">
                                        {Number(previewItem.price || 0).toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>

                                {/* Trạng thái */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                                        Trạng Thái
                                    </span>
                                    <span className={`text-xs font-bold flex items-center gap-1.5 ${
                                        previewItem.available ? "text-emerald-700" : "text-rose-700"
                                    }`}>
                                        <span className={`w-2 h-2 rounded-full ${
                                            previewItem.available ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                                        }`} />
                                        <span>{previewItem.available ? "Đang mở bán" : "Tạm ngưng"}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-slate-700">
                                    <DescriptionOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                    <span className="text-xs font-black uppercase tracking-wider">
                                        Mô Tả & Thành Phần Thực Đơn
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    {previewItem.description || "Không có mô tả chi tiết cho sản phẩm này."}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
                            <span className="text-xs text-slate-400 font-medium">
                                Mã sản phẩm: {previewItem.id}
                            </span>

                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setPreviewItem(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const it = previewItem;
                                        setPreviewItem(null);
                                        handleEditClick(it);
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-violet-500/25 flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <EditOutlinedIcon sx={{ fontSize: 15 }} />
                                    <span>Chỉnh Sửa Món Này</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* 6. DELETE CONFIRMATION MODAL */}
            <Dialog
                open={Boolean(itemToDelete)}
                onClose={() => setItemToDelete(null)}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "24px",
                            overflow: "hidden",
                            background: "#ffffff",
                            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
                        },
                    },
                }}
            >
                {itemToDelete && (
                    <div className="p-6 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                            <WarningAmberOutlinedIcon sx={{ fontSize: 28 }} />
                        </div>

                        <div className="text-center space-y-1">
                            <h3 className="text-base font-black text-slate-900">
                                Xác Nhận Xóa Sản Phẩm?
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Bạn có chắc chắn muốn xóa món{" "}
                                <span className="font-bold text-slate-800">
                                    "{itemToDelete.name}"
                                </span>{" "}
                                khỏi danh mục? Thao tác này không thể hoàn tác.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setItemToDelete(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDeleteConfirm}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-500/20 transition cursor-pointer disabled:opacity-50"
                            >
                                {isDeleting ? "Đang xóa..." : "Xác Nhận Xóa"}
                            </button>
                        </div>
                    </div>
                )}
            </Dialog>
        </Box>
    );
}
