import React, { useState, useEffect } from "react";
import AdminModalLayout from "../AdminModalLayout.jsx";
import { Tooltip } from "@mui/material";

// Icons
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export default function ResetPasswordModal({
    open,
    onClose,
    account,
    onSubmit,
}) {
    const [tempPassword, setTempPassword] = useState("");
    const [copied, setCopied] = useState(false);
    const [requireChangeOnLogin, setRequireChangeOnLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generateRandomPassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
        let res = "CineMeow@";
        for (let i = 0; i < 4; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setTempPassword(res);
        setCopied(false);
    };

    useEffect(() => {
        if (open) {
            generateRandomPassword();
            setCopied(false);
            setRequireChangeOnLogin(true);
        }
    }, [open]);

    const handleCopy = () => {
        if (!tempPassword) return;
        navigator.clipboard.writeText(tempPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tempPassword) return;

        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit(account, tempPassword, requireChangeOnLogin);
            setIsSubmitting(false);
            onClose();
        }, 300);
    };

    if (!account) return null;

    return (
        <AdminModalLayout
            open={open}
            onClose={onClose}
            maxWidth="sm"
            mode="edit"
            icon={<LockResetOutlinedIcon />}
            title="Đặt Lại Mật Khẩu Quản Trị"
            subtitle={`Cấp phát mật khẩu tạm thời cho tài khoản @${account.username} (${account.fullName})`}
            badgeText="Bảo mật"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Xác nhận cấp lại"
            requiredHint="* Vui lòng sao chép mật khẩu gửi nhân sự"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Warning notice */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-900 text-xs flex items-start gap-2.5">
                    <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        Mật khẩu cũ của quản trị viên sẽ bị vô hiệu hóa ngay lập tức. Hãy sao chép mật khẩu mới bên dưới và bàn giao an toàn qua kênh nội bộ.
                    </p>
                </div>

                {/* Password generator field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                            Mật khẩu tạm thời mới
                        </label>
                        <button
                            type="button"
                            onClick={generateRandomPassword}
                            className="text-[11px] font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 cursor-pointer transition"
                        >
                            <AutorenewOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Tạo chuỗi ngẫu nhiên</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                className="w-full px-3.5 py-2.5 font-mono text-sm font-bold text-slate-800 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 focus:outline-none transition shadow-2xs tracking-wider"
                            />
                        </div>

                        <Tooltip title={copied ? "Đã sao chép!" : "Sao chép mật khẩu"} arrow>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                    copied
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <CheckOutlinedIcon sx={{ fontSize: 16 }} />
                                        <span>Đã chép</span>
                                    </>
                                ) : (
                                    <>
                                        <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                                        <span>Sao chép</span>
                                    </>
                                )}
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Require password change switch */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800">
                            Bắt buộc đổi mật khẩu ở lần đăng nhập tới
                        </span>
                        <p className="text-[11px] text-slate-400">
                            Người dùng sẽ phải thiết lập mật khẩu cá nhân mới trước khi được truy cập dashboard.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                            type="checkbox"
                            checked={requireChangeOnLogin}
                            onChange={(e) => setRequireChangeOnLogin(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                    </label>
                </div>
            </form>
        </AdminModalLayout>
    );
}
