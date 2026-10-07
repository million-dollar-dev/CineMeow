import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Select,
    MenuItem,
    IconButton,
    Tooltip as MuiTooltip,
} from "@mui/material";

// Material UI Icons
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

// Recharts
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { useGetAllMoviesQuery } from "../services/movieService.js";

// --- KPI CARD COMPONENT ---
const KPICard = ({ title, value, subtext, trend, positive, icon, iconBg, iconColor }) => (
    <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
        <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                {title}
            </span>
            <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                {icon}
            </div>
        </div>

        <div className="text-2xl xl:text-3xl font-black text-slate-900 tracking-tight">
            {value}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                    positive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-rose-50 text-rose-700 border border-rose-200/60"
                }`}
            >
                {positive ? "↑" : "↓"} {trend}
            </span>
            <span className="text-slate-400 truncate max-w-[150px] font-medium">
                {subtext}
            </span>
        </div>
    </div>
);

// --- CUSTOM RECHARTS TOOLTIP ---
const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700/60 text-xs space-y-1.5">
                <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-300 font-medium">{entry.name}:</span>
                        </div>
                        <span className="font-bold text-white font-mono">
                            {typeof entry.value === "number" && entry.name.includes("Doanh thu")
                                ? `${entry.value.toLocaleString("vi-VN")} ₫`
                                : `${entry.value.toLocaleString("vi-VN")} vé`}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// --- DATASETS BY TIMEFRAME ---
const chartDataSets = {
    today: [
        { name: "09:00", revenue: 4200000, tickets: 42 },
        { name: "11:00", revenue: 6800000, tickets: 68 },
        { name: "13:00", revenue: 5100000, tickets: 50 },
        { name: "15:00", revenue: 8400000, tickets: 82 },
        { name: "17:00", revenue: 12500000, tickets: 118 },
        { name: "19:00", revenue: 19800000, tickets: 178 },
        { name: "21:00", revenue: 16400000, tickets: 145 },
        { name: "23:00", revenue: 7200000, tickets: 65 },
    ],
    week: [
        { name: "Thứ 2", revenue: 28400000, tickets: 285 },
        { name: "Thứ 3", revenue: 32100000, tickets: 320 },
        { name: "Thứ 4", revenue: 41500000, tickets: 410 },
        { name: "Thứ 5", revenue: 36800000, tickets: 360 },
        { name: "Thứ 6", revenue: 62400000, tickets: 615 },
        { name: "Thứ 7", revenue: 94200000, tickets: 920 },
        { name: "Chủ Nhật", revenue: 88500000, tickets: 870 },
    ],
    month: [
        { name: "Tuần 1", revenue: 265000000, tickets: 2600 },
        { name: "Tuần 2", revenue: 312000000, tickets: 3080 },
        { name: "Tuần 3", revenue: 345000000, tickets: 3420 },
        { name: "Tuần 4", revenue: 418000000, tickets: 4120 },
    ],
    year: [
        { name: "Q1", revenue: 3250000000, tickets: 32000 },
        { name: "Q2", revenue: 3840000000, tickets: 38100 },
        { name: "Q3", revenue: 4120000000, tickets: 40800 },
        { name: "Q4 (Dự kiến)", revenue: 4650000000, tickets: 45500 },
    ],
};

const formatBreakdownData = [
    { name: "IMAX Laser", value: 45, color: "#6366F1", revenue: "83.9M ₫" },
    { name: "2D Digital", value: 30, color: "#10B981", revenue: "55.9M ₫" },
    { name: "3D Atmos", value: 15, color: "#F59E0B", revenue: "27.9M ₫" },
    { name: "VIP Suite", value: 10, color: "#EC4899", revenue: "18.6M ₫" },
];

const topMoviesFallback = [
    {
        title: "Dune: Part Two",
        genre: "Khoa học viễn tưởng, Hành động",
        revenue: "68.250.000 ₫",
        tickets: "642 vé",
        occupancy: 91.4,
        rating: 8.8,
        poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    },
    {
        title: "Mai (2024)",
        genre: "Tâm lý, Tình cảm",
        revenue: "54.800.000 ₫",
        tickets: "560 vé",
        occupancy: 88.2,
        rating: 8.2,
        poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    },
    {
        title: "Godzilla x Kong: The New Empire",
        genre: "Hành động, Quái thú",
        revenue: "38.450.000 ₫",
        tickets: "380 vé",
        occupancy: 79.5,
        rating: 7.9,
        poster: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg",
    },
    {
        title: "Kung Fu Panda 4",
        genre: "Hoạt hình, Hài hước",
        revenue: "24.950.000 ₫",
        tickets: "260 vé",
        occupancy: 72.8,
        rating: 7.7,
        poster: "https://image.tmdb.org/t/p/w500/fNtqD4jN5n6f85Vw8XqK4P1wW7y.jpg",
    },
];

const liveScreeningRooms = [
    {
        room: "Phòng IMAX Laser (P.01)",
        format: "IMAX Laser 3D",
        movie: "Dune: Part Two",
        time: "19:30 - 22:15",
        seatsBooked: 286,
        totalSeats: 300,
        status: "screening",
        statusText: "Đang chiếu",
    },
    {
        room: "Phòng ScreenX (P.02)",
        format: "ScreenX 270°",
        movie: "Godzilla x Kong",
        time: "20:00 - 22:00",
        seatsBooked: 198,
        totalSeats: 220,
        status: "screening",
        statusText: "Đang chiếu",
    },
    {
        room: "Phòng VIP Atmos (P.03)",
        format: "Dolby Atmos VIP",
        movie: "Mai (2024)",
        time: "21:15 - 23:25",
        seatsBooked: 78,
        totalSeats: 90,
        status: "upcoming",
        statusText: "Sắp chiếu",
    },
    {
        room: "Phòng Standard (P.04)",
        format: "2D Digital",
        movie: "Kung Fu Panda 4",
        time: "20:30 - 22:05",
        seatsBooked: 142,
        totalSeats: 160,
        status: "screening",
        statusText: "Đang chiếu",
    },
];

export default function DashboardPage() {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState("week");
    const [chartMode, setChartMode] = useState("revenue"); // 'revenue' or 'tickets'
    const [selectedCluster, setSelectedCluster] = useState("all");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch live movies from backend if available
    const { data: moviesApiData } = useGetAllMoviesQuery();

    const topMovies = useMemo(() => {
        if (moviesApiData?.data && moviesApiData.data.length > 0) {
            return moviesApiData.data.slice(0, 4).map((m, idx) => ({
                title: m.title || "Phim điện ảnh",
                genre: m.genres?.map((g) => g.name).join(", ") || "Điện ảnh",
                revenue: `${(50000000 - idx * 8000000).toLocaleString("vi-VN")} ₫`,
                tickets: `${(520 - idx * 75).toLocaleString("vi-VN")} vé`,
                occupancy: Math.max(70, 92 - idx * 5),
                rating: m.rating || 8.5,
                poster: m.posterPath || topMoviesFallback[idx]?.poster,
            }));
        }
        return topMoviesFallback;
    }, [moviesApiData]);

    const activeChartData = chartDataSets[timeframe] || chartDataSets.week;

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 600);
    };

    return (
        <div className="py-6 space-y-6">
            
            {/* 1. TOP HEADER: GREETING & FILTERS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                            <TrendingUpOutlinedIcon className="text-violet-600" />
                            <span>Tổng Quan Vận Hành Cụm Rạp</span>
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold">
                            <FiberManualRecordIcon sx={{ fontSize: 9 }} className="text-emerald-500 animate-pulse" />
                            Trực tuyến
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                        Giám sát hiệu suất phòng vé, tỷ lệ lấp đầy ghế và hoạt động các phòng chiếu thời gian thực.
                    </p>
                </div>

                {/* Filters Row */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Cinema Cluster Selector */}
                    <Select
                        value={selectedCluster}
                        onChange={(e) => setSelectedCluster(e.target.value)}
                        size="small"
                        className="!bg-slate-50 hover:!bg-slate-100 !rounded-xl !text-xs !font-semibold !text-slate-700 !border-slate-200"
                    >
                        <MenuItem value="all">Tất cả cụm rạp</MenuItem>
                        <MenuItem value="landmark">CineMeow Landmark 81</MenuItem>
                        <MenuItem value="royal">CineMeow Royal City</MenuItem>
                        <MenuItem value="crescent">CineMeow Crescent Mall</MenuItem>
                    </Select>

                    {/* Timeframe Selector */}
                    <Select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        size="small"
                        className="!bg-slate-50 hover:!bg-slate-100 !rounded-xl !text-xs !font-semibold !text-slate-700 !border-slate-200"
                    >
                        <MenuItem value="today">Hôm nay</MenuItem>
                        <MenuItem value="week">7 ngày qua</MenuItem>
                        <MenuItem value="month">Tháng này</MenuItem>
                        <MenuItem value="year">Năm 2026</MenuItem>
                    </Select>

                    {/* Refresh Button */}
                    <MuiTooltip title="Làm mới dữ liệu">
                        <IconButton
                            onClick={handleRefresh}
                            className="!bg-slate-50 hover:!bg-slate-100 !border !border-slate-200 !rounded-xl !w-9 !h-9 !text-slate-600"
                        >
                            <RefreshOutlinedIcon fontSize="small" className={isRefreshing ? "animate-spin" : ""} />
                        </IconButton>
                    </MuiTooltip>
                </div>
            </div>

            {/* 2. KPI METRICS (4 PRIMARY CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Doanh thu phòng vé"
                    value={
                        timeframe === "today"
                            ? "48.250.000 ₫"
                            : timeframe === "month"
                            ? "1.248.500.000 ₫"
                            : timeframe === "year"
                            ? "14.850.000.000 ₫"
                            : "383.900.000 ₫"
                    }
                    trend="14.8%"
                    positive={true}
                    subtext="So với kỳ trước"
                    icon={<TrendingUpOutlinedIcon sx={{ fontSize: 20, display: "block" }} />}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                />

                <KPICard
                    title="Tổng số vé bán ra"
                    value={
                        timeframe === "today"
                            ? "462 vé"
                            : timeframe === "month"
                            ? "12.350 vé"
                            : timeframe === "year"
                            ? "146.200 vé"
                            : "3.780 vé"
                    }
                    trend="8.2%"
                    positive={true}
                    subtext="Bình quân 101k / vé"
                    icon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: 20, display: "block" }} />}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                />

                <KPICard
                    title="Tỷ lệ lấp đầy ghế"
                    value="78.6%"
                    trend="5.4%"
                    positive={true}
                    subtext="Giờ vàng đạt 94.2%"
                    icon={<EventSeatOutlinedIcon sx={{ fontSize: 20, display: "block" }} />}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />

                <KPICard
                    title="Suất chiếu vận hành"
                    value="36 / 42"
                    trend="100%"
                    positive={true}
                    subtext="8 phòng chiếu hoạt động"
                    icon={<MovieOutlinedIcon sx={{ fontSize: 20, display: "block" }} />}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                />
            </div>

            {/* 3. MAIN CHARTS ROW (REVENUE TREND AREA + FORMAT DONUT) */}
            <div className="grid grid-cols-12 gap-5">
                
                {/* 3.1 Main Trend Area Chart (8 Columns) */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-extrabold text-slate-900">
                                    Xu Hướng Doanh Số & Lượng Vé
                                </h2>
                                <span className="text-xs font-semibold text-slate-400">
                                    ({timeframe === "today" ? "Theo khung giờ" : "Theo mốc thời gian"})
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Thống kê tổng doanh thu bán vé và lượng vé phát hành.
                            </p>
                        </div>

                        {/* Chart Switcher Buttons */}
                        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setChartMode("revenue")}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    chartMode === "revenue"
                                        ? "bg-white text-violet-700 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Doanh thu (₫)
                            </button>
                            <button
                                type="button"
                                onClick={() => setChartMode("tickets")}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    chartMode === "tickets"
                                        ? "bg-white text-violet-700 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Lượng vé
                            </button>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="h-[280px] w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                                    </linearGradient>
                                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748B", fontSize: 11 }}
                                    tickFormatter={(val) =>
                                        chartMode === "revenue"
                                            ? val >= 1000000
                                                ? `${(val / 1000000).toFixed(0)}M`
                                                : `${val / 1000}k`
                                            : val
                                    }
                                />
                                <Tooltip content={<CustomChartTooltip />} />
                                {chartMode === "revenue" ? (
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Doanh thu"
                                        stroke="#6366F1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                ) : (
                                    <Area
                                        type="monotone"
                                        dataKey="tickets"
                                        name="Số vé"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTickets)"
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chart Summary Highlights */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Đỉnh điểm doanh số</span>
                            <span className="font-extrabold text-slate-800 text-sm">Thứ Bảy (94.2M ₫)</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Khung giờ cao điểm</span>
                            <span className="font-extrabold text-slate-800 text-sm">19:00 - 21:30</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Bình quân ngày</span>
                            <span className="font-extrabold text-slate-800 text-sm">54.8M ₫ / ngày</span>
                        </div>
                    </div>
                </div>

                {/* 3.2 Format Breakdown Donut Chart (4 Columns) */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-extrabold text-slate-900">
                                Định Dạng Phòng Chiếu
                            </h2>
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                Thị phần
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Cơ cấu doanh thu theo định dạng công nghệ rạp
                        </p>
                    </div>

                    {/* Donut Chart */}
                    <div className="relative h-[180px] w-full my-2 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={formatBreakdownData}
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {formatBreakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(val, name) => [`${val}%`, name]}
                                    contentStyle={{
                                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                                        borderRadius: "12px",
                                        border: "none",
                                        color: "#fff",
                                        fontSize: "12px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-slate-900 leading-none">45%</span>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">IMAX Top</span>
                        </div>
                    </div>

                    {/* Legend list */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        {formatBreakdownData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="font-semibold text-slate-700">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-400">{item.revenue}</span>
                                    <span className="font-bold text-slate-900 w-8 text-right">{item.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. BOTTOM SECTION: TOP MOVIES & LIVE SCREENING ROOMS */}
            <div className="grid grid-cols-12 gap-5">
                
                {/* 4.1 Top Performing Movies (7 Columns) */}
                <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900">
                                Top Phim Đạt Doanh Số Cao Nhất
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Các tác phẩm điện ảnh dẫn đầu về doanh thu và lượng vé
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/movies")}
                            className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
                        >
                            <span>Xem kho phim</span>
                            <ArrowOutwardIcon sx={{ fontSize: 14 }} />
                        </button>
                    </div>

                    {/* Movie List Cards */}
                    <div className="space-y-3">
                        {topMovies.map((movie, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition duration-150 group"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    {/* Poster Image */}
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-12 h-16 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </span>
                                            <h3 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-violet-600 transition">
                                                {movie.title}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">{movie.genre}</p>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                            <span className="flex items-center text-amber-500 font-semibold">
                                                <StarRateRoundedIcon sx={{ fontSize: 15 }} />
                                                {movie.rating}
                                            </span>
                                            <span>•</span>
                                            <span>Lấp đầy {movie.occupancy}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Revenue & Tickets Sold */}
                                <div className="text-right shrink-0 pl-3">
                                    <div className="font-black text-slate-900 text-sm sm:text-base font-mono">
                                        {movie.revenue}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">
                                        {movie.tickets}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4.2 Live Theater Room Status (5 Columns) */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900">
                                Phòng Chiếu Đang Vận Hành
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Trạng thái phòng máy và suất chiếu tức thời
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/showtimes")}
                            className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
                        >
                            <span>Lịch chiếu</span>
                            <ArrowOutwardIcon sx={{ fontSize: 14 }} />
                        </button>
                    </div>

                    {/* Room list */}
                    <div className="space-y-3">
                        {liveScreeningRooms.map((room, idx) => (
                            <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 hover:border-slate-200 transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <LiveTvOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                        <span className="font-extrabold text-xs text-slate-900">{room.room}</span>
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            room.status === "screening"
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                                        }`}
                                    >
                                        {room.statusText}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-600">
                                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                                        {room.movie}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                                        <AccessTimeOutlinedIcon sx={{ fontSize: 12 }} />
                                        {room.time}
                                    </span>
                                </div>

                                {/* Progress Bar of Booked Seats */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                        <span>Ghế đã đặt:</span>
                                        <span className="font-bold text-slate-700 font-mono">
                                            {room.seatsBooked} / {room.totalSeats} ({((room.seatsBooked / room.totalSeats) * 100).toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                                            style={{ width: `${(room.seatsBooked / room.totalSeats) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
