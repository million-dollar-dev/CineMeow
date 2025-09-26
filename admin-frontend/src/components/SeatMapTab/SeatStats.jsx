import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import WeekendIcon from "@mui/icons-material/Weekend";
import StarIcon from "@mui/icons-material/Star";
import BuildIcon from "@mui/icons-material/Build";
import ChairIcon from "@mui/icons-material/Chair";

export default function SeatStats({ seats, countSeats }) {
    const totalSeats = seats.flat().filter((s) => s.type !== "EMPTY").length;
    const normal = countSeats("NORMAL");
    const couple = countSeats("COUPLE");
    const maintenance = countSeats("maintenance");

    const stats = [
        {
            label: "Ghế thường",
            value: normal,
            color: "#9ca3af",
            icon: <EventSeatIcon />,
        },
        {
            label: "Ghế couple",
            value: couple,
            color: "#ec4899",
            icon: <WeekendIcon />,
        },
        {
            label: "Bảo trì",
            value: maintenance,
            color: "#ef4444",
            icon: <BuildIcon />,
        },
    ];

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                mt: 2,
                border: "1px solid #e5e7eb",
                bgcolor: "#fff",
            }}
        >
            <CardContent>
                {/* Header + Tổng ghế */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Thống kê ghế</Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        px={2}
                        py={1}
                        borderRadius={2}
                        sx={{ bgcolor: "#f9fafb" }}
                    >
                        <ChairIcon sx={{ fontSize: 24, color: "black" }} />
                        <Box>
                            <Typography variant="caption">Tổng ghế</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {totalSeats}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Theo loại ghế */}
                <Box display="flex" flexDirection="column" gap={1.5}>
                    {stats.map((s, idx) => (
                        <Box
                            key={idx}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: "#f9fafb",
                            }}
                        >
                            {/* Icon + Label */}
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: s.color,
                                        borderRadius: "50%",
                                        color: "#fff",
                                    }}
                                >
                                    {s.icon}
                                </Box>
                                <Typography variant="body2">{s.label}</Typography>
                            </Box>

                            {/* Giá trị */}
                            <Typography variant="subtitle1" fontWeight="bold">
                                {s.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}
