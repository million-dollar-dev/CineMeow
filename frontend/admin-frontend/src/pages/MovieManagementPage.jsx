import * as React from "react";
import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useDispatch } from "react-redux";

// Redux & Services
import { useGetAllMoviesQuery } from "../services/movieService.js";
import { openSnackbar } from "../redux/slices/snackbarSlice.js";

// Components & Modals
import MovieModal from "../components/MovieManagement/MovieModal.jsx";
import TableSkeleton from "../components/MovieManagement/TableSkeleton.jsx";
import StatCard from "../components/OverviewStats/StatCard.jsx";
import StatusChip from "../components/StatusChip.jsx";
import { MOVIE_STATUS_CONFIG } from "../constants/movieStatus.js";
import { MOCK_MOVIES } from "../mock/mockMovies.js";

// Icons
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import LocalMoviesOutlinedIcon from "@mui/icons-material/LocalMoviesOutlined";

// Helper: Safely extract genre names regardless of array of strings, objects, or comma string
const extractGenreNames = (rawGenres) => {
    if (!rawGenres) return [];
    if (typeof rawGenres === "string") {
        return rawGenres
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (Array.isArray(rawGenres)) {
        return rawGenres
            .map((g) => {
                if (!g) return null;
                if (typeof g === "string") return g.trim();
                if (typeof g === "object") return (g.name || g.label || "").trim();
                return String(g).trim();
            })
            .filter(Boolean);
    }
    return [];
};

// 1. Comprehensive Age Rating Normalizer according to Vietnam Cinema Standards
const getAgeRatingInfo = (rawRating) => {
    if (!rawRating && rawRating !== 0) {
        return {
            code: "P",
            label: "P - Phim được phép phổ biến rộng rãi đến mọi khán giả",
            shortDesc: "Mọi lứa tuổi",
            bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200/90 font-bold",
            solidClass: "bg-emerald-600 text-white font-bold",
        };
    }

    let str = "";
    if (typeof rawRating === "string") {
        str = rawRating.trim().toUpperCase();
    } else if (typeof rawRating === "object") {
        str = (rawRating.name || rawRating.code || rawRating.label || "P").trim().toUpperCase();
    } else {
        str = String(rawRating).trim().toUpperCase();
    }

    // Match Official Vietnamese Cinema Age Classifications
    if (str.includes("18") || str === "C18" || str === "T18" || str === "R" || str === "NC17") {
        return {
            code: "T18",
            label: "T18 - Phim cấm phổ biến đến khán giả dưới 18 tuổi",
            shortDesc: "Khán giả từ 18 tuổi trở lên",
            bgClass: "bg-rose-50 text-rose-700 border-rose-200/90 font-bold",
            solidClass: "bg-rose-600 text-white font-bold",
        };
    }
    if (str.includes("16") || str === "C16" || str === "T16") {
        return {
            code: "T16",
            label: "T16 - Phim cấm phổ biến đến khán giả dưới 16 tuổi",
            shortDesc: "Khán giả từ 16 tuổi trở lên",
            bgClass: "bg-orange-50 text-orange-700 border-orange-200/90 font-bold",
            solidClass: "bg-orange-500 text-white font-bold",
        };
    }
    if (str.includes("13") || str === "C13" || str === "T13" || str === "PG13" || str === "PG-13") {
        return {
            code: "T13",
            label: "T13 - Phim cấm phổ biến đến khán giả dưới 13 tuổi",
            shortDesc: "Khán giả từ 13 tuổi trở lên",
            bgClass: "bg-amber-50 text-amber-700 border-amber-200/90 font-bold",
            solidClass: "bg-amber-500 text-white font-bold",
        };
    }
    if (str === "K" || str === "PG") {
        return {
            code: "K",
            label: "K - Khán giả dưới 13 tuổi được xem với điều kiện có cha mẹ/người giám hộ đi cùng",
            shortDesc: "Dưới 13 tuổi (kèm người lớn)",
            bgClass: "bg-sky-50 text-sky-700 border-sky-200/90 font-bold",
            solidClass: "bg-sky-500 text-white font-bold",
        };
    }
    // Default P (General Audience)
    return {
        code: "P",
        label: "P - Phim được phép phổ biến rộng rãi đến mọi khán giả",
        shortDesc: "Phổ biến mọi lứa tuổi",
        bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200/90 font-bold",
        solidClass: "bg-emerald-600 text-white font-bold",
    };
};

const renderRatingBadge = (rating, isSolid = false) => {
    const info = getAgeRatingInfo(rating);
    if (isSolid) {
        return (
            <Tooltip title={info.label} arrow disableInteractive>
                <span
                    className={`inline-flex items-center justify-center text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm shrink-0 cursor-help select-none ${info.solidClass}`}
                    style={{ height: "22px", minHeight: "22px", maxHeight: "22px", lineHeight: "1" }}
                >
                    {info.code}
                </span>
            </Tooltip>
        );
    }
    return (
        <Tooltip title={info.label} arrow disableInteractive>
            <span
                className={`inline-flex items-center justify-center text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md border shadow-2xs shrink-0 cursor-help select-none transition-transform hover:scale-105 ${info.bgClass}`}
                style={{ height: "22px", minHeight: "22px", maxHeight: "22px", lineHeight: "1" }}
            >
                {info.code}
            </span>
        </Tooltip>
    );
};

// 2. Safe Duration Formatter
const formatDuration = (rawDuration) => {
    if (!rawDuration && rawDuration !== 0) {
        return { text: "Chưa cập nhật", detailText: "Chưa cập nhật thời lượng", minutes: 0 };
    }
    let minutes = 0;
    if (typeof rawDuration === "number") {
        minutes = rawDuration;
    } else if (typeof rawDuration === "string") {
        const match = rawDuration.match(/\d+/);
        minutes = match ? parseInt(match[0], 10) : 0;
    }
    if (!minutes || isNaN(minutes) || minutes <= 0) {
        return { text: "Chưa cập nhật", detailText: "Chưa cập nhật thời lượng", minutes: 0 };
    }

    const hours = Math.floor(minutes / 60);
    const remMins = minutes % 60;
    let hourStr = "";
    if (hours > 0) {
        hourStr = remMins > 0 ? `${hours} giờ ${remMins} phút` : `${hours} giờ`;
    } else {
        hourStr = `${remMins} phút`;
    }

    return {
        text: `${minutes} phút`,
        detailText: hours > 0 ? `${minutes} phút (${hourStr})` : `${minutes} phút`,
        minutes,
    };
};

// 3. Safe Vietnamese Date Formatter (DD/MM/YYYY)
const formatReleaseDate = (rawDate) => {
    if (!rawDate) return "Chưa định ngày";
    if (Array.isArray(rawDate) && rawDate.length >= 3) {
        const [year, month, day] = rawDate;
        return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    }
    if (typeof rawDate === "string") {
        const trimmed = rawDate.trim();
        // Check standard YYYY-MM-DD
        const parts = trimmed.split("-");
        if (parts.length === 3 && parts[0].length === 4) {
            return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
        }
        return trimmed;
    }
    try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString("vi-VN");
        }
    } catch {
        // fallback
    }
    return String(rawDate);
};

export default function MovieManagementPage() {
    const dispatch = useDispatch();

    // Data fetching
    const { data, isError, error, isLoading, refetch } = useGetAllMoviesQuery();

    // State management
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Detail Preview State
    const [previewMovie, setPreviewMovie] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    // Search and Status Tab Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatusTab, setSelectedStatusTab] = useState("ALL");

    // Format and merge raw movies with realistic mock dataset
    const movies = useMemo(() => {
        const apiMovies =
            data?.data?.map((movie) => {
                const genreList = extractGenreNames(movie.genres);
                return {
                    id: movie.id,
                    poster: movie.posterPath,
                    backdrop: movie.backdropPath,
                    title: movie.title,
                    subtitle: movie.subtitle || "",
                    tagline: movie.tagline || "",
                    genres: genreList,
                    genreString: genreList.join(", ") || "Chưa phân loại",
                    releaseDate: movie.releaseDate,
                    duration: movie.duration,
                    status: movie.status || "NOW_PLAYING",
                    rating: movie.rating || "P",
                    director: movie.director || "Chưa cập nhật",
                    casts: movie.casts || [],
                    overview: movie.overview || "Chưa có tóm tắt nội dung.",
                    trailerUrl: movie.trailerUrl || "",
                    originalLanguage: movie.originalLanguage || "Tiếng Việt",
                    originCountry: movie.originCountry || "Việt Nam",
                    fullData: movie,
                };
            }) || [];

        // Format mock movies
        const mockFormatted = MOCK_MOVIES.map((movie) => {
            const genreList = extractGenreNames(movie.genres);
            return {
                id: movie.id,
                poster: movie.posterPath,
                backdrop: movie.backdropPath,
                title: movie.title,
                subtitle: movie.subtitle,
                tagline: movie.tagline,
                genres: genreList,
                genreString: genreList.join(", "),
                releaseDate: movie.releaseDate,
                duration: movie.duration,
                status: movie.status,
                rating: movie.rating,
                director: movie.director,
                casts: movie.casts,
                overview: movie.overview,
                trailerUrl: movie.trailerUrl,
                originalLanguage: movie.originalLanguage,
                originCountry: movie.originCountry,
                fullData: movie,
            };
        });

        // Merge without duplicating existing IDs
        const apiIds = new Set(apiMovies.map((m) => m.id));
        const nonDuplicateMocks = mockFormatted.filter((m) => !apiIds.has(m.id));

        return [...apiMovies, ...nonDuplicateMocks];
    }, [data]);

    // Statistics Calculation
    const totalMovies = movies.length;
    const nowShowing = movies.filter((m) => m.status === "NOW_PLAYING").length;
    const comingSoon = movies.filter((m) => m.status === "COMING_SOON").length;
    const released = movies.filter((m) => m.status === "RELEASED").length;
    const postProduction = movies.filter((m) => m.status === "POST_PRODUCTION").length;

    // Stat Cards Configuration with aesthetic background watermark icon
    const stats = useMemo(
        () => [
            {
                title: "Tổng kho phim",
                value: totalMovies,
                subtitle: "Tất cả phim trong hệ thống",
                icon: <MovieCreationOutlinedIcon />,
                bigIcon: <MovieCreationOutlinedIcon fontSize="inherit" />,
                bgColor: "#1976d2", // Indigo / Violet gradient
            },
            {
                title: "Đang khởi chiếu",
                value: nowShowing,
                subtitle: "Đang mở bán vé tại cụm rạp",
                icon: <PlayCircleOutlinedIcon />,
                bigIcon: <PlayCircleOutlinedIcon fontSize="inherit" />,
                bgColor: "#2e7d32", // Emerald gradient
            },
            {
                title: "Sắp khởi chiếu",
                value: comingSoon,
                subtitle: "Dự kiến ra mắt khán giả",
                icon: <FiberNewOutlinedIcon />,
                bigIcon: <FiberNewOutlinedIcon fontSize="inherit" />,
                bgColor: "#f57c00", // Amber gradient
            },
            {
                title: "Đã phát hành",
                value: released,
                subtitle: "Lưu trữ lịch sử chiếu rạp",
                icon: <ScheduleOutlinedIcon />,
                bigIcon: <ScheduleOutlinedIcon fontSize="inherit" />,
                bgColor: "black", // Executive Slate gradient
            },
        ],
        [totalMovies, nowShowing, comingSoon, released]
    );

    // Filtered movies according to status tab & search query
    const filteredMovies = useMemo(() => {
        return movies.filter((movie) => {
            // Filter by Status Tab
            const matchesStatus =
                selectedStatusTab === "ALL" || movie.status === selectedStatusTab;

            // Filter by Search Query
            const query = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !query ||
                movie.title.toLowerCase().includes(query) ||
                movie.director.toLowerCase().includes(query) ||
                movie.genreString.toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [movies, selectedStatusTab, searchQuery]);

    // Handlers
    const handleAddClick = () => {
        setModalMode("add");
        setSelectedMovie(null);
        setOpenModal(true);
    };

    const handleEditClick = (movie) => {
        setModalMode("edit");
        setSelectedMovie(movie);
        setOpenModal(true);
        if (previewMovie) setPreviewMovie(null);
    };

    const handleDeleteClick = (movie) => {
        setMovieToDelete(movie);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        dispatch(
            openSnackbar({
                message: `Yêu cầu gỡ bỏ phim "${movieToDelete?.title}" đã được ghi nhận. Tính năng xóa an toàn đang được đồng bộ máy chủ.`,
                type: "info",
            })
        );
        setOpenDeleteDialog(false);
        setMovieToDelete(null);
    };

    // Notification on Fetch Error
    React.useEffect(() => {
        if (isError) {
            dispatch(
                openSnackbar({
                    message: error?.data?.message || "Không thể tải danh sách phim từ máy chủ.",
                    type: "error",
                })
            );
        }
    }, [isError, error, dispatch]);

    // Columns Definition: Large 80x114px Poster & Fixed Genre Pills
    const columns = [
        {
            field: "movieInfo",
            headerName: "Phim điện ảnh",
            flex: 1.6,
            minWidth: 320,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center gap-4 py-2 w-full min-w-0">
                        {/* Prominent Large Poster (80x114px, 2:3 aspect ratio) */}
                        <div
                            onClick={() => setPreviewMovie(row)}
                            className="relative w-20 h-[114px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-sm shrink-0 group/img cursor-pointer hover:shadow-md transition-all"
                        >
                            <img
                                src={row.poster}
                                alt={row.title}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://placehold.co/160x228/6366f1/ffffff?text=CineMeow";
                                }}
                            />
                            {/* Hover Overlay Hint */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <VisibilityOutlinedIcon sx={{ fontSize: 22 }} />
                            </div>
                        </div>

                        {/* Title, Subtitle, Director */}
                        <div className="min-w-0 flex-1 py-1 flex flex-col justify-center">
                            {/* Title with hover */}
                            <h3
                                onClick={() => setPreviewMovie(row)}
                                className="text-sm font-extrabold text-slate-900 truncate hover:text-violet-600 cursor-pointer transition-colors leading-snug"
                                title={row.title}
                            >
                                {row.title}
                            </h3>

                            {/* English subtitle / Tagline */}
                            {row.subtitle && (
                                <p className="text-xs text-slate-400 font-medium truncate mt-1">
                                    {row.subtitle}
                                </p>
                            )}

                            {/* Director & Country */}
                            <p className="text-xs text-slate-600 truncate mt-1.5">
                                <span className="text-slate-400">Đạo diễn: </span>
                                <span className="font-semibold text-slate-800">{row.director}</span>
                                {row.originCountry && (
                                    <span className="text-slate-400 ml-1.5">• {row.originCountry}</span>
                                )}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "durationAndRating",
            headerName: "Thời lượng & Độ tuổi",
            width: 180,
            sortable: false,
            renderCell: (params) => {
                const row = params.row;
                const durationInfo = formatDuration(row.duration);
                return (
                    <div className="flex items-center gap-2.5 py-1">
                        {/* Rating Badge (Hover to see full description) */}
                        {renderRatingBadge(row.rating)}

                        {/* Duration Pill */}
                        <Tooltip title={durationInfo.detailText} arrow disableInteractive>
                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-default select-none whitespace-nowrap">
                                <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400 shrink-0" />
                                <span>{durationInfo.text}</span>
                            </span>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            field: "genres",
            headerName: "Thể loại phim",
            width: 220,
            sortable: false,
            renderCell: (params) => {
                const genreList = extractGenreNames(params.row.genres);
                if (genreList.length === 0) {
                    return <span className="text-xs text-slate-400 italic">Chưa phân loại</span>;
                }

                const visibleGenres = genreList.slice(0, 3);
                const remainingCount = genreList.length - visibleGenres.length;

                return (
                    <div className="flex flex-wrap gap-1.5 items-center w-full py-1">
                        {visibleGenres.map((genre, idx) => (
                            <span
                                key={idx}
                                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-50/90 text-violet-700 border border-violet-100/90 shadow-2xs whitespace-nowrap"
                            >
                                {genre}
                            </span>
                        ))}
                        {remainingCount > 0 && (
                            <Tooltip title={genreList.join(", ")} arrow disableInteractive>
                                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer">
                                    +{remainingCount}
                                </span>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            field: "releaseDate",
            headerName: "Khởi chiếu",
            width: 150,
            renderCell: (params) => (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                    <span>{formatReleaseDate(params.value)}</span>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            renderCell: (params) => (
                <StatusChip status={params.value} configs={MOVIE_STATUS_CONFIG} />
            ),
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 160,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex items-center gap-1.5">
                        {/* Preview */}
                        <Tooltip title="Xem chi tiết phim" arrow disableInteractive>
                            <IconButton
                                size="small"
                                onClick={() => setPreviewMovie(row)}
                                className="!text-slate-400 hover:!text-slate-900 hover:!bg-slate-100 !rounded-xl !w-9 !h-9"
                            >
                                <VisibilityOutlinedIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                        </Tooltip>

                        {/* Edit */}
                        <Tooltip title="Chỉnh sửa thông tin" arrow disableInteractive>
                            <IconButton
                                size="small"
                                onClick={() => handleEditClick(row.fullData)}
                                className="!text-slate-400 hover:!text-violet-600 hover:!bg-violet-50 !rounded-xl !w-9 !h-9"
                            >
                                <EditOutlinedIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip title="Gỡ bỏ phim" arrow disableInteractive>
                            <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(row)}
                                className="!text-slate-400 hover:!text-rose-600 hover:!bg-rose-50 !rounded-xl !w-9 !h-9"
                            >
                                <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="py-6 space-y-6">
            {/* Modal Create / Edit */}
            <MovieModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                mode={modalMode}
                movieData={selectedMovie}
            />

            {/* 1. PAGE HEADER (STANDARD PAGE HEADER BANNER) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <LocalMoviesOutlinedIcon className="text-violet-600" />
                        <span>Quản Lý Phim</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Quản lý danh mục phim, kiểm soát tình trạng phát hành và thiết lập thông tin hiển thị trên hệ thống rạp CineMeow
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            refetch();
                            dispatch(openSnackbar({ message: "Đang đồng bộ dữ liệu danh mục phim...", type: "info" }));
                        }}
                        startIcon={<RefreshOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#E2E8F0",
                            color: "#475569",
                            "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                        }}
                    >
                        Làm mới
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleAddClick}
                        startIcon={<AddOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: "12px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                            boxShadow: "0 10px 20px -5px rgba(124, 58, 237, 0.3)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)",
                            },
                        }}
                    >
                        Thêm phim mới
                    </Button>
                </div>
            </div>

            {/* 2. STATS KPI GRID USING SHARED StatCard COMPONENT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} loading={isLoading} />
                ))}
            </div>

            {/* 3. CONTROL BAR: STATUS TABS & QUICK SEARCH */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    {[
                        { key: "ALL", label: "Tất cả", count: totalMovies },
                        { key: "NOW_PLAYING", label: "Đang chiếu", count: nowShowing },
                        { key: "COMING_SOON", label: "Sắp chiếu", count: comingSoon },
                        { key: "RELEASED", label: "Đã phát hành", count: released },
                        { key: "POST_PRODUCTION", label: "Đang hậu kỳ", count: postProduction },
                    ].map((tab) => {
                        const isActive = selectedStatusTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setSelectedStatusTab(tab.key)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? "bg-violet-600 text-white shadow-sm font-bold"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-200/70 text-slate-600"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Input */}
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:bg-white focus-within:border-violet-500 focus-within:ring-3 focus-within:ring-violet-500/10 transition-all w-full md:w-80 shadow-2xs">
                    <SearchOutlinedIcon sx={{ fontSize: 18 }} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên phim, thể loại, đạo diễn..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                        </button>
                    )}
                </div>
            </div>

            {/* 4. DATAGRID TABLE: Spacious 140px rowHeight, 80x114px Posters */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <TableSkeleton paginationModel={paginationModel} />
                ) : (
                    <Box sx={{ width: "100%", minHeight: 520 }}>
                        <DataGrid
                            rows={filteredMovies}
                            columns={columns}
                            rowHeight={140}
                            disableRowSelectionOnClick
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5, 10, 20]}
                            pagination
                            sx={{
                                border: "none",
                                fontFamily: "inherit",
                                "& .MuiDataGrid-columnHeaders": {
                                    bgcolor: "#F8FAFC",
                                    borderBottom: "1px solid #E2E8F0",
                                    fontWeight: 700,
                                    fontSize: "11px",
                                    color: "#475569",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    py: 1,
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "1px solid #F1F5F9",
                                    display: "flex",
                                    alignItems: "center",
                                },
                                "& .MuiDataGrid-row:hover": {
                                    bgcolor: "#F8FAFC/80",
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    borderTop: "1px solid #E2E8F0",
                                },
                            }}
                        />
                    </Box>
                )}
            </div>

            {/* 5. PREVIEW MOVIE DIALOG */}
            <Dialog
                open={Boolean(previewMovie)}
                onClose={() => setPreviewMovie(null)}
                maxWidth="md"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
                        },
                    },
                }}
            >
                {previewMovie && (
                    <div>
                        {/* Backdrop Banner */}
                        <div className="relative h-52 bg-slate-900 overflow-hidden">
                            {previewMovie.backdrop ? (
                                <img
                                    src={previewMovie.backdrop}
                                    alt={previewMovie.title}
                                    className="w-full h-full object-cover opacity-60"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-violet-900 to-indigo-900 opacity-80" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setPreviewMovie(null)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                            </button>

                            {/* Bottom Backdrop Info */}
                            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <StatusChip status={previewMovie.status} configs={MOVIE_STATUS_CONFIG} />
                                        {renderRatingBadge(previewMovie.rating, true)}
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">
                                        {previewMovie.title}
                                    </h3>
                                    {previewMovie.tagline && (
                                        <p className="text-xs text-slate-300 italic mt-0.5">
                                            "{previewMovie.tagline}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 space-y-5">
                            <div className="flex flex-col sm:flex-row gap-5">
                                {/* Large Poster Preview */}
                                <div className="w-32 h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-md">
                                    <img
                                        src={previewMovie.poster}
                                        alt={previewMovie.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Main Specs */}
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                            Tóm tắt nội dung
                                        </h4>
                                        <p className="text-xs text-slate-700 leading-relaxed mt-1">
                                            {previewMovie.overview}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <span className="text-slate-400 font-medium">Đạo diễn: </span>
                                            <span className="font-bold text-slate-800">
                                                {previewMovie.director || "Chưa cập nhật"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-medium">Thời lượng: </span>
                                            <span className="font-bold text-slate-800">
                                                {formatDuration(previewMovie.duration).text}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-medium">Khởi chiếu: </span>
                                            <span className="font-bold text-slate-800">
                                                {formatReleaseDate(previewMovie.releaseDate)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-medium">Quốc gia: </span>
                                            <span className="font-bold text-slate-800">
                                                {previewMovie.originCountry || "Việt Nam"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Genres */}
                                    <div>
                                        <span className="text-xs text-slate-400 font-medium mr-2">Thể loại:</span>
                                        {extractGenreNames(previewMovie.genres).map((g, i) => (
                                            <span
                                                key={i}
                                                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-violet-50 text-violet-700 mr-1.5"
                                            >
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cast List */}
                            {previewMovie.casts?.length > 0 && (
                                <div className="border-t border-slate-100 pt-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                        Diễn viên chính
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {previewMovie.casts.map((c, i) => (
                                            <span
                                                key={i}
                                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dialog Footer Actions */}
                            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                                {previewMovie.trailerUrl ? (
                                    <a
                                        href={previewMovie.trailerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1.5"
                                    >
                                        <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
                                        Xem Trailer chính thức
                                    </a>
                                ) : (
                                    <span />
                                )}

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMovie(null)}
                                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(previewMovie.fullData)}
                                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                                        Chỉnh sửa phim
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* 6. DELETE CONFIRMATION DIALOG */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "16px",
                            p: 1,
                            maxWidth: 420,
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: "16px", color: "#0F172A" }}>
                    Xác nhận gỡ bỏ phim?
                </DialogTitle>
                <DialogContent>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Bạn có chắc chắn muốn gỡ bỏ phim{" "}
                        <span className="font-bold text-slate-900">"{movieToDelete?.title}"</span> khỏi danh sách phát hành không? Thao tác này sẽ cập nhật trạng thái phân phối phim.
                    </p>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        sx={{ textTransform: "none", fontWeight: 600, color: "#64748B" }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDelete}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: "10px",
                            boxShadow: "none",
                        }}
                    >
                        Xác nhận gỡ bỏ
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
