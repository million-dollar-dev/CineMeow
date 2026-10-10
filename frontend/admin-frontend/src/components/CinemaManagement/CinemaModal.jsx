import React, { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Box,
    Tabs,
    Tab,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";

// Material Icons
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

// Services, Redux & Components
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import {
    useCreateCinemaMutation,
    useGetRoomsQuery,
    useUpdateCinemaMutation,
} from "../../services/cinemaService.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";
import { useGetAllBrandsQuery } from "../../services/brandService.js";
import ListRoomTab from "./ListRoomTab.jsx";
import { MOCK_BRANDS } from "../../mock/mockCinemas.js";

const EMPTY_CINEMA = {
    name: "",
    address: "",
    brandId: "",
    city: "",
    imageUrl: "",
};

const cinemaSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên rạp là bắt buộc")
        .max(100, "Tên rạp không được quá 100 ký tự"),
    address: yup
        .string()
        .required("Địa chỉ rạp là bắt buộc")
        .max(200, "Địa chỉ không được quá 200 ký tự"),
    city: yup
        .string()
        .required("Vui lòng nhập hoặc chọn thành phố")
        .max(50, "Tên thành phố không được quá 50 ký tự"),
    brandId: yup.string().required("Vui lòng chọn thương hiệu rạp"),
    imageUrl: yup
        .string()
        .url("Ảnh phải là đường dẫn URL hợp lệ (http/https)")
        .required("Đường dẫn ảnh rạp là bắt buộc"),
});

export default function CinemaModal({ open, onClose, cinemaData, mode = "add", initialTab = 0 }) {
    const [tab, setTab] = useState(initialTab);
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(cinemaSchema),
        defaultValues: EMPTY_CINEMA,
    });

    const watchedValues = useWatch({ control });

    // 1. Data queries
    const { data: brandResponse, isLoading: isLoadingBrands } = useGetAllBrandsQuery();
    const brands = useMemo(() => {
        const apiBrands = brandResponse?.data;
        if (apiBrands && apiBrands.length > 0) return apiBrands;
        return MOCK_BRANDS;
    }, [brandResponse]);

    const { data: roomResponse, isError: isErrorRooms, error: errorRooms } = useGetRoomsQuery(
        cinemaData?.id,
        { skip: !cinemaData?.id }
    );
    const rooms = roomResponse?.data ?? (cinemaData?.rooms || []);

    // 2. Mutations
    const [
        createCinema,
        { isLoading: isCreating, isError: isCreateError, error: createError },
    ] = useCreateCinemaMutation();

    const [
        updateCinema,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateCinemaMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    // Sync form on open/cinemaData change
    useEffect(() => {
        if (cinemaData && open) {
            reset({
                name: cinemaData.name || "",
                address: cinemaData.address || "",
                city: cinemaData.city || "",
                brandId: cinemaData.brand?.id || cinemaData.brandId || "",
                imageUrl: cinemaData.imageUrl || cinemaData.image || "",
            });
            setTab(initialTab);
        } else if (open) {
            reset(EMPTY_CINEMA);
            setTab(0);
        }
    }, [cinemaData, open, reset, initialTab]);

    useEffect(() => {
        if (isErrorRooms) {
            dispatch(openSnackbar({ message: errorRooms?.error || "Lỗi tải phòng", type: "error" }));
        }
    }, [isErrorRooms, errorRooms, dispatch]);

    // Active Brand lookup for preview
    const selectedBrand = useMemo(() => {
        return brands.find((b) => b.id === watchedValues?.brandId) || null;
    }, [brands, watchedValues?.brandId]);

    const onSubmit = async (data) => {
        try {
            const payload = { ...data };
            if (mode === "add") {
                await createCinema(payload).unwrap();
                dispatch(openSnackbar({ message: "Thêm cụm rạp mới thành công!", type: "success" }));
            } else {
                await updateCinema({ id: cinemaData.id, ...payload }).unwrap();
                dispatch(openSnackbar({ message: "Cập nhật cụm rạp thành công!", type: "success" }));
            }
            onClose();
        } catch (err) {
            dispatch(
                openSnackbar({
                    message: err?.data?.message || "Đã xảy ra lỗi khi lưu thông tin cụm rạp.",
                    type: "error",
                })
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
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
                        <StorefrontOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                {mode === "add" ? "Thêm Cụm Rạp Chiếu Mới" : `Hiệu Chỉnh: ${cinemaData?.name || "Cụm Rạp"}`}
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
                                ? "Khai báo địa điểm cụm rạp, thương hiệu và định dạng phòng chiếu vào mạng lưới"
                                : "Cập nhật thông tin rạp, vị trí bản đồ và quản lý sơ đồ phòng chiếu"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {mode === "edit" && (
                        <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                            <button
                                type="button"
                                onClick={() => setTab(0)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                                    tab === 0 ? "bg-white text-violet-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                Thông tin rạp
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab(1)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                                    tab === 1 ? "bg-white text-violet-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                Phòng chiếu ({rooms.length})
                            </button>
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

            {/* Mobile Tab Switcher */}
            {mode === "edit" && (
                <div className="sm:hidden px-6 pt-3 bg-white border-b border-slate-200/60">
                    <Tabs
                        value={tab}
                        onChange={(e, val) => setTab(val)}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ minHeight: 40 }}
                    >
                        <Tab label="Thông tin rạp" sx={{ textTransform: "none", fontWeight: 700, fontSize: "12px", minHeight: 40 }} />
                        <Tab label={`Phòng chiếu (${rooms.length})`} sx={{ textTransform: "none", fontWeight: 700, fontSize: "12px", minHeight: 40 }} />
                    </Tabs>
                </div>
            )}

            {/* 2. MODAL BODY */}
            <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                {tab === 0 ? (
                    <form id="cinema-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12 gap-6">
                            {/* LEFT COLUMN: FORM INPUTS (7 cols) */}
                            <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
                                {/* Card 1: Nhận diện & Thương hiệu */}
                                <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <LayersOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                            1. Nhận Diện Cụm Rạp & Thương Hiệu
                                        </h3>
                                    </div>

                                    {/* Cinema Name */}
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Tên cụm rạp chiếu *"
                                                placeholder="VD: CineMeow Landmark 81..."
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                }}
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Brand Select */}
                                        <Controller
                                            name="brandId"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="Thương hiệu rạp *"
                                                    fullWidth
                                                    size="small"
                                                    slotProps={{
                                                        input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                    }}
                                                    error={!!errors.brandId}
                                                    helperText={errors.brandId?.message}
                                                    SelectProps={{
                                                        renderValue: (selected) => {
                                                            const b = brands.find((item) => item.id === selected);
                                                            if (!b) return "";
                                                            return (
                                                                <div className="flex items-center gap-2">
                                                                    {b.logoUrl && (
                                                                        <img
                                                                            src={b.logoUrl}
                                                                            alt={b.name}
                                                                            className="w-5 h-5 rounded-full object-cover border border-slate-200"
                                                                        />
                                                                    )}
                                                                    <span className="font-semibold text-slate-800 text-xs truncate">
                                                                        {b.name}
                                                                    </span>
                                                                </div>
                                                            );
                                                        },
                                                    }}
                                                >
                                                    {brands.map((b) => (
                                                        <MenuItem key={b.id} value={b.id}>
                                                            <div className="flex items-center gap-2.5 py-1">
                                                                {b.logoUrl && (
                                                                    <img
                                                                        src={b.logoUrl}
                                                                        alt={b.name}
                                                                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-800">{b.name}</p>
                                                                    {b.description && (
                                                                        <p className="text-[10px] text-slate-400 line-clamp-1">{b.description}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        />

                                        {/* City Select / Input */}
                                        <Controller
                                            name="city"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Tỉnh / Thành phố *"
                                                    placeholder="VD: TP. Hồ Chí Minh, Hà Nội..."
                                                    fullWidth
                                                    size="small"
                                                    slotProps={{
                                                        input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                    }}
                                                    error={!!errors.city}
                                                    helperText={errors.city?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Card 2: Địa chỉ & Hình ảnh ngoại cảnh */}
                                <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <LocationOnOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                            2. Vị Trí & Không Gian Rạp
                                        </h3>
                                    </div>

                                    {/* Address */}
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Địa chỉ chi tiết rạp *"
                                                placeholder="VD: Tầng B1, TTTM Vincom Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh..."
                                                fullWidth
                                                size="small"
                                                multiline
                                                rows={2}
                                                slotProps={{
                                                    input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                }}
                                                error={!!errors.address}
                                                helperText={errors.address?.message}
                                            />
                                        )}
                                    />

                                    {/* Image URL */}
                                    <Controller
                                        name="imageUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Đường dẫn ảnh rạp chiếu (URL) *"
                                                placeholder="https://images.unsplash.com/photo-..."
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                }}
                                                error={!!errors.imageUrl}
                                                helperText={errors.imageUrl?.message || "Nhập link ảnh chất lượng cao để hiển thị trên website & ứng dụng"}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* RIGHT COLUMN: LIVE CINEMA CARD PREVIEW (5 cols) */}
                            <div className="col-span-12 lg:col-span-5">
                                <div className="sticky top-2 space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                Live Cinema Showcase
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
                                            Xem trước rạp
                                        </span>
                                    </div>

                                    {/* Real-time Cinema Card */}
                                    <div className="relative rounded-3xl bg-[#090A10] border border-zinc-800 shadow-2xl text-white overflow-hidden">
                                        {/* Hero Hall Image Banner */}
                                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                                            {watchedValues?.imageUrl ? (
                                                <img
                                                    src={watchedValues.imageUrl}
                                                    alt="Hall preview"
                                                    className="w-full h-full object-cover filter brightness-90 transition-all duration-300"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-zinc-500">
                                                    <ImageOutlinedIcon sx={{ fontSize: 36 }} className="opacity-50 mb-1" />
                                                    <span className="text-xs font-medium">Chưa có ảnh không gian rạp</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/40 to-transparent" />

                                            {/* Brand Logo overlay top left */}
                                            {selectedBrand && (
                                                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 z-10">
                                                    {selectedBrand.logoUrl && (
                                                        <img
                                                            src={selectedBrand.logoUrl}
                                                            alt={selectedBrand.name}
                                                            className="w-4 h-4 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <span className="text-[10px] font-black uppercase text-violet-300">
                                                        {selectedBrand.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body Specs */}
                                        <div className="p-5 space-y-3.5">
                                            <div>
                                                <h3 className="text-base font-black text-white leading-snug">
                                                    {watchedValues?.name || "Tên cụm rạp CineMeow..."}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                                                        <LocationOnOutlinedIcon sx={{ fontSize: 13 }} />
                                                        <span>{watchedValues?.city || "Chưa chọn thành phố"}</span>
                                                    </span>
                                                    <span className="text-zinc-600">•</span>
                                                    <span className="text-[11px] text-zinc-400 font-semibold">
                                                        {mode === "edit" ? `${rooms.length} phòng máy` : "Mạng lưới chuẩn quốc tế"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Address Info */}
                                            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs">
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block">
                                                    Vị trí địa chỉ
                                                </span>
                                                <p className="text-zinc-300 font-medium text-[11px] mt-0.5 line-clamp-2">
                                                    {watchedValues?.address || "Chưa nhập địa chỉ chi tiết..."}
                                                </p>
                                            </div>

                                            {/* Quick Specs Hotline & Hours */}
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-2">
                                                    <PhoneInTalkOutlinedIcon sx={{ fontSize: 16 }} className="text-emerald-400" />
                                                    <div>
                                                        <span className="text-[9px] text-zinc-500 uppercase font-bold block">Hotline</span>
                                                        <span className="text-[11px] font-bold text-zinc-200">1900 6017</span>
                                                    </div>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-2">
                                                    <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-400" />
                                                    <div>
                                                        <span className="text-[9px] text-zinc-500 uppercase font-bold block">Giờ mở cửa</span>
                                                        <span className="text-[11px] font-bold text-zinc-200">08:30 - 00:30</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="border-t border-slate-100 pt-5 mt-6 -mx-2 -mb-2 px-4 py-3 bg-slate-50/90 rounded-b-2xl flex items-center justify-between">
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
                                    disabled={isCreating || isUpdating}
                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-violet-500/20 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                                >
                                    {isCreating || isUpdating ? (
                                        <>
                                            <CircularProgress size={15} color="inherit" />
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                                            <span>{mode === "add" ? "Tạo Cụm Rạp Mới" : "Lưu Thay Đổi"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* Tab 1: Danh sách phòng chiếu */
                    <div className="py-2">
                        <ListRoomTab rooms={rooms} onClose={onClose} cinemaId={cinemaData?.id} cinemaName={cinemaData?.name} />
                        <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                                Tổng số {rooms.length} phòng chiếu đang hoạt động tại cụm rạp này
                            </span>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100/80 text-xs font-semibold cursor-pointer transition"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
