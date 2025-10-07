import React, {useEffect, useState} from "react";
import {Button, Typography, Box, Divider, CircularProgress} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Legend from "../SeatMapTab/Legend.jsx";
import SeatToolPanel from "../SeatMapTab/SeatToolPanel.jsx";
import SeatGrid from "../SeatMapTab/SeatGrid.jsx";
import SeatStats from "../SeatMapTab/SeatStats.jsx";
import {useGetSeatMapQuery, useUpdateSeatMapMutation} from "../../services/cinemaService.js";
import {useDispatch} from "react-redux";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";


export default function SeatMapTab({roomId}) {
    const [showEditor, setShowEditor] = useState(false);
    const [rows, setRows] = useState(6);
    const [cols, setCols] = useState(8);
    const [seatType, setSeatType] = useState("NORMAL");

    const dispatch = useDispatch();

    const {data: seatResponse = [], error, isError, isLoading} = useGetSeatMapQuery(roomId);
    const [
        updateSeatMap,
        {isLoading: isUpdating, isError: isUpdateError, error: updateError},
    ] = useUpdateSeatMapMutation();

    console.log('ress', seatResponse);

    const [seats, setSeats] = useState(
        Array.from({ length: 6 }, () =>
            Array.from({ length: 8 }, () => ({
                seatId: null,
                type: "NORMAL",
                status: "ACTIVE",
            }))
        )
    );

    const buildSeatMapRequest = (seatMatrix) => {
        const rows = seatMatrix.length;
        const columns = seatMatrix[0]?.length || 0;

        const seats = [];

        seatMatrix.forEach((row, rowIndex) => {
            row.forEach((seat, colIndex) => {
                if (seat) {
                    seats.push({
                        seatId: seat.seatId ?? null,
                        rowIndex,
                        colIndex,
                        type: seat.type ?? "NORMAL",
                        status: seat.status ?? "ACTIVE",
                    });
                }
            });
        });

        return {
            rows,
            columns,
            seats,
        };
    };

    useEffect(() => {
        if (seatResponse?.data?.seats) {
            const seatList = seatResponse.data.seats;

            const maxRow = Math.max(...seatList.map((s) => s.rowIndex)) + 1;
            const maxCol = Math.max(...seatList.map((s) => s.colIndex)) + 1;

            const newSeats = Array.from({ length: maxRow }, (_, r) =>
                Array.from({ length: maxCol }, (_, c) => {
                    const seat = seatList.find(
                        (s) => s.rowIndex === r && s.colIndex === c
                    );

                    if (seat) {
                        return {
                            seatId: seat.id,
                            type: seat.type ?? "NORMAL",
                            status: seat.status ?? "ACTIVE",
                            label: seat.label ?? null,
                        };
                    }

                    return { seatId: null, type: "EMPTY", status: "ACTIVE", label: seat.label ?? null, };
                })
            );

            setSeats(newSeats);
            setRows(maxRow);
            setCols(maxCol);
        }
    }, [seatResponse]);

    const handleSeatClick = (r, c) => {
        if (!showEditor) return;

        const newSeats = seats.map((row, i) =>
            row.map((seat, j) =>
                i === r && j === c
                    ? {
                        ...seat,
                        type: seatType ?? seat.type ?? "NORMAL",
                        status: "ACTIVE",
                    }
                    : seat
            )
        );

        setSeats(newSeats);
    };

    const handleSaveClick = async () => {
        try {
            const payload = buildSeatMapRequest(seats);
            await updateSeatMap({ id: roomId, ...payload }).unwrap();
            dispatch(openSnackbar({ message: "Cập nhật thành công!", type: "success" }));
        } catch (err) {
            console.error("Update seat map failed", err);
            dispatch(openSnackbar({ message: "Lỗi cập nhật sơ đồ ghế", type: "error" }));
        }
    };


    const countSeats = (type) => seats.flat().filter((s) => s.type === type).length;

    if (isLoading) {
        return (
            <Box className="flex justify-center items-center h-full">
                <CircularProgress />
            </Box>
        );
    }

    console.log('seats', seats)

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
                            handleSaveClick={handleSaveClick}
                        />
                    )}
                    <SeatGrid seats={seats} handleSeatClick={handleSeatClick} />
                    {isUpdating && (
                        <Box className="absolute inset-0 flex justify-center items-center bg-white/50">
                            <CircularProgress />
                        </Box>
                    )}
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
