import React, { useState, useMemo, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

// Redux
import { openSnackbar } from "../redux/slices/snackbarSlice.js";

// Constants & Mock
import {
    BOOKING_STORAGE_KEY,
    BOOKING_STATUSES,
    BOOKING_STATUS_CONFIG,
    PAYMENT_METHODS,
    BOOKING_QUICK_TABS,
    BOOKING_SORT_OPTIONS,
    CINEMA_BRANCH_FILTERS,
} from "../constants/bookingConstants.js";
import { MOCK_BOOKINGS } from "../mock/mockBookings.js";

// Components
import StatCard from "../components/OverviewStats/StatCard.jsx";
import StatusChip from "../components/StatusChip.jsx";
import BookingDetailModal from "../components/BookingManagement/BookingDetailModal.jsx";
import QuickLookupModal from "../components/BookingManagement/QuickLookupModal.jsx";

// Icons
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";

export default function BookingManagementPage() {
    const dispatch = useDispatch();

    // 1. Data State & Local Storage Initialization
    const [bookings, setBookings] = useState(() => {
        try {
            const saved = localStorage.getItem(BOOKING_STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse saved bookings:", e);
        }
        return MOCK_BOOKINGS;
    });

    useEffect(() => {
        try {
            localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
        } catch (e) {
            console.error("Failed to save bookings to localStorage:", e);
        }
    }, [bookings]);

    // 2. Filter & Search State
    const [statusTab, setStatusTab] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCinema, setSelectedCinema] = useState("ALL");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 3. Modals & Dialogs State
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openLookupModal, setOpenLookupModal] = useState(false);

    // Check-in Confirmation Dialog
    const [bookingToCheckIn, setBookingToCheckIn] = useState(null);
    const [openCheckInDialog, setOpenCheckInDialog] = useState(false);

    // Refund Confirmation Dialog
    const [bookingToRefund, setBookingToRefund] = useState(null);
    const [openRefundDialog, setOpenRefundDialog] = useState(false);
    const [refundReason, setRefundReason] = useState("");

    // 4. Reset Filters Handler
    const handleResetFilters = () => {
        setStatusTab("ALL");
        setSearchQuery("");
        setSelectedCinema("ALL");
        setSelectedPaymentMethod("ALL");
        setSortBy("NEWEST");
    };

    // 5. Refresh Data Handler
    const handleRefresh = () => {
        setIsRefreshing(true);
        setBookings(MOCK_BOOKINGS);
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(MOCK_BOOKINGS));
        dispatch(
            openSnackbar({
                message: "Đã làm mới và đồng bộ toàn bộ đơn đặt vé từ máy chủ!",
                type: "success",
            })
        );
        setTimeout(() => setIsRefreshing(false), 600);
    };

    // 6. Export Report Handler (JSON / CSV)
    const handleExportData = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(filteredBookings, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute(
            "download",
            `CineMeow_Bookings_Report_${dayjs().format("YYYYMMDD_HHmmss")}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        dispatch(
            openSnackbar({
                message: `Đã xuất báo cáo ${filteredBookings.length} đơn đặt vé thành công!`,
                type: "success",
            })
        );
    };

    // 7. Check-in Ticket Action
    const handleConfirmCheckIn = () => {
        if (!bookingToCheckIn) return;

        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const updated = bookings.map((b) => {
            if (b.id === bookingToCheckIn.id) {
                const newHistory = [
                    ...(b.history || []),
                    {
                        timestamp: now,
                        action: "In vé & Check-in tại quầy",
                        actor: "Quản trị viên (Admin Portal)",
                        notes: `Xác nhận soát vé hợp lệ và in vé giấy vào phòng chiếu.`,
                        status: "CHECKED_IN",
                    },
                ];
                return {
                    ...b,
                    orderStatus: "CHECKED_IN",
                    checkedInAt: now,
                    checkedInBy: "Admin Portal",
                    history: newHistory,
                };
            }
            return b;
        });

        setBookings(updated);
        setOpenCheckInDialog(false);

        // Update active modal if open
        if (selectedBooking && selectedBooking.id === bookingToCheckIn.id) {
            setSelectedBooking(updated.find((b) => b.id === bookingToCheckIn.id));
        }

        dispatch(
            openSnackbar({
                message: `Đã check-in và in vé thành công cho mã vé ${bookingToCheckIn.ticketCode}!`,
                type: "success",
            })
        );
        setBookingToCheckIn(null);
    };

    // 8. Refund Action
    const handleConfirmRefund = () => {
        if (!bookingToRefund) return;

        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const updated = bookings.map((b) => {
            if (b.id === bookingToRefund.id) {
                const newHistory = [
                    ...(b.history || []),
                    {
                        timestamp: now,
                        action: "Hủy đơn & Hoàn tiền vé",
                        actor: "Quản trị viên (Admin Portal)",
                        notes: `Lý do hoàn tiền: ${refundReason || "Khách hàng yêu cầu hủy vé hợp lệ trước giờ chiếu"}. Số tiền hoàn: ${(b.totalAmount || 0).toLocaleString("vi-VN")} ₫.`,
                        status: "REFUNDED",
                    },
                ];
                return {
                    ...b,
                    orderStatus: "REFUNDED",
                    paymentStatus: "REFUNDED",
                    history: newHistory,
                };
            }
            return b;
        });

        setBookings(updated);
        setOpenRefundDialog(false);

        if (selectedBooking && selectedBooking.id === bookingToRefund.id) {
            setSelectedBooking(updated.find((b) => b.id === bookingToRefund.id));
        }

        dispatch(
            openSnackbar({
                message: `Đã hoàn tiền ${(bookingToRefund.totalAmount || 0).toLocaleString("vi-VN")} ₫ cho đơn ${bookingToRefund.orderCode}!`,
                type: "info",
            })
        );
        setBookingToRefund(null);
        setRefundReason("");
    };

    // 9. Resend Ticket Action
    const handleResendTicket = (booking) => {
        dispatch(
            openSnackbar({
                message: `Đã gửi lại vé điện tử ${booking.ticketCode} qua Email (${booking.customer?.email}) và SMS (${booking.customer?.phone}) thành công!`,
                type: "success",
            })
        );
    };

    // 10. Copy ticket code helper
    const handleCopyCode = (code, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        dispatch(
            openSnackbar({
                message: `Đã sao chép mã ${code} vào bộ nhớ tạm!`,
                type: "info",
            })
        );
    };

    // 11. KPI Statistics Calculation
    const stats = useMemo(() => {
        const total = bookings.length;
        const totalRevenue = bookings
            .filter((b) => b.orderStatus === "PAID" || b.orderStatus === "CHECKED_IN")
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        const successCount = bookings.filter(
            (b) => b.orderStatus === "PAID" || b.orderStatus === "CHECKED_IN"
        ).length;
        const checkedInCount = bookings.filter((b) => b.orderStatus === "CHECKED_IN").length;

        const successRate = total > 0 ? ((successCount / total) * 100).toFixed(1) : 0;

        return [
            {
                title: "Tổng đơn đặt vé",
                value: `${total.toLocaleString()} đơn`,
                subtitle: "+14.2% so với hôm qua",
                icon: <ReceiptLongOutlinedIcon fontSize="medium" />,
                bigIcon: <ReceiptLongOutlinedIcon fontSize="inherit" />,
                bgColor: "#1976d2", // Indigo / Blue
            },
            {
                title: "Doanh thu bán vé",
                value: `${totalRevenue.toLocaleString("vi-VN")} ₫`,
                subtitle: "+18.5% tăng trưởng doanh số",
                icon: <AttachMoneyOutlinedIcon fontSize="medium" />,
                bigIcon: <AttachMoneyOutlinedIcon fontSize="inherit" />,
                bgColor: "#2e7d32", // Emerald green
            },
            {
                title: "Thanh toán thành công",
                value: `${successRate}%`,
                subtitle: `${successCount} đơn giao dịch hợp lệ`,
                icon: <DoneAllOutlinedIcon fontSize="medium" />,
                bigIcon: <DoneAllOutlinedIcon fontSize="inherit" />,
                bgColor: "#0284c7", // Sky blue
            },
            {
                title: "Đã check-in vào rạp",
                value: `${checkedInCount.toLocaleString()} vé`,
                subtitle: `Tỷ lệ vào rạp: ${total > 0 ? Math.round((checkedInCount / total) * 100) : 0}%`,
                icon: <ConfirmationNumberOutlinedIcon fontSize="medium" />,
                bigIcon: <ConfirmationNumberOutlinedIcon fontSize="inherit" />,
                bgColor: "#f57c00", // Amber / Orange
            },
        ];
    }, [bookings]);

    // 12. Filter & Sort Logic
    const filteredBookings = useMemo(() => {
        let result = [...bookings];

        // Status Tab
        if (statusTab !== "ALL") {
            result = result.filter((b) => b.orderStatus === statusTab);
        }

        // Cinema Filter
        if (selectedCinema !== "ALL") {
            result = result.filter((b) => b.cinema?.name === selectedCinema);
        }

        // Payment Method Filter
        if (selectedPaymentMethod !== "ALL") {
            result = result.filter((b) => b.paymentMethod === selectedPaymentMethod);
        }

        // Search Query
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(
                (b) =>
                    b.orderCode.toLowerCase().includes(q) ||
                    b.ticketCode.toLowerCase().includes(q) ||
                    b.customer?.name.toLowerCase().includes(q) ||
                    b.customer?.phone.includes(q) ||
                    b.customer?.email.toLowerCase().includes(q) ||
                    b.movie?.title.toLowerCase().includes(q) ||
                    b.cinema?.name.toLowerCase().includes(q)
            );
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "NEWEST") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (sortBy === "OLDEST") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            if (sortBy === "AMOUNT_DESC") {
                return (b.totalAmount || 0) - (a.totalAmount || 0);
            }
            if (sortBy === "AMOUNT_ASC") {
                return (a.totalAmount || 0) - (b.totalAmount || 0);
            }
            return 0;
        });

        return result;
    }, [bookings, statusTab, selectedCinema, selectedPaymentMethod, searchQuery, sortBy]);

    // 13. DataGrid Columns Definition (Clean 80px Row Height with Fit-Content Badges)
    const columns = useMemo(
        () => [
            {
                field: "orderTicketCode",
                headerName: "Mã đơn & Mã vé",
                flex: 1.1,
                minWidth: 190,
                sortable: false,
                renderCell: (params) => {
                    const row = params.row;
                    return (
                        <div className="flex flex-col justify-center gap-1 w-full py-1">
                            <span className="font-mono text-xs font-black text-slate-900 leading-tight">
                                {row.orderCode}
                            </span>
                            <div className="flex items-center gap-1">
                                <span
                                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-200/80 inline-flex items-center gap-1 shrink-0 self-start"
                                    style={{ height: "fit-content", lineHeight: "1.2" }}
                                >
                                    <span>{row.ticketCode}</span>
                                    <Tooltip title="Sao chép mã vé" arrow>
                                        <button
                                            type="button"
                                            onClick={(e) => handleCopyCode(row.ticketCode, e)}
                                            className="text-violet-400 hover:text-violet-700 cursor-pointer p-0.5"
                                        >
                                            <ContentCopyOutlinedIcon sx={{ fontSize: 11 }} />
                                        </button>
                                    </Tooltip>
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium leading-none">
                                {dayjs(row.createdAt).format("HH:mm - DD/MM/YYYY")}
                            </span>
                        </div>
                    );
                },
            },
            {
                field: "customerInfo",
                headerName: "Khách Hàng Thành Viên",
                flex: 1.4,
                minWidth: 250,
                sortable: false,
                renderCell: (params) => {
                    const row = params.row;
                    const cust = row.customer || {};
                    const initials = cust.name
                        ? cust.name
                              .split(" ")
                              .filter(Boolean)
                              .slice(-2)
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()
                        : "KH";

                    return (
                        <div className="flex items-center gap-3 w-full h-full min-w-0">
                            {/* Avatar with Status Dot (Synchronized with User Management Page) */}
                            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 self-center">
                                {initials}
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white bg-emerald-500" />
                            </div>

                            {/* Name & Contact */}
                            <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden">
                                <div className="flex items-center gap-1.5 leading-none">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                        {cust.name}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                        {cust.membershipCode || "MEM"}
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium truncate mt-1 leading-tight">
                                    {cust.phone} • {cust.email}
                                </div>
                            </div>
                        </div>
                    );
                },
            },
            {
                field: "movieShowtime",
                headerName: "Phim & Suất chiếu",
                flex: 1.6,
                minWidth: 260,
                sortable: false,
                renderCell: (params) => {
                    const row = params.row;
                    return (
                        <div className="flex items-center gap-2.5 w-full py-1 min-w-0">
                            <img
                                src={row.movie?.poster}
                                alt={row.movie?.title}
                                className="w-10 h-14 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://placehold.co/100x150/6366f1/ffffff?text=Movie";
                                }}
                            />
                            <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
                                <h4 className="text-xs font-black text-slate-900 truncate leading-tight">
                                    {row.movie?.title}
                                </h4>
                                <div className="text-[11px] text-slate-500 font-medium truncate leading-none">
                                    {row.cinema?.name} • {row.cinema?.roomName}
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span
                                        className="text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100 shrink-0"
                                        style={{ height: "fit-content", lineHeight: "1.2" }}
                                    >
                                        {row.showtime?.startTime} ({dayjs(row.showtime?.date).format("DD/MM")})
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {row.seats?.map((s, idx) => (
                                            <span
                                                key={idx}
                                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[10px] shrink-0"
                                                style={{ height: "fit-content", lineHeight: "1.2" }}
                                            >
                                                {s.code}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                },
            },
            {
                field: "paymentAmount",
                headerName: "Thanh toán",
                flex: 1,
                minWidth: 160,
                sortable: false,
                renderCell: (params) => {
                    const row = params.row;
                    const method = PAYMENT_METHODS[row.paymentMethod] || {
                        shortLabel: row.paymentMethod,
                        bgLight: "bg-slate-100 text-slate-700 border-slate-200",
                    };
                    return (
                        <div className="flex flex-col justify-center gap-1 w-full py-1">
                            <span className="font-extrabold text-xs text-violet-700 leading-tight">
                                {(row.totalAmount || 0).toLocaleString("vi-VN")} ₫
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${method.bgLight} shrink-0 self-start`}
                                    style={{ height: "fit-content", lineHeight: "1.2" }}
                                >
                                    {method.shortLabel}
                                </span>
                                {row.discountAmount > 0 && (
                                    <span className="text-[10px] text-emerald-600 font-bold leading-none">
                                        -{row.discountAmount.toLocaleString("vi-VN")}₫
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                field: "orderStatus",
                headerName: "Trạng thái",
                minWidth: 150,
                align: "center",
                headerAlign: "center",
                sortable: false,
                renderCell: (params) => (
                    <div className="flex items-center justify-center w-full h-full">
                        <StatusChip status={params.value} configs={BOOKING_STATUS_CONFIG} />
                    </div>
                ),
            },
            {
                field: "actions",
                headerName: "Thao tác",
                width: 150,
                sortable: false,
                renderCell: (params) => {
                    const row = params.row;
                    return (
                        <div className="flex items-center gap-1 h-full">
                            {/* View detail */}
                            <Tooltip title="Xem chi tiết đơn vé" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setSelectedBooking(row);
                                        setOpenDetailModal(true);
                                    }}
                                    sx={{
                                        color: "#64748B",
                                        borderRadius: "10px",
                                        "&:hover": { backgroundColor: "#F1F5F9", color: "#0F172A" },
                                    }}
                                >
                                    <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>

                            {/* Check-in / Print Ticket if PAID */}
                            {row.orderStatus === "PAID" && (
                                <Tooltip title="In vé & Check-in vào rạp" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setBookingToCheckIn(row);
                                            setOpenCheckInDialog(true);
                                        }}
                                        sx={{
                                            color: "#7C3AED",
                                            borderRadius: "10px",
                                            "&:hover": { backgroundColor: "#F5F3FF", color: "#6D28D9" },
                                        }}
                                    >
                                        <PrintOutlinedIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {/* Resend ticket */}
                            {(row.orderStatus === "PAID" || row.orderStatus === "CHECKED_IN") && (
                                <Tooltip title="Gửi lại vé điện tử (Email/SMS)" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleResendTicket(row)}
                                        sx={{
                                            color: "#0284C7",
                                            borderRadius: "10px",
                                            "&:hover": { backgroundColor: "#F0F9FF", color: "#0369A1" },
                                        }}
                                    >
                                        <MailOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {/* Refund button */}
                            {(row.orderStatus === "PAID" || row.orderStatus === "CHECKED_IN") && (
                                <Tooltip title="Hủy & Hoàn tiền vé" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setBookingToRefund(row);
                                            setOpenRefundDialog(true);
                                        }}
                                        sx={{
                                            color: "#E11D48",
                                            borderRadius: "10px",
                                            "&:hover": { backgroundColor: "#FFF1F2", color: "#BE123C" },
                                        }}
                                    >
                                        <CurrencyExchangeOutlinedIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className="py-6 space-y-6">
            {/* 1. PAGE HEADER (STANDARD PAGE HEADER BANNER) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <ReceiptLongOutlinedIcon className="text-violet-600" />
                        <span>Quản Lý Đơn Đặt Vé</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Tra cứu đơn đặt vé, trạng thái thanh toán, mã vé điện tử và lịch sử xử lý tại cụm rạp CineMeow
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
                        onClick={handleExportData}
                        startIcon={<FileDownloadOutlinedIcon />}
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
                        Xuất báo cáo
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => setOpenLookupModal(true)}
                        startIcon={<QrCodeScannerOutlinedIcon />}
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
                        Tra cứu nhanh mã vé
                    </Button>
                </div>
            </div>

            {/* 2. STATS KPI GRID (STANDARD CSS GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((item, idx) => (
                    <StatCard key={idx} {...item} />
                ))}
            </div>

            {/* 3. TOOLBAR CONTROLS: MULTI-FILTER 2-ROW LAYOUT */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3.5">
                {/* Row 1: Quick Status Tabs + Reset Button + Count Badge */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    {/* Quick Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                        {BOOKING_QUICK_TABS.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setStatusTab(tab.value)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                                    statusTab === tab.value
                                        ? "bg-violet-600 text-white shadow-2xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Right side: Reset + Result Counter */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        {(statusTab !== "ALL" ||
                            searchQuery ||
                            selectedCinema !== "ALL" ||
                            selectedPaymentMethod !== "ALL" ||
                            sortBy !== "NEWEST") && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <RestartAltOutlinedIcon sx={{ fontSize: 15 }} />
                                <span>Đặt lại bộ lọc</span>
                            </button>
                        )}

                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-600 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Hiển thị: {filteredBookings.length} đơn</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Search Input + Cinema Branch + Payment Method + Sort Dropdown */}
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full min-w-[240px]">
                        <SearchOutlinedIcon
                            sx={{ fontSize: 18 }}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm theo mã đơn, mã vé, tên khách, số điện thoại, phim, rạp..."
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

                    {/* Cinema Branch Select */}
                    <div className="relative w-full md:w-56 shrink-0">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <StorefrontOutlinedIcon sx={{ fontSize: 16 }} />
                        </div>
                        <select
                            value={selectedCinema}
                            onChange={(e) => setSelectedCinema(e.target.value)}
                            className="w-full pl-8.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none truncate"
                        >
                            {CINEMA_BRANCH_FILTERS.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        </div>
                    </div>

                    {/* Payment Method Select */}
                    <div className="relative w-full md:w-48 shrink-0">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <CreditCardOutlinedIcon sx={{ fontSize: 16 }} />
                        </div>
                        <select
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="w-full pl-8.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                        >
                            <option value="ALL">Cổng thanh toán: Tất cả</option>
                            {Object.values(PAYMENT_METHODS).map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative w-full md:w-48 shrink-0">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <FilterListOutlinedIcon sx={{ fontSize: 16 }} />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full pl-8.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                        >
                            {BOOKING_SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. DATAGRID TABLE */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
                <DataGrid
                    rows={filteredBookings}
                    columns={columns}
                    autoHeight
                    rowHeight={80}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#F8FAFC",
                            borderBottom: "1px solid #E2E8F0",
                            fontWeight: 800,
                            fontSize: "12px",
                            color: "#475569",
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
                            borderBottom: "1px solid #F1F5F9",
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            lineHeight: "normal !important",
                            outline: "none !important",
                        },
                    }}
                />
            </div>

            {/* 5. BOOKING DETAIL MODAL */}
            <BookingDetailModal
                open={openDetailModal}
                onClose={() => {
                    setOpenDetailModal(false);
                    setSelectedBooking(null);
                }}
                booking={selectedBooking}
                onCheckIn={(b) => {
                    setBookingToCheckIn(b);
                    setOpenCheckInDialog(true);
                }}
                onRefund={(b) => {
                    setBookingToRefund(b);
                    setOpenRefundDialog(true);
                }}
                onResendTicket={handleResendTicket}
            />

            {/* 6. QUICK LOOKUP MODAL */}
            <QuickLookupModal
                open={openLookupModal}
                onClose={() => setOpenLookupModal(false)}
                bookings={bookings}
                onSelectBooking={(b) => {
                    setSelectedBooking(b);
                    setOpenDetailModal(true);
                }}
                onCheckIn={(b) => {
                    setBookingToCheckIn(b);
                    setOpenCheckInDialog(true);
                }}
            />

            {/* 7. CHECK-IN CONFIRMATION DIALOG */}
            <Dialog
                open={openCheckInDialog}
                onClose={() => setOpenCheckInDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: "20px", p: 1 },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: "16px", color: "#0F172A" }}>
                    Xác nhận in vé & Check-in?
                </DialogTitle>
                <DialogContent>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Bạn đang chuẩn bị check-in và in vé cho khách hàng{" "}
                        <strong className="text-slate-900">{bookingToCheckIn?.customer?.name}</strong>.
                    </p>
                    <div className="mt-3 p-3 rounded-xl bg-violet-50 border border-violet-100 font-mono text-xs text-violet-800 space-y-1">
                        <div>Mã vé: <strong>{bookingToCheckIn?.ticketCode}</strong></div>
                        <div>Phim: <strong>{bookingToCheckIn?.movie?.title}</strong></div>
                        <div>Ghế: <strong>{bookingToCheckIn?.seats?.map((s) => s.code).join(", ")}</strong></div>
                    </div>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenCheckInDialog(false)}
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderColor: "#E2E8F0",
                            color: "#64748B",
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmCheckIn}
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: 800,
                            fontSize: "12px",
                            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                        }}
                    >
                        Xác nhận In vé
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 8. REFUND CONFIRMATION DIALOG */}
            <Dialog
                open={openRefundDialog}
                onClose={() => setOpenRefundDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: "20px", p: 1 },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: "16px", color: "#E11D48" }}>
                    Xác nhận Hủy đơn & Hoàn tiền vé?
                </DialogTitle>
                <DialogContent className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Hành động này sẽ hủy hiệu lực của vé và hoàn trả số tiền{" "}
                        <strong className="text-rose-600 font-mono">
                            {(bookingToRefund?.totalAmount || 0).toLocaleString("vi-VN")} ₫
                        </strong>{" "}
                        lại cho khách hàng{" "}
                        <strong className="text-slate-900">{bookingToRefund?.customer?.name}</strong>.
                    </p>

                    <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Lý do hoàn vé:
                        </label>
                        <textarea
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            rows={3}
                            placeholder="Nhập lý do hoàn tiền (VD: Đổi suất chiếu, sự cố phòng chiếu, yêu cầu hủy hợp lệ)..."
                            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-400 focus:outline-none transition resize-none placeholder:text-slate-400"
                        />
                    </div>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenRefundDialog(false)}
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderColor: "#E2E8F0",
                            color: "#64748B",
                        }}
                    >
                        Quay lại
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmRefund}
                        sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: 800,
                            fontSize: "12px",
                            backgroundColor: "#E11D48",
                            "&:hover": { backgroundColor: "#BE123C" },
                        }}
                    >
                        Xác nhận Hoàn tiền
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
