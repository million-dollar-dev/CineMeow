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
import EventSeatIcon from "@mui/icons-material/EventSeat";
import WeekendIcon from "@mui/icons-material/Weekend";
import StarIcon from "@mui/icons-material/Star";
import BlockIcon from "@mui/icons-material/Block";
import BuildIcon from "@mui/icons-material/Build";
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

export default function SeatToolPanel(
    {
        rows,
        cols,
        setRows,
        setCols,
        setSeats,
        setSeatType,
        seatType,
        handleSaveClick,
    })
{

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
                    <SaveOutlinedIcon
                        onClick={handleSaveClick}
                    />
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
                        setSeats((prevSeats) => {
                            const newSeats = [];

                            for (let r = 0; r < rows; r++) {
                                const row = [];

                                for (let c = 0; c < cols; c++) {
                                    // Nếu ghế cũ còn tồn tại
                                    if (prevSeats[r]?.[c]) {
                                        row.push(prevSeats[r][c]);
                                    } else {
                                        row.push({ seatId: null, type: "NORMAL" });
                                    }
                                }

                                newSeats.push(row);
                            }

                            return newSeats;
                        })
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
                    onClick={() => setSeatType("NORMAL")}
                >
                    <EventSeatIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Ghế couple" placement="right">
                <IconButton
                    color={seatType === "couple" ? "primary" : "default"}
                    onClick={() => setSeatType("COUPLE")}
                >
                    <WeekendIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Chỗ trống" placement="right">
                <IconButton
                    color={seatType === "empty" ? "primary" : "default"}
                    onClick={() => setSeatType("EMPTY")}
                >
                    <BlockIcon />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}
