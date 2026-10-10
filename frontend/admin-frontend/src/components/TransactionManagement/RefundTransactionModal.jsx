import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
} from "@mui/material";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export default function RefundTransactionModal({
    open,
    onClose,
    transaction,
    onConfirmRefund,
}) {
    if (!transaction) return null;

    const [refundAmount, setRefundAmount] = useState(transaction.amount || 0);
    const [reason, setReason] = useState("CUSTOMER_REQUEST");
    const [customReason, setCustomReason] = useState("");
    const [refundMethod, setRefundMethod] = useState("GATEWAY_ORIGINAL");

    const formatCurrency = (amount) => {
        return (amount || 0).toLocaleString("vi-VN") + " ₫";
    };

    const handleSubmit = () => {
        const finalReason =
            reason === "OTHER"
                ? customReason.trim() || "Hoàn tiền theo yêu cầu quản trị viên"
                : reason === "CUSTOMER_REQUEST"
                ? "Khách hàng yêu cầu hủy vé hợp lệ trước giờ chiếu"
                : reason === "TECHNICAL_ISSUE"
                ? "Sự cố kỹ thuật phòng chiếu hoặc hủy suất chiếu"
                : "Khách hàng bị trừ tiền kép (Duplicate transaction)";

        onConfirmRefund({
            transactionId: transaction.id,
            refundAmount: Number(refundAmount),
            reason: finalReason,
            refundMethod,
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
                    overflow: "hidden",
                },
            }}
        >
            {/* Top Stripe Red / Rose Gradient */}
            <div className="h-1.5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 shrink-0" />

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
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
                        <CurrencyExchangeOutlinedIcon sx={{ fontSize: 22 }} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                            Xác Nhận Hoàn Tiền Giao Dịch
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                            Giao dịch gốc: #{transaction.txnCode} • Cổng {transaction.gateway}
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

            {/* Modal Body */}
            <DialogContent sx={{ p: 3 }} className="space-y-4">
                {/* Warning Alert */}
                <Alert
                    severity="warning"
                    icon={<WarningAmberOutlinedIcon sx={{ fontSize: 20 }} />}
                    sx={{
                        borderRadius: "14px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: "#FFFBEB",
                        border: "1px solid #FDE68A",
                        color: "#92400E",
                    }}
                >
                    Lưu ý: Lệnh hoàn tiền qua cổng đối tác không thể hoàn tác sau khi đã gửi đi thành công.
                </Alert>

                {/* Transaction Snapshot */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                        <span>Khách hàng nhận hoàn:</span>
                        <span className="font-black text-slate-900">
                            {transaction.customer?.name} ({transaction.customer?.phone})
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Số tiền giao dịch ban đầu:</span>
                        <span className="font-bold text-slate-900">
                            {formatCurrency(transaction.amount)}
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Mã tham chiếu cổng:</span>
                        <span className="font-mono text-slate-700">
                            {transaction.gatewayRef}
                        </span>
                    </div>
                </div>

                {/* Refund Form Fields */}
                <div className="space-y-3.5 pt-1">
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Số tiền hoàn trả (VNĐ)
                        </label>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            inputProps={{
                                min: 1000,
                                max: transaction.amount,
                                step: 1000,
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    fontWeight: 700,
                                },
                            }}
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                            Tối đa: {formatCurrency(transaction.amount)}
                        </span>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Phương thức hoàn tiền
                        </label>
                        <FormControl fullWidth size="small">
                            <Select
                                value={refundMethod}
                                onChange={(e) => setRefundMethod(e.target.value)}
                                sx={{ borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}
                            >
                                <MenuItem value="GATEWAY_ORIGINAL" sx={{ fontSize: "12px" }}>
                                    Hoàn về tài khoản / thẻ gốc qua cổng ({transaction.gateway})
                                </MenuItem>
                                <MenuItem value="CINEPOINTS_WALLET" sx={{ fontSize: "12px" }}>
                                    Quy đổi hoàn điểm CinePoints vào ví hội viên
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Lý do hoàn tiền
                        </label>
                        <FormControl fullWidth size="small">
                            <Select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                sx={{ borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}
                            >
                                <MenuItem value="CUSTOMER_REQUEST" sx={{ fontSize: "12px" }}>
                                    Khách hàng yêu cầu hủy vé hợp lệ trước giờ chiếu
                                </MenuItem>
                                <MenuItem value="TECHNICAL_ISSUE" sx={{ fontSize: "12px" }}>
                                    Sự cố kỹ thuật rạp / Hủy suất chiếu
                                </MenuItem>
                                <MenuItem value="DUPLICATE_PAYMENT" sx={{ fontSize: "12px" }}>
                                    Trừ tiền kép tại cổng đối tác
                                </MenuItem>
                                <MenuItem value="OTHER" sx={{ fontSize: "12px" }}>
                                    Lý do khác
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {reason === "OTHER" && (
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Nhập lý do hoàn tiền cụ thể..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            multiline
                            rows={2}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                },
                            }}
                        />
                    )}
                </div>
            </DialogContent>

            {/* Modal Actions */}
            <DialogActions
                sx={{
                    p: 2.5,
                    px: 3,
                    borderTop: "1px solid #F1F5F9",
                    backgroundColor: "#FFFFFF",
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "12px",
                        borderRadius: "12px",
                    }}
                >
                    Hủy bỏ
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleSubmit}
                    startIcon={<CurrencyExchangeOutlinedIcon />}
                    sx={{
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: "12px",
                        borderRadius: "12px",
                        boxShadow: "0 10px 20px -5px rgba(225, 29, 72, 0.35)",
                    }}
                >
                    Xác nhận hoàn tiền {formatCurrency(Number(refundAmount))}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
