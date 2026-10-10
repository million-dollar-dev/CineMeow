import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Pagination,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

// Redux
import { openSnackbar } from "../redux/slices/snackbarSlice.js";

// Constants & Mock
import {
    NOTIFICATION_STORAGE_KEY,
    NOTIFICATION_CATEGORIES,
    NOTIFICATION_PRIORITIES,
} from "../constants/notificationConstants.js";
import { MOCK_NOTIFICATIONS } from "../mock/mockNotifications.js";
import { CINEMA_BRANCH_OPTIONS } from "../constants/accountConstants.js";

// Components
import StatCard from "../components/OverviewStats/StatCard.jsx";
import NotificationDetailModal from "../components/NotificationManagement/NotificationDetailModal.jsx";

// Icons
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

export default function NotificationManagementPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Notifications State with LocalStorage Persistence
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error("Failed to load notifications from storage:", e);
        }
        return MOCK_NOTIFICATIONS;
    });

    useEffect(() => {
        try {
            localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
        } catch (e) {
            console.error("Failed to persist notifications:", e);
        }
    }, [notifications]);

    // 2. Modals state
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Delete single confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);

    // Delete all read confirmation dialog
    const [clearReadDialogOpen, setClearReadDialogOpen] = useState(false);

    // 3. Selection state for batch actions
    const [selectedIds, setSelectedIds] = useState([]);

    // 4. Search & Filter states
    const [categoryTab, setCategoryTab] = useState("ALL"); // "ALL" | "UNREAD" | "BOOKING" | "SHOWTIME" | ...
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [branchFilter, setBranchFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST"); // "NEWEST" | "OLDEST" | "PRIORITY"

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    // 5. Statistics Calculation
    const totalCount = notifications.length;
    const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);
    const criticalCount = useMemo(
        () => notifications.filter((n) => n.priority === "CRITICAL" || n.priority === "HIGH").length,
        [notifications]
    );
    const todayCount = useMemo(() => {
        const todayStr = dayjs().format("YYYY-MM-DD");
        return notifications.filter((n) => dayjs(n.createdAt).format("YYYY-MM-DD") === todayStr).length;
    }, [notifications]);

    const stats = useMemo(
        () => [
            {
                title: "Tổng thông báo",
                value: `${totalCount} Tin nhắn`,
                subtitle: "Nhật ký vận hành rạp chiếu",
                icon: <NotificationsNoneOutlinedIcon fontSize="medium" />,
                bigIcon: <NotificationsNoneOutlinedIcon fontSize="inherit" />,
                bgColor: "#7C3AED", // Violet
            },
            {
                title: "Thông báo chưa đọc",
                value: `${unreadCount} Chưa đọc`,
                subtitle: "Cần phản hồi hoặc xem xét",
                icon: <NotificationsActiveOutlinedIcon fontSize="medium" />,
                bigIcon: <NotificationsActiveOutlinedIcon fontSize="inherit" />,
                bgColor: "#E11D48", // Rose / Red
            },
            {
                title: "Cảnh báo khẩn & quan trọng",
                value: `${criticalCount} Cảnh báo`,
                subtitle: "Ưu tiên xử lý ngay trong ca trực",
                icon: <ErrorOutlineOutlinedIcon fontSize="medium" />,
                bigIcon: <ErrorOutlineOutlinedIcon fontSize="inherit" />,
                bgColor: "#D97706", // Amber
            },
            {
                title: "Nhận trong hôm nay",
                value: `${todayCount} Thông báo`,
                subtitle: `Ngày ${dayjs().format("DD/MM/YYYY")}`,
                icon: <AccessTimeOutlinedIcon fontSize="medium" />,
                bigIcon: <AccessTimeOutlinedIcon fontSize="inherit" />,
                bgColor: "#0284C7", // Sky
            },
        ],
        [totalCount, unreadCount, criticalCount, todayCount]
    );

    // 6. Filter & Sort Logic
    const filteredNotifications = useMemo(() => {
        let list = notifications.filter((item) => {
            // Category Tab Filter
            if (categoryTab === "UNREAD" && !item.unread) return false;
            if (categoryTab !== "ALL" && categoryTab !== "UNREAD" && item.category !== categoryTab) return false;

            // Search Query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchTitle = item.title?.toLowerCase().includes(q);
                const matchDesc = item.desc?.toLowerCase().includes(q);
                const matchId = item.id?.toLowerCase().includes(q);
                const matchBranch = item.branch?.toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchId && !matchBranch) return false;
            }

            // Priority Filter
            if (priorityFilter !== "ALL" && item.priority !== priorityFilter) return false;

            // Branch Filter
            if (branchFilter !== "ALL" && !item.branch?.includes(branchFilter)) return false;

            return true;
        });

        // Sorting
        if (sortBy === "NEWEST") {
            list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === "OLDEST") {
            list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === "PRIORITY") {
            const priorityWeight = { CRITICAL: 4, HIGH: 3, NORMAL: 2, SUCCESS: 1 };
            list = [...list].sort(
                (a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
            );
        }

        return list;
    }, [notifications, categoryTab, searchQuery, priorityFilter, branchFilter, sortBy]);

    // Paginated subset
    const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
    const paginatedNotifications = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredNotifications.slice(start, start + pageSize);
    }, [filteredNotifications, currentPage]);

    const isFiltered =
        categoryTab !== "ALL" ||
        searchQuery.trim() !== "" ||
        priorityFilter !== "ALL" ||
        branchFilter !== "ALL" ||
        sortBy !== "NEWEST";

    const handleResetFilters = () => {
        setCategoryTab("ALL");
        setSearchQuery("");
        setPriorityFilter("ALL");
        setBranchFilter("ALL");
        setSortBy("NEWEST");
        setCurrentPage(1);
    };

    // 7. Actions Handlers
    const handleViewDetail = (item) => {
        // Mark as read when opened
        if (item.unread) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
            );
        }
        setSelectedNotification(item);
        setDetailModalOpen(true);
    };

    const handleToggleRead = (item) => {
        const nextUnread = !item.unread;
        setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, unread: nextUnread } : n))
        );
        dispatch(
            openSnackbar({
                message: nextUnread ? "Đã đánh dấu là chưa đọc" : "Đã đánh dấu là đã đọc",
                type: "info",
            })
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        dispatch(
            openSnackbar({
                message: "Đã đánh dấu tất cả thông báo là đã đọc!",
                type: "success",
            })
        );
    };

    const handleDeleteSingle = (item) => {
        setNotificationToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDeleteSingle = () => {
        if (!notificationToDelete) return;
        setNotifications((prev) => prev.filter((n) => n.id !== notificationToDelete.id));
        setSelectedIds((prev) => prev.filter((id) => id !== notificationToDelete.id));
        dispatch(
            openSnackbar({
                message: `Đã xóa thông báo #${notificationToDelete.id}!`,
                type: "success",
            })
        );
        setDeleteDialogOpen(false);
        setNotificationToDelete(null);
    };

    const handleClearAllRead = () => {
        const unreadOnly = notifications.filter((n) => n.unread);
        const removedCount = notifications.length - unreadOnly.length;
        if (removedCount === 0) {
            dispatch(
                openSnackbar({
                    message: "Không có thông báo đã đọc nào để xóa!",
                    type: "info",
                })
            );
            return;
        }
        setNotifications(unreadOnly);
        setSelectedIds([]);
        setClearReadDialogOpen(false);
        dispatch(
            openSnackbar({
                message: `Đã dọn dẹp ${removedCount} thông báo đã đọc thành công!`,
                type: "success",
            })
        );
    };

    // Batch Actions
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(paginatedNotifications.map((n) => n.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleToggleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleBatchMarkAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => (selectedIds.includes(n.id) ? { ...n, unread: false } : n))
        );
        dispatch(
            openSnackbar({
                message: `Đã đánh dấu ${selectedIds.length} thông báo là đã đọc!`,
                type: "success",
            })
        );
        setSelectedIds([]);
    };

    const handleBatchDelete = () => {
        setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
        dispatch(
            openSnackbar({
                message: `Đã xóa ${selectedIds.length} thông báo đã chọn!`,
                type: "success",
            })
        );
        setSelectedIds([]);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        dispatch(
            openSnackbar({
                message: "Đang kiểm tra và đồng bộ thông báo mới từ hệ thống...",
                type: "info",
            })
        );
        setTimeout(() => setIsRefreshing(false), 600);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "BOOKING":
                return <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18 }} />;
            case "SHOWTIME":
                return <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />;
            case "INVENTORY":
                return <FastfoodOutlinedIcon sx={{ fontSize: 18 }} />;
            case "REVENUE":
                return <TrendingUpOutlinedIcon sx={{ fontSize: 18 }} />;
            case "PROMOTION":
                return <LoyaltyOutlinedIcon sx={{ fontSize: 18 }} />;
            default:
                return <SettingsOutlinedIcon sx={{ fontSize: 18 }} />;
        }
    };

    return (
        <div className="py-6 space-y-6">
            {/* 1. PAGE HEADER (STANDARD PAGE HEADER BANNER) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <NotificationsActiveOutlinedIcon className="text-violet-600" />
                        <span>Thông Báo Hệ Thống & Vận Hành</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Cập nhật tức thời các đơn vé mới, biến động suất chiếu, cảnh báo kho bắp nước và báo cáo tài chính
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
                        variant="outlined"
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                        startIcon={<DoneAllOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#E2E8F0",
                            color: "#475569",
                            "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                            "&:disabled": {
                                color: "#94A3B8",
                                borderColor: "#E2E8F0",
                            },
                        }}
                    >
                        Đã đọc tất cả
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => setClearReadDialogOpen(true)}
                        startIcon={<DeleteSweepOutlinedIcon />}
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
                        Dọn dẹp đã đọc
                    </Button>
                </div>
            </div>

            {/* 2. OVERVIEW STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                        bigIcon={stat.bigIcon}
                        bgColor={stat.bgColor}
                    />
                ))}
            </div>

            {/* 3. MULTI-FILTER TOOLBAR (2-ROW DESIGN) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
                {/* Row 1: Category Quick Tabs */}
                <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
                    <div className="flex items-center gap-1.5 shrink-0">
                        {[
                            { id: "ALL", label: "Tất cả", count: totalCount },
                            { id: "UNREAD", label: "Chưa đọc", count: unreadCount },
                            { id: "BOOKING", label: "Vé & Đơn", count: notifications.filter((n) => n.category === "BOOKING").length },
                            { id: "SHOWTIME", label: "Suất chiếu", count: notifications.filter((n) => n.category === "SHOWTIME").length },
                            { id: "INVENTORY", label: "Kho F&B", count: notifications.filter((n) => n.category === "INVENTORY").length },
                            { id: "REVENUE", label: "Doanh thu", count: notifications.filter((n) => n.category === "REVENUE").length },
                            { id: "PROMOTION", label: "Khuyến mãi", count: notifications.filter((n) => n.category === "PROMOTION").length },
                            { id: "SYSTEM", label: "Hệ thống", count: notifications.filter((n) => n.category === "SYSTEM").length },
                        ].map((tab) => {
                            const isSelected = categoryTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setCategoryTab(tab.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                        isSelected
                                            ? "bg-violet-50 text-violet-700 border border-violet-200 shadow-2xs"
                                            : "text-slate-600 hover:bg-slate-50 border border-transparent"
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                            isSelected
                                                ? "bg-violet-200/70 text-violet-800"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Reset Filter Button */}
                    {isFiltered && (
                        <button
                            onClick={handleResetFilters}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer shrink-0"
                        >
                            <RestartAltOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Đặt lại bộ lọc</span>
                        </button>
                    )}
                </div>

                {/* Row 2: Search Input & Dropdowns */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                            <SearchOutlinedIcon sx={{ fontSize: 18 }} />
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm thông báo theo tiêu đề, nội dung, mã thông báo hoặc chi nhánh..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition shadow-2xs"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                            </button>
                        )}
                    </div>

                    {/* Priority Dropdown */}
                    <div className="relative min-w-[180px]">
                        <select
                            value={priorityFilter}
                            onChange={(e) => {
                                setPriorityFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                        >
                            <option value="ALL">Tất cả mức độ ưu tiên</option>
                            {Object.values(NOTIFICATION_PRIORITIES).map((p) => (
                                <option key={p.code} value={p.code}>
                                    {p.badge} ({p.label})
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        </div>
                    </div>

                    {/* Branch Dropdown */}
                    <div className="relative min-w-[190px]">
                        <select
                            value={branchFilter}
                            onChange={(e) => {
                                setBranchFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                        >
                            <option value="ALL">Tất cả chi nhánh rạp</option>
                            {CINEMA_BRANCH_OPTIONS.map((b) => (
                                <option key={b.id} value={b.name.split(" (")[0]}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative min-w-[160px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                        >
                            <option value="NEWEST">Mới nhất trước</option>
                            <option value="OLDEST">Cũ nhất trước</option>
                            <option value="PRIORITY">Ưu tiên cao nhất</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. BATCH ACTIONS BAR (Appears when items are checked) */}
            {selectedIds.length > 0 && (
                <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-violet-900">
                            Đã chọn {selectedIds.length} thông báo
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleBatchMarkAsRead}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-violet-700 border border-violet-200 hover:bg-violet-100/60 transition cursor-pointer shadow-2xs"
                        >
                            <MarkEmailReadOutlinedIcon sx={{ fontSize: 15 }} />
                            <span>Đánh dấu đã đọc</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleBatchDelete}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-xs"
                        >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                            <span>Xóa các mục chọn</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 transition cursor-pointer"
                        >
                            Bỏ chọn
                        </button>
                    </div>
                </div>
            )}

            {/* 5. NOTIFICATIONS FEED LIST */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                {/* Table Header Row with Select All */}
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={
                                paginatedNotifications.length > 0 &&
                                paginatedNotifications.every((n) => selectedIds.includes(n.id))
                            }
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                        />
                        <span>Danh Sách Thông Báo ({filteredNotifications.length})</span>
                    </div>

                    <span className="hidden sm:block text-[11px] font-medium text-slate-400 lowercase">
                        Trang {currentPage} / {totalPages}
                    </span>
                </div>

                {/* Notification Items List */}
                {paginatedNotifications.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {paginatedNotifications.map((item) => {
                            const isChecked = selectedIds.includes(item.id);
                            const category = NOTIFICATION_CATEGORIES[item.category] || NOTIFICATION_CATEGORIES.SYSTEM;
                            const priority = NOTIFICATION_PRIORITIES[item.priority] || NOTIFICATION_PRIORITIES.NORMAL;

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 md:p-5 flex items-start gap-4 transition group ${
                                        item.unread
                                            ? "bg-violet-50/20 hover:bg-violet-50/40"
                                            : "hover:bg-slate-50/80"
                                    } ${isChecked ? "bg-violet-50/40" : ""}`}
                                >
                                    {/* Selection Checkbox */}
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleSelectOne(item.id)}
                                            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                                        />
                                    </div>

                                    {/* Category Icon Badge */}
                                    <div
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 border ${
                                            category.bgColor ? "" : "bg-slate-100 text-slate-700"
                                        }`}
                                        style={{
                                            backgroundColor: category.bgColor,
                                            color: category.color,
                                            borderColor: category.borderColor,
                                        }}
                                    >
                                        {getCategoryIcon(item.category)}
                                    </div>

                                    {/* Content Body */}
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        {/* Top Tags & Title */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Unread indicator */}
                                            {item.unread && (
                                                <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0 animate-pulse" />
                                            )}

                                            <h4
                                                onClick={() => handleViewDetail(item)}
                                                className={`text-xs md:text-sm leading-snug cursor-pointer transition ${
                                                    item.unread
                                                        ? "font-black text-slate-900 hover:text-violet-700"
                                                        : "font-bold text-slate-700 hover:text-violet-600"
                                                }`}
                                            >
                                                {item.title}
                                            </h4>

                                            {/* Category Pill */}
                                            <span
                                                className="px-2 py-0.5 rounded-md text-[10px] font-extrabold border shrink-0"
                                                style={{
                                                    backgroundColor: category.bgColor,
                                                    color: category.color,
                                                    borderColor: category.borderColor,
                                                }}
                                            >
                                                {category.shortLabel}
                                            </span>

                                            {/* Priority Pill */}
                                            <span
                                                className="px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0"
                                                style={{
                                                    backgroundColor: priority.bgColor,
                                                    color: priority.color,
                                                    borderColor: priority.borderColor,
                                                }}
                                            >
                                                {priority.badge}
                                            </span>

                                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                                                {item.id}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                            {item.desc}
                                        </p>

                                        {/* Bottom Meta & Branch info */}
                                        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium flex-wrap pt-0.5">
                                            <span className="flex items-center gap-1">
                                                <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />
                                                <span>{dayjs(item.createdAt).fromNow()}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{dayjs(item.createdAt).format("HH:mm - DD/MM/YYYY")}</span>
                                            </span>

                                            <span className="flex items-center gap-1 text-slate-500">
                                                <StorefrontOutlinedIcon sx={{ fontSize: 13 }} />
                                                <span>{item.branch}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right Action Icons */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        {/* View Detail Button */}
                                        <Tooltip title="Xem chi tiết" arrow>
                                            <button
                                                type="button"
                                                onClick={() => handleViewDetail(item)}
                                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                            >
                                                <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                                            </button>
                                        </Tooltip>

                                        {/* Toggle Read */}
                                        <Tooltip title={item.unread ? "Đánh dấu đã đọc" : "Đánh dấu chưa đọc"} arrow>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleRead(item)}
                                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                                    item.unread
                                                        ? "text-violet-600 hover:bg-violet-50"
                                                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                                }`}
                                            >
                                                <MarkEmailReadOutlinedIcon sx={{ fontSize: 17 }} />
                                            </button>
                                        </Tooltip>

                                        {/* Quick Jump */}
                                        {category.targetRoute && (
                                            <Tooltip title={`Chuyển tới ${category.label}`} arrow>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(category.targetRoute)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                                                >
                                                    <ArrowForwardOutlinedIcon sx={{ fontSize: 17 }} />
                                                </button>
                                            </Tooltip>
                                        )}

                                        {/* Delete */}
                                        <Tooltip title="Xóa thông báo" arrow>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSingle(item)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                            >
                                                <DeleteOutlineOutlinedIcon sx={{ fontSize: 17 }} />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="p-12 text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                            <NotificationsNoneOutlinedIcon sx={{ fontSize: 28 }} />
                        </div>
                        <h4 className="text-sm font-black text-slate-800">
                            Không tìm thấy thông báo nào
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                            {isFiltered
                                ? "Không có thông báo nào phù hợp với bộ lọc hiện tại. Thử đặt lại bộ lọc để xem toàn bộ danh sách."
                                : "Hệ thống vận hành trơn tru! Hiện chưa có thông báo mới nào phát sinh."}
                        </p>
                        {isFiltered && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 transition cursor-pointer shadow-2xs"
                            >
                                Đặt lại bộ lọc
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                            Hiển thị {paginatedNotifications.length} trên tổng số {filteredNotifications.length} thông báo
                        </span>

                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(e, page) => setCurrentPage(page)}
                            color="primary"
                            size="small"
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    borderRadius: "8px",
                                },
                            }}
                        />
                    </div>
                )}
            </div>

            {/* 6. MODALS & DIALOGS */}
            {/* Notification Detail Modal */}
            <NotificationDetailModal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                notification={selectedNotification}
                onToggleRead={handleToggleRead}
                onDelete={handleDeleteSingle}
            />

            {/* Delete Single Notification Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        p: 1,
                        maxWidth: "400px",
                        width: "100%",
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1, pt: 2 }}>
                    <div className="flex items-center gap-2.5 text-rose-600">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                            <WarningAmberOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 leading-snug">
                                Xóa thông báo
                            </h3>
                            <p className="text-[11px] font-normal text-slate-400">
                                Hành động này không thể hoàn tác
                            </p>
                        </div>
                    </div>
                </DialogTitle>

                <DialogContent sx={{ py: 1.5 }}>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Bạn có chắc chắn muốn xóa thông báo{" "}
                        <strong className="text-slate-900 font-bold">
                            #{notificationToDelete?.id}
                        </strong>{" "}
                        khỏi nhật ký vận hành không?
                    </p>
                </DialogContent>

                <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            color: "#64748B",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "10px",
                            px: 2,
                            "&:hover": { backgroundColor: "#F1F5F9" },
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmDeleteSingle}
                        sx={{
                            backgroundColor: "#E11D48",
                            "&:hover": { backgroundColor: "#BE123C" },
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "10px",
                            px: 2.5,
                            boxShadow: "0 4px 12px rgba(225, 29, 72, 0.25)",
                        }}
                    >
                        Xác nhận xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Clear All Read Notifications Dialog */}
            <Dialog
                open={clearReadDialogOpen}
                onClose={() => setClearReadDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        p: 1,
                        maxWidth: "420px",
                        width: "100%",
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1, pt: 2 }}>
                    <div className="flex items-center gap-2.5 text-indigo-600">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                            <DeleteSweepOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 leading-snug">
                                Dọn dẹp thông báo đã đọc
                            </h3>
                            <p className="text-[11px] font-normal text-slate-400">
                                Giữ lại các thông báo chưa xử lý
                            </p>
                        </div>
                    </div>
                </DialogTitle>

                <DialogContent sx={{ py: 1.5 }}>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Hệ thống sẽ xóa toàn bộ các thông báo đã đọc để nhật ký vận hành gọn gàng hơn. Các thông báo chưa đọc sẽ được giữ nguyên. Bạn có muốn tiếp tục?
                    </p>
                </DialogContent>

                <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Button
                        onClick={() => setClearReadDialogOpen(false)}
                        sx={{
                            color: "#64748B",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "10px",
                            px: 2,
                            "&:hover": { backgroundColor: "#F1F5F9" },
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleClearAllRead}
                        sx={{
                            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                            "&:hover": { background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)", },
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "10px",
                            px: 2.5,
                        }}
                    >
                        Dọn dẹp ngay
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
