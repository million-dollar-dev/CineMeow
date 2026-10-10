import React, { useEffect } from "react";
import {
    Box,
    CircularProgress,
    Dialog,
    Tooltip,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Icons
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";

// Services & Constants & Mocks
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";
import {
    useCreateFnBMutation,
    useUpdateFnBMutation,
} from "../../services/cinemaService.js";
import { useGetAllBrandsQuery } from "../../services/brandService.js";
import { FNB_AVAILABLE, FNB_CATEGORY } from "../../constants/fnbConstants.js";
import { FNB_SAMPLE_PRESETS } from "../../mock/mockFnB.js";
import { MOCK_ADMIN_BRANDS } from "../../mock/mockBrands.js";

const fnbSchema = yup.object().shape({
    brandId: yup.string().required("Vui lòng chọn thương hiệu áp dụng."),
    name: yup
        .string()
        .trim()
        .required("Tên sản phẩm không được để trống.")
        .max(100, "Tên sản phẩm không vượt quá 100 ký tự."),
    description: yup
        .string()
        .trim()
        .max(500, "Mô tả không vượt quá 500 ký tự.")
        .nullable(),
    imageUrl: yup
        .string()
        .trim()
        .url("URL hình ảnh không hợp lệ.")
        .required("Vui lòng nhập đường dẫn hình ảnh."),
    price: yup
        .number()
        .typeError("Giá phải là một số hợp lệ.")
        .positive("Giá phải lớn hơn 0.")
        .required("Vui lòng nhập đơn giá."),
    category: yup.string().required("Vui lòng chọn danh mục sản phẩm."),
    available: yup.boolean().required("Vui lòng chọn trạng thái phục vụ."),
});

const EMPTY_ITEM = {
    brandId: "",
    name: "",
    imageUrl: "",
    description: "",
    price: 69000,
    category: "COMBO",
    available: true,
};

const QUICK_PRICES = [35000, 55000, 69000, 99000, 129000, 159000];

export default function FnBModal({ open, onClose, mode = "add", itemData }) {
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(fnbSchema),
        defaultValues: EMPTY_ITEM,
    });

    const watchedBrandId = watch("brandId");
    const watchedName = watch("name");
    const watchedPrice = watch("price");
    const watchedCategory = watch("category");
    const watchedImageUrl = watch("imageUrl");
    const watchedDescription = watch("description");
    const watchedAvailable = watch("available");

    // Brands data
    const { data: brandResponse } = useGetAllBrandsQuery();
    const brands = (brandResponse?.data && brandResponse.data.length > 0)
        ? brandResponse.data
        : MOCK_ADMIN_BRANDS;

    const currentBrand = brands.find((b) => b.id === watchedBrandId) || brands[0];

    // Mutations
    const [
        createItem,
        { isLoading: isCreating, isError: isCreateError, error: createError },
    ] = useCreateFnBMutation();

    const [
        updateItem,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateFnBMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    useEffect(() => {
        if (itemData) {
            reset({
                brandId: itemData.cinemaBrand?.id || (brands[0]?.id || ""),
                name: itemData.name || "",
                imageUrl: itemData.imageUrl || "",
                description: itemData.description || "",
                price: itemData.price || 69000,
                category: itemData.category || "COMBO",
                available: itemData.available ?? true,
            });
        } else {
            reset({
                ...EMPTY_ITEM,
                brandId: brands[0]?.id || "",
            });
        }
    }, [itemData, open, reset, brands]);

    // Handle quick preset filling
    const handleApplyPreset = (preset) => {
        setValue("name", preset.name, { shouldValidate: true });
        setValue("category", preset.category, { shouldValidate: true });
        setValue("price", preset.price, { shouldValidate: true });
        setValue("imageUrl", preset.imageUrl, { shouldValidate: true });
        setValue("description", preset.description, { shouldValidate: true });
        setValue("available", preset.available, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        try {
            const payload = {
                brandId: data.brandId,
                name: data.name.trim(),
                description: data.description ? data.description.trim() : "",
                imageUrl: data.imageUrl.trim(),
                price: Number(data.price),
                category: data.category,
                available: Boolean(data.available),
            };

            if (mode === "add") {
                await createItem(payload).unwrap();
                dispatch(openSnackbar({ message: "Thêm sản phẩm F&B thành công!", type: "success" }));
            } else {
                await updateItem({ id: itemData.id, ...payload}).unwrap();
                dispatch(openSnackbar({ message: "Cập nhật sản phẩm F&B thành công!", type: "success" }));
            }
            onClose();
        } catch (err) {
            const msg = err?.data?.message || err?.message || "Có lỗi xảy ra, vui lòng thử lại!";
            dispatch(openSnackbar({ message: msg, type: "error" }));
        }
    };

    const activeCategoryConfig = FNB_CATEGORY.find((c) => c.value === watchedCategory) || FNB_CATEGORY[0];

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                        <FastfoodOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                {mode === "add" ? "Thêm Món / Combo Bắp Nước Mới" : `Hiệu Chỉnh: ${itemData?.name || "Món F&B"}`}
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
                            {mode === "add"
                                ? "Khai báo thực đơn combo bắp nước, định mức giá và cấu hình phục vụ cho cụm rạp"
                                : "Chỉnh sửa biểu phí, hình ảnh nhận diện và trạng thái mở bán tại rạp chiếu"}
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
                            {FNB_SAMPLE_PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => handleApplyPreset(preset.data)}
                                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-violet-700 hover:bg-white rounded-lg transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1"
                                >
                                    <span>{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-100/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
                        title="Đóng cửa sổ"
                    >
                        <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>

            {/* 2. MODAL BODY (Grid 12 cols: 7 cols Form - 5 cols Live Client Preview) */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* LEFT COLUMN: Input Form (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col gap-5">
                            {/* Card 1: Thông tin cơ bản */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                                    <StorefrontOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                                        1. Thông Tin Nhận Diện & Định Danh
                                    </span>
                                </div>

                                {/* Brand Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Thương hiệu áp dụng <span className="text-rose-500">*</span>
                                    </label>
                                    <Controller
                                        name="brandId"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="relative">
                                                <select
                                                    {...field}
                                                    className={`w-full pl-3 pr-8 py-2.5 text-xs font-bold text-slate-800 rounded-xl border ${
                                                        errors.brandId
                                                            ? "border-rose-400 bg-rose-50/20"
                                                            : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer`}
                                                >
                                                    <option value="">-- Chọn chuỗi cụm rạp --</option>
                                                    {brands.map((b) => (
                                                        <option key={b.id} value={b.id}>
                                                            {b.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.brandId && (
                                                    <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                        {errors.brandId.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Item Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Tên món ăn / Combo bắp nước <span className="text-rose-500">*</span>
                                    </label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="VD: Combo Couple Bắp Nước 2 Người..."
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

                                {/* Category & Price Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Category Select */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Phân loại <span className="text-rose-500">*</span>
                                        </label>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/70 rounded-xl border border-slate-200/80">
                                                    {FNB_CATEGORY.map((cat) => {
                                                        const isSelected = field.value === cat.value;
                                                        return (
                                                            <button
                                                                key={cat.value}
                                                                type="button"
                                                                onClick={() => field.onChange(cat.value)}
                                                                className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                                                                    isSelected
                                                                        ? "bg-white text-violet-700 shadow-2xs border border-violet-100"
                                                                        : "text-slate-600 hover:text-slate-900"
                                                                }`}
                                                            >
                                                                <span className="text-sm">{cat.icon}</span>
                                                                <span>{cat.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        />
                                        {errors.category && (
                                            <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                {errors.category.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Đơn giá niêm yết (VNĐ) <span className="text-rose-500">*</span>
                                        </label>
                                        <Controller
                                            name="price"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <div className="relative">
                                                        <AttachMoneyOutlinedIcon
                                                            sx={{ fontSize: 18 }}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                        />
                                                        <input
                                                            {...field}
                                                            type="number"
                                                            step="1000"
                                                            placeholder="VD: 79000"
                                                            className={`w-full pl-9 pr-12 py-2.5 text-xs font-bold rounded-xl border ${
                                                                errors.price
                                                                    ? "border-rose-400 bg-rose-50/20"
                                                                    : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                            } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800`}
                                                        />
                                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                                            ₫
                                                        </span>
                                                    </div>
                                                    {errors.price && (
                                                        <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                            {errors.price.message}
                                                        </p>
                                                    )}

                                                    {/* Quick Price Buttons */}
                                                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                                                        <span className="text-[10px] text-slate-400 font-semibold mr-1">Nhanh:</span>
                                                        {QUICK_PRICES.map((p) => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => field.onChange(p)}
                                                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition cursor-pointer ${
                                                                    Number(field.value) === p
                                                                        ? "bg-violet-50 text-violet-700 border-violet-200"
                                                                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                                                                }`}
                                                            >
                                                                {(p / 1000).toLocaleString("vi-VN")}k
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Hình ảnh & Trạng thái */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                                    <ImageIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                                        2. Hình Ảnh Món & Trạng Thái Phục Vụ
                                    </span>
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        URL Hình ảnh sản phẩm <span className="text-rose-500">*</span>
                                    </label>
                                    <Controller
                                        name="imageUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <input
                                                    {...field}
                                                    type="url"
                                                    placeholder="https://images.unsplash.com/photo-..."
                                                    className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border ${
                                                        errors.imageUrl
                                                            ? "border-rose-400 bg-rose-50/20"
                                                            : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition text-slate-800`}
                                                />
                                                {errors.imageUrl && (
                                                    <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                        {errors.imageUrl.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Serving Status Radio */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Trạng thái phục vụ tại rạp
                                    </label>
                                    <Controller
                                        name="available"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange(true)}
                                                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                                                        field.value === true
                                                            ? "bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/10"
                                                            : "bg-slate-50/50 border-slate-200 hover:bg-white"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800">Đang Mở Bán</p>
                                                            <p className="text-[10px] text-slate-500">Khách có thể đặt trong luồng vé</p>
                                                        </div>
                                                    </div>
                                                    {field.value === true && (
                                                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} className="text-emerald-600" />
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange(false)}
                                                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                                                        field.value === false
                                                            ? "bg-rose-50/60 border-rose-300 ring-2 ring-rose-500/10"
                                                            : "bg-slate-50/50 border-slate-200 hover:bg-white"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800">Tạm Ngưng Phục Vụ</p>
                                                            <p className="text-[10px] text-slate-500">Ẩn hoặc hiển thị hết hàng</p>
                                                        </div>
                                                    </div>
                                                    {field.value === false && (
                                                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} className="text-rose-600" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Card 3: Mô tả chi tiết */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                                    <DescriptionOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                                        3. Mô Tả Chi Tiết & Thành Phần
                                    </span>
                                </div>

                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <textarea
                                                {...field}
                                                rows={3}
                                                placeholder="VD: 1 Hộp bắp rang bơ 64oz khổng lồ vị ngọt/phô mai + 2 Ly nước ngọt có gas 32oz..."
                                                className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border ${
                                                    errors.description
                                                        ? "border-rose-400 bg-rose-50/20"
                                                        : "border-slate-200 bg-slate-50/60 focus:bg-white"
                                                } focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition resize-none text-slate-800`}
                                            />
                                            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                                                <span>Gợi ý: Liệt kê rõ số lượng bắp, kích cỡ ly nước ngọt để khách dễ chọn.</span>
                                                <span>{(field.value || "").length}/500</span>
                                            </div>
                                            {errors.description && (
                                                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                    {errors.description.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Live Client Combo Card Preview (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col">
                            <div className="sticky top-0 p-5 rounded-2xl bg-[#0F1017] border border-zinc-800 shadow-xl space-y-4 text-white">
                                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-black text-zinc-300 uppercase tracking-wider">
                                            Live Preview Đặt Vé Client
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-violet-400 bg-violet-950/60 border border-violet-800/80 px-2 py-0.5 rounded-full">
                                        CineMeow Mobile / Web
                                    </span>
                                </div>

                                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                                    Mô phỏng hiển thị thực tế của món ăn trong cửa sổ chọn combo bắp nước tại bước thanh toán:
                                </p>

                                {/* Client Combo Card Simulation */}
                                <div className="bg-[#181926] border border-zinc-800 hover:border-violet-500/60 rounded-2xl p-4 transition-all shadow-lg space-y-3 relative overflow-hidden group">
                                    {/* Top brand header */}
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center border border-zinc-700">
                                                <img
                                                    src={currentBrand?.logoUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100"}
                                                    alt="Brand Logo"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100";
                                                    }}
                                                />
                                            </div>
                                            <span className="text-[11px] font-bold text-zinc-300 truncate max-w-[160px]">
                                                {currentBrand?.name || "Hệ thống cụm rạp"}
                                            </span>
                                        </div>

                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${activeCategoryConfig.badgeBg} ${activeCategoryConfig.badgeText} ${activeCategoryConfig.badgeBorder}`}>
                                            {activeCategoryConfig.icon} {activeCategoryConfig.label}
                                        </span>
                                    </div>

                                    {/* Food Thumbnail & Overlay */}
                                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80">
                                        <img
                                            src={watchedImageUrl || "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=600"}
                                            alt={watchedName || "Món ăn"}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=600";
                                            }}
                                        />

                                        {!watchedAvailable && (
                                            <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="px-3 py-1 rounded-full bg-rose-500/90 text-white text-xs font-black tracking-wider uppercase shadow-md">
                                                    Tạm Ngưng Phục Vụ
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white font-black text-xs">
                                            {watchedPrice ? `${Number(watchedPrice).toLocaleString("vi-VN")} ₫` : "0 ₫"}
                                        </div>
                                    </div>

                                    {/* Food Details */}
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-1">
                                            {watchedName || "Tên món ăn / Combo"}
                                        </h4>
                                        <p className="text-xs text-zinc-400 font-medium leading-relaxed line-clamp-2">
                                            {watchedDescription || "Mô tả sản phẩm, kích thước bắp và loại nước uống đi kèm trong gói combo."}
                                        </p>
                                    </div>

                                    {/* Action Buttons Mock */}
                                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-zinc-500 font-semibold">Tình trạng:</span>
                                            {watchedAvailable ? (
                                                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    Sẵn sàng phục vụ
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-bold text-rose-400">
                                                    Hết hàng
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            disabled={!watchedAvailable}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                                                watchedAvailable
                                                    ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20"
                                                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                            }`}
                                        >
                                            <AddShoppingCartOutlinedIcon sx={{ fontSize: 14 }} />
                                            <span>+ Chọn Mua</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                                    <p className="font-bold text-zinc-300">💡 Lưu ý hiển thị:</p>
                                    <p>• Hình ảnh rõ nét tỷ lệ 16:9 hoặc 4:3 sẽ đem lại trải nghiệm thị giác tốt nhất.</p>
                                    <p>• Các combo có mô tả chi tiết thường có tỷ lệ chốt đơn cao hơn 35%.</p>
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
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-violet-500/25 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                        >
                            {(isCreating || isUpdating) ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 17 }} />
                            )}
                            <span>{mode === "add" ? "Tạo Sản Phẩm F&B" : "Lưu Thay Đổi"}</span>
                        </button>
                    </div>
                </div>
            </form>
        </Dialog>
    );
}
