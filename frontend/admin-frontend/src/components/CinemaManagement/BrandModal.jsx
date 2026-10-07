import React, { useEffect } from "react";
import {
    Dialog,
    TextField,
    CircularProgress,
    InputAdornment,
    Tooltip,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";

// Material Icons
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined";

// Services, Redux & Mock
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import { useCreateBrandMutation, useUpdateBrandMutation } from "../../services/brandService.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";
import { BRAND_SAMPLE_TEMPLATES } from "../../mock/mockBrands.js";

const EMPTY_BRAND = {
    name: "",
    logoUrl: "",
    description: "",
    employeeCount: 1200,
    backgroundUrl: "",
};

const brandSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên thương hiệu là bắt buộc")
        .min(2, "Tên thương hiệu phải có ít nhất 2 ký tự")
        .max(100, "Tên thương hiệu không được vượt quá 100 ký tự"),

    description: yup
        .string()
        .required("Mô tả thương hiệu là bắt buộc")
        .max(500, "Mô tả không được vượt quá 500 ký tự"),

    logoUrl: yup
        .string()
        .url("Logo phải là một URL hợp lệ (http/https)")
        .required("Đường dẫn Logo là bắt buộc"),

    employeeCount: yup
        .number()
        .transform((value, originalValue) =>
            String(originalValue).trim() === "" ? null : value
        )
        .nullable()
        .required("Số lượng nhân viên là bắt buộc")
        .min(1, "Số nhân viên tối thiểu là 1")
        .integer("Số nhân viên phải là số nguyên"),

    backgroundUrl: yup
        .string()
        .url("Ảnh bìa phải là một URL hợp lệ (http/https)")
        .required("Đường dẫn ảnh bìa là bắt buộc"),
});

export default function BrandModal({ open, onClose, mode = "add", brandData }) {
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
        register,
    } = useForm({
        resolver: yupResolver(brandSchema),
        defaultValues: EMPTY_BRAND,
    });

    const watchedValues = useWatch({ control });

    const [
        createBrand,
        { isLoading: isCreating, isError: isCreateError, error: createError },
    ] = useCreateBrandMutation();

    const [
        updateBrand,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateBrandMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    useEffect(() => {
        if (brandData && open) {
            reset({
                name: brandData.name || "",
                logoUrl: brandData.logoUrl || "",
                description: brandData.description || "",
                employeeCount: brandData.employeeCount || 1200,
                backgroundUrl: brandData.backgroundUrl || "",
            });
        } else if (open) {
            reset(EMPTY_BRAND);
        }
    }, [brandData, open, reset]);

    const handleApplyTemplate = (templateData) => {
        reset({
            ...templateData,
        });
        dispatch(
            openSnackbar({
                message: `Đã nạp mẫu dữ liệu: ${templateData.name}`,
                type: "info",
            })
        );
    };

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                employeeCount: Number(data.employeeCount),
            };

            if (mode === "add") {
                await createBrand(payload).unwrap();
                dispatch(openSnackbar({ message: "Thêm thương hiệu mới thành công!", type: "success" }));
            } else {
                await updateBrand({ id: brandData.id, ...payload }).unwrap();
                dispatch(openSnackbar({ message: "Cập nhật thương hiệu thành công!", type: "success" }));
            }
            onClose();
        } catch (err) {
            dispatch(
                openSnackbar({
                    message: err?.data?.message || "Đã xảy ra lỗi khi lưu thương hiệu.",
                    type: "error",
                })
            );
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            slotProps={{
                paper: {
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
                        <BrandingWatermarkOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                {mode === "add" ? "Thêm Thương Hiệu Chiếu Mới" : `Hiệu Chỉnh: ${brandData?.name || "Thương Hiệu"}`}
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
                                ? "Khai báo đối tác thương hiệu chuỗi rạp chiếu, biểu trưng nhận diện và quy mô nhân sự"
                                : "Cập nhật hồ sơ nhận diện, biểu trưng và thông tin chuỗi rạp chiếu phim"}
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
                            {BRAND_SAMPLE_TEMPLATES.map((tpl) => (
                                <button
                                    key={tpl.name}
                                    type="button"
                                    onClick={() => handleApplyTemplate(tpl.data)}
                                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-violet-700 hover:bg-white rounded-lg transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1"
                                >
                                    <span>{tpl.name}</span>
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

            {/* 2. MODAL BODY (Grid 12 cols: 6 cols Form - 6 cols Live Client BrandPage Preview) */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* LEFT COLUMN: Input Form (6 cols) */}
                        <div className="lg:col-span-6 flex flex-col gap-5">
                            {/* Card 1: Thông tin nhận diện */}
                            <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <BusinessOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                            1. Thông Tin Nhận Diện Thương Hiệu
                                        </h3>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-400">
                                        Định danh chính
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <TextField
                                            label="Tên thương hiệu chuỗi rạp *"
                                            placeholder="VD: CineMeow Cinema, CJ CGV Vietnam, Galaxy Cinema..."
                                            {...register("name")}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            fullWidth
                                            size="small"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <TextField
                                            label="Tổng số lượng nhân sự toàn hệ thống *"
                                            placeholder="VD: 1500"
                                            type="number"
                                            {...register("employeeCount")}
                                            error={!!errors.employeeCount}
                                            helperText={errors.employeeCount?.message || "Tổng nhân sự vận hành, quản lý rạp và dịch vụ khách hàng"}
                                            fullWidth
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PeopleOutlineOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <span className="text-xs font-semibold text-slate-400">Nhân sự</span>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <TextField
                                            label="Mô tả & Tầm nhìn thương hiệu *"
                                            placeholder="Giới thiệu thông điệp, quy mô phòng chiếu, dịch vụ nổi bật và trải nghiệm điện ảnh..."
                                            multiline
                                            rows={4}
                                            {...register("description")}
                                            error={!!errors.description}
                                            helperText={errors.description?.message}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Biểu trưng & Ảnh bìa nhận diện */}
                            <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <ImageOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                            2. Biểu Trưng & Ảnh Bìa Nhận Diện
                                        </h3>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-400">
                                        Media Assets
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <TextField
                                        label="Đường dẫn Logo biểu trưng (URL) *"
                                        placeholder="https://.../logo.png"
                                        {...register("logoUrl")}
                                        error={!!errors.logoUrl}
                                        helperText={errors.logoUrl?.message || "Khuyến nghị ảnh PNG/SVG nền trong suốt, tỉ lệ vuông 1:1"}
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LinkOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        label="Đường dẫn Ảnh bìa / Background (URL) *"
                                        placeholder="https://.../banner.jpg"
                                        {...register("backgroundUrl")}
                                        error={!!errors.backgroundUrl}
                                        helperText={errors.backgroundUrl?.message || "Khuyến nghị ảnh phong cảnh 16:9 độ phân giải cao (1920x1080px)"}
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ImageOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LIVE BRANDPAGE PREVIEW (client-frontend / BrandPage replica) (6 cols) */}
                        <div className="lg:col-span-6">
                            <div className="sticky top-2 space-y-3">
                                {/* Preview Header Bar (Synchronized with ShowtimeModal & MovieModal) */}
                                <div className="flex items-center justify-between px-1 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-extrabold uppercase tracking-wider text-slate-800 text-[11px]">
                                            Live Preview: Giao Diện Thương Hiệu Khách Hàng
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
                                        client-frontend / BrandPage
                                    </span>
                                </div>

                                {/* EXACT CLIENT-FRONTEND BRANDPAGE HERO BANNER REPLICA */}
                                <div className="relative w-full overflow-hidden bg-[#0a0a0d] border border-violet-900/30 rounded-3xl shadow-2xl text-zinc-100 select-none p-5 sm:p-6">
                                    {/* Background Theater Backdrop with Smooth Dark Gradient */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
                                        style={{
                                            backgroundImage: `url(${watchedValues.backgroundUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80"})`,
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/80 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0d] via-[#0a0a0d]/65 to-transparent" />

                                    {/* Ambient Glow */}
                                    <div className="absolute top-0 right-5 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

                                    {/* Hero Content */}
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-5">
                                        {/* Brand Logo in Glass Container */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md border border-white/20 p-2.5 shadow-2xl shadow-violet-950/60 flex items-center justify-center shrink-0">
                                            {watchedValues.logoUrl ? (
                                                <img
                                                    src={watchedValues.logoUrl}
                                                    alt={watchedValues.name || "Brand Logo"}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150";
                                                    }}
                                                />
                                            ) : (
                                                <span className="font-black text-xl text-violet-400">BRAND</span>
                                            )}
                                        </div>

                                        {/* Brand Details */}
                                        <div className="flex-1 space-y-2 min-w-0">
                                            {/* Partner Badge */}
                                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-600/25 border border-violet-500/40 text-violet-300 text-[10px] font-bold shadow-md">
                                                <ShieldOutlinedIcon sx={{ fontSize: 13 }} className="text-violet-400" />
                                                <span>ĐỐI TÁC CHÍNH THỨC CINEMEOW</span>
                                            </div>

                                            {/* Brand Name */}
                                            <div className="flex items-center gap-1.5">
                                                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight line-clamp-1">
                                                    {watchedValues.name || "Tên thương hiệu đối tác"}
                                                </h1>
                                                <VerifiedIcon sx={{ fontSize: 18 }} className="text-indigo-400 shrink-0" />
                                            </div>

                                            {/* Tagline */}
                                            <p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 line-clamp-1">
                                                Thế giới điện ảnh vượt mọi giới hạn & Đẳng cấp giải trí quốc tế
                                            </p>

                                            {/* Description */}
                                            <p className="text-xs text-zinc-300 leading-relaxed font-normal line-clamp-3">
                                                {watchedValues.description ||
                                                    "Mô tả thương hiệu, quy mô phòng chiếu và dịch vụ sẽ hiển thị tại đây khi bạn nhập nội dung..."}
                                            </p>

                                            {/* Highlight Pills */}
                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200">
                                                    <LocationOnOutlinedIcon sx={{ fontSize: 13 }} className="text-rose-400" />
                                                    <span>18+ Cụm rạp toàn quốc</span>
                                                </div>
                                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200">
                                                    <PeopleOutlineOutlinedIcon sx={{ fontSize: 13 }} className="text-violet-400" />
                                                    <span>
                                                        {Number(watchedValues.employeeCount || 0).toLocaleString("vi-VN")} nhân sự
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200">
                                                    <StarOutlinedIcon sx={{ fontSize: 13 }} className="text-amber-400" />
                                                    <span>4.9 / 5.0 Đánh giá</span>
                                                </div>
                                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200">
                                                    <PhoneInTalkOutlinedIcon sx={{ fontSize: 13 }} className="text-emerald-400" />
                                                    <span>Hotline: 1900 6017</span>
                                                </div>
                                            </div>

                                            {/* Action CTA Buttons */}
                                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-600 text-white font-bold text-[11px] shadow-lg shadow-violet-600/40 select-none">
                                                    <CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} />
                                                    <span>Xem Lịch Chiếu Tại Rạp Này</span>
                                                </div>

                                                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 text-white font-semibold text-[11px] border border-white/20 select-none">
                                                    <CardGiftcardOutlinedIcon sx={{ fontSize: 13 }} className="text-amber-300" />
                                                    <span>Ưu Đãi Rạp</span>
                                                </div>

                                                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 text-zinc-300 font-medium text-[11px] border border-white/10 select-none">
                                                    <LanguageOutlinedIcon sx={{ fontSize: 13 }} className="text-violet-400" />
                                                    <span>Website chính thức</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Cinema Experience Technology Highlights (from client BrandPage) */}
                                    <div className="mt-5 pt-4 border-t border-zinc-800/80">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                                                ĐẲNG CẤP PHÒNG CHIẾU TẠI {watchedValues.name || "HỆ THỐNG RẠP"}
                                            </span>
                                            <span className="text-[10px] text-zinc-400 font-medium">
                                                Chuẩn trải nghiệm quốc tế
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-extrabold text-white text-xs">
                                                        IMAX Laser & 4DX
                                                    </span>
                                                    <span className="px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 text-[9px] font-bold">
                                                        Độc quyền
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-zinc-400 leading-tight">
                                                    Màn hình cong khổng lồ, âm thanh vòm 12 kênh sống động chân thực.
                                                </p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-extrabold text-white text-xs">
                                                        Gold Class & VIP
                                                    </span>
                                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                                        Thượng hạng
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-zinc-400 leading-tight">
                                                    Ghế sofa bọc da ngả điện 180 độ, phục vụ cà phê và ẩm thực tại chỗ.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MODAL FOOTER */}
                <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
                    <span className="text-xs text-slate-400 font-medium">
                        * Các trường có dấu sao đỏ là bắt buộc nhập
                    </span>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100/80 text-xs font-semibold cursor-pointer transition"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-violet-500/20 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <CircularProgress size={15} color="inherit" />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                                    <span>{mode === "add" ? "Tạo Mới" : "Lưu Thay Đổi"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </Dialog>
    );
}
