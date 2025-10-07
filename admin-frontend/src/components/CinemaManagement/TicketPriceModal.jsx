import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { useState } from "react";

const ROOM_TYPES = ["2D", "3D", "IMAX", "4DX"];
const SEAT_TYPES = ["NORMAL", "COUPLE"];

export default function TicketPriceModal({ open, onClose, brand }) {
    const [prices, setPrices] = useState(() =>
        ROOM_TYPES.map((room) => ({
            roomType: room,
            seats: SEAT_TYPES.map((seat) => ({
                seatType: seat,
                price: "",
            })),
        }))
    );

    const handlePriceChange = (roomIndex, seatIndex, value) => {
        const updated = [...prices];
        updated[roomIndex].seats[seatIndex].price = value;
        setPrices(updated);
    };

    const handleSave = () => {
        console.log("Saving prices:", prices);
        onClose();
    };

    console.log(brand)

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle className="text-lg font-semibold text-gray-800">
                Tùy chỉnh giá vé {brand?.name}
            </DialogTitle>

            <DialogContent className="!px-8 !py-4 bg-white">
                <div className="overflow-x-auto rounded-xl border border-gray-300">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-black">
                        <tr>
                            <th className="p-3 text-left font-semibold text-white border-b border-gray-200 w-[20%] uppercase whitespace-nowrap">
                                Loại phòng
                            </th>
                            {SEAT_TYPES.map((seat) => (
                                <th
                                    key={seat}
                                    className="p-3 text-center font-semibold text-white border-b border-gray-200 w-[40%]"
                                >
                                    {seat} Seat
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {prices.map((room, rIdx) => (
                            <tr
                                key={room.roomType}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-3 font-medium text-gray-800 border-b border-gray-100 text-left">
                                    {room.roomType}
                                </td>
                                {room.seats.map((seat, sIdx) => (
                                    <td
                                        key={seat.seatType}
                                        className="p-4 text-center border-b border-gray-100"
                                    >
                                        <div className="flex justify-center items-center gap-2">
                                            <TextField
                                                type="number"
                                                value={seat.price}
                                                onChange={(e) =>
                                                    handlePriceChange(rIdx, sIdx, e.target.value)
                                                }
                                                placeholder="Enter price"
                                                size="small"
                                                InputProps={{
                                                    sx: {
                                                        "& input": {
                                                            textAlign: "center",
                                                            fontWeight: 500,
                                                            color: "#333",
                                                            backgroundColor: "#fafafa",
                                                            borderRadius: "6px",
                                                        },
                                                    },
                                                }}
                                                className="!w-[8.5rem]"
                                            />
                                            <span className="text-gray-500 text-xs">₫</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>

            <DialogActions className="bg-gray-50 px-6 py-4">
                <Button onClick={onClose} variant="outlined" color="error">
                    Đóng
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
    );
}
