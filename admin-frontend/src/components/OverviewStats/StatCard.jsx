import { Card, Typography, Box } from "@mui/material";
import React from "react";

const StatCard = ({ icon, title, value, color = "primary.main", bigIcon }) => {
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
                bgcolor: color,
                color: "white",
                minHeight: 120,
                minWidth: 280,
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
                {React.cloneElement(icon, { style: { color: color, fontSize: 28 } })}
            </Box>


            {/* Text */}
            <Box sx={{ zIndex: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                    {value}
                </Typography>
            </Box>

            {/* Icon to góc phải */}
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
        </Card>
    );
};

export default StatCard;
