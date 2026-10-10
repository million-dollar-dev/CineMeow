import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tooltip,
} from "@mui/material";
import dayjs from "dayjs";

// Icons
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

// Components
import StatusChip from "../StatusChip.jsx";

// Constants
import {
    TRANSACTION_STATUSES,
    TRANSACTION_STATUS_CONFIG,
    PAYMENT_GATEWAYS,
    TRANSACTION_TYPES,
} from "../../constants/transactionConstants.js";
import { MEMBERSHIP_TIERS } from "../../constants/accountConstants.js";

export default function TransactionDetailModal({
    open,
    onClose,
    transaction,
    onRecheckGateway,
    onOpenRefund,
}) {
    const [activeTab, setActiveTab] = useState("OVERVIEW"); // "OVERVIEW" | "GATEWAY_LOGS" | "TIMELINE"
    const [copiedRef, setCopiedRef] = useState(false);
    const [copiedTxn, setCopiedTxn] = useState(false);

    if (!transaction) return null;

    const statusConfig = TRANSACTION_STATUSES[transaction.status] || TRANSACTION_STATUSES.PENDING;
    const gatewayConfig = PAYMENT_GATEWAYS[transaction.gateway] || {
        label: transaction.gateway,
        shortLabel: transaction.gateway,
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    };
    const typeConfig = TRANSACTION_TYPES[transaction.type] || TRANSACTION_TYPES.PAYMENT;

    const formatCurrency = (amount) => {
        return (amount || 0).toLocaleString("vi-VN") + " ₫";
    };

    const handleCopy = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        if (type === "ref") {
            setCopiedRef(true);
            setTimeout(() => setCopiedRef(false), 2000);
        } else {
            setCopiedTxn(true);
            setTimeout(() => setCopiedTxn(false), 2000);
        }
    };

    const getCustomerTier = (tierCode) => {
        const key = String(tierCode || "STANDARD").toUpperCase();
        if (key === "DIAMOND" || key === "PLATINUM") return MEMBERSHIP_TIERS.PLATINUM;
        if (key === "GOLD") return MEMBERSHIP_TIERS.GOLD;
        if (key === "SILVER") return MEMBERSHIP_TIERS.SILVER;
        return MEMBERSHIP_TIERS.STANDARD;
    };

    const customerTier = getCustomerTier(transaction.customer?.tier);
    const customerInitials = transaction.customer?.name
        ? transaction.customer.name
              .split(" ")
              .filter(Boolean)
              .slice(-2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()
        : "KH";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    maxHeight: "92vh",
                    boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* Top Stripe Gradient */}
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shrink-0" />

            {/* Modal Header */}
            <DialogTitle
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #F1F5F9",
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                        <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                Chi Tiết Giao Dịch & Quyết Toán
                            </h3>
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                                {transaction.txnCode}
                            </span>
                            <StatusChip status={transaction.status} configs={TRANSACTION_STATUS_CONFIG} />
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Khởi tạo lúc: {dayjs(transaction.createdAt).format("HH:mm:ss - DD/MM/YYYY")}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                >
                    <CloseOutlinedIcon sx={{ fontSize: 20 }} />
                </button>
            </DialogTitle>

            {/* Navigation Tabs */}
            <div className="px-6 pt-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab("OVERVIEW")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        activeTab === "OVERVIEW"
                            ? "border-blue-600 text-blue-600 bg-white rounded-t-xl"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                >
                    <ReceiptLongOutlinedIcon sx={{ fontSize: 17 }} />
                    <span>Tổng quan giao dịch</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("GATEWAY_LOGS")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        activeTab === "GATEWAY_LOGS"
                            ? "border-blue-600 text-blue-600 bg-white rounded-t-xl"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                >
                    <CodeOutlinedIcon sx={{ fontSize: 17 }} />
                    <span>Kỹ thuật cổng (IPN / Webhook)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("TIMELINE")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        activeTab === "TIMELINE"
                            ? "border-blue-600 text-blue-600 bg-white rounded-t-xl"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                >
                    <HistoryOutlinedIcon sx={{ fontSize: 17 }} />
                    <span>Lịch sử xử lý ({transaction.timeline?.length || 0})</span>
                </button>
            </div>

            {/* Modal Body Content */}
            <DialogContent sx={{ p: 3 }} className="overflow-y-auto space-y-5">
                {/* 1. Large Top Hero Amount Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-300">
                                Số tiền thanh toán thực tế
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                    transaction.type === "REFUND"
                                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                }`}
                            >
                                {typeConfig.shortLabel || transaction.type}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span
                                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                                    transaction.type === "REFUND" ? "text-rose-400" : "text-emerald-400"
                                }`}
                            >
                                {transaction.type === "REFUND" ? "-" : "+"}
                                {formatCurrency(transaction.amount)}
                            </span>
                            <span className="text-xs text-slate-400">
                                (Phí cổng: {formatCurrency(transaction.fee)})
                            </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                            Quyết toán ròng: <strong className="text-white">{formatCurrency(transaction.netAmount)}</strong>
                        </p>
                    </div>

                    {/* Gateway Badge & Ref Code */}
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1.5 shrink-0 min-w-[200px]">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-300 uppercase font-bold">
                                Cổng thanh toán
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${gatewayConfig.badgeClass}`}
                            >
                                {gatewayConfig.shortLabel}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                            <div className="min-w-0">
                                <span className="text-[10px] text-slate-400 block font-mono">
                                    Mã tham chiếu cổng:
                                </span>
                                <span className="font-mono text-xs font-bold text-white truncate block">
                                    {transaction.gatewayRef || "N/A"}
                                </span>
                            </div>
                            <Tooltip title={copiedRef ? "Đã chép!" : "Sao chép mã tham chiếu"} arrow>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(transaction.gatewayRef, "ref")}
                                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
                                >
                                    <ContentCopyOutlinedIcon sx={{ fontSize: 13 }} />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeTab === "OVERVIEW" && (
                    <div className="space-y-4">
                        {/* 1.1 Customer Profile Card - Synchronized with User Management */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                                <span>Khách hàng thành viên thực hiện giao dịch</span>
                            </h5>

                            {/* Header Profile Card with Avatar & Tier Badge */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                    {/* Gradient Avatar */}
                                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                                        {customerInitials}
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white bg-emerald-500" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-base font-black text-slate-900 leading-snug truncate">
                                                {transaction.customer?.name}
                                            </h3>
                                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded shrink-0">
                                                {transaction.customer?.membershipCode || "MEM-GUEST"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                                            {transaction.customer?.phone} • {transaction.customer?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Tier Badge */}
                                <div
                                    className="px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-2xs"
                                    style={{
                                        backgroundColor: customerTier.bgColor,
                                        color: customerTier.color,
                                        borderColor: customerTier.borderColor,
                                        height: "fit-content",
                                    }}
                                >
                                    <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16 }} />
                                    <span>{customerTier.label}</span>
                                </div>
                            </div>
                        </div>

                        {/* 1.2 Linked Order Details */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <TheatersOutlinedIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                                <span>Thông tin đơn hàng & Suất chiếu liên kết</span>
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                                    <span className="text-[11px] text-slate-400 font-bold block uppercase">
                                        Mã đơn đặt vé
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-extrabold text-blue-700 text-sm">
                                            {transaction.orderCode}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 block truncate">
                                        Mã vé: {transaction.ticketCode || "N/A (Giao dịch nạp ví)"}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                                    <span className="text-[11px] text-slate-400 font-bold block uppercase">
                                        Phim & Cụm rạp
                                    </span>
                                    <span className="font-bold text-slate-900 block truncate">
                                        {transaction.movieTitle}
                                    </span>
                                    <span className="text-[11px] text-slate-500 block truncate">
                                        {transaction.cinemaName}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 1.3 Financial Settlement Breakdown */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <ReceiptLongOutlinedIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                                <span>Bảng kê quyết toán tài chính & Phí cổng</span>
                            </h5>

                            <div className="divide-y divide-slate-100 text-xs">
                                <div className="flex justify-between py-2 text-slate-600">
                                    <span>Giá trị đơn hàng (Gross Amount):</span>
                                    <span className="font-bold text-slate-900">{formatCurrency(transaction.amount)}</span>
                                </div>
                                <div className="flex justify-between py-2 text-slate-600">
                                    <span>Phí giao dịch cổng thanh toán ({transaction.gateway}):</span>
                                    <span className="font-bold text-rose-600">-{formatCurrency(transaction.fee)}</span>
                                </div>
                                <div className="flex justify-between py-2 text-slate-600">
                                    <span>Thuế GTGT (VAT 8% đã bao gồm):</span>
                                    <span className="font-bold text-slate-700">{formatCurrency(Math.round(transaction.amount * 0.08))}</span>
                                </div>
                                <div className="flex justify-between py-2.5 text-sm font-black text-slate-900 bg-slate-50 px-3 rounded-xl mt-1">
                                    <span>Thực thu về ví merchant CineMeow:</span>
                                    <span className="text-emerald-700 font-mono">{formatCurrency(transaction.netAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: TECHNICAL GATEWAY LOGS */}
                {activeTab === "GATEWAY_LOGS" && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-3 border border-slate-800 shadow-md">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                <span className="text-emerald-400 font-bold uppercase text-[11px]">
                                    Cổng phản hồi: {gatewayConfig.label}
                                </span>
                                <span className="text-slate-400 text-[10px]">
                                    IPN Webhook Time: {transaction.completedAt || transaction.createdAt}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                                <div>
                                    <span className="text-slate-400 block">Response Code:</span>
                                    <span className="text-white font-bold">{transaction.responseCode}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">Bank / Partner Code:</span>
                                    <span className="text-white font-bold">{transaction.bankCode || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">Gateway Transaction Ref:</span>
                                    <span className="text-amber-400 font-bold">{transaction.gatewayRef}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">Client IP Address:</span>
                                    <span className="text-white font-bold">{transaction.ipAddress}</span>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                                    Thông điệp phản hồi từ Cổng (Gateway Message):
                                </span>
                                <div className="p-2.5 rounded-lg bg-slate-950 text-slate-300 text-xs">
                                    "{transaction.responseMessage}"
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: TIMELINE AUDIT */}
                {activeTab === "TIMELINE" && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                        <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <HistoryOutlinedIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                            <span>Nhật ký luồng giao dịch & Đối soát cổng</span>
                        </h5>

                        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 pl-2">
                            {transaction.timeline?.map((item, idx) => (
                                <div key={idx} className="relative flex items-start gap-3.5 pl-6">
                                    <div
                                        className={`absolute left-2 w-3.5 h-3.5 rounded-full border-2 border-white -translate-x-1/2 mt-1 shadow-xs ${
                                            item.status === "SUCCESS"
                                                ? "bg-emerald-500 ring-4 ring-emerald-100"
                                                : item.status === "FAILED"
                                                ? "bg-rose-500 ring-4 ring-rose-100"
                                                : item.status === "REFUNDED"
                                                ? "bg-violet-500 ring-4 ring-violet-100"
                                                : "bg-amber-500 ring-4 ring-amber-100"
                                        }`}
                                    />
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 w-full text-xs">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <span className="font-black text-slate-900">{item.title}</span>
                                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                                                {item.time}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>

            {/* Modal Actions */}
            <DialogActions
                sx={{
                    p: 2.5,
                    px: 3,
                    borderTop: "1px solid #F1F5F9",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <div className="flex items-center gap-2">
                    {/* Recheck Gateway */}
                    <Button
                        variant="outlined"
                        onClick={() => onRecheckGateway(transaction)}
                        startIcon={<SyncOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#CBD5E1",
                            color: "#475569",
                            "&:hover": {
                                borderColor: "#94A3B8",
                                backgroundColor: "#F8FAFC",
                            },
                        }}
                    >
                        Đối soát lại với cổng
                    </Button>

                    {/* Refund Action (Eligible for successful payment) */}
                    {transaction.status === "SUCCESS" && transaction.type === "PAYMENT" && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => onOpenRefund(transaction)}
                            startIcon={<CurrencyExchangeOutlinedIcon />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "12px",
                                borderRadius: "12px",
                            }}
                        >
                            Yêu cầu hoàn tiền
                        </Button>
                    )}
                </div>

                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "12px",
                        borderRadius: "12px",
                        backgroundColor: "#0F172A",
                        "&:hover": {
                            backgroundColor: "#1E293B",
                        },
                    }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}
