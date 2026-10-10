import React, { useState, useEffect } from "react";
import AdminModalLayout from "../AdminModalLayout.jsx";
import { ADMIN_ROLES } from "../../constants/accountConstants.js";
import dayjs from "dayjs";

// Material UI Icons
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

export default function AdminProfileModal({
    open,
    onClose,
    user,
    onUpdateProfile,
    onOpenChangePassword,
}) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open && user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
            });
            setErrors({});
            setIsSubmitting(false);
        }
    }, [open, user]);

    if (!user) return null;

    const roleInfo = ADMIN_ROLES[user.role] || ADMIN_ROLES.SUPER_ADMIN;

    const initials = user.fullName
        ? user.fullName
              .split(" ")
              .filter(Boolean)
              .slice(-2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()
        : "AD";

    const validate = () => {
        const nextErrors = {};
        if (!formData.fullName.trim()) {
            nextErrors.fullName = "Vui lòng nhập họ và tên";
        }
        if (!formData.email.trim()) {
            nextErrors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = "Email không hợp lệ";
        }
        if (!formData.phoneNumber.trim()) {
            nextErrors.phoneNumber = "Vui lòng nhập số điện thoại";
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
            if (onUpdateProfile) {
                onUpdateProfile(formData);
            }
        }, 300);
    };

    return (
        <AdminModalLayout
            open={open}
            onClose={onClose}
            maxWidth="sm"
            mode="edit"
            icon={<PersonOutlineOutlinedIcon />}
            title="Thông Tin Tài Khoản"
            subtitle="Hồ sơ quản trị viên và thông tin liên hệ công vụ"
            badgeText={user.id || "Cá nhân"}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Lưu Thay Đổi"
            submitIcon={<SaveOutlinedIcon sx={{ fontSize: 16 }} />}
            requiredHint="* Các trường có dấu sao đỏ là bắt buộc nhập"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Profile Hero Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3.5">
                        <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white font-black text-base flex items-center justify-center shadow-md shrink-0">
                            {initials}
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-black text-white truncate">{user.fullName}</h3>
                                <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                                    @{user.username}
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 truncate">
                                <StorefrontOutlinedIcon sx={{ fontSize: 14 }} className="text-violet-400 shrink-0" />
                                <span className="truncate">{user.assignedCinema || "Toàn bộ hệ thống"}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onOpenChangePassword}
                        className="px-3 py-1.5 rounded-xl border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                        <LockResetOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-300" />
                        <span>Đổi mật khẩu</span>
                    </button>
                </div>

                {/* Role Info Box */}
                <div
                    className="p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3"
                    style={{
                        backgroundColor: roleInfo.bgColor,
                        borderColor: roleInfo.borderColor,
                        color: roleInfo.color,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <BadgeOutlinedIcon sx={{ fontSize: 18 }} />
                        <span className="font-extrabold">{roleInfo.label}</span>
                    </div>
                    <span className="text-[11px] opacity-80 truncate">{roleInfo.description}</span>
                </div>

                {/* Editable Fields */}
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                            <PersonOutlineOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                            <span>Họ và tên</span>
                            <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="Nhập họ và tên đầy đủ"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition ${
                                errors.fullName
                                    ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                                    : "border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                            }`}
                        />
                        {errors.fullName && (
                            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                                <EmailOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                                <span>Email công vụ</span>
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@cinemeow.vn"
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition ${
                                    errors.email
                                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                                        : "border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                                <PhoneOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                                <span>Số điện thoại</span>
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="0988 123 456"
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition ${
                                    errors.phoneNumber
                                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                                        : "border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                }`}
                            />
                            {errors.phoneNumber && (
                                <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.phoneNumber}</p>
                            )}
                        </div>
                    </div>

                    {/* Read-only system meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <LockOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>Tên đăng nhập:</span>
                            </span>
                            <p className="font-bold text-slate-700 mt-0.5">@{user.username}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>Đăng nhập gần nhất:</span>
                            </span>
                            <p className="font-bold text-slate-700 mt-0.5">
                                {user.lastLogin ? dayjs(user.lastLogin).format("HH:mm - DD/MM/YYYY") : "Hôm nay"}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </AdminModalLayout>
    );
}
