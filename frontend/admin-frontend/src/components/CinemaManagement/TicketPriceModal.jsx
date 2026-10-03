import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField, CircularProgress,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useGetAllPriceByBrandQuery, useUpdatePricingMutation} from "../../services/bookingService.js";
import {useDispatch} from "react-redux";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";

const ROOM_TYPES = ["_2D", "_3D", "_IMAX", "_4DX"];
const SEAT_TYPES = ["NORMAL", "COUPLE"];

export default function TicketPriceModal({ open, onClose, brand }) {
    const [prices, setPrices] = useState([]);
    const dispatch = useDispatch();
    const {
        data: pricingList,
        isLoading: isGetLoading,
        isError: isLoadingError,
        error: loadingError
    } = useGetAllPriceByBrandQuery(brand?.id, { skip: !brand?.id });

    useEffect(() => {
        if (!pricingList?.length) return;

        const grouped = ROOM_TYPES.map((roomType) => ({
            roomType,
            seats: SEAT_TYPES.map((seatType) => {
                const found = pricingList.find(
                    (p) => p.roomType === roomType && p.seatType === seatType
                );
                return {
                    id: found?.id || null,
                    seatType,
                    price: found?.price || 0,
                    brandId: brand?.id,
                    roomType,
                };
            }),
        }));

        setPrices(grouped);
    }, [pricingList]);

    const handlePriceChange = (roomIdx, seatIdx, value) => {
        const updated = [...prices];
        updated[roomIdx].seats[seatIdx].price = Number(value);
        setPrices(updated);
    };

    const [updatePrice, { isLoading: isUpdating }] = useUpdatePricingMutation();

    const handleSave = async () => {
        const flattened = prices.flatMap((room) =>
            room.seats.map((seat) => ({
                id: seat.id,
                brandId: brand?.id,
                seatType: seat.seatType,
                roomType: seat.roomType,
                price: seat.price,
            }))
        );

        const changedPrices = flattened.filter((newItem) => {
            const oldItem = pricingList.find((old) => old.id === newItem.id);
            return oldItem && oldItem.price !== newItem.price;
        });

        if (changedPrices.length === 0) {
            dispatch(openSnackbar({ message: "Không có thay đổi nào để lưu.", type: "info" }));
            return;
        }

        try {
            for (const price of changedPrices) {
                await updatePrice({ id: price.id, ...price }).unwrap();
            }

            dispatch(openSnackbar({ message: "Cập nhật giá vé thành công!", type: "success" }));
            onClose?.();

        } catch (error) {
            dispatch(openSnackbar({ message: "Cập nhật thất bại. Vui lòng thử lại!", type: "error" }));
        }

    };

    useEffect(() => {
        if (isLoadingError && loadingError) {
            dispatch(
                openSnackbar({
                    message: loadingError?.data?.message || "Không thể tải dữ liệu giá vé!",
                    type: "error",
                })
            );
        }


    }, [isLoadingError, loadingError, dispatch]);
    console.log(pricingList)
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle className="text-lg font-semibold text-gray-800">
                Tùy chỉnh giá vé {brand?.name}
            </DialogTitle>

            <DialogContent className="!px-8 !py-4 bg-white">
                {isGetLoading ? (
                    <div className="flex flex-col items-center gap-3 text-gray-600">
                        <CircularProgress color="primary" />
                        <span className="text-sm">Đang tải dữ liệu giá vé...</span>
                    </div>
                ) :
                    (<div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-black text-white">
                        <tr>
                            <th className="p-3 text-left font-semibold border-b border-gray-200 w-[25%] uppercase">
                                Loại phòng
                            </th>
                            {SEAT_TYPES.map((seat) => (
                                <th
                                    key={seat}
                                    className="p-3 text-center font-semibold border-b border-gray-200 w-[37.5%]"
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
                                                type="text"
                                                value={seat.price.toLocaleString("vi-VN")} // ✅ Hiển thị có dấu phẩy
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/[^\d]/g, ""); // chỉ lấy số
                                                    handlePriceChange(rIdx, sIdx, rawValue ? parseInt(rawValue) : 0);
                                                }}
                                                placeholder="Nhập giá"
                                                size="small"
                                                InputProps={{
                                                    sx: {
                                                        "& input": {
                                                            textAlign: "center",
                                                            fontWeight: 500,
                                                            color: "#333",
                                                            backgroundColor: "#fafafa",
                                                            borderRadius: "8px",
                                                        },
                                                    },
                                                }}
                                                className="!w-[9rem]"
                                            />
                                            <span className="text-gray-500 text-xs">₫</span>
                                        </div>

                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>)}
            </DialogContent>

            <DialogActions className="bg-gray-50 px-6 py-4">
                <Button onClick={onClose} variant="outlined" color="error">
                    Đóng
                </Button>
                <Button onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={isUpdating}
                        startIcon={isUpdating && <CircularProgress size={20} color="inherit" />}
                >
                    {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
