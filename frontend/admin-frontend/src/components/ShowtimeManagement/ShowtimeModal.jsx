import React, { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Autocomplete,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

// Material Icons
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";

// Services, Redux & Constants
import { useGetAllCinemasQuery, useGetRoomsQuery } from "../../services/cinemaService.js";
import { useGetAllMoviesQuery } from "../../services/movieService.js";
import { useCreateShowtimeMutation, useUpdateShowtimeMutation } from "../../services/showtimeService.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import { SHOWTIME_STATUS_CONFIG } from "../../constants/showtimeStatus.js";
import StatusChip from "../StatusChip.jsx";
import { MOCK_MOVIES } from "../../mock/mockMovies.js";
import { MOCK_CINEMAS, MOCK_ROOMS } from "../../mock/mockShowtimes.js";

// Validation Schema
const showtimeSchema = yup.object().shape({
    movieId: yup.string().required("Vui lòng chọn phim chiếu"),
    cinemaId: yup.string().required("Vui lòng chọn cụm rạp"),
    roomId: yup.string().required("Vui lòng chọn phòng chiếu"),
    startTime: yup
        .string()
        .required("Vui lòng chọn thời gian bắt đầu chiếu"),
    endTime: yup
        .string()
        .required("Thời gian kết thúc là bắt buộc"),
    status: yup.string().required("Vui lòng chọn trạng thái suất chiếu"),
});

const EMPTY_SHOWTIME = {
    movieId: "",
    cinemaId: "",
    roomId: "",
    startTime: "",
    endTime: "",
    status: "AVAILABLE",
};

export default function ShowtimeModal({ open, onClose, mode = "add", showtimeData }) {
    const dispatch = useDispatch();

    const [selectedCinemaId, setSelectedCinemaId] = useState(null);

    // 1. Data queries
    const { data: cinemaResponse, isLoading: isLoadingCinemas } = useGetAllCinemasQuery();
    const cinemas = useMemo(() => {
        const apiData = cinemaResponse?.data;
        if (apiData && apiData.length > 0) return apiData;
        return MOCK_CINEMAS;
    }, [cinemaResponse]);

    const { data: roomResponse, isLoading: isLoadingRooms } = useGetRoomsQuery(selectedCinemaId, {
        skip: !selectedCinemaId,
    });
    const rooms = useMemo(() => {
        const apiData = roomResponse?.data;
        if (apiData && apiData.length > 0) return apiData;
        if (selectedCinemaId) {
            return MOCK_ROOMS.filter((r) => r.cinemaId === selectedCinemaId);
        }
        return MOCK_ROOMS;
    }, [roomResponse, selectedCinemaId]);

    const { data: movieResponse, isLoading: isLoadingMovies } = useGetAllMoviesQuery();
    const movies = useMemo(() => {
        const apiData = movieResponse?.data;
        if (apiData && apiData.length > 0) return apiData;
        return MOCK_MOVIES;
    }, [movieResponse]);

    // 2. Mutations
    const [createShowtime, { isLoading: isCreating, isError: isCreateError, error: createError }] =
        useCreateShowtimeMutation();

    const [updateShowtime, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] =
        useUpdateShowtimeMutation();

    // 3. Form setup
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(showtimeSchema),
        defaultValues: EMPTY_SHOWTIME,
    });

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    // Watch values in real-time for live preview
    const watchedValues = useWatch({ control });

    // Find currently selected objects
    const currentMovie = useMemo(() => {
        return movies.find((m) => m.id === watchedValues?.movieId) || null;
    }, [movies, watchedValues?.movieId]);

    const currentCinema = useMemo(() => {
        return cinemas.find((c) => c.id === watchedValues?.cinemaId) || null;
    }, [cinemas, watchedValues?.cinemaId]);

    const currentRoom = useMemo(() => {
        return rooms.find((r) => r.id === watchedValues?.roomId) || null;
    }, [rooms, watchedValues?.roomId]);

    // Populate or reset form when modal opens
    useEffect(() => {
        if (!open) return;

        if (showtimeData) {
            const cinemaId = showtimeData.cinemaId || "";
            setSelectedCinemaId(cinemaId);

            let sTime = "";
            let eTime = "";
            if (showtimeData.startTime) {
                sTime = dayjs(showtimeData.startTime).format("YYYY-MM-DDTHH:mm");
            }
            if (showtimeData.endTime) {
                eTime = dayjs(showtimeData.endTime).format("YYYY-MM-DDTHH:mm");
            }

            reset({
                movieId: showtimeData.movieId || "",
                cinemaId: cinemaId,
                roomId: showtimeData.roomId || "",
                startTime: sTime,
                endTime: eTime,
                status: showtimeData.status || "AVAILABLE",
            });
        } else {
            // Default: start in next 2 hours rounded to 15 mins
            const defaultStart = dayjs().add(2, "hour").minute(Math.ceil(dayjs().minute() / 15) * 15).second(0);
            const defaultCinema = cinemas[0]?.id || "";
            setSelectedCinemaId(defaultCinema);

            reset({
                movieId: movies[0]?.id || "",
                cinemaId: defaultCinema,
                roomId: "",
                startTime: defaultStart.format("YYYY-MM-DDTHH:mm"),
                endTime: defaultStart.add(150, "minute").format("YYYY-MM-DDTHH:mm"),
                status: "AVAILABLE",
            });
        }
    }, [showtimeData, open, reset, cinemas, movies]);

    // Auto-calculate End Time when Start Time or Movie Duration changes
    const handleStartTimeChange = (newStartTime) => {
        setValue("startTime", newStartTime, { shouldValidate: true });
        if (newStartTime && currentMovie?.duration) {
            const movieDuration = Number(currentMovie.duration) || 120;
            const end = dayjs(newStartTime).add(movieDuration, "minute");
            setValue("endTime", end.format("YYYY-MM-DDTHH:mm"), { shouldValidate: true });
        }
    };

    const handleMovieChange = (newMovie) => {
        setValue("movieId", newMovie?.id || "", { shouldValidate: true });
        if (watchedValues?.startTime && newMovie?.duration) {
            const movieDuration = Number(newMovie.duration) || 120;
            const end = dayjs(watchedValues.startTime).add(movieDuration, "minute");
            setValue("endTime", end.format("YYYY-MM-DDTHH:mm"), { shouldValidate: true });
        }
    };

    // Submit handler
    const onSubmit = async (formData) => {
        try {
            const payload = {
                movieId: formData.movieId,
                roomId: formData.roomId,
                startTime: dayjs(formData.startTime).format("YYYY-MM-DDTHH:mm:ss"),
                endTime: dayjs(formData.endTime).format("YYYY-MM-DDTHH:mm:ss"),
                status: formData.status,
            };

            if (mode === "add") {
                await createShowtime(payload).unwrap();
                dispatch(
                    openSnackbar({
                        message: "Lập lịch suất chiếu mới thành công!",
                        type: "success",
                    })
                );
            } else {
                await updateShowtime({ id: showtimeData.id, ...payload }).unwrap();
                dispatch(
                    openSnackbar({
                        message: "Cập nhật suất chiếu thành công!",
                        type: "success",
                    })
                );
            }
            onClose();
        } catch (err) {
            if (!err?.data?.data) {
                dispatch(
                    openSnackbar({
                        message: err?.data?.message || "Đã xảy ra lỗi khi lưu suất chiếu.",
                        type: "error",
                    })
                );
            }
        }
    };

    // Formatted times for live ticket pass preview
    const ticketInfo = useMemo(() => {
        const s = watchedValues?.startTime ? dayjs(watchedValues.startTime) : null;
        const e = watchedValues?.endTime ? dayjs(watchedValues.endTime) : null;

        const startTimeFormatted = s && s.isValid() ? s.format("HH:mm") : "--:--";
        const endTimeFormatted = e && e.isValid() ? e.format("HH:mm") : "--:--";
        const dateFormatted = s && s.isValid() ? s.format("DD/MM/YYYY") : "Chưa chọn ngày";
        const dayOfWeek = s && s.isValid() ? s.format("dddd") : "";

        return {
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
            date: dateFormatted,
            dayOfWeek,
        };
    }, [watchedValues?.startTime, watchedValues?.endTime]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
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
                        {mode === "add" ? (
                            <CalendarMonthOutlinedIcon sx={{ fontSize: 24 }} />
                        ) : (
                            <EditOutlinedIcon sx={{ fontSize: 24 }} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                {mode === "add" ? "Lập Lịch Suất Chiếu Mới" : "Cập Nhật Thông Tin Suất Chiếu"}
                            </h2>
                            <span
                                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${
                                    mode === "add"
                                        ? "bg-violet-50 text-violet-700 border-violet-200"
                                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                }`}
                            >
                                {mode === "add" ? "Tạo mới" : "Hiệu chỉnh"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {mode === "add"
                                ? "Phân bổ phòng chiếu, khung giờ phát sóng và đồng bộ trạng thái mở bán vé"
                                : `Đang điều chỉnh lịch chiếu cho phim "${showtimeData?.movieTitle || ""}"`}
                        </p>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-100/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
                    title="Đóng cửa sổ"
                >
                    <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                </button>
            </div>

            {/* 2. FORM BODY WITH 2-COLUMN SPLIT (FORM vs REAL-TIME TICKET PREVIEW) */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="grid grid-cols-12 gap-7 items-start">
                        {/* LEFT COLUMN: FORM CONTROLS (7 cols) */}
                        <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
                            {/* Card 1: Chọn Tác Phẩm Điện Ảnh */}
                            <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <MovieCreationOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                            1. Tác Phẩm Điện Ảnh
                                        </h3>
                                    </div>
                                    {currentMovie && (
                                        <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                                            {currentMovie.duration ? `${currentMovie.duration} phút` : "Chưa rõ thời lượng"}
                                        </span>
                                    )}
                                </div>

                                <Controller
                                    name="movieId"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            value={currentMovie}
                                            onChange={(_, newValue) => handleMovieChange(newValue)}
                                            options={movies}
                                            getOptionLabel={(opt) => opt?.title || ""}
                                            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                                            loading={isLoadingMovies}
                                            renderOption={(props, opt) => (
                                                <li {...props} key={opt.id} className="py-2.5 px-3 hover:bg-slate-50 cursor-pointer">
                                                    <div className="flex items-center gap-3 w-full">
                                                        <img
                                                            src={opt.posterPath || opt.poster}
                                                            alt={opt.title}
                                                            className="w-10 h-14 object-cover rounded-md border border-slate-200 shrink-0"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://placehold.co/100x140?text=Movie";
                                                            }}
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <h4 className="text-sm font-bold text-slate-900 truncate">
                                                                    {opt.title}
                                                                </h4>
                                                                {opt.rating && (
                                                                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                                                        {opt.rating}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                                                                {opt.subtitle || opt.director || "Điện ảnh"} • {opt.duration} phút
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Chọn phim chiếu *"
                                                    placeholder="Gõ tìm kiếm tên phim..."
                                                    size="small"
                                                    error={!!errors.movieId}
                                                    helperText={errors.movieId?.message}
                                                    slotProps={{
                                                        input: {
                                                            ...params.InputProps,
                                                            sx: { borderRadius: "12px", minHeight: "44px" },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </div>

                            {/* Card 2: Cụm Rạp & Phòng Chiếu */}
                            <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <StorefrontOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                        2. Địa Điểm Cụm Rạp & Phòng Chiếu
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Cinema Select */}
                                    <Controller
                                        name="cinemaId"
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                value={currentCinema}
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue?.id || "");
                                                    setSelectedCinemaId(newValue?.id || "");
                                                    setValue("roomId", ""); // reset room when cinema changes
                                                }}
                                                options={cinemas}
                                                getOptionLabel={(c) => c?.name || ""}
                                                isOptionEqualToValue={(c, val) => c?.id === val?.id}
                                                loading={isLoadingCinemas}
                                                renderOption={(props, c) => (
                                                    <li {...props} key={c.id}>
                                                        <div className="py-1">
                                                            <p className="text-xs font-bold text-slate-900">{c.name}</p>
                                                            {c.address && (
                                                                <p className="text-[11px] text-slate-400 truncate">{c.address}</p>
                                                            )}
                                                        </div>
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Cụm rạp chiếu *"
                                                        placeholder="Chọn rạp..."
                                                        size="small"
                                                        error={!!errors.cinemaId}
                                                        helperText={errors.cinemaId?.message}
                                                        slotProps={{
                                                            input: {
                                                                ...params.InputProps,
                                                                sx: { borderRadius: "12px" },
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        )}
                                    />

                                    {/* Room Select */}
                                    <Controller
                                        name="roomId"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth size="small" error={!!errors.roomId}>
                                                <InputLabel id="room-label">Phòng chiếu *</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId="room-label"
                                                    label="Phòng chiếu *"
                                                    value={rooms.some((r) => r.id === field.value) ? field.value : ""}
                                                    sx={{ borderRadius: "12px" }}
                                                    disabled={!selectedCinemaId}
                                                >
                                                    {isLoadingRooms ? (
                                                        <MenuItem disabled>
                                                            <CircularProgress size={18} />
                                                        </MenuItem>
                                                    ) : rooms.length === 0 ? (
                                                        <MenuItem disabled>Chưa có phòng chiếu tại rạp này</MenuItem>
                                                    ) : (
                                                        rooms.map((room) => (
                                                            <MenuItem key={room.id} value={room.id}>
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="text-xs font-semibold text-slate-800">
                                                                        {room.name}
                                                                    </span>
                                                                    {room.roomType && (
                                                                        <span
                                                                            className="inline-flex items-center justify-center text-[10px] font-extrabold uppercase px-2 rounded bg-violet-50 text-violet-700 border border-violet-100 ml-2 shadow-2xs select-none"
                                                                            style={{ height: "18px", lineHeight: "1" }}
                                                                        >
                                                                            {room.roomType}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                                <FormHelperText>
                                                    {errors.roomId?.message ||
                                                        (!selectedCinemaId ? "Vui lòng chọn cụm rạp trước" : "")}
                                                </FormHelperText>
                                            </FormControl>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Card 3: Khung Giờ & Trạng Thái */}
                            <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                        3. Khung Giờ Chiếu & Trạng Thái Mở Bán
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Start Time */}
                                    <Controller
                                        name="startTime"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="datetime-local"
                                                label="Giờ bắt đầu chiếu *"
                                                size="small"
                                                slotProps={{
                                                    inputLabel: { shrink: true },
                                                    input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                }}
                                                error={!!errors.startTime}
                                                helperText={errors.startTime?.message}
                                                onChange={(e) => handleStartTimeChange(e.target.value)}
                                            />
                                        )}
                                    />

                                    {/* End Time (Computed automatically) */}
                                    <Controller
                                        name="endTime"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="datetime-local"
                                                label="Giờ kết thúc dự kiến *"
                                                size="small"
                                                slotProps={{
                                                    inputLabel: { shrink: true },
                                                    input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                }}
                                                error={!!errors.endTime}
                                                helperText={
                                                    errors.endTime?.message ||
                                                    (currentMovie?.duration
                                                        ? `Tự động cộng ${currentMovie.duration} phút thời lượng phim`
                                                        : "")
                                                }
                                            />
                                        )}
                                    />
                                </div>

                                {/* Status Select */}
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth size="small" error={!!errors.status}>
                                            <InputLabel id="status-label">Trạng thái phát hành *</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="status-label"
                                                label="Trạng thái phát hành *"
                                                renderValue={(val) => (
                                                    <StatusChip status={val} configs={SHOWTIME_STATUS_CONFIG} />
                                                )}
                                                sx={{ borderRadius: "12px" }}
                                            >
                                                {Object.values(SHOWTIME_STATUS_CONFIG).map((opt) => (
                                                    <MenuItem key={opt.value} value={opt.value}>
                                                        <div className="flex items-center gap-2">
                                                            <StatusChip status={opt.value} configs={SHOWTIME_STATUS_CONFIG} />
                                                            <span className="text-xs text-slate-500 font-medium ml-1">
                                                                ({opt.label})
                                                            </span>
                                                        </div>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{errors.status?.message}</FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LIVE CINEMA TICKET PASS PREVIEW (5 cols) */}
                        <div className="col-span-12 lg:col-span-5">
                            <div className="sticky top-2 space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                            Live Showtime Ticket Pass
                                        </h4>
                                    </div>
                                    <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
                                        Bản xem trước vé
                                    </span>
                                </div>

                                {/* Realistic Cinema Ticket Card */}
                                <div className="relative rounded-3xl bg-[#090a10] border border-zinc-800 shadow-2xl text-white overflow-hidden">
                                    {/* Movie Backdrop Top Banner */}
                                    <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                                        {currentMovie?.backdropPath ? (
                                            <img
                                                src={currentMovie.backdropPath}
                                                alt="Backdrop"
                                                className="w-full h-full object-cover opacity-60 filter blur-[1px] scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 opacity-80" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-[#090a10]/50 to-transparent" />

                                        {/* Status Chip overlay top right */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <StatusChip
                                                status={watchedValues?.status || "AVAILABLE"}
                                                configs={SHOWTIME_STATUS_CONFIG}
                                            />
                                        </div>
                                    </div>

                                    {/* Ticket Content Body */}
                                    <div className="p-5 space-y-4">
                                        {/* Movie Poster & Title Header */}
                                        <div className="flex gap-3.5 -mt-12 relative z-10 items-end">
                                            <div className="w-20 h-28 rounded-xl overflow-hidden bg-zinc-900 border-2 border-white/20 shadow-xl shrink-0">
                                                <img
                                                    src={currentMovie?.posterPath || currentMovie?.poster}
                                                    alt={currentMovie?.title || "Poster"}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://placehold.co/120x170?text=Poster";
                                                    }}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1 pb-1">
                                                <h3 className="text-base font-black text-white leading-tight line-clamp-2">
                                                    {currentMovie?.title || "Vui lòng chọn phim..."}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    {currentMovie?.rating && (
                                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-white leading-none">
                                                            {currentMovie.rating}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-zinc-400 font-medium">
                                                        {currentMovie?.duration ? `${currentMovie.duration} phút` : "--"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dashed Ticket Divider with Notches */}
                                        <div className="relative py-1">
                                            <div className="border-b border-dashed border-zinc-700/80 w-full" />
                                            <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-100" />
                                            <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-100" />
                                        </div>

                                        {/* Showtime Information Specs */}
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            {/* Cinema Info */}
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                                    Cụm rạp
                                                </span>
                                                <p className="font-bold text-zinc-200 truncate" title={currentCinema?.name}>
                                                    {currentCinema?.name || "Chưa chọn rạp"}
                                                </p>
                                                <p className="text-[10px] text-zinc-500 truncate">
                                                    {currentCinema?.address || "Toàn quốc"}
                                                </p>
                                            </div>

                                            {/* Room Info */}
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                                    Phòng chiếu
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-bold text-zinc-200 truncate">
                                                        {currentRoom?.name || "Chưa chọn phòng"}
                                                    </p>
                                                    {currentRoom?.roomType && (
                                                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 border border-violet-500/40">
                                                            {currentRoom.roomType}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-zinc-500">
                                                    {currentRoom?.totalSeats ? `${currentRoom.totalSeats} ghế ngồi` : "Chuẩn rạp"}
                                                </p>
                                            </div>

                                            {/* Showtime Slot (Big highlight) */}
                                            <div className="col-span-2 p-3 rounded-2xl bg-gradient-to-r from-violet-950/60 to-indigo-950/60 border border-violet-800/40 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider block">
                                                        Giờ chiếu chính thức
                                                    </span>
                                                    <div className="flex items-baseline gap-2 mt-0.5">
                                                        <span className="text-xl font-black text-white tracking-tight">
                                                            {ticketInfo.startTime}
                                                        </span>
                                                        <ArrowForwardOutlinedIcon sx={{ fontSize: 13 }} className="text-violet-400" />
                                                        <span className="text-sm font-bold text-zinc-300">
                                                            {ticketInfo.endTime}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                                                        Ngày chiếu
                                                    </span>
                                                    <span className="text-xs font-black text-amber-300 mt-0.5 block">
                                                        {ticketInfo.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ticket Barcode Mockup */}
                                        <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80 text-[10px] text-zinc-500">
                                            <div className="flex items-center gap-1.5">
                                                <QrCode2OutlinedIcon sx={{ fontSize: 20 }} className="text-zinc-400" />
                                                <span className="font-mono tracking-wider">CMW-SHOWTIME-PASS</span>
                                            </div>
                                            <span className="font-mono">#SHOWTIME-{mode.toUpperCase()}</span>
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
                                    <span>{mode === "add" ? "Tạo Suất Chiếu" : "Lưu Thay Đổi"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </Dialog>
    );
}
