import React from "react";
import { Dialog, CircularProgress } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

/**
 * Standard Dialog Paper configuration adhering to CineMeow Design System
 */
export const ADMIN_MODAL_PAPER_PROPS = {
    sx: {
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
        background: "#ffffff",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
    },
};

/**
 * Top Gradient Stripe Component
 */
export function AdminModalTopStripe() {
    return (
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 shrink-0" />
    );
}

/**
 * Standard Modal Header Component
 */
export function AdminModalHeader({
    icon,
    title,
    subtitle,
    mode = "add",
    badgeText,
    onClose,
    children, // Additional actions such as tab switchers or sample templates
}) {
    const isAdd = mode === "add";
    const badgeLabel = badgeText || (isAdd ? "Tạo mới" : "Cập nhật");

    return (
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            {/* Left: Icon & Title info */}
            <div className="flex items-center gap-3.5">
                <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                        isAdd
                            ? "bg-violet-50 text-violet-600 border border-violet-100"
                            : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    }`}
                >
                    {icon}
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">
                            {title}
                        </h2>
                        <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${
                                isAdd
                                    ? "bg-violet-50 text-violet-700 border-violet-200"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}
                        >
                            {badgeLabel}
                        </span>
                    </div>

                    {subtitle && (
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Actions & Close Button */}
            <div className="flex items-center gap-2.5">
                {children}

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-100/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
                        title="Đóng cửa sổ"
                    >
                        <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * Standard Modal Footer Component
 */
export function AdminModalFooter({
    onClose,
    onSubmit,
    isSubmitting = false,
    cancelLabel = "Hủy bỏ",
    submitLabel = "Lưu Thay Đổi",
    submitIcon = <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />,
    requiredHint = "* Các trường có dấu sao đỏ là bắt buộc nhập",
    showSubmit = true,
    submitDisabled = false,
}) {
    return (
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400 font-medium">
                {requiredHint}
            </span>

            <div className="flex items-center gap-2.5">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100/80 text-xs font-semibold cursor-pointer transition"
                    >
                        {cancelLabel}
                    </button>
                )}

                {showSubmit && (
                    <button
                        type={onSubmit ? "button" : "submit"}
                        onClick={onSubmit}
                        disabled={isSubmitting || submitDisabled}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-violet-500/20 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <CircularProgress size={15} color="inherit" />
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                {submitIcon}
                                <span>{submitLabel}</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * Complete Plug-and-Play Admin Modal Component
 */
export default function AdminModalLayout({
    open,
    onClose,
    maxWidth = "lg",
    mode = "add",
    icon,
    title,
    subtitle,
    badgeText,
    isSubmitting = false,
    onSubmit, // If wrapped in a form, pass null and wrap children in <form> with onSubmit
    cancelLabel = "Hủy bỏ",
    submitLabel,
    requiredHint,
    showFooter = true,
    showSubmit = true,
    submitDisabled = false,
    extraHeaderActions,
    children,
}) {
    const isAdd = mode === "add";
    const defaultSubmitLabel = isAdd ? "Tạo Mới" : "Lưu Thay Đổi";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={maxWidth}
            slotProps={{ paper: ADMIN_MODAL_PAPER_PROPS }}
        >
            <AdminModalTopStripe />

            <AdminModalHeader
                icon={icon}
                title={title}
                subtitle={subtitle}
                mode={mode}
                badgeText={badgeText}
                onClose={onClose}
            >
                {extraHeaderActions}
            </AdminModalHeader>

            <div className="flex-1 overflow-y-auto">
                {children}
            </div>

            {showFooter && (
                <AdminModalFooter
                    onClose={onClose}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    cancelLabel={cancelLabel}
                    submitLabel={submitLabel || defaultSubmitLabel}
                    requiredHint={requiredHint}
                    showSubmit={showSubmit}
                    submitDisabled={submitDisabled}
                />
            )}
        </Dialog>
    );
}
