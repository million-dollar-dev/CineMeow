import React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton,
    Tooltip,
    Paper,
} from "@mui/material";
import StraightenIcon from "@mui/icons-material/Straighten";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import WeekendIcon from "@mui/icons-material/Weekend";
import StarIcon from "@mui/icons-material/Star";
import BlockIcon from "@mui/icons-material/Block";
import BuildIcon from "@mui/icons-material/Build";
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

export default function SeatToolPanel({
                                          rows,
                                          cols,
                                          setRows,
                                          setCols,
                                          setSeats,
                                          setSeatType,
                                          seatType,
                                      }) {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                mr: 2,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                width: 80,
            }}
        >
            <Tooltip title="Lưu" placement="right">
                <IconButton>
                    <SaveOutlinedIcon />
                </IconButton>
            </Tooltip>

            <Divider flexItem />
            {/* Kích thước */}
            <Box textAlign="center">
                <TextField
                    type="number"
                    size="small"
                    label="H"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    sx={{ width: "100%", mt: 1 }}
                />
                <TextField
                    type="number"
                    size="small"
                    label="C"
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value))}
                    sx={{ width: "100%", mt: 1 }}
                />
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                        setSeats(
                            Array.from({ length: rows }, () =>
                                Array.from({ length: cols }, () => "normal")
                            )
                        )
                    }
                    sx={{ mt: 1 }}
                >
                    <DoneOutlinedIcon />
                </Button>
            </Box>

            <Divider flexItem />

            {/* Loại ghế */}
            <Tooltip title="Ghế thường" placement="right">
                <IconButton
                    color={seatType === "normal" ? "primary" : "default"}
                    onClick={() => setSeatType("normal")}
                >
                    <EventSeatIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Ghế couple" placement="right">
                <IconButton
                    color={seatType === "couple" ? "primary" : "default"}
                    onClick={() => setSeatType("couple")}
                >
                    <WeekendIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Ghế VIP" placement="right">
                <IconButton
                    color={seatType === "vip" ? "primary" : "default"}
                    onClick={() => setSeatType("vip")}
                >
                    <StarIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Chỗ trống" placement="right">
                <IconButton
                    color={seatType === "empty" ? "primary" : "default"}
                    onClick={() => setSeatType("empty")}
                >
                    <BlockIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Ghế bảo trì" placement="right">
                <IconButton
                    color={seatType === "maintenance" ? "primary" : "default"}
                    onClick={() => setSeatType("maintenance")}
                >
                    <BuildIcon />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}
