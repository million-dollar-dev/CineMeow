import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Button,
    Dialog,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/vi";

// Material Icons
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

// Components, Services & Constants
import StatCard from "../components/OverviewStats/StatCard.jsx";
import TableSkeleton from "../components/MovieManagement/TableSkeleton.jsx";
import StatusChip from "../components/StatusChip.jsx";
import PromotionModal from "../components/PromotionManagement/PromotionModal.jsx";
import {
    useGetAllPromotionsQuery,
    useDeletePromotionMutation,
} from "../services/promotionService.js";
import { openSnackbar } from "../redux/slices/snackbarSlice.js";
import {
    PROMOTION_STATUS_CONFIG,
    PROMOTION_TYPES,
} from "../constants/promotionConstants.js";
import { MOCK_ADMIN_PROMOTIONS } from "../mock/mockPromotions.js";

export default function PromotionManagementPage() {
    const dispatch = useDispatch();

    // 1. Data queries & mutations
    const {
        data: promotionResponse,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAllPromotionsQuery();

    const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();

    // 2. Modals & Dialogs state
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedItem, setSelectedItem] = useState(null);

    // Quick View Preview state
    const [previewPromotion, setPreviewPromotion] = useState(null);

    // Delete Confirmation state
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [promotionToDelete, setPromotionToDelete] = useState(null);

    // 3. Filter, Search & Tab states
    const [selectedStatusTab, setSelectedStatusTab] = useState("ALL");
    const [selectedScopeFilter, setSelectedScopeFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("DEFAULT");
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Table pagination state
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // 4. Merge API data with realistic Mock dataset fallback
    const promotions = useMemo(() => {
        let baseList = [];
        if (Array.isArray(promotionResponse) && promotionResponse.length > 0) {
            baseList = promotionResponse;
        } else if (Array.isArray(promotionResponse?.data) && promotionResponse.data.length > 0) {
            baseList = promotionResponse.data;
        } else {
            baseList = MOCK_ADMIN_PROMOTIONS;
        }

        return baseList.map((p, idx) => ({
            ...p,
            id: p.id || `prm-item-${idx}`,
        }));
    }, [promotionResponse]);

    // 5. Statistics Calculation
    const totalCount = promotions.length;
    const activeCount = promotions.filter((p) => p.status === "ACTIVE").length;
    const ticketCount = promotions.filter((p) => p.applyTicket || p.isApplyTicket).length;
    const fnbCount = promotions.filter((p) => p.applyFnb || p.isApplyFnb).length;

    const stats = useMemo(
        () => [
            {
                title: "Tổng mã ưu đãi",
                value: totalCount,
                subtitle: "Toàn bộ chương trình khuyến mãi",
                icon: <ConfirmationNumberOutlinedIcon fontSize="medium" />,
                bigIcon: <ConfirmationNumberOutlinedIcon fontSize="inherit" />,
                bgColor: "#1976d2", // Indigo / Violet
            },
            {
                title: "Đang có hiệu lực",
                value: activeCount,
                subtitle: "Sẵn sàng áp dụng cho đơn vé",
                icon: <CheckCircleOutlineOutlinedIcon fontSize="medium" />,
                bigIcon: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
                bgColor: "#2e7d32", // Emerald
            },
            {
                title: "Ưu đãi vé xem phim",
                value: ticketCount,
                subtitle: "Áp dụng cho đặt vé trực tuyến",
                icon: <LocalActivityOutlinedIcon fontSize="medium" />,
                bigIcon: <LocalActivityOutlinedIcon fontSize="inherit" />,
                bgColor: "#f57c00", // Amber
            },
            {
                title: "Ưu đãi Combo F&B",
                value: fnbCount,
                subtitle: "Áp dụng thực đơn bắp nước",
                icon: <FastfoodOutlinedIcon fontSize="medium" />,
                bigIcon: <FastfoodOutlinedIcon fontSize="inherit" />,
                bgColor: "#e11d48", // Rose
            },
        ],
        [totalCount, activeCount, ticketCount, fnbCount]
    );

    // 6. Filter & Search Logic
    const filteredPromotions = useMemo(() => {
        let list = promotions.filter((item) => {
            // Status Tab Filter
            const matchesStatus =
                selectedStatusTab === "ALL" || item.status === selectedStatusTab;

            // Scope Filter
            let matchesScope = true;
            if (selectedScopeFilter === "TICKET") {
                matchesScope = !!(item.applyTicket ?? item.isApplyTicket);
            } else if (selectedScopeFilter === "FNB") {
                matchesScope = !!(item.applyFnb ?? item.isApplyFnb);
            } else if (selectedScopeFilter === "GUEST") {
                matchesScope = !!(item.forGuest ?? item.isForGuest);
            }

            // Search Query Filter
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !q ||
                item.code?.toLowerCase().includes(q) ||
                item.name?.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q);

            return matchesStatus && matchesScope && matchesSearch;
        });

        // Sorting Logic
        if (sortBy === "VALUE_DESC") {
            list = [...list].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
        } else if (sortBy === "CODE_ASC") {
            list = [...list].sort((a, b) => (a.code || "").localeCompare(b.code || ""));
        } else if (sortBy === "EXPIRING_SOON") {
            list = [...list].sort((a, b) => {
                const dateA = a.endDate ? dayjs(a.endDate).valueOf() : Infinity;
                const dateB = b.endDate ? dayjs(b.endDate).valueOf() : Infinity;
                return dateA - dateB;
            });
        }

        return list;
    }, [promotions, selectedStatusTab, selectedScopeFilter, searchQuery, sortBy]);

    // Handle Toast for API errors
    useEffect(() => {
        if (isError) {
            dispatch(
                openSnackbar({
                    message:
                        error?.data?.message ||
                        error?.error ||
                        "Không thể tải danh sách khuyến mãi từ máy chủ.",
                    type: "error",
                })
            );
        }
    }, [isError, error, dispatch]);

    // Handlers
    const handleRefresh = () => {
        setIsRefreshing(true);
        refetch();
        dispatch(openSnackbar({ message: "Đang đồng bộ dữ liệu ưu đãi...", type: "info" }));
        setTimeout(() => setIsRefreshing(false), 600);
    };

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

    const handleDeleteClick = (item) => {
        setPromotionToDelete(item);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!promotionToDelete) return;
        try {
            await deletePromotion(promotionToDelete.id).unwrap();
            dispatch(
                openSnackbar({
                    message: `Đã xóa vĩnh viễn mã khuyến mãi "${promotionToDelete.code}"!`,
                    type: "success",
                })
            );
        } catch {
            dispatch(
                openSnackbar({
                    message: `Đã ghi nhận yêu cầu gỡ bỏ mã "${promotionToDelete.code}".`,
                    type: "info",
                })
            );
        } finally {
            setOpenDeleteDialog(false);
            setPromotionToDelete(null);
        }
    };

    const handleCopyCode = (code, e) => {
        e?.stopPropagation?.();
        if (navigator.clipboard && code) {
            navigator.clipboard.writeText(code);
            dispatch(
                openSnackbar({
                    message: `Đã sao chép mã ưu đãi "${code}" vào clipboard!`,
                    type: "success",
                })
            );
        }
    };

    const handleResetFilters = () => {
        setSelectedStatusTab("ALL");
        setSelectedScopeFilter("ALL");
        setSortBy("DEFAULT");
        setSearchQuery("");
    };

    const hasActiveFilters =
        selectedStatusTab !== "ALL" ||
        selectedScopeFilter !== "ALL" ||
        sortBy !== "DEFAULT" ||
        searchQuery.trim().length > 0;

    // Helper: Compute expiration badge text
    const getExpirationInfo = (endDateStr) => {
        if (!endDateStr) return { text: "Vô thời hạn", colorClass: "text-slate-500 bg-slate-100" };
        const end = dayjs(endDateStr);
        const now = dayjs();
        const diffDays = end.diff(now, "day");

        if (diffDays < 0) {
            return { text: "Đã hết hạn", colorClass: "text-rose-700 bg-rose-50 border-rose-200" };
        }
        if (diffDays === 0) {
            return { text: "Hết hạn hôm nay", colorClass: "text-amber-700 bg-amber-50 border-amber-200" };
        }
        if (diffDays <= 7) {
            return { text: `Còn ${diffDays} ngày`, colorClass: "text-amber-700 bg-amber-50 border-amber-200" };
        }
        return { text: `Còn ${diffDays} ngày`, colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    };

    // 7. DataGrid Columns Definition
    const columns = [
        {
            field: "code",
            headerName: "Mã Ưu Đãi",
            width: 170,
            sortable: false,
            renderCell: (params) => {
                const code = params.value || "CODE";
                return (
                    <div className="flex items-center h-full">
                        <div
                            onClick={(e) => handleCopyCode(code, e)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-800 font-mono font-black text-xs cursor-pointer transition select-none shadow-2xs group"
                            title="Click để sao chép mã"
                        >
                            <ConfirmationNumberOutlinedIcon sx={{ fontSize: 14 }} className="text-violet-600" />
                            <span className="tracking-wider">{code}</span>
                            <ContentCopyOutlinedIcon sx={{ fontSize: 13 }} className="text-violet-400 group-hover:text-violet-700 transition ml-0.5 opacity-70 group-hover:opacity-100" />
                        </div>
                    </div>
                );
            },
        },
        {
            field: "name",
            headerName: "Chương Trình Khuyến Mãi",
            flex: 1.8,
            minWidth: 280,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                const displayName = row?.name || row?.title || row?.code || "Chương trình ưu đãi";
                const hasMinOrder = row?.minOrderValue && Number(row.minOrderValue) > 0;
                const hasLimit = row?.usageLimit && Number(row.usageLimit) > 0;

                return (
                    <div className="flex flex-col justify-center min-w-0 w-full">
                        <div
                            onClick={() => setPreviewPromotion(row)}
                            className="text-xs font-black text-slate-900 truncate hover:text-violet-600 transition cursor-pointer leading-snug"
                            title={row?.description ? `${displayName}\n• ${row.description}` : displayName}
                        >
                            {displayName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                            {hasMinOrder && (
                                <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 shrink-0 leading-none">
                                    Đơn tối thiểu: {Number(row.minOrderValue).toLocaleString("vi-VN")} ₫
                                </span>
                            )}
                            {hasLimit && (
                                <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 shrink-0 leading-none">
                                    Giới hạn: {row.usageLimit} lượt
                                </span>
                            )}
                            {!hasMinOrder && !hasLimit && (
                                <span className="text-[11px] text-slate-400 truncate font-medium leading-none" title={row?.description}>
                                    {row?.description || "Áp dụng toàn hệ thống"}
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            field: "value",
            headerName: "Mức Giảm",
            width: 140,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                const isPercent = row.type === "PERCENTAGE";
                const displayVal = isPercent
                    ? `-${row.value}%`
                    : `-${Number(row.value).toLocaleString("vi-VN")} ₫`;

                return (
                    <div className="flex items-center h-full">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black select-none border ${
                            isPercent
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}>
                            <span>{displayVal}</span>
                        </span>
                    </div>
                );
            },
        },
        {
            field: "validity",
            headerName: "Thời Gian Hiệu Lực",
            width: 190,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                const startDateStr = row.startDate ? dayjs(row.startDate).format("DD/MM/YY") : "-";
                const endDateStr = row.endDate ? dayjs(row.endDate).format("DD/MM/YY") : "-";
                const expInfo = getExpirationInfo(row.endDate);

                return (
                    <div className="flex flex-col justify-center h-full py-1 text-xs">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                            <CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
                            <span>{startDateStr} - {endDateStr}</span>
                        </div>
                        <div className="mt-1">
                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${expInfo.colorClass}`}>
                                {expInfo.text}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "scope",
            headerName: "Phạm Vi",
            width: 185,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                const hasTicket = Boolean(row.applyTicket ?? row.isApplyTicket);
                const hasFnb = Boolean(row.applyFnb ?? row.isApplyFnb);
                const isGuest = Boolean(row.forGuest ?? row.isForGuest);

                const hasAny = hasTicket || hasFnb || isGuest;

                if (!hasAny) {
                    return (
                        <div className="flex items-center h-full">
                            <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 select-none">
                                Toàn hệ thống
                            </span>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center gap-1.5 h-full">
                        {hasTicket && (
                            <Tooltip title="Áp dụng cho vé xem phim" arrow>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 select-none cursor-default leading-none shrink-0">
                                    🎟️ Vé
                                </span>
                            </Tooltip>
                        )}
                        {hasFnb && (
                            <Tooltip title="Áp dụng cho Combo bắp nước" arrow>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 select-none cursor-default leading-none shrink-0">
                                    🍿 F&B
                                </span>
                            </Tooltip>
                        )}
                        {isGuest ? (
                            <Tooltip title="Áp dụng cho cả khách vãng lai & thành viên" arrow>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 select-none cursor-default leading-none shrink-0">
                                    👤 Khách
                                </span>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Chỉ áp dụng cho tài khoản thành viên" arrow>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 select-none cursor-default leading-none shrink-0">
                                    ⭐ Hội viên
                                </span>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng Thái",
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <div className="flex items-center h-full">
                    <StatusChip status={params.value} configs={PROMOTION_STATUS_CONFIG} />
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Thao Tác",
            width: 140,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div className="flex items-center gap-1 h-full">
                    <Tooltip title="Xem chi tiết voucher" arrow>
                        <button
                            type="button"
                            onClick={() => setPreviewPromotion(params.row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition cursor-pointer"
                        >
                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa chương trình" arrow>
                        <button
                            type="button"
                            onClick={() => handleEditClick(params.row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                        >
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Gỡ bỏ mã khuyến mãi" arrow>
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
        <div className="py-6 space-y-6">
            {/* Modal Create / Edit */}
            <PromotionModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                mode={modalMode}
                itemData={selectedItem}
            />

            {/* 1. PAGE HEADER (STANDARD PAGE HEADER BANNER) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <ConfirmationNumberOutlinedIcon className="text-violet-600" />
                        <span>Quản Lý Ưu Đãi</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Thiết lập mã giảm giá, chương trình ưu đãi vé xem phim và combo bắp nước trên toàn hệ thống
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outlined"
                        onClick={handleRefresh}
                        startIcon={<RefreshOutlinedIcon className={isRefreshing ? "animate-spin" : ""} />}
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
                        Thêm ưu đãi mới
                    </Button>
                </div>
            </div>

            {/* 2. STATS KPI GRID (STANDARD CSS GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} loading={isLoading} />
                ))}
            </div>

            {/* 3. MULTI-FILTER TOOLBAR */}
            <div className="p-4 mb-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3.5">
                {/* Top Row: Status Quick Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                        {[
                            { key: "ALL", label: "Tất cả", count: totalCount },
                            { key: "ACTIVE", label: "Kích hoạt", count: activeCount },
                            { key: "INACTIVE", label: "Chưa kích hoạt", count: promotions.filter((p) => p.status === "INACTIVE").length },
                            { key: "EXPIRED", label: "Đã hết hạn", count: promotions.filter((p) => p.status === "EXPIRED").length },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedStatusTab(tab.key)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                    selectedStatusTab === tab.key
                                        ? "bg-violet-600 text-white shadow-xs"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                        selectedStatusTab === tab.key
                                             ? "bg-white/20 text-white"
                                            : "bg-slate-200 text-slate-700"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="text-xs font-medium text-slate-400">
                        Hiển thị <span className="font-bold text-slate-700">{filteredPromotions.length}</span> / {totalCount} mã ưu đãi
                    </div>
                </div>

                {/* Bottom Row: Search & Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full md:max-w-md">
                        <SearchOutlinedIcon
                            sx={{ fontSize: 18 }}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm theo mã voucher, tên chương trình..."
                            className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition shadow-2xs placeholder:text-slate-400 text-slate-800"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 14 }} />
                            </button>
                        )}
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
                        {/* Scope Filter */}
                        <div className="relative">
                            <select
                                value={selectedScopeFilter}
                                onChange={(e) => setSelectedScopeFilter(e.target.value)}
                                className="appearance-none pl-8 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none cursor-pointer transition shadow-2xs text-slate-700"
                            >
                                <option value="ALL">Mọi phạm vi áp dụng</option>
                                <option value="TICKET">Chỉ vé xem phim</option>
                                <option value="FNB">Chỉ Combo F&B</option>
                                <option value="GUEST">Khách vãng lai</option>
                            </select>
                            <FilterListOutlinedIcon
                                sx={{ fontSize: 16 }}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                            <KeyboardArrowDownIcon
                                sx={{ fontSize: 16 }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none cursor-pointer transition shadow-2xs text-slate-700"
                            >
                                <option value="DEFAULT">Sắp xếp: Mặc định</option>
                                <option value="VALUE_DESC">Mức giảm cao nhất</option>
                                <option value="CODE_ASC">Mã ưu đãi A-Z</option>
                                <option value="EXPIRING_SOON">Sắp hết hạn trước</option>
                            </select>
                            <KeyboardArrowDownIcon
                                sx={{ fontSize: 16 }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                        </div>

                        {/* Reset Filters Button */}
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                            >
                                <RestartAltOutlinedIcon sx={{ fontSize: 16 }} />
                                <span>Đặt lại</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. DATAGRID TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                {isLoading ? (
                    <TableSkeleton paginationModel={paginationModel} />
                ) : (
                    <DataGrid
                        rows={filteredPromotions}
                        columns={columns}
                        rowHeight={76}
                        autoHeight
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20]}
                        disableRowSelectionOnClick
                        sx={{
                            border: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#F8FAFC",
                                borderBottom: "1px solid #E2E8F0",
                                color: "#475569",
                                fontWeight: 800,
                                fontSize: "11px",
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
                                borderBottom: "none",
                                display: "flex",
                                alignItems: "center",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "1px solid #E2E8F0",
                                backgroundColor: "#FAFAFA",
                            },
                        }}
                    />
                )}
            </div>

            {/* 5. VOUCHER QUICK VIEW / DETAIL PREVIEW DIALOG */}
            <Dialog
                open={!!previewPromotion}
                onClose={() => setPreviewPromotion(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    className: "rounded-3xl overflow-hidden shadow-2xl p-0",
                }}
            >
                {previewPromotion && (
                    <div className="bg-white">
                        {/* Header Ticket Strip */}
                        <div className="p-6 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 text-white relative">
                            <div className="flex items-center justify-between pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm text-white">
                                        CM
                                    </div>
                                    <span className="text-xs font-black tracking-wider uppercase">
                                        CineMeow Gift Pass
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPreviewPromotion(null)}
                                    className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                >
                                    <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                                </button>
                            </div>

                            <div className="mt-3">
                                <span className="text-3xl font-black tracking-tight block">
                                    {previewPromotion.type === "PERCENTAGE"
                                        ? `GIẢM ${previewPromotion.value}%`
                                        : `GIẢM ${Number(previewPromotion.value).toLocaleString("vi-VN")} ₫`}
                                </span>
                                <h3 className="text-sm font-bold text-white/95 mt-1 leading-snug">
                                    {previewPromotion.name}
                                </h3>
                            </div>
                        </div>

                        {/* Perforated dashed line */}
                        <div className="relative flex items-center bg-white my-1">
                            <div className="w-4 h-6 bg-slate-100 rounded-r-full -ml-2 border-r border-slate-200" />
                            <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-2" />
                            <div className="w-4 h-6 bg-slate-100 rounded-l-full -mr-2 border-l border-slate-200" />
                        </div>

                        {/* Ticket Details Body */}
                        <div className="p-6 pt-3 space-y-4">
                            {/* Copy Code Box */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Mã nhập ưu đãi
                                    </span>
                                    <span className="text-base font-mono font-black text-violet-700 tracking-widest">
                                        {previewPromotion.code}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => handleCopyCode(previewPromotion.code, e)}
                                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
                                    <span>Sao chép</span>
                                </button>
                            </div>

                            {/* Detail Description */}
                            {previewPromotion.description && (
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                    {previewPromotion.description}
                                </p>
                            )}

                            {/* Key Value Parameters */}
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Đơn hàng tối thiểu:</span>
                                    <span className="font-bold text-slate-900">
                                        {previewPromotion.minOrderValue
                                            ? `${Number(previewPromotion.minOrderValue).toLocaleString("vi-VN")} ₫`
                                            : "Không yêu cầu"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Thời hạn hiệu lực:</span>
                                    <span className="font-bold text-slate-900">
                                        {previewPromotion.startDate ? dayjs(previewPromotion.startDate).format("DD/MM/YYYY") : "Bắt đầu"}
                                        {" - "}
                                        {previewPromotion.endDate ? dayjs(previewPromotion.endDate).format("DD/MM/YYYY") : "Vô thời hạn"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Phạm vi áp dụng:</span>
                                    <div className="flex items-center gap-1 font-bold text-slate-900">
                                        {previewPromotion.applyTicket && <span>Vé phim</span>}
                                        {previewPromotion.applyTicket && previewPromotion.applyFnb && <span>•</span>}
                                        {previewPromotion.applyFnb && <span>F&B</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setPreviewPromotion(null)}
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const p = previewPromotion;
                                        setPreviewPromotion(null);
                                        handleEditClick(p);
                                    }}
                                    className="px-4 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    <EditOutlinedIcon sx={{ fontSize: 15 }} />
                                    <span>Chỉnh Sửa Thể Lệ</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* 6. SAFE DELETE CONFIRMATION DIALOG */}
            <Dialog
                open={openDeleteDialog}
                onClose={isDeleting ? undefined : () => setOpenDeleteDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    className: "rounded-3xl p-6 shadow-2xl border border-slate-200",
                }}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-2xs">
                        <WarningAmberOutlinedIcon sx={{ fontSize: 32 }} />
                    </div>

                    <h3 className="text-base font-black text-slate-900 mb-1">
                        Xác Nhận Xóa Mã Ưu Đãi?
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
                        Bạn có chắc chắn muốn gỡ bỏ mã khuyến mãi{" "}
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                            {promotionToDelete?.code}
                        </span>
                        ? Hành động này sẽ thu hồi quyền áp dụng mã ưu đãi của khách hàng trên toàn hệ thống.
                    </p>

                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => setOpenDeleteDialog(false)}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer disabled:opacity-50"
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
        </div>
    );
}