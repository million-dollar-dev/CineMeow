import React from "react";
import AdminModalLayout from "../AdminModalLayout.jsx";
import { ADMIN_ROLES, ACCOUNT_STATUS_CONFIG } from "../../constants/accountConstants.js";
import dayjs from "dayjs";

// Icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

export default function AccountDetailModal({
    open,
    onClose,
    account,
    onEdit,
    onResetPassword,
}) {
    if (!account) return null;

    const roleInfo = ADMIN_ROLES[account.role] || ADMIN_ROLES.CINEMA_MANAGER;
    const statusInfo = ACCOUNT_STATUS_CONFIG[account.status] || ACCOUNT_STATUS_CONFIG.ACTIVE;

    const initials = account.fullName
        ? account.fullName
              .split(" ")
              .filter(Boolean)
              .slice(-2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()
        : "AD";

    return (
        <AdminModalLayout
            open={open}
            onClose={onClose}
            maxWidth="sm"
            mode="edit"
            icon={<AccountCircleOutlinedIcon />}
            title="Hồ Sơ Quản Trị Viên"
            subtitle={`Chi tiết phân quyền và tình trạng tài khoản @${account.username}`}
            badgeText={account.id}
            showSubmit={false}
            cancelLabel="Đóng"
        >
            <div className="p-6 space-y-6">
                {/* Profile Hero Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-4">
                        {/* Gradient Avatar */}
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                            {initials}
                            <span
                                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-slate-900"
                                style={{ backgroundColor: statusInfo.dotColor }}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base font-black text-white">{account.fullName}</h3>
                                <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                                    @{account.username}
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                                <StorefrontOutlinedIcon sx={{ fontSize: 14 }} className="text-violet-400" />
                                <span>{account.assignedCinema}</span>
                            </p>
                        </div>
                    </div>

                    <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-extrabold border shrink-0"
                        style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.textColor,
                            borderColor: statusInfo.borderColor,
                        }}
                    >
                        {statusInfo.label}
                    </span>
                </div>

                {/* Role & Permissions Banner */}
                <div
                    className="p-4 rounded-xl border text-xs space-y-1.5"
                    style={{
                        backgroundColor: roleInfo.bgColor,
                        borderColor: roleInfo.borderColor,
                        color: roleInfo.color,
                    }}
                >
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
                        <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>{roleInfo.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                        {roleInfo.description}
                    </p>
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Email */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Email công vụ:</span>
                        </span>
                        <p className="font-bold text-slate-800 break-all">{account.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Số điện thoại:</span>
                        </span>
                        <p className="font-bold text-slate-800">{account.phoneNumber}</p>
                    </div>

                    {/* Last Login */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Lần đăng nhập cuối:</span>
                        </span>
                        <p className="font-bold text-slate-800">
                            {dayjs(account.lastLogin).format("HH:mm - DD/MM/YYYY")}
                        </p>
                    </div>

                    {/* Created Date */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Ngày khởi tạo tài khoản:</span>
                        </span>
                        <p className="font-bold text-slate-800">
                            {dayjs(account.createdAt).format("DD/MM/YYYY [lúc] HH:mm")}
                        </p>
                    </div>
                </div>

                {/* Notes */}
                {account.notes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">Ghi chú nội bộ:</span>
                        <p className="text-slate-700 leading-relaxed italic">{account.notes}</p>
                    </div>
                )}

                {/* Actions Bottom Bar */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onResetPassword(account);
                        }}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <LockResetOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-600" />
                        <span>Đặt lại mật khẩu</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onEdit(account);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-600/20"
                    >
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        <span>Chỉnh sửa tài khoản</span>
                    </button>
                </div>
            </div>
        </AdminModalLayout>
    );
}
