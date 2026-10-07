import React from "react";
import { Card, Box, Typography, Skeleton } from "@mui/material";

// Gradient mapping helper for aesthetic presets
const getGradient = (bgColor) => {
    switch (bgColor) {
        case "#1976d2":
        case "primary.main":
        case "blue":
            return "linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #818CF8 100%)"; // Indigo / Violet
        case "#2e7d32":
        case "success.main":
        case "green":
            return "linear-gradient(135deg, #047857 0%, #10B981 50%, #34D399 100%)"; // Emerald
        case "#f57c00":
        case "warning.main":
        case "orange":
            return "linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)"; // Amber
        case "black":
        case "#000000":
        case "#111827":
            return "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)"; // Slate
        case "#e11d48":
        case "rose":
            return "linear-gradient(135deg, #BE123C 0%, #F43F5E 50%, #FB7185 100%)"; // Rose
        case "#0284c7":
        case "sky":
            return "linear-gradient(135deg, #0369A1 0%, #0EA5E9 50%, #38BDF8 100%)"; // Sky
        default:
            return bgColor?.startsWith("linear-gradient")
                ? bgColor
                : `linear-gradient(135deg, ${bgColor} 0%, ${bgColor} 100%)`;
    }
};

const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    bgColor = "#1976d2",
    iconColor = "white",
    bigIcon,
    loading = false,
    gradient,
    onClick,
}) => {
    const cardGradient = gradient || getGradient(bgColor);

    return (
        <Card
            onClick={onClick}
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "20px",
                p: { xs: 2, sm: 2.25 },
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: cardGradient,
                color: "white",
                minHeight: { xs: 104, sm: 110 },
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: onClick ? "pointer" : "default",
                userSelect: "none",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 18px 30px -8px rgba(15, 23, 42, 0.18)",
                    "& .stat-big-icon": {
                        transform: "rotate(0deg) scale(1.08)",
                        opacity: 0.22,
                    },
                },
                // Ambient Radial Light
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)",
                    pointerEvents: "none",
                },
            }}
        >
            {/* 1. Frosted Glass Front Icon Container */}
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.35)",
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    zIndex: 2,
                }}
            >
                {icon &&
                    React.cloneElement(icon, {
                        style: {
                            color: "#FFFFFF",
                            fontSize: 24,
                        },
                    })}
            </Box>

            {/* 2. Text Content */}
            <Box sx={{ zIndex: 2, minWidth: 0, flex: 1 }}>
                {loading ? (
                    <>
                        <Skeleton
                            width={90}
                            height={18}
                            sx={{ bgcolor: "rgba(255,255,255,0.3)", borderRadius: "6px" }}
                        />
                        <Skeleton
                            width={65}
                            height={38}
                            sx={{ mt: 0.5, bgcolor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}
                        />
                    </>
                ) : (
                    <>
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                fontWeight: 700,
                                fontSize: "11px",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "rgba(255, 255, 255, 0.85)",
                                lineHeight: 1.2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                fontSize:
                                    typeof value === "string" && value.length > 5
                                        ? { xs: "20px", sm: "22px" }
                                        : { xs: "24px", sm: "28px" },
                                letterSpacing: "-0.02em",
                                lineHeight: 1.15,
                                mt: 0.25,
                                color: "#FFFFFF",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {value}
                        </Typography>

                        {subtitle && (
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: "rgba(255, 255, 255, 0.75)",
                                    mt: 0.5,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </>
                )}
            </Box>

            {/* 3. Artistic Background Watermark Icon */}
            {bigIcon && (
                <Box
                    className="stat-big-icon"
                    sx={{
                        position: "absolute",
                        right: -10,
                        bottom: -22,
                        fontSize: 110,
                        opacity: 0.14,
                        color: "#FFFFFF",
                        transform: "rotate(-10deg)",
                        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                        pointerEvents: "none",
                        lineHeight: 1,
                        zIndex: 1,
                    }}
                >
                    {bigIcon}
                </Box>
            )}
        </Card>
    );
};

export default StatCard;
