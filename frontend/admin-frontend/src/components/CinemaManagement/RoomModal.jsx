import React, { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Box,
    Tabs,
    Tab,
    Tooltip,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";

// Material Icons
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import TheaterComedyOutlinedIcon from "@mui/icons-material/TheaterComedyOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

// Subcomponents, Constants & Services
import SeatMapTab from "./SeatMapTab.jsx";
import {
    ROOM_TYPES,
    ROOM_STATUSES,
    getRoomTypeLabel,
    getRoomStatusLabel,
} from "../../constants/roomOptions.js";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";
import {
    useCreateRoomMutation,
    useUpdateRoomMutation,
} from "../../services/cinemaService.js";

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Tên phòng chiếu là bắt buộc")
        .max(100, "Tên phòng không được quá 100 ký tự"),
    type: yup.string().required("Vui lòng chọn loại công nghệ phòng chiếu"),
    status: yup.string().required("Vui lòng chọn trạng thái phòng"),
});

const EMPTY_ROOM = {
    name: "",
    type: "_2D",
    status: "ACTIVE",
};

export default function RoomModal({
    open,
    onClose,
    mode = "add",
    roomData,
    cinemaId,
    cinemaName,
    initialTab = 0,
}) {
    const [tab, setTab] = useState(initialTab);
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: EMPTY_ROOM,
    });

    const watchedValues = useWatch({ control });

    const [
        createRoom,
        { isLoading: isCreating, isError: isCreateError, error: createError },
    ] = useCreateRoomMutation();

    const [
        updateRoom,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateRoomMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    // Sync form values on roomData or open change
    useEffect(() => {
        if (roomData && open) {
            let normalizedType = roomData.type || roomData.roomType || "_2D";
            if (!normalizedType.startsWith("_")) {
                normalizedType = `_${normalizedType}`;
            }

            reset({
                name: roomData.name || "",
                type: normalizedType,
                status: roomData.status || "ACTIVE",
            });
            setTab(initialTab);
        } else if (open) {
            reset(EMPTY_ROOM);
            setTab(0);
        }
    }, [roomData, open, reset, initialTab]);

    const activeRoomTypeConfig = useMemo(() => {
        return (
            ROOM_TYPES.find((t) => t.value === watchedValues?.type) || {
                value: "_2D",
                label: "2D Standard",
                badge: "2D",
            }
        );
    }, [watchedValues?.type]);

    const activeStatusConfig = useMemo(() => {
        return (
            ROOM_STATUSES.find((s) => s.value === watchedValues?.status) || {
                value: "ACTIVE",
                label: "Đang hoạt động",
                dot: "bg-emerald-500",
            }
        );
    }, [watchedValues?.status]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                cinemaId: cinemaId || roomData?.cinemaId,
            };

            if (mode === "add") {
                await createRoom(payload).unwrap();
                dispatch(
                    openSnackbar({
                        message: `Thêm phòng chiếu "${data.name}" thành công!`,
                        type: "success",
                    })
                );
            } else {
                await updateRoom({ id: roomData.id, ...payload }).unwrap();
                dispatch(
                    openSnackbar({
                        message: `Cập nhật thông tin phòng "${data.name}" thành công!`,
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
                        "Đã xảy ra lỗi khi lưu thông tin phòng chiếu.",
                    type: "error",
                })
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={tab === 1 ? "xl" : "lg"}
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
                        transition: "max-width 0.3s ease",
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
                        {tab === 1 ? (
                            <EventSeatOutlinedIcon sx={{ fontSize: 24 }} />
                        ) : (
                            <MeetingRoomOutlinedIcon sx={{ fontSize: 24 }} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                {tab === 1
                                    ? `Sơ Đồ Ghế: ${roomData?.name || "Phòng Chiếu"}`
                                    : mode === "add"
                                    ? "Thêm Phòng Chiếu Mới"
                                    : `Hiệu Chỉnh Phòng: ${roomData?.name || ""}`}
                            </h2>
                            <span
                                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${
                                    mode === "add"
                                        ? "bg-violet-50 text-violet-700 border-violet-200"
                                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                }`}
                            >
                                {tab === 1 ? activeRoomTypeConfig?.badge || "Sơ đồ ghế" : mode === "add" ? "Tạo mới" : "Cập nhật"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {cinemaName ? `Cụm rạp: ${cinemaName}` : "CineMeow Cinema"}
                            {tab === 1 ? " • Thiết kế ma trận vị trí và cấu hình loại ghế" : " • Cấu hình thông số kỹ thuật phòng máy"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* Mode Edit: Tab Switcher (Thông tin vs Sơ đồ ghế) */}
                    {mode === "edit" && roomData?.id && (
                        <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                            <button
                                type="button"
                                onClick={() => setTab(0)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                                    tab === 0
                                        ? "bg-white text-violet-700 shadow-2xs"
                                        : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                1. Thông số phòng
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab(1)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                                    tab === 1
                                        ? "bg-white text-violet-700 shadow-2xs"
                                        : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                <EventSeatOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>2. Sơ đồ ghế ngồi</span>
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
            {mode === "edit" && roomData?.id && (
                <div className="sm:hidden px-6 pt-2 bg-white border-b border-slate-200/60">
                    <Tabs
                        value={tab}
                        onChange={(e, val) => setTab(val)}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ minHeight: 40 }}
                    >
                        <Tab
                            label="Thông số phòng"
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "12px",
                                minHeight: 40,
                            }}
                        />
                        <Tab
                            label="Sơ đồ ghế"
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "12px",
                                minHeight: 40,
                            }}
                        />
                    </Tabs>
                </div>
            )}

            {/* 2. MODAL BODY */}
            <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                {tab === 0 ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12 gap-6">
                            {/* LEFT COLUMN: FORM INPUTS (7 cols) */}
                            <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
                                <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <SettingsOutlinedIcon
                                            sx={{ fontSize: 18 }}
                                            className="text-violet-600"
                                        />
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                            1. Cấu Hình Thông Số Phòng Chiếu
                                        </h3>
                                    </div>

                                    {/* Room Name */}
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Tên phòng chiếu *"
                                                placeholder="VD: Phòng 01 (IMAX Laser), Phòng 02 (Dolby Atmos)..."
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            borderRadius: "12px",
                                                            fontSize: "14px",
                                                        },
                                                    },
                                                }}
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                        )}
                                    />

                                    {/* Room Type */}
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Định dạng công nghệ phòng chiếu *"
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            borderRadius: "12px",
                                                            fontSize: "14px",
                                                        },
                                                    },
                                                }}
                                                error={!!errors.type}
                                                helperText={
                                                    errors.type?.message ||
                                                    "Lựa chọn chuẩn màn hình và công nghệ chiếu phim"
                                                }
                                                SelectProps={{
                                                    renderValue: (selected) => {
                                                        const item = ROOM_TYPES.find(
                                                            (t) => t.value === selected
                                                        );
                                                        if (!item) return selected;
                                                        return (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-100">
                                                                    {item.badge}
                                                                </span>
                                                                <span className="font-semibold text-slate-800 text-xs">
                                                                    {item.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    },
                                                }}
                                            >
                                                {ROOM_TYPES.map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        <div className="flex items-center justify-between w-full py-1">
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {option.label}
                                                            </span>
                                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                                                {option.badge}
                                                            </span>
                                                        </div>
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />

                                    {/* Room Status */}
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Trạng thái vận hành *"
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            borderRadius: "12px",
                                                            fontSize: "14px",
                                                        },
                                                    },
                                                }}
                                                error={!!errors.status}
                                                helperText={errors.status?.message}
                                                SelectProps={{
                                                    renderValue: (selected) => {
                                                        const item = ROOM_STATUSES.find(
                                                            (s) => s.value === selected
                                                        );
                                                        if (!item) return selected;
                                                        return (
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`w-2 h-2 rounded-full ${item.dot}`}
                                                                />
                                                                <span className="font-semibold text-slate-800 text-xs">
                                                                    {item.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    },
                                                }}
                                            >
                                                {ROOM_STATUSES.map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        <div className="flex items-center gap-2.5 py-1">
                                                            <span
                                                                className={`w-2 h-2 rounded-full ${option.dot}`}
                                                            />
                                                            <span className="text-xs font-bold text-slate-800">
                                                                {option.label}
                                                            </span>
                                                        </div>
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* RIGHT COLUMN: LIVE ROOM SHOWCASE PREVIEW (5 cols) */}
                            <div className="col-span-12 lg:col-span-5">
                                <div className="sticky top-2 space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                Live Room Showcase
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
                                            Xem trước phòng máy
                                        </span>
                                    </div>

                                    {/* Realistic Room Showcase Card */}
                                    <div className="relative rounded-3xl bg-[#090A10] border border-zinc-800 shadow-2xl text-white overflow-hidden p-6 space-y-4">
                                        {/* Cinema Ambient Curved Screen Glow */}
                                        <div className="relative h-20 w-full rounded-2xl bg-gradient-to-b from-violet-600/20 via-indigo-900/10 to-transparent border-t-2 border-violet-500/40 flex flex-col items-center justify-center overflow-hidden">
                                            <div className="w-3/4 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_15px_rgba(167,139,250,0.8)] mb-2" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-300/80">
                                                MÀN HÌNH CHIẾU CHÍNH (SCREEN)
                                            </span>
                                        </div>

                                        {/* Room Name & Badges */}
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="text-base font-black text-white leading-snug">
                                                    {watchedValues?.name || "Tên phòng chiếu..."}
                                                </h3>
                                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-violet-600/30 text-violet-300 border border-violet-500/40 shrink-0">
                                                    {activeRoomTypeConfig.badge}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${activeStatusConfig.dot}`}
                                                    />
                                                    <span>{activeStatusConfig.label}</span>
                                                </span>

                                                <span className="text-xs text-zinc-400 font-medium">
                                                    {cinemaName || "Cụm rạp CineMeow"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tech Specs Grid */}
                                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                                            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                                                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase">
                                                    <TvOutlinedIcon sx={{ fontSize: 13 }} />
                                                    <span>Công nghệ</span>
                                                </div>
                                                <p className="font-bold text-zinc-200">
                                                    {activeRoomTypeConfig.label}
                                                </p>
                                            </div>

                                            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                                                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase">
                                                    <EventSeatOutlinedIcon sx={{ fontSize: 13 }} />
                                                    <span>Quy mô ghế</span>
                                                </div>
                                                <p className="font-bold text-amber-300">
                                                    {roomData?.seatCount || roomData?.totalSeats || 160} ghế ngồi
                                                </p>
                                            </div>

                                            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1 col-span-2">
                                                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase">
                                                    <VolumeUpOutlinedIcon sx={{ fontSize: 13 }} />
                                                    <span>Âm thanh & Máy chiếu</span>
                                                </div>
                                                <p className="text-[11px] font-medium text-zinc-300">
                                                    Dolby Atmos 12.1 Surround & Dual Laser 4K Projector
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick shortcut to Seat Map */}
                                        {mode === "edit" && roomData?.id && (
                                            <button
                                                type="button"
                                                onClick={() => setTab(1)}
                                                className="w-full py-2.5 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <span>Chuyển sang cấu hình Sơ đồ ghế</span>
                                                <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
                                            </button>
                                        )}
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
                                            <span>{mode === "add" ? "Tạo Phòng Mới" : "Lưu Thông Tin Phòng"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* Tab 1: Sơ đồ bố trí ghế ngồi */
                    <div className="py-1">
                        {roomData?.id ? (
                            <>
                                <SeatMapTab roomId={roomData.id} />
                                <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium">
                                        * Mẹo: Nhấn nút "Lưu Sơ Đồ Ghế" ở trên cùng để lưu toàn bộ thay đổi vị trí ghế vào hệ thống
                                    </span>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100/80 text-xs font-semibold cursor-pointer transition"
                                    >
                                        Đóng cửa sổ
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="py-16 flex flex-col items-center justify-center text-center rounded-2xl bg-white border border-slate-200">
                                <EventSeatOutlinedIcon
                                    sx={{ fontSize: 48 }}
                                    className="text-slate-300 mb-2"
                                />
                                <h3 className="text-sm font-bold text-slate-800">
                                    Chưa có mã định danh phòng chiếu
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                                    Vui lòng hoàn tất lưu thông tin cơ bản của phòng chiếu để hệ thống khởi tạo sơ đồ ma trận ghế.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setTab(0)}
                                    className="mt-4 px-4 py-2 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition cursor-pointer"
                                >
                                    Quay lại thông số phòng
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
