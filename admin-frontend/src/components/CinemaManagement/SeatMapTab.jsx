import React, {useEffect, useState} from "react";
import { Button, Typography, Box, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Legend from "../SeatMapTab/Legend.jsx";
import SeatToolPanel from "../SeatMapTab/SeatToolPanel.jsx";
import SeatGrid from "../SeatMapTab/SeatGrid.jsx";
import SeatStats from "../SeatMapTab/SeatStats.jsx";
import {useGetSeatMapQuery} from "../../services/cinemaService.js";


export default function SeatMapTab({roomId}) {
    const [showEditor, setShowEditor] = useState(false);
    const [rows, setRows] = useState(6);
    const [cols, setCols] = useState(8);
    const [seatType, setSeatType] = useState("normal");

    const {data: seatResponse = [], error, isError, isLoading} = useGetSeatMapQuery(roomId);

    const [seats, setSeats] = useState(
        Array.from({ length: 6 }, () =>
            Array.from({ length: 8 }, () => ({
                seatId: null,
                type: "NORMAL",
                status: "ACTIVE",
            }))
        )
    );

    useEffect(() => {
        if (seatResponse?.data?.seats) {
            const seatList = seatResponse.data.seats;

            const maxRow = Math.max(...seatList.map(s => s.rowIndex)) + 1;
            const maxCol = Math.max(...seatList.map(s => s.colIndex)) + 1;

            // Tạo ma trận seats dạng object { seatId, type }
            const newSeats = Array.from({ length: maxRow }, (_, r) =>
                Array.from({ length: maxCol }, (_, c) => {
                    const seat = seatList.find(s => s.rowIndex === r && s.colIndex === c);
                    return seat
                        ? { seatId: seat.id, type: seat.type, status: seat.status }
                        : { seatId: null, type: "EMPTY", status: "ACTIVE" };
                })
            );

            setSeats(newSeats);
            setRows(maxRow);
            setCols(maxCol);

            console.log('seat List', seats)
        }
    }, [seatResponse]);


    const handleSeatClick = (r, c) => {
        if (!showEditor) return;
        const newSeats = seats.map((row, i) =>
            row.map((seat, j) => (i === r && j === c ? seatType : seat))
        );
        setSeats(newSeats);
    };

    const handleSaveSeatMap = () => {
        console.log('request: ', seats)
    }

    const countSeats = (type) => seats.flat().filter((s) => s === type).length;

    return (
        <div className="grid grid-cols-3 gap-6 p-6 bg-gray-100 min-h-[80vh]">
            {/* LEFT */}
            <div className="col-span-2 flex flex-col">
                <Legend />
                <Box className="flex flex-1">
                    {showEditor && (
                        <SeatToolPanel
                            rows={rows}
                            cols={cols}
                            setRows={setRows}
                            setCols={setCols}
                            setSeats={setSeats}
                            setSeatType={setSeatType}
                            seatType={seatType}
                            handleSaveClick={handleSaveSeatMap()}
                        />
                    )}
                    <SeatGrid seats={seats} handleSeatClick={handleSeatClick} />
                </Box>
            </div>

            {/* RIGHT */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                        Thông tin ghế
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setShowEditor((prev) => !prev)}
                        sx={{
                            bgcolor: "black",
                            "&:hover": { bgcolor: "gray.800" },
                        }}
                    >
                        {showEditor ? "Ẩn công cụ" : "Chỉnh sửa"}
                    </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
                <SeatStats seats={seats} countSeats={countSeats} />
            </div>
        </div>
    );
}
