import React, { useState, useMemo, useEffect } from "react";
import {
    Button,
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
    TRANSACTION_STORAGE_KEY,
    TRANSACTION_STATUSES,
    TRANSACTION_STATUS_CONFIG,
    PAYMENT_GATEWAYS,
    TRANSACTION_TYPES,
    TRANSACTION_QUICK_TABS,
    TRANSACTION_SORT_OPTIONS,
} from "../constants/transactionConstants.js";
import { MOCK_TRANSACTIONS } from "../mock/mockTransactions.js";

// Components
import StatCard from "../components/OverviewStats/StatCard.jsx";
import StatusChip from "../components/StatusChip.jsx";
import TransactionDetailModal from "../components/TransactionManagement/TransactionDetailModal.jsx";
import RefundTransactionModal from "../components/TransactionManagement/RefundTransactionModal.jsx";

// Icons
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

export default function TransactionManagementPage() {
    const dispatch = useDispatch();

    // 1. Transactions State with LocalStorage Persistence
    const [transactions, setTransactions] = useState(() => {
        try {
            const saved = localStorage.getItem(TRANSACTION_STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse saved transactions:", e);
        }
        return MOCK_TRANSACTIONS;
    });

    useEffect(() => {
        try {
            localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
        } catch (e) {
            console.error("Failed to save transactions to localStorage:", e);
        }
    }, [transactions]);

    // 2. Filter & Search States
    const [statusTab, setStatusTab] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGateway, setSelectedGateway] = useState("ALL");
    const [selectedType, setSelectedType] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST");

    // 3. Modals State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);

    const [refundModalOpen, setRefundModalOpen] = useState(false);
    const [txnToRefund, setTxnToRefund] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 4. Data Refresh Handler
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTransactions(MOCK_TRANSACTIONS);
        localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(MOCK_TRANSACTIONS));
        dispatch(
            openSnackbar({
                message: "Đã làm mới và đồng bộ lại toàn bộ dữ liệu giao dịch!",
                type: "success",
            })
        );
        setTimeout(() => setIsRefreshing(false), 600);
    };

    // 5. Export Report Handler (JSON)
    const handleExportData = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(filteredTransactions, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute(
            "download",
            `CineMeow_Transactions_Report_${dayjs().format("YYYYMMDD_HHmmss")}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        dispatch(
            openSnackbar({
                message: `Đã xuất báo cáo ${filteredTransactions.length} giao dịch thành công!`,
                type: "success",
            })
        );
    };

    // 6. Sync All Gateways Handler (Reconciliation Simulation)
    const handleSyncAllGateways = () => {
        let reconciledCount = 0;
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const updated = transactions.map((t) => {
            if (t.status === "PENDING") {
                reconciledCount++;
                return {
                    ...t,
                    status: "SUCCESS",
                    completedAt: now,
                    responseCode: "00",
                    responseMessage: "Cổng thanh toán xác thực: Giao dịch đã thanh toán thành công",
                    timeline: [
                        ...(t.timeline || []),
                        {
                            time: now,
                            title: "Đối soát tự động thành công",
                            description: "Hệ thống truy vấn QueryDR và đối chiếu khớp lệnh với cổng",
                            status: "SUCCESS",
                        },
                    ],
                };
            }
            return t;
        });

        setTransactions(updated);
        dispatch(
            openSnackbar({
                message:
                    reconciledCount > 0
                        ? `Đối soát thành công! Đã khớp lệnh ${reconciledCount} giao dịch đang chờ.`
                        : "Toàn bộ giao dịch trên các cổng đều đã ở trạng thái đồng bộ!",
                type: "success",
            })
        );
    };

    // 7. Single Transaction Recheck with Gateway
    const handleRecheckGateway = (txn) => {
        if (!txn) return;
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

        const updated = transactions.map((t) => {
            if (t.id === txn.id) {
                const isNowSuccess = t.status === "PENDING" ? "SUCCESS" : t.status;
                const newTimelineItem = {
                    time: now,
                    title: "Truy vấn trạng thái cổng (QueryDR)",
                    description: `Kiểm tra mã tham chiếu ${t.gatewayRef}. Kết quả: Hợp lệ.`,
                    status: isNowSuccess,
                };
                return {
                    ...t,
                    status: isNowSuccess,
                    completedAt: isNowSuccess === "SUCCESS" && !t.completedAt ? now : t.completedAt,
                    responseMessage: `Đã đối soát lại lúc ${now}`,
                    timeline: [...(t.timeline || []), newTimelineItem],
                };
            }
            return t;
        });

        setTransactions(updated);
        if (selectedTxn && selectedTxn.id === txn.id) {
            setSelectedTxn((prev) => ({
                ...prev,
                status: prev.status === "PENDING" ? "SUCCESS" : prev.status,
                responseMessage: `Đã đối soát lại lúc ${now}`,
            }));
        }

        dispatch(
            openSnackbar({
                message: `Đã kiểm tra lại giao dịch #${txn.txnCode} với cổng ${txn.gateway}!`,
                type: "success",
            })
        );
    };

    // 8. Refund Action Confirmation
    const handleConfirmRefund = ({ transactionId, refundAmount, reason, refundMethod }) => {
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

        const updated = transactions.map((t) => {
            if (t.id === transactionId) {
                const newTimelineItem = {
                    time: now,
                    title: "Thực hiện hoàn tiền",
                    description: `Hoàn ${refundAmount.toLocaleString("vi-VN")} ₫. Phương thức: ${refundMethod}. Lý do: ${reason}`,
                    status: "REFUNDED",
                };
                return {
                    ...t,
                    status: "REFUNDED",
                    type: "REFUND",
                    completedAt: now,
                    responseCode: "REFUND_SUCCESS",
                    responseMessage: `Đã hoàn tiền ${refundAmount.toLocaleString("vi-VN")} ₫`,
                    timeline: [...(t.timeline || []), newTimelineItem],
                };
            }
            return t;
        });

        setTransactions(updated);
        setRefundModalOpen(false);
        setTxnToRefund(null);

        if (detailModalOpen && selectedTxn?.id === transactionId) {
            setSelectedTxn((prev) => ({
                ...prev,
                status: "REFUNDED",
                type: "REFUND",
                responseMessage: `Đã hoàn tiền ${refundAmount.toLocaleString("vi-VN")} ₫`,
            }));
        }

        dispatch(
            openSnackbar({
                message: `Đã hoàn trả thành công ${refundAmount.toLocaleString("vi-VN")} ₫ cho khách hàng!`,
                type: "success",
            })
        );
    };

    // 9. Copy Helper
    const handleCopyCode = (code, e) => {
        if (e) e.stopPropagation();
        navigator.clipboard.writeText(code);
        dispatch(
            openSnackbar({
                message: `Đã sao chép mã ${code} vào bộ nhớ tạm!`,
                type: "info",
            })
        );
    };

    // 10. KPI Statistics Calculation (Watermark Icon Synchronized)
    const stats = useMemo(() => {
        const total = transactions.length;
        const successTxns = transactions.filter((t) => t.status === "SUCCESS");
        const totalRevenue = successTxns.reduce(
            (sum, t) => sum + (t.type === "PAYMENT" || t.type === "TOPUP" ? t.amount : 0),
            0
        );
        const pendingCount = transactions.filter((t) => t.status === "PENDING").length;
        const refundTotal = transactions
            .filter((t) => t.status === "REFUNDED" || t.type === "REFUND")
            .reduce((sum, t) => sum + t.amount, 0);

        const successRate = total > 0 ? ((successTxns.length / total) * 100).toFixed(1) : 0;

        return [
            {
                title: "Tổng doanh thu quyết toán",
                value: `${totalRevenue.toLocaleString("vi-VN")} ₫`,
                subtitle: "+18.2% tăng trưởng dòng tiền",
                icon: <AttachMoneyOutlinedIcon fontSize="medium" />,
                bigIcon: <AttachMoneyOutlinedIcon fontSize="inherit" />,
                bgColor: "#1976d2", // Indigo / Blue
            },
            {
                title: "Giao dịch thành công",
                value: `${successRate}%`,
                subtitle: `${successTxns.length} / ${total} giao dịch hoàn tất`,
                icon: <DoneAllOutlinedIcon fontSize="medium" />,
                bigIcon: <DoneAllOutlinedIcon fontSize="inherit" />,
                bgColor: "#2e7d32", // Emerald green
            },
            {
                title: "Đang chờ đối soát",
                value: `${pendingCount} giao dịch`,
                subtitle: "Cần xác thực IPN Webhook",
                icon: <AccessTimeOutlinedIcon fontSize="medium" />,
                bigIcon: <AccessTimeOutlinedIcon fontSize="inherit" />,
                bgColor: "#f57c00", // Amber
            },
            {
                title: "Tổng tiền đã hoàn trả",
                value: `${refundTotal.toLocaleString("vi-VN")} ₫`,
                subtitle: "Quyết toán qua cổng & ví",
                icon: <CurrencyExchangeOutlinedIcon fontSize="medium" />,
                bigIcon: <CurrencyExchangeOutlinedIcon fontSize="inherit" />,
                bgColor: "#0284c7", // Sky blue
            },
        ];
    }, [transactions]);

    // 11. Filter & Sort Logic
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        // Status Tab
        if (statusTab !== "ALL") {
            result = result.filter((t) => t.status === statusTab);
        }

        // Gateway Filter
        if (selectedGateway !== "ALL") {
            result = result.filter((t) => t.gateway === selectedGateway);
        }

        // Type Filter
        if (selectedType !== "ALL") {
            result = result.filter((t) => t.type === selectedType);
        }

        // Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (t) =>
                    t.txnCode.toLowerCase().includes(query) ||
                    (t.gatewayRef && t.gatewayRef.toLowerCase().includes(query)) ||
                    (t.orderCode && t.orderCode.toLowerCase().includes(query)) ||
                    (t.customer?.name && t.customer.name.toLowerCase().includes(query)) ||
                    (t.customer?.phone && t.customer.phone.includes(query))
            );
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "NEWEST") {
                return dayjs(b.createdAt).diff(dayjs(a.createdAt));
            }
            if (sortBy === "OLDEST") {
                return dayjs(a.createdAt).diff(dayjs(b.createdAt));
            }
            if (sortBy === "AMOUNT_DESC") {
                return (b.amount || 0) - (a.amount || 0);
            }
            if (sortBy === "AMOUNT_ASC") {
                return (a.amount || 0) - (b.amount || 0);
            }
            return 0;
        });

        return result;
    }, [transactions, statusTab, selectedGateway, selectedType, searchQuery, sortBy]);

    // 12. Reset All Filters
    const handleResetFilters = () => {
        setStatusTab("ALL");
        setSearchQuery("");
        setSelectedGateway("ALL");
        setSelectedType("ALL");
        setSortBy("NEWEST");
    };

    // 13. DataGrid Columns Definition (Optimized column widths to prevent horizontal scroll)
    const columns = useMemo(
        () => [
            {
                field: "txnCode",
                headerName: "Mã Giao Dịch",
                flex: 1.1,
                minWidth: 155,
                renderCell: (params) => {
                    const row = params.row;
                    return (
                        <div className="flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-1 leading-none">
                                <span className="font-mono text-xs font-black text-slate-900 truncate">
                                    {row.txnCode}
                                </span>
                                <Tooltip title="Sao chép mã" arrow>
                                    <button
                                        type="button"
                                        onClick={(e) => handleCopyCode(row.txnCode, e)}
                                        className="text-slate-400 hover:text-blue-600 cursor-pointer p-0.5"
                                    >
                                        <ContentCopyOutlinedIcon sx={{ fontSize: 11 }} />
                                    </button>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-1 mt-1 leading-none">
                                <span className="text-[10px] font-mono font-medium text-slate-400 truncate">
                                    Ref: {row.gatewayRef || "N/A"}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                field: "typeAndAmount",
                headerName: "Số Tiền & Phân Loại",
                flex: 1,
                minWidth: 135,
                renderCell: (params) => {
                    const row = params.row;
                    const isRefund = row.type === "REFUND";
                    const isPayment = row.type === "PAYMENT";
                    return (
                        <div className="flex flex-col justify-center min-w-0">
                            <span
                                className={`font-mono text-xs font-black tracking-tight leading-none ${
                                    isRefund ? "text-rose-600" : "text-emerald-700"
                                }`}
                            >
                                {isRefund ? "-" : "+"}
                                {(row.amount || 0).toLocaleString("vi-VN")} ₫
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 mt-1 leading-none truncate">
                                {isPayment ? "Thanh toán" : isRefund ? "Hoàn tiền" : "Nạp ví"}
                            </span>
                        </div>
                    );
                },
            },
            {
                field: "gateway",
                headerName: "Cổng Thanh Toán",
                flex: 0.8,
                minWidth: 115,
                renderCell: (params) => {
                    const row = params.row;
                    const gw = PAYMENT_GATEWAYS[row.gateway] || {
                        shortLabel: row.gateway,
                        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
                    };
                    return (
                        <div className="flex flex-col justify-center min-w-0">
                            <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold border w-fit leading-none ${gw.badgeClass}`}
                            >
                                {gw.shortLabel}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 mt-1 leading-none truncate">
                                Bank: {row.bankCode || "DIRECT"}
                            </span>
                        </div>
                    );
                },
            },
            {
                field: "customerInfo",
                headerName: "Khách Hàng",
                flex: 1.3,
                minWidth: 175,
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
                        <div className="flex items-center gap-2.5 w-full h-full min-w-0">
                            {/* Avatar with Status Dot (Synchronized with User Management Page) */}
                            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 self-center">
                                {initials}
                                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1.5 ring-white bg-emerald-500" />
                            </div>

                            {/* Name & Contact */}
                            <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden">
                                <div className="flex items-center gap-1 leading-none">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                        {cust.name}
                                    </span>
                                    <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1 py-0.2 rounded shrink-0">
                                        {cust.membershipCode || "MEM"}
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5 leading-tight">
                                    {cust.phone}
                                </div>
                            </div>
                        </div>
                    );
                },
            },
            {
                field: "status",
                headerName: "Trạng Thái",
                flex: 0.8,
                minWidth: 115,
                renderCell: (params) => (
                    <div className="flex items-center h-full">
                        <StatusChip status={params.row.status} configs={TRANSACTION_STATUS_CONFIG} />
                    </div>
                ),
            },
            {
                field: "createdAt",
                headerName: "Thời Gian",
                flex: 0.7,
                minWidth: 95,
                renderCell: (params) => {
                    const row = params.row;
                    return (
                        <div className="flex flex-col justify-center min-w-0 leading-tight">
                            <span className="text-xs font-medium text-slate-800">
                                {dayjs(row.createdAt).format("HH:mm")}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                                {dayjs(row.createdAt).format("DD/MM/YYYY")}
                            </span>
                        </div>
                    );
                },
            },
            {
                field: "actions",
                headerName: "Thao Tác",
                width: 105,
                minWidth: 105,
                sortable: false,
                align: "right",
                headerAlign: "right",
                renderCell: (params) => {
                    const row = params.row;
                    return (
                        <div className="flex items-center justify-end gap-0.5 w-full h-full">
                            {/* View Details */}
                            <Tooltip title="Chi tiết" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setSelectedTxn(row);
                                        setDetailModalOpen(true);
                                    }}
                                    sx={{
                                        p: "4px",
                                        color: "#475569",
                                        "&:hover": {
                                            backgroundColor: "#EFF6FF",
                                            color: "#2563EB",
                                        },
                                    }}
                                >
                                    <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                                </IconButton>
                            </Tooltip>

                            {/* Recheck with Gateway */}
                            <Tooltip title="Đối soát" arrow>
                                <IconButton
                                    size="small"
                                    onClick={() => handleRecheckGateway(row)}
                                    sx={{
                                        p: "4px",
                                        color: "#475569",
                                        "&:hover": {
                                            backgroundColor: "#F0FDF4",
                                            color: "#16A34A",
                                        },
                                    }}
                                >
                                    <SyncOutlinedIcon sx={{ fontSize: 17 }} />
                                </IconButton>
                            </Tooltip>

                            {/* Refund Button */}
                            {row.status === "SUCCESS" && row.type === "PAYMENT" && (
                                <Tooltip title="Hoàn tiền" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setTxnToRefund(row);
                                            setRefundModalOpen(true);
                                        }}
                                        sx={{
                                            p: "4px",
                                            color: "#475569",
                                            "&:hover": {
                                                backgroundColor: "#FFF1F2",
                                                color: "#E11D48",
                                            },
                                        }}
                                    >
                                        <CurrencyExchangeOutlinedIcon sx={{ fontSize: 17 }} />
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
                        <AccountBalanceWalletOutlinedIcon className="text-violet-600" />
                        <span>Quản Lý Giao Dịch & Đối Soát</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Tra cứu luồng tiền, đối soát cổng thanh toán VNPay/MoMo/ZaloPay và hoàn tiền theo thời gian thực
                    </p>
                </div>

                {/* Right Top Actions */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Refresh Button */}
                    <Tooltip title="Tải lại dữ liệu giao dịch mới nhất" arrow>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            startIcon={<RefreshOutlinedIcon className={isRefreshing ? "animate-spin" : ""} />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "12px",
                                borderRadius: "12px",
                                borderColor: "#CBD5E1",
                                color: "#475569",
                                backgroundColor: "#FFFFFF",
                                "&:hover": {
                                    borderColor: "#94A3B8",
                                    backgroundColor: "#F8FAFC",
                                },
                            }}
                        >
                            Làm mới
                        </Button>
                    </Tooltip>

                    {/* Export Report */}
                    <Button
                        variant="outlined"
                        onClick={handleExportData}
                        startIcon={<FileDownloadOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#CBD5E1",
                            color: "#475569",
                            backgroundColor: "#FFFFFF",
                            "&:hover": {
                                borderColor: "#94A3B8",
                                backgroundColor: "#F8FAFC",
                            },
                        }}
                    >
                        Xuất báo cáo
                    </Button>

                    {/* Sync All Gateways */}
                    <Button
                        variant="contained"
                        onClick={handleSyncAllGateways}
                        startIcon={<SyncOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: "12px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)",
                            boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.35)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #0369A1 0%, #1D4ED8 100%)",
                            },
                        }}
                    >
                        Đối soát toàn bộ cổng
                    </Button>
                </div>
            </div>

            {/* 2. STATS KPI GRID (WITH WATERMARK BACKGROUND ICONS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((item, idx) => (
                    <StatCard key={idx} {...item} />
                ))}
            </div>

            {/* 3. TOOLBAR CONTROLS: MULTI-FILTER */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3.5">
                {/* Row 1: Status Tabs + Reset + Count */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                        {TRANSACTION_QUICK_TABS.map((tab) => {
                            const isSelected = statusTab === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => setStatusTab(tab.value)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                        isSelected
                                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <span className="text-xs text-slate-500 font-semibold">
                            Tìm thấy: <strong className="text-slate-900">{filteredTransactions.length}</strong> giao dịch
                        </span>

                        <Tooltip title="Đặt lại bộ lọc về mặc định" arrow>
                            <Button
                                size="small"
                                onClick={handleResetFilters}
                                startIcon={<RestartAltOutlinedIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: "11px",
                                    color: "#64748B",
                                    borderRadius: "10px",
                                }}
                            >
                                Đặt lại
                            </Button>
                        </Tooltip>
                    </div>
                </div>

                {/* Row 2: Search Input + Gateways + Type + Sort */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                    {/* Search */}
                    <div className="lg:col-span-5 relative">
                        <SearchOutlinedIcon
                            sx={{ fontSize: 18 }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm theo mã GD, mã tham chiếu, mã đơn, khách hàng..."
                            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition font-medium"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 14 }} />
                            </button>
                        )}
                    </div>

                    {/* Gateway Filter */}
                    <div className="lg:col-span-3 relative">
                        <select
                            value={selectedGateway}
                            onChange={(e) => setSelectedGateway(e.target.value)}
                            aria-label="Cổng thanh toán"
                            className="w-full pl-3 pr-8 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-blue-500 outline-none appearance-none font-semibold text-slate-700 cursor-pointer"
                        >
                            {Object.values(PAYMENT_GATEWAYS).map((gw) => (
                                <option key={gw.value} value={gw.value}>
                                    {gw.label}
                                </option>
                            ))}
                        </select>
                        <KeyboardArrowDownIcon
                            sx={{ fontSize: 16 }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="lg:col-span-2 relative">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            aria-label="Phân loại giao dịch"
                            className="w-full pl-3 pr-8 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-blue-500 outline-none appearance-none font-semibold text-slate-700 cursor-pointer"
                        >
                            {Object.values(TRANSACTION_TYPES).map((tp) => (
                                <option key={tp.value} value={tp.value}>
                                    {tp.label}
                                </option>
                            ))}
                        </select>
                        <KeyboardArrowDownIcon
                            sx={{ fontSize: 16 }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                    </div>

                    {/* Sort Options */}
                    <div className="lg:col-span-2 relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sắp xếp giao dịch"
                            className="w-full pl-3 pr-8 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-blue-500 outline-none appearance-none font-semibold text-slate-700 cursor-pointer"
                        >
                            {TRANSACTION_SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <KeyboardArrowDownIcon
                            sx={{ fontSize: 16 }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                    </div>
                </div>
            </div>

            {/* 4. DATAGRID TABLE */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
                <DataGrid
                    rows={filteredTransactions}
                    columns={columns}
                    autoHeight
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    rowHeight={80}
                    disableRowSelectionOnClick
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#F8FAFC",
                            borderBottom: "1px solid #E2E8F0",
                            fontSize: "11px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "#64748B",
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
                            lineHeight: "normal !important",
                            py: 0,
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "1px solid #F1F5F9",
                            backgroundColor: "#FFFFFF",
                        },
                    }}
                />
            </div>

            {/* 5. MODALS */}
            <TransactionDetailModal
                open={detailModalOpen}
                onClose={() => {
                    setDetailModalOpen(false);
                    setSelectedTxn(null);
                }}
                transaction={selectedTxn}
                onRecheckGateway={handleRecheckGateway}
                onOpenRefund={(txn) => {
                    setTxnToRefund(txn);
                    setRefundModalOpen(true);
                }}
            />

            <RefundTransactionModal
                open={refundModalOpen}
                onClose={() => {
                    setRefundModalOpen(false);
                    setTxnToRefund(null);
                }}
                transaction={txnToRefund}
                onConfirmRefund={handleConfirmRefund}
            />
        </div>
    );
}
