import React, { useState, useEffect } from "react";
import AdminModalLayout from "../AdminModalLayout.jsx";
import { IconButton } from "@mui/material";

// Material UI Icons
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

export default function ChangePasswordModal({
    open,
    onClose,
    user,
    onSuccess,
}) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            setErrors({});
            setIsSubmitting(false);
        }
    }, [open]);

    const validate = () => {
        const nextErrors = {};

        if (!formData.currentPassword) {
            nextErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
        }

        if (!formData.newPassword) {
            nextErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        } else if (formData.newPassword.length < 6) {
            nextErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
        } else if (formData.currentPassword && formData.newPassword === formData.currentPassword) {
            nextErrors.newPassword = "Mật khẩu mới không được trùng với mật khẩu hiện tại";
        }

        if (!formData.confirmPassword) {
            nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
        } else if (formData.newPassword && formData.confirmPassword !== formData.newPassword) {
            nextErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        }, 350);
    };

    return (
        <AdminModalLayout
            open={open}
            onClose={onClose}
            maxWidth="sm"
            mode="edit"
            icon={<VerifiedUserOutlinedIcon />}
            title="Đổi Mật Khẩu Quản Trị"
            subtitle={`Cập nhật mật khẩu đăng nhập an toàn cho tài khoản @${user?.username || "admin"}`}
            badgeText="Bảo mật"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Cập Nhật Mật Khẩu"
            submitIcon={<CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />}
            requiredHint="* Mật khẩu tối thiểu 6 ký tự"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
                {/* Security Advice Notice */}
                <div className="p-3.5 rounded-xl border border-violet-200/80 bg-violet-50/50 text-violet-900 text-xs flex items-start gap-2.5">
                    <ShieldOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        Để bảo vệ an toàn cho hệ thống rạp CineMeow, mật khẩu nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                    </p>
                </div>

                {/* 1. Current Password */}
                <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                        <LockOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                        <span>Mật khẩu hiện tại</span>
                        <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, currentPassword: e.target.value })
                            }
                            placeholder="Nhập mật khẩu hiện tại"
                            className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs font-medium outline-none transition ${
                                errors.currentPassword
                                    ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                                    : "border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                            title={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showCurrentPassword ? (
                                <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                            ) : (
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            )}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="text-[11px] font-medium text-rose-500 mt-1">
                            {errors.currentPassword}
                        </p>
                    )}
                </div>

                {/* 2. New Password */}
                <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                        <LockOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                        <span>Mật khẩu mới</span>
                        <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, newPassword: e.target.value })
                            }
                            placeholder="Tối thiểu 6 ký tự"
                            className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs font-medium outline-none transition ${
                                errors.newPassword
                                    ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                                    : "border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                            title={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showNewPassword ? (
                                <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                            ) : (
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            )}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-[11px] font-medium text-rose-500 mt-1">
                            {errors.newPassword}
                        </p>
                    )}
                </div>

                {/* 3. Confirm New Password */}
                <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                        <LockOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                        <span>Xác nhận mật khẩu mới</span>
                        <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            placeholder="Nhập lại mật khẩu mới"
                            className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-xs font-medium outline-none transition ${
                                errors.confirmPassword
                                    ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                                    : "border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                            title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showConfirmPassword ? (
                                <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                            ) : (
                                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-[11px] font-medium text-rose-500 mt-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>
            </form>
        </AdminModalLayout>
    );
}
