import React from "react";
import AdminModalLayout from "../AdminModalLayout.jsx";
import { MEMBERSHIP_TIERS, ACCOUNT_STATUS_CONFIG } from "../../constants/accountConstants.js";
import dayjs from "dayjs";

// Icons
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

export default function CustomerDetailModal({
    open,
    onClose,
    customer,
    onToggleStatus,
}) {
    if (!customer) return null;

    const tier = MEMBERSHIP_TIERS[customer.membershipTier] || MEMBERSHIP_TIERS.STANDARD;
    const statusConfig = ACCOUNT_STATUS_CONFIG[customer.status] || ACCOUNT_STATUS_CONFIG.ACTIVE;
    const isActive = customer.status === "ACTIVE";

    return (
        <AdminModalLayout
            open={open}
            onClose={onClose}
            maxWidth="sm"
            mode="edit"
            title="Hồ Sơ Khách Hàng Thành Viên"
            subtitle={`Chi tiết thông tin tài khoản người dùng #${customer.id}`}
            badgeText={customer.id}
            icon={<PersonOutlineOutlinedIcon sx={{ fontSize: 22 }} />}
            showSubmit={false}
            cancelLabel="Đóng"
        >
            {/* Added px-6 py-6 for proper horizontal and vertical padding */}
            <div className="px-6 py-6 space-y-5">
                {/* Header Profile Card with Avatar */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Gradient Avatar */}
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                            {customer.fullName
                                ? customer.fullName
                                      .split(" ")
                                      .filter(Boolean)
                                      .slice(-2)
                                      .map((w) => w[0])
                                      .join("")
                                      .toUpperCase()
                                : "KH"}
                            <span
                                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white"
                                style={{ backgroundColor: statusConfig.dotColor }}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base font-black text-slate-900 leading-snug truncate">
                                    {customer.fullName}
                                </h3>
                                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded shrink-0">
                                    {customer.id}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                                @{customer.username} • {customer.email}
                            </p>
                        </div>
                    </div>

                    {/* Tier Badge */}
                    <div
                        className="px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-2xs"
                        style={{
                            backgroundColor: tier.bgColor,
                            color: tier.color,
                            borderColor: tier.borderColor,
                            height: "fit-content",
                        }}
                    >
                        <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16 }} />
                        <span>{tier.label}</span>
                    </div>
                </div>

                {/* Loyalty & Financial Metrics */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-100 text-center">
                        <span className="text-[11px] font-bold text-violet-700 flex items-center justify-center gap-1">
                            <StarsOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Điểm CinePoints</span>
                        </span>
                        <p className="text-base font-black text-violet-900 mt-1">
                            {Number(customer.points).toLocaleString("vi-VN")}
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                            <PaymentsOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Tổng chi tiêu</span>
                        </span>
                        <p className="text-base font-black text-emerald-900 mt-1">
                            {Number(customer.totalSpent).toLocaleString("vi-VN")} ₫
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                        <span className="text-[11px] font-bold text-amber-700 flex items-center justify-center gap-1">
                            <ConfirmationNumberOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Số vé đã mua</span>
                        </span>
                        <p className="text-base font-black text-amber-900 mt-1">
                            {customer.totalBookings} vé
                        </p>
                    </div>
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Email */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Email liên hệ:</span>
                        </span>
                        <p className="font-bold text-slate-800 break-all">{customer.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Số điện thoại:</span>
                        </span>
                        <p className="font-bold text-slate-800">{customer.phoneNumber}</p>
                    </div>

                    {/* Preferred Cinema */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <StorefrontOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Rạp xem thường xuyên:</span>
                        </span>
                        <p className="font-bold text-slate-800">{customer.preferredCinema || "Chưa xác định"}</p>
                    </div>

                    {/* Status */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Lần đăng nhập cuối:</span>
                        </span>
                        <p className="font-bold text-slate-800">
                            {dayjs(customer.lastLogin).format("HH:mm - DD/MM/YYYY")}
                        </p>
                    </div>

                    {/* Created Date */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Ngày đăng ký tài khoản:</span>
                        </span>
                        <p className="font-bold text-slate-800">
                            {dayjs(customer.createdAt).format("DD/MM/YYYY [lúc] HH:mm")}
                        </p>
                    </div>
                </div>

                {/* Notes */}
                {customer.notes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <span className="font-bold text-slate-700 block mb-1">Ghi chú quản trị:</span>
                        <p className="text-slate-600 leading-relaxed font-medium">{customer.notes}</p>
                    </div>
                )}

                {/* Account Status Control Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                        Tình trạng hiện tại:{" "}
                        <strong className={isActive ? "text-emerald-600" : "text-rose-600"}>
                            {statusConfig.label}
                        </strong>
                    </span>

                    <button
                        type="button"
                        onClick={() => {
                            onToggleStatus(customer);
                            onClose();
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shadow-2xs ${
                            isActive
                                ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                    >
                        {isActive ? (
                            <>
                                <BlockOutlinedIcon sx={{ fontSize: 15 }} />
                                <span>Khóa tài khoản</span>
                            </>
                        ) : (
                            <>
                                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                                <span>Mở khóa tài khoản</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AdminModalLayout>
    );
}
