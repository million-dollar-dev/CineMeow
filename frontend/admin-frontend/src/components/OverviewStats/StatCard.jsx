import React from "react";
import { Card, Box, Typography, Skeleton } from "@mui/material";

const StatCard = ({
                      icon,
                      title,
                      value,
                      bgColor = "primary.main",
                      iconColor = "primary.main",
                      bigIcon,
                      loading = false
}) => {
    return (
        <Card
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: bgColor,
                color: "white",
                minHeight: 120,
                minWidth: 280,
                flex: 1,
            }}
        >
            {/* Logo nhỏ phía trước */}
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {icon &&
                    React.cloneElement(icon, {
                        style: { color: iconColor, fontSize: 28 },
                    })}
            </Box>

            {/* Text */}
            <Box sx={{ zIndex: 1 }}>
                {loading ? (
                    <>
                        <Skeleton width={80} height={20} sx={{ bgcolor: "rgba(255,255,255,0.4)" }} />
                        <Skeleton width={60} height={36} sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.6)" }} />
                    </>
                ) : (
                    <>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                            {value}
                        </Typography>
                    </>
                )}
            </Box>

            {/* Icon to góc phải */}
            {bigIcon && (
                <Box
                    sx={{
                        position: "absolute",
                        right: -15,
                        bottom: -35,
                        fontSize: 100,
                        opacity: 0.25,
                        color: "white",
                    }}
                >
                    {bigIcon}
                </Box>
            )}
        </Card>
    );
};

export default StatCard;
