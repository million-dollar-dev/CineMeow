import React, { useEffect, useMemo } from "react";
import {
    Box,
    CircularProgress,
    Dialog,
    Tooltip,
} from "@mui/material";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";

// Material Icons
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

// Services, Hooks & Constants
import {
    useCreatePromotionMutation,
    useUpdatePromotionMutation,
} from "../../services/promotionService.js";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";
import {
    PROMOTION_TYPES,
    CONDITION_TYPES,
    PROMOTION_STATUS_OPTIONS,
} from "../../constants/promotionConstants.js";
import { PROMOTION_PRESETS } from "../../mock/mockPromotions.js";

// Validation Schema
const schema = yup.object().shape({
    code: yup
        .string()
        .trim()
        .required("Vui lòng nhập mã ưu đãi.")
        .matches(/^[A-Z0-9_-]+$/, "Mã chỉ được chứa chữ hoa, số, dấu gạch ngang hoặc gạch dưới.")
        .max(30, "Mã không được vượt quá 30 ký tự."),
    name: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên chương trình khuyến mãi.")
        .max(150, "Tên không được vượt quá 150 ký tự."),
    description: yup
        .string()
        .trim()
        .max(500, "Mô tả không vượt quá 500 ký tự.")
        .nullable(),
    type: yup.string().required("Vui lòng chọn loại ưu đãi."),
    value: yup
        .number()
        .typeError("Giá trị giảm phải là một số hợp lệ.")
        .positive("Giá trị giảm phải lớn hơn 0.")
        .required("Vui lòng nhập mức giảm giá."),
    minOrderValue: yup
        .number()
        .typeError("Đơn hàng tối thiểu phải là số hợp lệ.")
        .min(0, "Giá trị không được âm.")
        .nullable(),
    usageLimit: yup
        .number()
        .typeError("Giới hạn lượt dùng phải là số hợp lệ.")
        .min(0, "Lượt dùng không được âm.")
        .nullable(),
    startDate: yup.string().required("Vui lòng chọn ngày giờ bắt đầu áp dụng."),
    endDate: yup
        .string()
        .required("Vui lòng chọn ngày giờ kết thúc chương trình.")
        .test("is-after-start", "Ngày kết thúc phải diễn ra sau ngày bắt đầu.", function (val) {
            const { startDate } = this.parent;
            if (!startDate || !val) return true;
            return dayjs(val).isAfter(dayjs(startDate));
        }),
    status: yup.string().required("Vui lòng chọn trạng thái."),
    forGuest: yup.boolean(),
    applyFnb: yup.boolean(),
    applyTicket: yup.boolean(),
});

export default function PromotionModal({ open, onClose, mode = "add", itemData }) {
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            code: "",
            name: "",
            description: "",
            type: "PERCENTAGE",
            value: 10,
            minOrderValue: 0,
            usageLimit: 500,
            status: "ACTIVE",
            startDate: dayjs().format("YYYY-MM-DDTHH:mm"),
            endDate: dayjs().add(30, "day").format("YYYY-MM-DDTHH:mm"),
            forGuest: true,
            applyFnb: true,
            applyTicket: true,
            conditions: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "conditions",
    });

    const [
        createPromotion,
        { isLoading: isCreating, isError: isCreateError, error: createError },
    ] = useCreatePromotionMutation();

    const [
        updatePromotion,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdatePromotionMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    // Watch values for real-time live preview
    const watchedCode = watch("code");
    const watchedName = watch("name");
    const watchedType = watch("type");
    const watchedValue = watch("value");
    const watchedMinOrder = watch("minOrderValue");
    const watchedEndDate = watch("endDate");
    const watchedStatus = watch("status");
    const watchedForGuest = watch("forGuest");
    const watchedApplyFnb = watch("applyFnb");
    const watchedApplyTicket = watch("applyTicket");

    useEffect(() => {
        if (open) {
            if (mode === "edit" && itemData) {
                reset({
                    code: itemData.code || "",
                    name: itemData.name || "",
                    description: itemData.description || "",
                    type: itemData.type || "PERCENTAGE",
                    value: itemData.value ? Number(itemData.value) : 0,
                    minOrderValue: itemData.minOrderValue ? Number(itemData.minOrderValue) : 0,
                    usageLimit: itemData.usageLimit ? Number(itemData.usageLimit) : 0,
                    status: itemData.status || "ACTIVE",
                    startDate: itemData.startDate
                        ? dayjs(itemData.startDate).format("YYYY-MM-DDTHH:mm")
                        : dayjs().format("YYYY-MM-DDTHH:mm"),
                    endDate: itemData.endDate
                        ? dayjs(itemData.endDate).format("YYYY-MM-DDTHH:mm")
                        : dayjs().add(30, "day").format("YYYY-MM-DDTHH:mm"),
                    forGuest: !!(itemData.forGuest ?? itemData.isForGuest),
                    applyFnb: !!(itemData.applyFnb ?? itemData.isApplyFnb),
                    applyTicket: !!(itemData.applyTicket ?? itemData.isApplyTicket),
                    conditions: Array.isArray(itemData.conditions)
                        ? itemData.conditions.map((c) => ({
                              id: c.id,
                              type: c.type || "SEAT_TYPE",
                              value: c.value || "",
                          }))
                        : [],
                });
            } else {
                reset({
                    code: "",
                    name: "",
                    description: "",
                    type: "PERCENTAGE",
                    value: 10,
                    minOrderValue: 0,
                    usageLimit: 500,
                    status: "ACTIVE",
                    startDate: dayjs().format("YYYY-MM-DDTHH:mm"),
                    endDate: dayjs().add(30, "day").format("YYYY-MM-DDTHH:mm"),
                    forGuest: true,
                    applyFnb: true,
                    applyTicket: true,
                    conditions: [],
                });
            }
        }
    }, [open, mode, itemData, reset]);

    const handleApplyPreset = (preset) => {
        setValue("code", preset.code, { shouldValidate: true });
        setValue("name", preset.name, { shouldValidate: true });
        setValue("type", preset.type, { shouldValidate: true });
        setValue("value", preset.value, { shouldValidate: true });
        setValue("minOrderValue", preset.minOrderValue, { shouldValidate: true });
        setValue("applyTicket", preset.applyTicket);
        setValue("applyFnb", preset.applyFnb);
        setValue("forGuest", preset.forGuest);
        setValue("status", preset.status);
    };

    const onSubmit = async (formData) => {
        try {
            const payload = {
                code: formData.code.toUpperCase().trim(),
                name: formData.name.trim(),
                description: formData.description?.trim() || "",
                type: formData.type,
                value: Number(formData.value),
                minOrderValue: Number(formData.minOrderValue || 0),
                usageLimit: Number(formData.usageLimit || 0),
                startDate: formData.startDate ? `${formData.startDate}:00` : null,
                endDate: formData.endDate ? `${formData.endDate}:00` : null,
                status: formData.status,
                forGuest: !!formData.forGuest,
                applyFnb: !!formData.applyFnb,
                applyTicket: !!formData.applyTicket,
                conditions: formData.conditions
                    ?.filter((c) => c.type && c.value?.trim())
                    .map((c) => ({
                        type: c.type,
                        value: c.value.trim(),
                    })),
            };

            if (mode === "add") {
                await createPromotion(payload).unwrap();
                dispatch(
                    openSnackbar({
                        message: `Đã khởi tạo thành công mã khuyến mãi "${payload.code}"!`,
                        type: "success",
                    })
                );
            } else {
                await updatePromotion({ id: itemData.id, ...payload }).unwrap();
                dispatch(
                    openSnackbar({
                        message: `Cập nhật thành công chương trình ưu đãi "${payload.code}"!`,
                        type: "success",
                    })
                );
            }
            onClose();
        } catch (err) {
            dispatch(
                openSnackbar({
                    message:
                        err?.data?.message ||
                        err?.error ||
                        "Thao tác thất bại. Vui lòng kiểm tra lại thông tin.",
                    type: "error",
                })
            );
        }
    };

    const isSubmitting = isCreating || isUpdating;

    // Computed display value
    const formattedDiscountDisplay = useMemo(() => {
        if (!watchedValue && watchedValue !== 0) return "GIẢM 0%";
        if (watchedType === "PERCENTAGE") {
            return `GIẢM ${watchedValue}%`;
        }
        return `GIẢM ${Number(watchedValue).toLocaleString("vi-VN")} ₫`;
    }, [watchedType, watchedValue]);

    return (
        <Dialog
            open={open}
            onClose={isSubmitting ? undefined : onClose}
            fullWidth
            maxWidth="xl"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "24px",
                        overflow: "hidden",
                        background: "#ffffff",
                        boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
                        maxHeight: "92vh",
                        display: "flex",
                        flexDirection: "column",
                    },
                },
            }}
        >
            {/* Top Gradient Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 shrink-0" />

            {/* 1. MODAL HEADER */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3.5">
                    <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                            mode === "add"
                                ? "bg-violet-50 text-violet-600 border border-violet-100"
                                : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        }`}
                    >
                        <ConfirmationNumberOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                {mode === "add" ? "Thêm Mã Ưu Đãi / Khuyến Mãi Mới" : `Hiệu Chỉnh Ưu Đãi: ${itemData?.code || ""}`}
                            </h2>
                            <span
                                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${
                                    mode === "add"
                                        ? "bg-violet-50 text-violet-700 border-violet-200"
                                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                }`}
                            >
                                {mode === "add" ? "Tạo mới" : "Cập nhật"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Cấu hình thể lệ giảm giá, thời hạn hiệu lực và điều kiện áp dụng tại chuỗi rạp CineMeow
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* Quick sample template switcher in header for add mode */}
                    {mode === "add" && (
                        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
                            <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                                <AutoFixHighOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-500" />
                                Mẫu gợi ý:
                            </span>
                            {PROMOTION_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleApplyPreset(preset)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-slate-600 hover:text-violet-600 hover:bg-violet-50 border border-slate-200/70 hover:border-violet-200 transition cursor-pointer shadow-2xs"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex items-center justify-center cursor-pointer disabled:opacity-50"
                    >
                        <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>

            {/* 2. MODAL BODY (Grid 12 cols: 7 cols Form - 5 cols Live Client Preview) */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT COLUMN: Input Form (7 cols) */}
                        <div className="lg:col-span-7 space-y-5">
                            
                            {/* Card 1: Thông tin cơ bản */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                                    <SellOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                                        1. Thông Tin Nhận Diện & Mã Ưu Đãi
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Code */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Mã Voucher / Coupon <span className="text-rose-500">*</span>
                                        </label>
                                        <Controller
                                            name="code"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="VD: CINEMEOW20"
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                        className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl border ${
                                                            errors.code
                                                                ? "border-rose-400 bg-rose-50/20"
                                                                : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                        } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition tracking-wider text-slate-800`}
                                                    />
                                                    {errors.code && (
                                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                            {errors.code.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </div>

                                    {/* Status: Dropdown matches table values exactly */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Trạng thái áp dụng <span className="text-rose-500">*</span>
                                        </label>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer text-slate-800"
                                                >
                                                    {PROMOTION_STATUS_OPTIONS.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Program Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Tên chương trình ưu đãi <span className="text-rose-500">*</span>
                                    </label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="VD: Tri Ân Khách Hàng - Giảm 20% Vé Xem Phim & F&B"
                                                    className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border ${
                                                        errors.name
                                                            ? "border-rose-400 bg-rose-50/20"
                                                            : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800`}
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                        {errors.name.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Mô tả chi tiết thể lệ
                                    </label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                rows={2}
                                                placeholder="Mô tả quyền lợi, đối tượng được hưởng ưu đãi hoặc ghi chú lưu ý..."
                                                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800 resize-none"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Card 2: Hình thức & Định mức giảm giá */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                                    <LocalActivityOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                                        2. Hình Thức & Định Mức Giảm Giá
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Type */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Loại hình giảm giá <span className="text-rose-500">*</span>
                                        </label>
                                        <Controller
                                            name="type"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer text-slate-800"
                                                >
                                                    {PROMOTION_TYPES.map((t) => (
                                                        <option key={t.value} value={t.value}>
                                                            {t.icon} {t.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                    </div>

                                    {/* Value */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            {watchedType === "PERCENTAGE" ? "Mức giảm (%)" : "Mức giảm (VNĐ)"}{" "}
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <Controller
                                            name="value"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        placeholder={watchedType === "PERCENTAGE" ? "VD: 20" : "VD: 50000"}
                                                        className={`w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border ${
                                                            errors.value
                                                                ? "border-rose-400 bg-rose-50/20"
                                                                : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                        } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800`}
                                                    />
                                                    {errors.value && (
                                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                            {errors.value.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </div>

                                    {/* Min Order Value */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Đơn hàng tối thiểu (VNĐ)
                                        </label>
                                        <Controller
                                            name="minOrderValue"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="number"
                                                    placeholder="VD: 100000 (0 nếu không yêu cầu)"
                                                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800"
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Usage Limit */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Giới hạn lượt dùng toàn hệ thống
                                        </label>
                                        <Controller
                                            name="usageLimit"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="number"
                                                    placeholder="VD: 500 (0 = không giới hạn)"
                                                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Thời gian hiệu lực & Phạm vi áp dụng */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                                    <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                                        3. Thời Gian Hiệu Lực & Phạm Vi Áp Dụng
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Thời gian bắt đầu <span className="text-rose-500">*</span>
                                        </label>
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <input
                                                        {...field}
                                                        type="datetime-local"
                                                        className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border ${
                                                            errors.startDate
                                                                ? "border-rose-400 bg-rose-50/20"
                                                                : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                        } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800`}
                                                    />
                                                    {errors.startDate && (
                                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                            {errors.startDate.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Thời gian kết thúc <span className="text-rose-500">*</span>
                                        </label>
                                        <Controller
                                            name="endDate"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <input
                                                        {...field}
                                                        type="datetime-local"
                                                        className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border ${
                                                            errors.endDate
                                                                ? "border-rose-400 bg-rose-50/20"
                                                                : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                        } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800`}
                                                    />
                                                    {errors.endDate && (
                                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                            {errors.endDate.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Applicable Scope Checkboxes */}
                                <div className="pt-2 border-t border-slate-100">
                                    <label className="block text-xs font-bold text-slate-700 mb-2">
                                        Phạm vi kích hoạt ưu đãi:
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        <Controller
                                            name="applyTicket"
                                            control={control}
                                            render={({ field }) => (
                                                <label className={`flex items-center gap-2 p-2.5 rounded-xl border transition cursor-pointer select-none text-xs font-semibold ${
                                                    field.value
                                                        ? "border-violet-500 bg-violet-50/60 text-violet-800"
                                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/60"
                                                }`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                                                    />
                                                    <LocalActivityOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                                    <span>Vé xem phim</span>
                                                </label>
                                            )}
                                        />

                                        <Controller
                                            name="applyFnb"
                                            control={control}
                                            render={({ field }) => (
                                                <label className={`flex items-center gap-2 p-2.5 rounded-xl border transition cursor-pointer select-none text-xs font-semibold ${
                                                    field.value
                                                        ? "border-violet-500 bg-violet-50/60 text-violet-800"
                                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/60"
                                                }`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                                                    />
                                                    <FastfoodOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                                    <span>Combo F&B</span>
                                                </label>
                                            )}
                                        />

                                        <Controller
                                            name="forGuest"
                                            control={control}
                                            render={({ field }) => (
                                                <label className={`flex items-center gap-2 p-2.5 rounded-xl border transition cursor-pointer select-none text-xs font-semibold ${
                                                    field.value
                                                        ? "border-violet-500 bg-violet-50/60 text-violet-800"
                                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/60"
                                                }`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                                                    />
                                                    <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                                    <span>Khách vãng lai</span>
                                                </label>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Điều kiện ràng buộc đặc biệt */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3.5">
                                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <InfoOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                        <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                                            4. Ràng Buộc & Điều Kiện Đặc Biệt ({fields.length})
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => append({ type: "SEAT_TYPE", value: "" })}
                                        className="px-2.5 py-1 text-xs font-bold text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <AddOutlinedIcon sx={{ fontSize: 15 }} />
                                        <span>Thêm điều kiện</span>
                                    </button>
                                </div>

                                {fields.length === 0 ? (
                                    <p className="text-xs text-slate-400 font-medium italic py-2">
                                        Chưa có điều kiện ràng buộc. Mã sẽ áp dụng rộng rãi cho mọi khách hàng và phòng chiếu hợp lệ.
                                    </p>
                                ) : (
                                    <div className="space-y-2.5">
                                        {fields.map((fieldItem, idx) => (
                                            <div
                                                key={fieldItem.id}
                                                className="grid grid-cols-12 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 items-center"
                                            >
                                                <div className="col-span-5">
                                                    <Controller
                                                        name={`conditions.${idx}.type`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <select
                                                                {...field}
                                                                className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white focus:border-violet-500 focus:outline-none transition cursor-pointer text-slate-800"
                                                            >
                                                                {CONDITION_TYPES.map((c) => (
                                                                    <option key={c.value} value={c.value}>
                                                                        {c.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-6">
                                                    <Controller
                                                        name={`conditions.${idx}.value`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                placeholder="Nhập giá trị ràng buộc..."
                                                                className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white focus:border-violet-500 focus:outline-none transition text-slate-800"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-1 flex justify-center">
                                                    <Tooltip title="Xóa điều kiện" arrow>
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(idx)}
                                                            className="p-1 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                                        >
                                                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LIVE VOUCHER PASS CLIENT PREVIEW (5 cols) */}
                        <div className="lg:col-span-5 sticky top-2">
                            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Xem Trước Voucher Khách Hàng
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                                        Live Client Preview
                                    </span>
                                </div>

                                {/* TICKET VOUCHER PASS CARD (PERFORATED TICKET EFFECT) */}
                                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-violet-700/30 text-white select-none transition-all duration-300 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800">
                                    {/* Top Notch & Brand Header */}
                                    <div className="p-4.5 pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xs text-white">
                                                    CM
                                                </div>
                                                <span className="text-xs font-black tracking-wider uppercase">
                                                    CineMeow Pass
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                                                {watchedStatus === "ACTIVE"
                                                    ? "Kích hoạt"
                                                    : watchedStatus === "INACTIVE"
                                                    ? "Chưa kích hoạt"
                                                    : "Đã hết hạn"}
                                            </span>
                                        </div>

                                        {/* Main Discount Amount */}
                                        <div className="mt-4">
                                            <div className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
                                                {formattedDiscountDisplay}
                                            </div>
                                            <div className="text-xs font-semibold text-white/90 line-clamp-1 mt-1">
                                                {watchedName || "Chưa đặt tên chương trình ưu đãi"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Perforated Divider with Semicircular Notches */}
                                    <div className="relative flex items-center my-1">
                                        {/* Left Notch */}
                                        <div className="w-4 h-6 bg-slate-50/50 rounded-r-full -ml-2" />
                                        {/* Dashed line */}
                                        <div className="flex-1 border-t-2 border-dashed border-white/30 mx-2" />
                                        {/* Right Notch */}
                                        <div className="w-4 h-6 bg-slate-50/50 rounded-l-full -mr-2" />
                                    </div>

                                    {/* Bottom Ticket Details */}
                                    <div className="p-4.5 pt-2 space-y-3">
                                        {/* Coupon Code Pill */}
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/10">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-white/60 block">
                                                    Mã voucher
                                                </span>
                                                <span className="text-sm font-mono font-black tracking-widest text-amber-300">
                                                    {watchedCode || "VOUCHERCODE"}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/20 text-white">
                                                SAO CHÉP
                                            </span>
                                        </div>

                                        {/* Meta Information List */}
                                        <div className="text-[11px] space-y-1.5 text-white/80 font-medium">
                                            <div className="flex items-center justify-between">
                                                <span>Đơn tối thiểu:</span>
                                                <span className="font-bold text-white">
                                                    {watchedMinOrder && Number(watchedMinOrder) > 0
                                                        ? `${Number(watchedMinOrder).toLocaleString("vi-VN")} ₫`
                                                        : "Không giới hạn"}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span>Hiệu lực đến:</span>
                                                <span className="font-bold text-white">
                                                    {watchedEndDate
                                                        ? dayjs(watchedEndDate).format("DD/MM/YYYY HH:mm")
                                                        : "Vô thời hạn"}
                                                </span>
                                            </div>

                                            {/* Scope Chips */}
                                            <div className="flex items-center gap-1 flex-wrap pt-1">
                                                {watchedApplyTicket && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20">
                                                        🎟️ Vé phim
                                                    </span>
                                                )}
                                                {watchedApplyFnb && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20">
                                                        🍿 Bắp nước
                                                    </span>
                                                )}
                                                {watchedForGuest && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20">
                                                        👤 Khách vãng lai
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Simulated Barcode at bottom */}
                                        <div className="pt-2 border-t border-white/10 flex flex-col items-center justify-center text-center">
                                            <div className="flex items-center gap-1 h-6 opacity-70">
                                                {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 3, 1, 4, 2].map((w, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-white h-full"
                                                        style={{ width: `${w * 1.5}px` }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-mono text-white/50 tracking-widest mt-1">
                                                {watchedCode ? `*${watchedCode}*` : "*CINEMEOW-PASS*"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Helper note */}
                                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-800 space-y-1">
                                    <p className="font-bold text-amber-900 flex items-center gap-1.5">
                                        <span>💡</span> Lưu ý phát hành:
                                    </p>
                                    <p>• Mã ưu đãi sẽ có hiệu lực tức thì ngay sau khi kích hoạt thành công.</p>
                                    <p>• Khách hàng có thể nhập mã tại bước chọn ghế hoặc giỏ hàng F&B.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MODAL FOOTER */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
                    <span className="text-xs text-slate-400 font-medium">
                        (*) Các trường đánh dấu sao là bắt buộc nhập
                    </span>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-violet-500/25 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <CircularProgress size={16} color="inherit" />
                                    <span>{mode === "add" ? "Đang khởi tạo..." : "Đang lưu..."}</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 17 }} />
                                    <span>{mode === "add" ? "Khởi Tạo Ưu Đãi" : "Lưu Thay Đổi"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </Dialog>
    );
}
