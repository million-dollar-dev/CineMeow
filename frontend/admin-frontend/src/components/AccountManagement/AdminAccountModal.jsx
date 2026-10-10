import React, { useState, useEffect } from "react";
import AdminModalLayout from "../AdminModalLayout.jsx";
import { ADMIN_ROLES, ACCOUNT_STATUS_CONFIG, CINEMA_BRANCH_OPTIONS } from "../../constants/accountConstants.js";

// Icons
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function AdminAccountModal({
    open,
    onClose,
    mode = "add",
    accountData,
    onSubmit,
}) {
    const isAdd = mode === "add";

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "CINEMA_MANAGER",
        assignedCinema: CINEMA_BRANCH_OPTIONS[0].name,
        status: "ACTIVE",
        twoFactorEnabled: false,
        notes: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync form state on open/edit
    useEffect(() => {
        if (accountData && !isAdd) {
            setFormData({
                fullName: accountData.fullName || "",
                username: accountData.username || "",
                email: accountData.email || "",
                phoneNumber: accountData.phoneNumber || "",
                password: "", // Do not populate password on edit
                role: accountData.role || "CINEMA_MANAGER",
                assignedCinema: accountData.assignedCinema || CINEMA_BRANCH_OPTIONS[0].name,
                status: accountData.status || "ACTIVE",
                notes: accountData.notes || "",
            });
        } else {
            setFormData({
                fullName: "",
                username: "",
                email: "",
                phoneNumber: "",
                password: "",
                role: "CINEMA_MANAGER",
                assignedCinema: CINEMA_BRANCH_OPTIONS[0].name,
                status: "ACTIVE",
                notes: "",
            });
        }
        setErrors({});
        setShowPassword(false);
    }, [accountData, isAdd, open]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
        if (!formData.username.trim()) newErrors.username = "Vui lòng nhập tên đăng nhập";
        else if (formData.username.length < 4) newErrors.username = "Tên đăng nhập tối thiểu 4 ký tự";

        if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email không đúng định dạng";

        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Vui lòng nhập số điện thoại";

        if (isAdd) {
            if (!formData.password) newErrors.password = "Vui lòng tạo mật khẩu ban đầu";
            else if (formData.password.length < 6) newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit({
                ...(accountData || {}),
                ...formData,
                id: accountData?.id || `ADM-${String(Math.floor(Math.random() * 900) + 100)}`,
                lastLogin: accountData?.lastLogin || new Date().toISOString(),
                createdAt: accountData?.createdAt || new Date().toISOString(),
            });
            setIsSubmitting(false);
            onClose();
        }, 300);
    };

    const selectedRoleInfo = ADMIN_ROLES[formData.role] || ADMIN_ROLES.CINEMA_MANAGER;

    return (
        <AdminModalLayout
            open={open}
            onClose={onClose}
            maxWidth="md"
            mode={mode}
            icon={isAdd ? <PersonAddAlt1OutlinedIcon /> : <ManageAccountsOutlinedIcon />}
            title={isAdd ? "Thêm Quản Trị Viên Mới" : "Cập Nhật Tài Khoản Quản Trị"}
            subtitle={
                isAdd
                    ? "Cấp phát tài khoản nhân sự mới và phân quyền vai trò vận hành hệ thống CineMeow"
                    : `Điều chỉnh thông tin, quyền hạn và cụm rạp quản lý cho @${formData.username}`
            }
            badgeText={isAdd ? "Tạo mới" : "Cập nhật"}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel={isAdd ? "Tạo tài khoản" : "Lưu thay đổi"}
            requiredHint="* Trường thông tin bắt buộc"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* 1. Basic Profile Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <BadgeOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                        <span>Thông tin cá nhân & Tài khoản</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Họ và tên <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Nguyễn Hoàng Tuấn"
                                value={formData.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
                                className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border bg-slate-50/60 transition shadow-2xs ${
                                    errors.fullName
                                        ? "border-rose-300 focus:border-rose-500 ring-2 ring-rose-500/10"
                                        : "border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none"
                                }`}
                            />
                            {errors.fullName && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Tên đăng nhập (Username) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
                                <input
                                    type="text"
                                    placeholder="tuan.admin"
                                    disabled={!isAdd}
                                    value={formData.username}
                                    onChange={(e) => handleChange("username", e.target.value.toLowerCase().replace(/\s+/g, ""))}
                                    className={`w-full pl-8 pr-3.5 py-2.5 text-xs font-medium rounded-xl border transition shadow-2xs ${
                                        !isAdd
                                            ? "bg-slate-100/80 border-slate-200 text-slate-500 cursor-not-allowed"
                                            : errors.username
                                            ? "border-rose-300 focus:border-rose-500 ring-2 ring-rose-500/10 bg-slate-50/60"
                                            : "border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none"
                                    }`}
                                />
                            </div>
                            {errors.username && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <EmailOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                                <span>Email công vụ <span className="text-rose-500">*</span></span>
                            </label>
                            <input
                                type="email"
                                placeholder="tuan.nh@cinemeow.vn"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border bg-slate-50/60 transition shadow-2xs ${
                                    errors.email
                                        ? "border-rose-300 focus:border-rose-500 ring-2 ring-rose-500/10"
                                        : "border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none"
                                }`}
                            />
                            {errors.email && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <PhoneOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                                <span>Số điện thoại liên hệ <span className="text-rose-500">*</span></span>
                            </label>
                            <input
                                type="tel"
                                placeholder="0988 123 456"
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border bg-slate-50/60 transition shadow-2xs ${
                                    errors.phoneNumber
                                        ? "border-rose-300 focus:border-rose-500 ring-2 ring-rose-500/10"
                                        : "border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none"
                                }`}
                            />
                            {errors.phoneNumber && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.phoneNumber}</p>}
                        </div>

                        {/* Initial Password (Only shown when adding new) */}
                        {isAdd && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <LockOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                                    <span>Mật khẩu khởi tạo <span className="text-rose-500">*</span></span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Tối thiểu 6 ký tự bảo mật"
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        className={`w-full pl-3.5 pr-10 py-2.5 text-xs font-medium rounded-xl border bg-slate-50/60 transition shadow-2xs ${
                                            errors.password
                                                ? "border-rose-300 focus:border-rose-500 ring-2 ring-rose-500/10"
                                                : "border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                                        ) : (
                                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.password}</p>}
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Nhân viên sẽ được yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Role & Cinema Assignment */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16 }} className="text-indigo-600" />
                        <span>Phân quyền vai trò & Cụm rạp phân công</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Role Selector */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Vai trò quản trị (Role) <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => handleChange("role", e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs"
                            >
                                {Object.values(ADMIN_ROLES).map((role) => (
                                    <option key={role.code} value={role.code}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned Cinema */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <StorefrontOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400" />
                                <span>Cụm rạp phụ trách</span>
                            </label>
                            <select
                                value={formData.assignedCinema}
                                onChange={(e) => handleChange("assignedCinema", e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs"
                            >
                                {CINEMA_BRANCH_OPTIONS.map((branch) => (
                                    <option key={branch.id} value={branch.name}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Role Description Card */}
                    <div
                        className="p-3.5 rounded-xl border text-xs space-y-1"
                        style={{
                            backgroundColor: selectedRoleInfo.bgColor,
                            borderColor: selectedRoleInfo.borderColor,
                            color: selectedRoleInfo.color,
                        }}
                    >
                        <div className="flex items-center gap-2 font-bold">
                            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Phạm vi quyền hạn: {selectedRoleInfo.label}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                            {selectedRoleInfo.description}
                        </p>
                    </div>
                </div>

                {/* 3. Account Status & Notes */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <SecurityOutlinedIcon sx={{ fontSize: 16 }} className="text-emerald-600" />
                        <span>Trạng thái hoạt động & Ghi chú</span>
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Trạng thái tài khoản <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs"
                        >
                            <option value="ACTIVE">🟢 Đang hoạt động (ACTIVE) - Cho phép truy cập ca trực</option>
                            <option value="INACTIVE">🟡 Tạm ngưng (INACTIVE) - Nghỉ phép hoặc tạm ngưng</option>
                            <option value="SUSPENDED">🔴 Đã đình chỉ (SUSPENDED) - Thu hồi quyền truy cập</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Ghi chú nội bộ
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Ghi chú về phân công ca trực hoặc lý do cấp quyền..."
                            value={formData.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition shadow-2xs"
                        />
                    </div>
                </div>
            </form>
        </AdminModalLayout>
    );
}
