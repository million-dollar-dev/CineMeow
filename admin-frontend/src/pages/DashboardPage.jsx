import React, {useState} from "react";
import {IconButton, MenuItem, Select} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import HomePage from "./HomePage.jsx";

const KPICard = ({ title, value, diff, positive, className }) => (
    <div
        className={`p-5 bg-white shadow flex flex-col justify-between ${className}`}
    >
        <div className="flex items-start justify-between">
            <div className="text-sm text-gray-500">{title}</div>
            <IconButton size="small" className="!bg-gray-100 !w-7 !h-7 !rounded-full">
                <ArrowOutwardIcon fontSize="inherit" />
            </IconButton>
        </div>
        <div className="mt-3">
            <div className="font-extrabold text-black text-2xl">{value}</div>
            <div className="mt-1 text-xs flex items-center gap-2">
        <span
            className={`px-2 py-0.5 rounded-full ${
                positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
        >
          {positive ? "↑" : "↓"} {diff}%
        </span>
                <span className="text-gray-400">This month vs last</span>
            </div>
        </div>
    </div>
);

const dataRevenue = [
    { name: "1 AUG", value: 22000 },
    { name: "2 AUG", value: 9000 },
    { name: "3 AUG", value: 14867 },
    { name: "4 AUG", value: 13000 },
    { name: "5 AUG", value: 16500 },
    { name: "6 AUG", value: 21000 },
    { name: "7 AUG", value: 25000 },
    { name: "8 AUG", value: 19000 },
];

const topFilms = [
    {
        title: "Oppenheimer",
        revenue: "$45,000",
        percentage: 35,
        poster: "https://preview.redd.it/john-wick-ch-4-poster-v0-gn8tocf45sra1.jpg?auto=webp&s=f5d7b38283e4464371ae4abce81c0226200107e2",
    },
    {
        title: "Barbie",
        revenue: "$38,500",
        percentage: 30,
        poster: "https://preview.redd.it/john-wick-ch-4-poster-v0-gn8tocf45sra1.jpg?auto=webp&s=f5d7b38283e4464371ae4abce81c0226200107e2",
    },
    {
        title: "Mission Impossible",
        revenue: "$25,000",
        percentage: 20,
        poster: "https://preview.redd.it/john-wick-ch-4-poster-v0-gn8tocf45sra1.jpg?auto=webp&s=f5d7b38283e4464371ae4abce81c0226200107e2",
    },
];



const DashboardPage = () => {
    const [month, setMonth] = useState("this-month");
    return (
        // Dashboard.jsx
        <div className="bg-transparent min-h-screen">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                {/* Text bên trái */}
                <div>
                    <h2 className="text-2xl font-extrabold text-black">
                        Hello, Barbara! 👋
                    </h2>
                    <p className="text-sm text-gray-500">
                        This is what's happening in your store this month.
                    </p>
                </div>

                {/* Bộ lọc tháng bên phải */}
                <div className="flex items-center gap-3">
                    <Select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        size="small"
                        className="!bg-white !rounded-xl !text-sm"
                    >
                        <MenuItem value="this-month">This month</MenuItem>
                        <MenuItem value="last-month">Last month</MenuItem>
                        <MenuItem value="this-year">This year</MenuItem>
                    </Select>
                    <IconButton className="!bg-white !rounded-xl shadow">
                        <CalendarTodayIcon fontSize="small" />
                    </IconButton>
                </div>
            </div>

            {/* Hàng trên */}
            <div className="grid grid-cols-12 gap-4">
                {/* 4 KPI cards */}
                <div className="col-span-12 md:col-span-4 grid grid-cols-2 grid-rows-2 gap-3">
                    <KPICard title="Total revenue" value="$ 99.560" diff="2.67" positive className="rounded-tl-2xl" />
                    <KPICard title="Total orders" value="35" diff="2.67" positive={false} className="rounded-tr-2xl" />
                    <KPICard title="Total visitors" value="45.600" diff="2.67" positive={false} className="rounded-bl-2xl" />
                    <KPICard title="Net profit" value="$ 60.450" diff="5.67" positive className="rounded-br-2xl" />
                </div>

                {/* Revenue Chart */}
                <div className="col-span-12 md:col-span-8 bg-white rounded-2xl shadow p-4">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-black text-sm">Revenue</h3>
                        <IconButton className="!bg-gray-100 !w-6 !h-6 !rounded-full">
                            <ArrowOutwardIcon fontSize="inherit" />
                        </IconButton>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">This month vs last</div>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataRevenue}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#5b61ff" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Hàng dưới */}
            <div className="grid grid-cols-12 gap-4 mt-4">
                {/* Pie Chart */}
                <div className="col-span-12 md:col-span-8 bg-white rounded-2xl shadow p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-extrabold text-black text-2xl">Top Films by Revenue</h3>
                        <IconButton className="!bg-gray-100 !w-7 !h-7 !rounded-full">
                            <ArrowOutwardIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <div className="space-y-4 flex justify-between  gap-4">
                        {topFilms.map((film, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={film.poster}
                                        alt={film.title}
                                        className="w-26 h-32 rounded-md object-cover shadow"
                                    />
                                    <div className="flex flex-col items-start gap-4">
                                        <div className="font-medium text-black line-clamp-1">{film.title}</div>
                                        <div className="text-sm text-gray-500">{film.revenue}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Orders + Customers */}
                <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-tl-2xl rounded-bl-2xl shadow p-4">
                        <div className="text-2xl font-extrabold text-black">98</div>
                        <div className="text-base text-black">orders</div>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="text-red-500">12 orders</span> awaiting confirmation.
                        </p>
                    </div>
                    <div className="bg-white rounded-tr-2xl rounded-br-2xl shadow p-4">
                        <div className="text-2xl font-extrabold text-black">17</div>
                        <div className="text-base text-black">customers</div>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="text-red-500">17 customers</span> waiting for response.
                        </p>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default DashboardPage;
