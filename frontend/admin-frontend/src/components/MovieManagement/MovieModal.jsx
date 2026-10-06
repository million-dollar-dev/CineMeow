import React, { useState, useEffect, useMemo } from "react";
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

// Material Icons
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalMoviesOutlinedIcon from "@mui/icons-material/LocalMoviesOutlined";

// Services, Redux & Constants
import { useGetAllGenresQuery } from "../../services/genreService.js";
import { useCreateMovieMutation, useUpdateMovieMutation } from "../../services/movieService.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import { MOVIE_STATUS_CONFIG } from "../../constants/movieStatus.js";
import StatusChip from "../StatusChip.jsx";

// 1. Status Options
const STATUS_OPTIONS = [
    { value: "NOW_PLAYING", label: "Đang khởi chiếu" },
    { value: "COMING_SOON", label: "Sắp khởi chiếu" },
    { value: "RELEASED", label: "Đã phát hành" },
    { value: "POST_PRODUCTION", label: "Hậu kỳ / Chuẩn bị" },
];

// 2. Rating Options with Vietnamese Cinema Standards
const RATING_CONFIGS = [
    {
        value: "P",
        label: "P - Mọi lứa tuổi",
        desc: "Phổ biến rộng rãi đến mọi khán giả",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold",
        solidClass: "bg-emerald-600 text-white font-bold",
    },
    {
        value: "K",
        label: "K - Dưới 13 tuổi (kèm người lớn)",
        desc: "Khán giả dưới 13 tuổi cần người giám hộ đi cùng",
        badgeClass: "bg-sky-50 text-sky-700 border-sky-300 font-bold",
        solidClass: "bg-sky-500 text-white font-bold",
    },
    {
        value: "T13",
        label: "T13 - Khán giả từ 13+",
        desc: "Cấm khán giả dưới 13 tuổi",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-300 font-bold",
        solidClass: "bg-amber-500 text-white font-bold",
    },
    {
        value: "T16",
        label: "T16 - Khán giả từ 16+",
        desc: "Cấm khán giả dưới 16 tuổi",
        badgeClass: "bg-orange-50 text-orange-700 border-orange-300 font-bold",
        solidClass: "bg-orange-500 text-white font-bold",
    },
    {
        value: "T18",
        label: "T18 - Khán giả từ 18+",
        desc: "Cấm khán giả dưới 18 tuổi",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-300 font-bold",
        solidClass: "bg-rose-600 text-white font-bold",
    },
    {
        value: "C13",
        label: "C13 (Tiêu chuẩn cũ)",
        desc: "Cấm khán giả dưới 13 tuổi",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-300 font-bold",
        solidClass: "bg-amber-500 text-white font-bold",
    },
    {
        value: "PG13",
        label: "PG-13 (Quốc tế)",
        desc: "Khán giả dưới 13 tuổi cần cảnh báo cha mẹ",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-300 font-bold",
        solidClass: "bg-amber-500 text-white font-bold",
    },
    {
        value: "R",
        label: "R (Quốc tế)",
        desc: "Restricted - Dưới 17 tuổi cần người lớn đi kèm",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-300 font-bold",
        solidClass: "bg-rose-600 text-white font-bold",
    },
    {
        value: "NC17",
        label: "NC-17 (Quốc tế)",
        desc: "Cấm tuyệt đối khán giả dưới 17 tuổi",
        badgeClass: "bg-purple-50 text-purple-700 border-purple-300 font-bold",
        solidClass: "bg-purple-600 text-white font-bold",
    },
    {
        value: "PG",
        label: "PG (Quốc tế)",
        desc: "Parental Guidance Suggested",
        badgeClass: "bg-sky-50 text-sky-700 border-sky-300 font-bold",
        solidClass: "bg-sky-500 text-white font-bold",
    },
    {
        value: "G",
        label: "G (Quốc tế)",
        desc: "General Audiences - Mọi khán giả",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold",
        solidClass: "bg-emerald-600 text-white font-bold",
    },
];

const getRatingConfig = (val) => {
    return RATING_CONFIGS.find((c) => c.value === val) || RATING_CONFIGS[2]; // Default T13
};

// 3. Exact Client-Frontend Rating Card Mapping
const CLIENT_RATING_MAP = {
    P: { bg: "bg-emerald-500", text: "text-white", label: "P" },
    G: { bg: "bg-emerald-500", text: "text-white", label: "P" },
    K: { bg: "bg-sky-500", text: "text-white", label: "K" },
    PG: { bg: "bg-sky-500", text: "text-white", label: "PG" },
    PG13: { bg: "bg-amber-500", text: "text-white", label: "13+" },
    "13+": { bg: "bg-amber-500", text: "text-white", label: "13+" },
    C13: { bg: "bg-amber-500", text: "text-white", label: "T13" },
    T13: { bg: "bg-amber-500", text: "text-white", label: "T13" },
    "16+": { bg: "bg-orange-500", text: "text-white", label: "16+" },
    C16: { bg: "bg-orange-500", text: "text-white", label: "T16" },
    T16: { bg: "bg-orange-500", text: "text-white", label: "T16" },
    "18+": { bg: "bg-rose-600", text: "text-white", label: "18+" },
    C18: { bg: "bg-rose-600", text: "text-white", label: "T18" },
    T18: { bg: "bg-rose-600", text: "text-white", label: "T18" },
    R: { bg: "bg-rose-600", text: "text-white", label: "R" },
    NC17: { bg: "bg-purple-600", text: "text-white", label: "18+" },
};

const ClientRatingBadge = ({ rating = "P", className = "" }) => {
    const key = String(rating || "P").toUpperCase().trim();
    const info = CLIENT_RATING_MAP[key] || { bg: "bg-zinc-700", text: "text-zinc-200", label: rating };

    return (
        <span
            className={`inline-flex items-center justify-center font-bold text-[11px] sm:text-xs px-2 py-0.5 rounded shadow-sm leading-none tracking-tight shrink-0 select-none ${info.bg} ${info.text} ${className}`}
        >
            {info.label}
        </span>
    );
};

// 4. Quick Country & Language Suggestions
const POPULAR_COUNTRIES = [
    "Việt Nam",
    "Mỹ (USA)",
    "Hàn Quốc",
    "Nhật Bản",
    "Anh (UK)",
    "Pháp",
    "Thái Lan",
    "Trung Quốc",
    "Úc",
    "Canada",
];

const POPULAR_LANGUAGES = [
    "Tiếng Việt",
    "Tiếng Anh",
    "Tiếng Hàn",
    "Tiếng Nhật",
    "Tiếng Thái",
    "Tiếng Trung",
    "Tiếng Pháp",
    "Lồng tiếng Việt",
    "Phụ đề tiếng Việt",
];

// 5. Sample templates for rapid testing & prototyping
const SAMPLE_TEMPLATES = [
    {
        name: "Dune: Part Two",
        data: {
            title: "Dune: Hành Tinh Cát - Phần 2",
            subtitle: "Dune: Part Two",
            tagline: "Long live the fighters",
            director: "Denis Villeneuve",
            duration: 166,
            status: "NOW_PLAYING",
            rating: "T16",
            releaseDate: "2024-03-01",
            overview:
                "Paul Atreides hợp nhất với Chani và người Fremen trong khi tìm kiếm sự trả thù chống lại những kẻ chủ mưu đã tiêu diệt gia tộc anh. Phải đối mặt với sự lựa chọn giữa tình yêu của đời mình và số phận của vũ trụ.",
            originCountry: "Mỹ (USA)",
            originalLanguage: "Tiếng Anh",
            posterPath: "https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
            backdropPath: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520098.jpg",
            trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
            casts: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"],
        },
    },
    {
        name: "Avengers: Endgame",
        data: {
            title: "Avengers: Hồi Kết",
            subtitle: "Avengers: Endgame",
            tagline: "Part of the journey is the end",
            director: "Anthony Russo, Joe Russo",
            duration: 181,
            status: "RELEASED",
            rating: "T13",
            releaseDate: "2019-04-26",
            overview:
                "Sau những sự kiện tàn khốc của Avengers: Cuộc Chiến Vô Cực, vũ trụ đã bị hủy hoại một nửa. Với sự trợ giúp của các đồng minh còn lại, các Avengers tập hợp một lần nữa để đảo ngược hành động của Thanos.",
            originCountry: "Mỹ (USA)",
            originalLanguage: "Tiếng Anh",
            posterPath: "https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            backdropPath: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
            trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
            casts: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth", "Scarlett Johansson"],
        },
    },
];

// 6. Blank Movie Default State
const BLANK_MOVIE = {
    title: "",
    subtitle: "",
    tagline: "",
    director: "",
    duration: "",
    status: "NOW_PLAYING",
    rating: "T13",
    releaseDate: new Date().toISOString().split("T")[0],
    overview: "",
    originCountry: "Việt Nam",
    originalLanguage: "Tiếng Việt",
    posterPath: "",
    backdropPath: "",
    trailerUrl: "",
    casts: [],
    genres: [],
};

// 7. Yup Validation Schema
const movieSchema = yup.object().shape({
    title: yup.string().trim().required("Vui lòng nhập tên phim"),
    subtitle: yup.string().trim().required("Vui lòng nhập tên phụ/subtitle"),
    tagline: yup.string().trim().required("Vui lòng nhập câu đề từ (tagline)"),
    director: yup.string().trim().required("Vui lòng nhập tên đạo diễn"),
    duration: yup
        .number()
        .typeError("Thời lượng phải là số nguyên (phút)")
        .min(1, "Thời lượng tối thiểu 1 phút")
        .max(600, "Thời lượng tối đa 600 phút")
        .required("Vui lòng nhập thời lượng phim"),
    status: yup.string().required("Vui lòng chọn trạng thái phim"),
    rating: yup.string().required("Vui lòng chọn phân loại độ tuổi"),
    releaseDate: yup.string().required("Vui lòng chọn ngày khởi chiếu"),
    originCountry: yup.string().trim().required("Vui lòng nhập quốc gia sản xuất"),
    originalLanguage: yup.string().trim().required("Vui lòng nhập ngôn ngữ phim"),
    overview: yup
        .string()
        .trim()
        .min(10, "Mô tả nội dung tối thiểu 10 ký tự")
        .max(1000, "Mô tả nội dung tối đa 1000 ký tự")
        .required("Vui lòng nhập mô tả tóm tắt phim"),
    genres: yup
        .array()
        .of(yup.number())
        .min(1, "Vui lòng chọn ít nhất 1 thể loại")
        .required("Vui lòng chọn ít nhất 1 thể loại"),
    casts: yup
        .array()
        .of(yup.string())
        .min(1, "Vui lòng thêm ít nhất 1 diễn viên chính")
        .required("Vui lòng thêm ít nhất 1 diễn viên chính"),
    posterPath: yup
        .string()
        .trim()
        .url("Đường dẫn poster phải là URL hợp lệ")
        .required("Vui lòng nhập đường dẫn ảnh poster (2:3)"),
    backdropPath: yup
        .string()
        .trim()
        .url("Đường dẫn ảnh bìa/backdrop phải là URL hợp lệ")
        .required("Vui lòng nhập đường dẫn ảnh bìa/backdrop (16:9)"),
    trailerUrl: yup
        .string()
        .trim()
        .nullable()
        .transform((v) => (v === "" ? null : v))
        .url("Trailer phải là đường dẫn URL hợp lệ")
        .notRequired(),
});

export default function MovieModal({ open, onClose, mode = "add", movieData }) {
    const dispatch = useDispatch();

    // Active Navigation Tab: 1 = Thông tin chung, 2 = Phân loại & Xuất bản, 3 = Media & Đội ngũ
    const [activeTab, setActiveTab] = useState(1);

    // Queries & Mutations
    const { data: genresData = [], isLoading: isLoadingGenres } = useGetAllGenresQuery();
    const genres = genresData.data ?? [];

    const [createMovie, { isLoading: isCreating, isError: isCreateError, error: createError }] =
        useCreateMovieMutation();

    const [updateMovie, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] =
        useUpdateMovieMutation();

    // React Hook Form
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
        register,
    } = useForm({
        resolver: yupResolver(movieSchema),
        defaultValues: BLANK_MOVIE,
    });

    // Watch values in real-time for Live Studio Preview
    const watchedValues = useWatch({ control });

    // Server-side validation errors mapping
    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    // Populate or reset form whenever modal opens or movieData changes
    useEffect(() => {
        if (!open) return;
        setActiveTab(1);

        if (movieData) {
            // Clean Duration
            let cleanDuration = "";
            if (movieData.duration !== undefined && movieData.duration !== null) {
                const parsed = Number(String(movieData.duration).replace(/\D/g, ""));
                cleanDuration = !isNaN(parsed) && parsed > 0 ? parsed : "";
            }

            // Clean Genres
            let cleanGenres = [];
            if (Array.isArray(movieData.genres)) {
                cleanGenres = movieData.genres
                    .map((g) => (typeof g === "object" && g !== null ? Number(g.id ?? g.genreId) : Number(g)))
                    .filter((id) => !isNaN(id) && id > 0);
            }

            // Clean Casts
            let cleanCasts = [];
            if (Array.isArray(movieData.casts)) {
                cleanCasts = movieData.casts
                    .map((c) => (typeof c === "string" ? c.trim() : c?.name || ""))
                    .filter(Boolean);
            } else if (typeof movieData.casts === "string") {
                cleanCasts = movieData.casts
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean);
            }

            // Clean Release Date (supports array [YYYY, MM, DD] or string)
            let cleanReleaseDate = "";
            if (movieData.releaseDate) {
                if (Array.isArray(movieData.releaseDate) && movieData.releaseDate.length >= 3) {
                    const [y, m, d] = movieData.releaseDate;
                    cleanReleaseDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                } else if (typeof movieData.releaseDate === "string") {
                    cleanReleaseDate = movieData.releaseDate.substring(0, 10);
                }
            }

            reset({
                title: movieData.title || "",
                subtitle: movieData.subtitle || "",
                tagline: movieData.tagline || "",
                director: movieData.director || "",
                duration: cleanDuration,
                status: movieData.status || "NOW_PLAYING",
                rating: movieData.rating || "T13",
                releaseDate: cleanReleaseDate || new Date().toISOString().split("T")[0],
                overview: movieData.overview || "",
                originCountry: movieData.originCountry || "Việt Nam",
                originalLanguage: movieData.originalLanguage || "Tiếng Việt",
                posterPath: movieData.posterPath || movieData.poster || "",
                backdropPath: movieData.backdropPath || movieData.backdrop || "",
                trailerUrl: movieData.trailerUrl || "",
                casts: cleanCasts,
                genres: cleanGenres,
            });
        } else {
            reset(BLANK_MOVIE);
        }
    }, [movieData, open, reset]);

    // Fill sample template (only available in add mode)
    const handleApplySample = (template) => {
        const defaultGenreIds = genres.slice(0, 2).map((g) => g.id);
        reset({
            ...BLANK_MOVIE,
            ...template.data,
            genres: defaultGenreIds.length > 0 ? defaultGenreIds : [1],
        });
        dispatch(
            openSnackbar({
                message: `Đã nạp dữ liệu mẫu "${template.name}" thành công!`,
                type: "info",
            })
        );
    };

    // Calculate tab error states to show indicators on tabs
    const tabErrors = useMemo(() => {
        const t1 = ["title", "subtitle", "tagline", "overview"].some((f) => errors[f]);
        const t2 = [
            "status",
            "rating",
            "duration",
            "releaseDate",
            "genres",
            "originCountry",
            "originalLanguage",
        ].some((f) => errors[f]);
        const t3 = ["director", "casts", "trailerUrl", "posterPath", "backdropPath"].some((f) => errors[f]);
        return { 1: t1, 2: t2, 3: t3 };
    }, [errors]);

    // Form submission
    const onSubmit = async (formData) => {
        try {
            const payload = {
                ...formData,
                duration: Number(formData.duration),
                casts: Array.isArray(formData.casts) ? formData.casts : [],
                genres: Array.isArray(formData.genres) ? formData.genres : [],
            };

            if (mode === "add") {
                await createMovie(payload).unwrap();
                dispatch(
                    openSnackbar({
                        message: `Đã thêm phim "${formData.title}" vào hệ thống thành công!`,
                        type: "success",
                    })
                );
            } else {
                await updateMovie({ id: movieData.id, ...payload }).unwrap();
                dispatch(
                    openSnackbar({
                        message: `Cập nhật thông tin phim "${formData.title}" thành công!`,
                        type: "success",
                    })
                );
            }
            onClose();
        } catch (err) {
            if (!err?.data?.data) {
                dispatch(
                    openSnackbar({
                        message: err?.data?.message || "Đã xảy ra lỗi khi lưu phim. Vui lòng thử lại.",
                        type: "error",
                    })
                );
            }
        }
    };

    // If form validation fails, automatically navigate to the first tab that has errors
    const onFormError = (formErrors) => {
        if (["title", "subtitle", "tagline", "overview"].some((f) => formErrors[f])) {
            setActiveTab(1);
        } else if (
            [
                "status",
                "rating",
                "duration",
                "releaseDate",
                "genres",
                "originCountry",
                "originalLanguage",
            ].some((f) => formErrors[f])
        ) {
            setActiveTab(2);
        } else if (["director", "casts", "trailerUrl", "posterPath", "backdropPath"].some((f) => formErrors[f])) {
            setActiveTab(3);
        }
        dispatch(
            openSnackbar({
                message: "Vui lòng hoàn thiện các trường thông tin bắt buộc còn thiếu.",
                type: "warning",
            })
        );
    };

    // Calculate formatted duration text for preview
    const durationMinutes = Number(watchedValues?.duration) || 0;
    const durationFormatted = useMemo(() => {
        if (!durationMinutes || durationMinutes <= 0) return "120 phút";
        return `${durationMinutes} phút`;
    }, [durationMinutes]);

    // Format release date for preview: DD/MM/YYYY
    const previewReleaseDate = useMemo(() => {
        const raw = watchedValues?.releaseDate;
        if (!raw) return "Đang chiếu tại rạp";
        if (typeof raw === "string" && raw.includes("-")) {
            const parts = raw.split("-");
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }
        return String(raw);
    }, [watchedValues?.releaseDate]);

    // Selected genre names for preview
    const selectedGenreNames = useMemo(() => {
        const ids = watchedValues?.genres || [];
        const matched = genres.filter((g) => ids.includes(g.id)).map((g) => g.name);
        return matched.length > 0 ? matched : ["Hành động", "Kịch tính"];
    }, [genres, watchedValues?.genres]);

    // Casts display string for preview specs table
    const castsDisplayString = useMemo(() => {
        const cList = watchedValues?.casts || [];
        if (!cList || cList.length === 0) return "Nhiều diễn viên";
        return cList.slice(0, 4).join(", ") + (cList.length > 4 ? ` +${cList.length - 4}` : "");
    }, [watchedValues?.casts]);

    // Status badge configuration for preview
    const statusConfig = useMemo(() => {
        switch (watchedValues?.status) {
            case "NOW_PLAYING":
                return { label: "Đang Chiếu", icon: "🔥", badgeClass: "bg-rose-600 shadow-rose-600/40" };
            case "COMING_SOON":
                return { label: "Sắp Chiếu", icon: "✨", badgeClass: "bg-amber-600 shadow-amber-600/40" };
            case "RELEASED":
                return { label: "Đã Chiếu", icon: "🎬", badgeClass: "bg-zinc-800 shadow-zinc-800/40" };
            default:
                return { label: "Hậu Kỳ", icon: "⚙️", badgeClass: "bg-indigo-600 shadow-indigo-600/40" };
        }
    }, [watchedValues?.status]);

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
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3.5">
                    <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                            mode === "add"
                                ? "bg-violet-50 text-violet-600 border border-violet-100"
                                : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        }`}
                    >
                        {mode === "add" ? (
                            <MovieCreationOutlinedIcon sx={{ fontSize: 24 }} />
                        ) : (
                            <EditOutlinedIcon sx={{ fontSize: 24 }} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                {mode === "add" ? "Thêm Phim Điện Ảnh Mới" : "Chỉnh Sửa Thông Tin Phim"}
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
                                ? "Điền đầy đủ thông số phát hành và hình ảnh truyền thông cho hệ thống CineMeow"
                                : `Đang hiệu chỉnh tác phẩm "${movieData?.title || ""}"`}
                        </p>
                    </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2.5">
                    {mode === "add" && (
                        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
                            <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                                <AutoFixHighOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-500" />
                                Mẫu thử:
                            </span>
                            {SAMPLE_TEMPLATES.map((tmpl) => (
                                <button
                                    key={tmpl.name}
                                    type="button"
                                    onClick={() => handleApplySample(tmpl)}
                                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-violet-700 hover:bg-white rounded-lg transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                                >
                                    {tmpl.name}
                                </button>
                            ))}
                        </div>
                    )}

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
            </div>

            {/* 2. FORM BODY WITH TABS & LIVE CLIENT DETAIL PREVIEW */}
            <form
                onSubmit={handleSubmit(onSubmit, onFormError)}
                className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
                {/* Navigation Tabs Bar */}
                <div className="px-6 py-2.5 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        {/* Tab 1 */}
                        <button
                            type="button"
                            onClick={() => setActiveTab(1)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                activeTab === 1
                                    ? "bg-white text-violet-700 shadow-sm border border-slate-200/90"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                            }`}
                        >
                            <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                                    activeTab === 1 ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"
                                }`}
                            >
                                1
                            </span>
                            <span>Thông tin tác phẩm</span>
                            {tabErrors[1] && (
                                <span
                                    className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                                    title="Tab có trường chưa hợp lệ"
                                />
                            )}
                        </button>

                        {/* Tab 2 */}
                        <button
                            type="button"
                            onClick={() => setActiveTab(2)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                activeTab === 2
                                    ? "bg-white text-violet-700 shadow-sm border border-slate-200/90"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                            }`}
                        >
                            <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                                    activeTab === 2 ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"
                                }`}
                            >
                                2
                            </span>
                            <span>Phân loại & Phát hành</span>
                            {tabErrors[2] && (
                                <span
                                    className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                                    title="Tab có trường chưa hợp lệ"
                                />
                            )}
                        </button>

                        {/* Tab 3 */}
                        <button
                            type="button"
                            onClick={() => setActiveTab(3)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                activeTab === 3
                                    ? "bg-white text-violet-700 shadow-sm border border-slate-200/90"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                            }`}
                        >
                            <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                                    activeTab === 3 ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"
                                }`}
                            >
                                3
                            </span>
                            <span>Đội ngũ & Media</span>
                            {tabErrors[3] && (
                                <span
                                    className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                                    title="Tab có trường chưa hợp lệ"
                                />
                            )}
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-600">Client Detail Preview</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>

                {/* Main Content Area: 2-Column Split View (Form Inputs vs Exact Client Banner Preview) */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="grid grid-cols-12 gap-7">
                        {/* LEFT COLUMN: The Input Fields for Active Tab (col-span-12 lg:col-span-6) */}
                        <div className="col-span-12 lg:col-span-6 flex flex-col gap-5">
                            {/* TAB 1: THÔNG TIN TÁC PHẨM */}
                            {activeTab === 1 && (
                                <div className="flex flex-col gap-5 animate-fadeIn">
                                    {/* Card: Tên Phim & Định Danh */}
                                    <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <MovieCreationOutlinedIcon
                                                sx={{ fontSize: 18 }}
                                                className="text-violet-600"
                                            />
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                Tên Phim & Định Danh
                                            </h3>
                                        </div>

                                        {/* Tên phim chính (Title) */}
                                        <TextField
                                            label="Tên phim chính (Tiếng Việt hoặc Quốc Tế) *"
                                            {...register("title")}
                                            error={!!errors.title}
                                            helperText={errors.title?.message}
                                            placeholder="Ví dụ: Dune: Hành Tinh Cát - Phần 2"
                                            fullWidth
                                            size="small"
                                            slotProps={{
                                                input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                            }}
                                        />

                                        {/* Grid: Subtitle & Tagline */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <TextField
                                                label="Tên gốc / Tên tiếng Anh (Subtitle) *"
                                                {...register("subtitle")}
                                                error={!!errors.subtitle}
                                                helperText={errors.subtitle?.message}
                                                placeholder="Ví dụ: Dune: Part Two"
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                }}
                                            />

                                            <TextField
                                                label="Câu đề từ (Tagline) *"
                                                {...register("tagline")}
                                                error={!!errors.tagline}
                                                helperText={errors.tagline?.message}
                                                placeholder="Ví dụ: Long live the fighters"
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Card: Tóm tắt kịch bản (Overview) */}
                                    <div className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-2">
                                                <VisibilityOutlinedIcon
                                                    sx={{ fontSize: 18 }}
                                                    className="text-violet-600"
                                                />
                                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                    Tóm Tắt Nội Dung Phim *
                                                </h3>
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-400">
                                                {(watchedValues?.overview || "").length} / 1000 ký tự
                                            </span>
                                        </div>

                                        <TextField
                                            {...register("overview")}
                                            multiline
                                            rows={5}
                                            fullWidth
                                            error={!!errors.overview}
                                            helperText={errors.overview?.message}
                                            placeholder="Tóm tắt ngắn gọn cốt truyện, nội dung nổi bật và thông điệp của bộ phim để giới thiệu đến khán giả rạp..."
                                            slotProps={{
                                                input: {
                                                    sx: {
                                                        borderRadius: "14px",
                                                        fontSize: "13px",
                                                        lineHeight: 1.6,
                                                    },
                                                },
                                            }}
                                        />
                                    </div>

                                    {/* Next Step Button */}
                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab(2)}
                                            className="px-5 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer border border-violet-200/60"
                                        >
                                            <span>Tiếp theo: Phân loại & Phát hành</span>
                                            <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: PHÂN LOẠI & PHÁT HÀNH */}
                            {activeTab === 2 && (
                                <div className="flex flex-col gap-5 animate-fadeIn">
                                    {/* Card: Trạng thái & Phân loại độ tuổi */}
                                    <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <CategoryOutlinedIcon
                                                sx={{ fontSize: 18 }}
                                                className="text-violet-600"
                                            />
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                Trạng Thái & Phân Loại Độ Tuổi
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Status Dropdown */}
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
                                                                <StatusChip status={val} configs={MOVIE_STATUS_CONFIG} />
                                                            )}
                                                            sx={{ borderRadius: "12px" }}
                                                        >
                                                            {STATUS_OPTIONS.map((opt) => (
                                                                <MenuItem key={opt.value} value={opt.value}>
                                                                    <div className="flex items-center gap-2">
                                                                        <StatusChip
                                                                            status={opt.value}
                                                                            configs={MOVIE_STATUS_CONFIG}
                                                                        />
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

                                            {/* Rating Dropdown */}
                                            <Controller
                                                name="rating"
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth size="small" error={!!errors.rating}>
                                                        <InputLabel id="rating-label">Phân loại độ tuổi *</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId="rating-label"
                                                            label="Phân loại độ tuổi *"
                                                            renderValue={(val) => {
                                                                const cfg = getRatingConfig(val);
                                                                return (
                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${cfg.badgeClass}`}
                                                                        >
                                                                            {cfg.value}
                                                                        </span>
                                                                        <span className="text-xs font-semibold text-slate-800">
                                                                            {cfg.label}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            }}
                                                            sx={{ borderRadius: "12px" }}
                                                        >
                                                            {RATING_CONFIGS.map((cfg) => (
                                                                <MenuItem key={cfg.value} value={cfg.value}>
                                                                    <div className="flex flex-col py-0.5">
                                                                        <div className="flex items-center gap-2">
                                                                            <span
                                                                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${cfg.badgeClass}`}
                                                                            >
                                                                                {cfg.value}
                                                                            </span>
                                                                            <span className="text-xs font-bold text-slate-800">
                                                                                {cfg.label}
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-[11px] text-slate-400 mt-0.5 ml-0.5">
                                                                            {cfg.desc}
                                                                        </span>
                                                                    </div>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <FormHelperText>{errors.rating?.message}</FormHelperText>
                                                    </FormControl>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Duration Input */}
                                            <TextField
                                                label="Thời lượng (phút) *"
                                                {...register("duration")}
                                                type="number"
                                                error={!!errors.duration}
                                                helperText={
                                                    errors.duration?.message ||
                                                    (durationMinutes > 0 ? `Quy đổi: ${durationFormatted}` : "")
                                                }
                                                placeholder="120"
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        sx: { borderRadius: "12px", fontSize: "14px" },
                                                        startAdornment: (
                                                            <AccessTimeOutlinedIcon
                                                                sx={{ fontSize: 16 }}
                                                                className="text-slate-400 mr-1.5"
                                                            />
                                                        ),
                                                    },
                                                }}
                                            />

                                            {/* Release Date */}
                                            <Controller
                                                name="releaseDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        type="date"
                                                        label="Ngày khởi chiếu *"
                                                        slotProps={{
                                                            inputLabel: { shrink: true },
                                                            input: {
                                                                sx: { borderRadius: "12px", fontSize: "14px" },
                                                                startAdornment: (
                                                                    <CalendarTodayOutlinedIcon
                                                                        sx={{ fontSize: 15 }}
                                                                        className="text-slate-400 mr-1.5"
                                                                    />
                                                                ),
                                                            },
                                                        }}
                                                        error={!!errors.releaseDate}
                                                        helperText={errors.releaseDate?.message}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Card: Thể loại & Quốc gia xuất bản */}
                                    <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <CategoryOutlinedIcon
                                                sx={{ fontSize: 18 }}
                                                className="text-violet-600"
                                            />
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                Thể Loại & Quốc Gia Xuất Bản
                                            </h3>
                                        </div>

                                        {/* Genres Autocomplete */}
                                        <Controller
                                            name="genres"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    multiple
                                                    options={genres}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    isOptionEqualToValue={(option, value) =>
                                                        (option.id ?? option) === (value.id ?? value)
                                                    }
                                                    value={genres.filter((g) => field.value?.includes(g.id))}
                                                    onChange={(_, newValue) =>
                                                        field.onChange(newValue.map((g) => Number(g.id)))
                                                    }
                                                    loading={isLoadingGenres}
                                                    renderTags={(tagValue, getTagProps) =>
                                                        tagValue.map((option, index) => {
                                                            const { key, ...tagProps } = getTagProps({ index });
                                                            return (
                                                                <span
                                                                    key={key}
                                                                    {...tagProps}
                                                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200 mr-1 mb-0.5"
                                                                >
                                                                    {option.name}
                                                                </span>
                                                            );
                                                        })
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Thể loại phim *"
                                                            placeholder="Chọn hoặc tìm thể loại..."
                                                            size="small"
                                                            error={!!errors.genres}
                                                            helperText={errors.genres?.message}
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

                                        {/* Country & Language */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <Controller
                                                name="originCountry"
                                                control={control}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        freeSolo
                                                        options={POPULAR_COUNTRIES}
                                                        value={field.value || ""}
                                                        onInputChange={(_, newInputValue) =>
                                                            field.onChange(newInputValue)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Quốc gia sản xuất *"
                                                                placeholder="Ví dụ: Việt Nam, Mỹ..."
                                                                size="small"
                                                                error={!!errors.originCountry}
                                                                helperText={errors.originCountry?.message}
                                                                slotProps={{
                                                                    input: {
                                                                        ...params.InputProps,
                                                                        sx: { borderRadius: "12px", fontSize: "14px" },
                                                                        startAdornment: (
                                                                            <>
                                                                                <PublicOutlinedIcon
                                                                                    sx={{ fontSize: 16 }}
                                                                                    className="text-slate-400 mr-1.5"
                                                                                />
                                                                                {params.InputProps.startAdornment}
                                                                            </>
                                                                        ),
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name="originalLanguage"
                                                control={control}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        freeSolo
                                                        options={POPULAR_LANGUAGES}
                                                        value={field.value || ""}
                                                        onInputChange={(_, newInputValue) =>
                                                            field.onChange(newInputValue)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Ngôn ngữ gốc *"
                                                                placeholder="Ví dụ: Tiếng Việt, Tiếng Anh..."
                                                                size="small"
                                                                error={!!errors.originalLanguage}
                                                                helperText={errors.originalLanguage?.message}
                                                                slotProps={{
                                                                    input: {
                                                                        ...params.InputProps,
                                                                        sx: { borderRadius: "12px", fontSize: "14px" },
                                                                        startAdornment: (
                                                                            <>
                                                                                <LanguageOutlinedIcon
                                                                                    sx={{ fontSize: 16 }}
                                                                                    className="text-slate-400 mr-1.5"
                                                                                />
                                                                                {params.InputProps.startAdornment}
                                                                            </>
                                                                        ),
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Tab Navigation Buttons */}
                                    <div className="flex items-center justify-between pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab(1)}
                                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                                        >
                                            <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
                                            <span>Quay lại: Thông tin tác phẩm</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab(3)}
                                            className="px-5 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer border border-violet-200/60"
                                        >
                                            <span>Tiếp theo: Đội ngũ & Media</span>
                                            <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: ĐỘI NGŨ & MEDIA */}
                            {activeTab === 3 && (
                                <div className="flex flex-col gap-5 animate-fadeIn">
                                    {/* Card: Đạo diễn & Diễn viên chính */}
                                    <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <PeopleOutlineOutlinedIcon
                                                sx={{ fontSize: 18 }}
                                                className="text-violet-600"
                                            />
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                Đạo Diễn & Diễn Viên Chính
                                            </h3>
                                        </div>

                                        {/* Đạo diễn */}
                                        <TextField
                                            label="Đạo diễn chính *"
                                            {...register("director")}
                                            error={!!errors.director}
                                            helperText={errors.director?.message}
                                            placeholder="Ví dụ: Christopher Nolan, Denis Villeneuve"
                                            fullWidth
                                            size="small"
                                            slotProps={{
                                                input: { sx: { borderRadius: "12px", fontSize: "14px" } },
                                            }}
                                        />

                                        {/* Diễn viên (Chips tag input) */}
                                        <Controller
                                            name="casts"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    multiple
                                                    freeSolo
                                                    options={[]}
                                                    value={field.value || []}
                                                    onChange={(_, newValue) => {
                                                        const flatList = newValue
                                                            .flatMap((val) =>
                                                                typeof val === "string" ? val.split(",") : [val]
                                                            )
                                                            .map((s) => s.trim())
                                                            .filter(Boolean);
                                                        field.onChange([...new Set(flatList)]);
                                                    }}
                                                    renderTags={(tagValue, getTagProps) =>
                                                        tagValue.map((option, index) => {
                                                            const { key, ...tagProps } = getTagProps({ index });
                                                            return (
                                                                <span
                                                                    key={key}
                                                                    {...tagProps}
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200/80 mr-1 mb-1"
                                                                >
                                                                    <PeopleOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                                                                    {option}
                                                                </span>
                                                            );
                                                        })
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Diễn viên chính (nhập tên rồi nhấn Enter) *"
                                                            placeholder="Ví dụ: Timothée Chalamet, Zendaya..."
                                                            size="small"
                                                            error={!!errors.casts}
                                                            helperText={
                                                                errors.casts?.message ||
                                                                "Có thể dán danh sách cách nhau bởi dấu phẩy."
                                                            }
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

                                    {/* Card: Media URLs (Trailer, Poster, Backdrop) */}
                                    <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <VideoLibraryOutlinedIcon
                                                sx={{ fontSize: 18 }}
                                                className="text-violet-600"
                                            />
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                Đường Dẫn Media & Hình Ảnh
                                            </h3>
                                        </div>

                                        {/* Trailer URL */}
                                        <TextField
                                            label="Đường dẫn Trailer chính thức (YouTube)"
                                            {...register("trailerUrl")}
                                            error={!!errors.trailerUrl}
                                            helperText={errors.trailerUrl?.message}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            fullWidth
                                            size="small"
                                            slotProps={{
                                                input: {
                                                    sx: { borderRadius: "12px", fontSize: "14px" },
                                                    startAdornment: (
                                                        <PlayArrowRoundedIcon
                                                            sx={{ fontSize: 18 }}
                                                            className="text-rose-500 mr-1.5"
                                                        />
                                                    ),
                                                    endAdornment: watchedValues?.trailerUrl ? (
                                                        <a
                                                            href={watchedValues.trailerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 shrink-0 ml-2"
                                                        >
                                                            <span>Xem thử</span>
                                                            <OpenInNewOutlinedIcon sx={{ fontSize: 14 }} />
                                                        </a>
                                                    ) : null,
                                                },
                                            }}
                                        />

                                        {/* Poster Path */}
                                        <TextField
                                            label="Đường dẫn ảnh Poster (Tỉ lệ 2:3) *"
                                            {...register("posterPath")}
                                            error={!!errors.posterPath}
                                            helperText={errors.posterPath?.message}
                                            placeholder="https://image.tmdb.org/t/p/original/..."
                                            fullWidth
                                            size="small"
                                            slotProps={{
                                                input: {
                                                    sx: { borderRadius: "12px", fontSize: "14px" },
                                                    startAdornment: (
                                                        <ImageOutlinedIcon
                                                            sx={{ fontSize: 18 }}
                                                            className="text-slate-400 mr-1.5"
                                                        />
                                                    ),
                                                },
                                            }}
                                        />

                                        {/* Backdrop Path */}
                                        <TextField
                                            label="Đường dẫn ảnh bìa / Backdrop (Tỉ lệ 16:9) *"
                                            {...register("backdropPath")}
                                            error={!!errors.backdropPath}
                                            helperText={errors.backdropPath?.message}
                                            placeholder="https://image.tmdb.org/t/p/original/..."
                                            fullWidth
                                            size="small"
                                            slotProps={{
                                                input: {
                                                    sx: { borderRadius: "12px", fontSize: "14px" },
                                                    startAdornment: (
                                                        <PhotoCameraBackOutlinedIcon
                                                            sx={{ fontSize: 18 }}
                                                            className="text-slate-400 mr-1.5"
                                                        />
                                                    ),
                                                },
                                            }}
                                        />
                                    </div>

                                    {/* Back Button */}
                                    <div className="flex justify-start pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab(2)}
                                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                                        >
                                            <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
                                            <span>Quay lại: Phân loại & Phát hành</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: EXACT CLIENT DETAIL PAGE PREVIEW (col-span-12 lg:col-span-6) */}
                        <div className="col-span-12 lg:col-span-6">
                            <div className="sticky top-2 space-y-2">
                                {/* Preview Top Bar */}
                                <div className="flex items-center justify-between px-1 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-extrabold uppercase tracking-wider text-slate-800 text-[11px]">
                                            Live Preview: Giao Diện Chi Tiết Phim Khách Hàng
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
                                        client-frontend / MovieDetailPage
                                    </span>
                                </div>

                                {/* EXACT CLIENT-FRONTEND BANNER REPLICA */}
                                <div className="relative w-full overflow-hidden bg-[#07070b] p-5 sm:p-6 select-none border border-zinc-800/80 rounded-3xl shadow-2xl">
                                    {/* 1. Backdrop Background Artwork with Soft Cinematic Blur & Neon Glows */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        {watchedValues?.backdropPath ? (
                                            <img
                                                src={watchedValues.backdropPath}
                                                alt={watchedValues?.title || "Backdrop"}
                                                className="w-full h-full object-cover object-[center_25%] filter blur-[3px] brightness-[0.88] contrast-[1.1] saturate-[1.15] scale-[1.03] opacity-85 transition-all duration-700"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "https://placehold.co/800x450/1e1b4b/ffffff?text=CineMeow+Backdrop";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-950 via-slate-950 to-violet-950/40 opacity-90" />
                                        )}

                                        {/* Halftone Texture Overlay */}
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-0 pointer-events-none z-[2] opacity-20"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)",
                                                backgroundSize: "16px 16px",
                                            }}
                                        />

                                        {/* Directional Vignette & Gradient Overlays */}
                                        <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] bg-gradient-to-r from-[#07070b] via-[#07070b]/85 via-40% to-transparent z-[1]" />
                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07070b] via-[#07070b]/75 to-transparent z-[1]" />
                                        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#07070b]/80 via-[#07070b]/40 to-transparent z-[1]" />
                                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#07070b]/50 to-transparent z-[1]" />

                                        {/* Ambient Neon Spotlights */}
                                        <div className="absolute top-1/4 right-1/4 w-[280px] h-[280px] bg-violet-600/18 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                                        <div className="absolute bottom-1/3 left-1/4 w-[240px] h-[240px] bg-fuchsia-600/15 rounded-full blur-[90px] pointer-events-none mix-blend-screen" />
                                        <div className="absolute top-8 right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none mix-blend-screen" />
                                    </div>

                                    {/* 2. Main Content Container */}
                                    <div className="relative z-10 space-y-4">
                                        {/* Breadcrumbs */}
                                        <nav className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                                            <span className="hover:text-violet-400">Trang chủ</span>
                                            <ChevronRightOutlinedIcon sx={{ fontSize: 11 }} className="text-zinc-600" />
                                            <span className="hover:text-violet-400">Phim đang chiếu</span>
                                            <ChevronRightOutlinedIcon sx={{ fontSize: 11 }} className="text-zinc-600" />
                                            <span className="text-zinc-200 font-medium truncate max-w-[180px]">
                                                {watchedValues?.title || "Tên phim..."}
                                            </span>
                                        </nav>

                                        {/* Banner Split: Poster + Metadata */}
                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                                            {/* LEFT COLUMN: 3D Poster Showcase + Trailer Action */}
                                            <div className="sm:col-span-5 flex flex-col items-center sm:items-start">
                                                <div className="relative group w-full max-w-[210px] aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-950/40 bg-zinc-900">
                                                    {watchedValues?.posterPath ? (
                                                        <img
                                                            src={watchedValues.posterPath}
                                                            alt={watchedValues?.title || "Poster"}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src =
                                                                    "https://placehold.co/300x450/4c1d95/ffffff?text=Poster";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                                                            <ImageOutlinedIcon sx={{ fontSize: 32 }} className="text-slate-600 mb-1" />
                                                            <span className="text-[11px] font-semibold text-zinc-400">Chưa có Poster</span>
                                                            <span className="text-[9px] text-zinc-600">Tỉ lệ 2:3 (Tab 3)</span>
                                                        </div>
                                                    )}

                                                    {/* Status badge top-left */}
                                                    <div className="absolute top-2.5 left-2.5 z-10">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-wider shadow-lg ${statusConfig.badgeClass}`}
                                                        >
                                                            <span>{statusConfig.icon}</span>
                                                            <span>{statusConfig.label}</span>
                                                        </span>
                                                    </div>

                                                    {/* Age Rating Card top-right */}
                                                    <div className="absolute top-2.5 right-2.5 z-10">
                                                        <ClientRatingBadge rating={watchedValues?.rating || "T13"} />
                                                    </div>

                                                    {/* Play Trailer Floating Overlay Button */}
                                                    {watchedValues?.trailerUrl && (
                                                        <a
                                                            href={watchedValues.trailerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex flex-col items-center justify-center gap-1.5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
                                                            title="Xem trailer chính thức"
                                                        >
                                                            <div className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-xl shadow-violet-600/50 scale-90 group-hover:scale-100 transition-transform">
                                                                <PlayArrowRoundedIcon sx={{ fontSize: 28 }} className="ml-0.5" />
                                                            </div>
                                                            <span className="text-[10px] font-bold tracking-wider uppercase drop-shadow-md">
                                                                Xem Trailer
                                                            </span>
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Action Row below Poster */}
                                                <div className="w-full max-w-[210px] mt-3 flex items-center gap-2">
                                                    {watchedValues?.trailerUrl ? (
                                                        <a
                                                            href={watchedValues.trailerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/40 text-[11px] font-bold text-zinc-200 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <PlayArrowRoundedIcon sx={{ fontSize: 16 }} className="text-violet-400" />
                                                            <span>Xem Trailer</span>
                                                        </a>
                                                    ) : (
                                                        <div className="flex-1 py-2 px-2.5 text-center text-[10px] font-medium text-zinc-500 bg-zinc-900/60 rounded-xl border border-zinc-800">
                                                            Chưa có Trailer
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="w-8.5 h-8.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Chia sẻ phim"
                                                    >
                                                        <ShareOutlinedIcon sx={{ fontSize: 14 }} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* RIGHT COLUMN: Rich Movie Metadata & Synopsis */}
                                            <div className="sm:col-span-7 space-y-3.5">
                                                {/* 1. Meta Badges Bar */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <ClientRatingBadge rating={watchedValues?.rating || "T13"} />

                                                    {/* Score Card */}
                                                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-bold shadow-sm">
                                                        <StarRateRoundedIcon sx={{ fontSize: 13 }} className="text-amber-400" />
                                                        <span>9.2 / 10</span>
                                                        <span className="text-zinc-500 font-normal text-[10px]">
                                                            (28.4K)
                                                        </span>
                                                    </div>

                                                    {/* Duration */}
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[11px] font-semibold">
                                                        <AccessTimeOutlinedIcon sx={{ fontSize: 12 }} className="text-zinc-400" />
                                                        <span>{durationFormatted}</span>
                                                    </span>

                                                    {/* Release Date */}
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[11px] font-semibold">
                                                        <CalendarTodayOutlinedIcon sx={{ fontSize: 11 }} className="text-zinc-400" />
                                                        <span>{previewReleaseDate}</span>
                                                    </span>

                                                    {/* Formats badge */}
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-violet-600/20 backdrop-blur-md border border-violet-500/40 text-violet-300 text-[11px] font-bold">
                                                        <LocalMoviesOutlinedIcon sx={{ fontSize: 12 }} />
                                                        <span>IMAX 2D • 2D</span>
                                                    </span>
                                                </div>

                                                {/* 2. Movie Titles */}
                                                <div>
                                                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-lg">
                                                        {watchedValues?.title || "Tên phim..."}
                                                    </h1>
                                                    {watchedValues?.subtitle && (
                                                        <p className="text-xs text-violet-300/90 font-medium italic mt-0.5">
                                                            {watchedValues.subtitle}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* 3. Genres Pills */}
                                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                    {selectedGenreNames.map((genre, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2.5 py-0.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-[11px] font-medium backdrop-blur-sm"
                                                        >
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* 4. Action Buttons Row (CTA) */}
                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white font-extrabold text-xs shadow-lg shadow-violet-600/40 cursor-default"
                                                    >
                                                        <ConfirmationNumberOutlinedIcon sx={{ fontSize: 14 }} />
                                                        <span>Đặt Vé Ngay</span>
                                                    </button>

                                                    {watchedValues?.trailerUrl && (
                                                        <a
                                                            href={watchedValues.trailerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all"
                                                        >
                                                            <PlayArrowRoundedIcon sx={{ fontSize: 14 }} className="text-violet-400" />
                                                            <span>Trailer</span>
                                                        </a>
                                                    )}

                                                    <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-zinc-900/90 text-zinc-300 text-[11px] font-semibold border border-zinc-800">
                                                        <StarRateRoundedIcon sx={{ fontSize: 13 }} className="text-amber-400" />
                                                        <span>Đánh giá (28.4K)</span>
                                                    </span>
                                                </div>

                                                {/* 5. Movie Synopsis */}
                                                <div className="pt-1 text-zinc-300 text-xs leading-relaxed">
                                                    <p className="line-clamp-3">
                                                        {watchedValues?.overview ||
                                                            "Tóm tắt nội dung kịch bản và thông điệp của phim sẽ được giới thiệu trực quan tại đây..."}
                                                    </p>
                                                </div>

                                                {/* 6. Production & Cast Specs Table */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-zinc-800/80 text-[11px]">
                                                    <div className="space-y-0.5">
                                                        <div className="text-zinc-500 font-medium flex items-center gap-1">
                                                            <PersonOutlineOutlinedIcon sx={{ fontSize: 12 }} />
                                                            <span>Đạo diễn</span>
                                                        </div>
                                                        <p
                                                            className="text-zinc-200 font-semibold truncate"
                                                            title={watchedValues?.director}
                                                        >
                                                            {watchedValues?.director || "Đang cập nhật"}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <div className="text-zinc-500 font-medium flex items-center gap-1">
                                                            <PeopleOutlineOutlinedIcon sx={{ fontSize: 12 }} />
                                                            <span>Diễn viên</span>
                                                        </div>
                                                        <p
                                                            className="text-zinc-200 font-semibold truncate"
                                                            title={castsDisplayString}
                                                        >
                                                            {castsDisplayString}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <div className="text-zinc-500 font-medium flex items-center gap-1">
                                                            <LanguageOutlinedIcon sx={{ fontSize: 12 }} />
                                                            <span>Ngôn ngữ</span>
                                                        </div>
                                                        <p className="text-zinc-200 font-semibold truncate">
                                                            {watchedValues?.originalLanguage || "Phụ đề tiếng Việt"}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <div className="text-zinc-500 font-medium flex items-center gap-1">
                                                            <PublicOutlinedIcon sx={{ fontSize: 12 }} />
                                                            <span>Quốc gia</span>
                                                        </div>
                                                        <p className="text-zinc-200 font-semibold truncate">
                                                            {watchedValues?.originCountry || "Việt Nam"}
                                                        </p>
                                                    </div>
                                                </div>
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
                                    <span>{mode === "add" ? "Tạo Phim Mới" : "Lưu Thay Đổi"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </Dialog>
    );
}
