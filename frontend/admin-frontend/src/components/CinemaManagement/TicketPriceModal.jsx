import React, { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    TextField,
    CircularProgress,
    InputAdornment,
    Tooltip,
} from "@mui/material";
import { useDispatch } from "react-redux";

// Material Icons
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";

// Services, Redux & Mock
import {
    useGetAllPriceByBrandQuery,
    useUpdatePricingMutation,
    useCreatePricingMutation,
} from "../../services/bookingService.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";
import {
    ROOM_TYPES,
    SEAT_TYPES,
    ROOM_FORMAT_CONFIG,
    SEAT_TYPE_CONFIG,
    DEFAULT_BRAND_PRICING,
    PRICING_PRESETS,
    formatPricingMatrix,
} from "../../mock/mockPricing.js";

export default function TicketPriceModal({ open, onClose, brand }) {
    const dispatch = useDispatch();

    // Data query for this brand's price records
    const {
        data: pricingList,
        isLoading: isGetLoading,
        isError: isLoadingError,
        error: loadingError,
        refetch,
    } = useGetAllPriceByBrandQuery(brand?.id, { skip: !brand?.id });

    // Mutations
    const [updatePrice, { isLoading: isUpdating }] = useUpdatePricingMutation();
    const [createPrice, { isLoading: isCreating }] = useCreatePricingMutation();

    // Local state for the editable matrix
    const [matrix, setMatrix] = useState([]);
    // Selected format tab in the Live Preview panel
    const [previewFormat, setPreviewFormat] = useState("_2D");

    // Initialize or reset matrix when pricingList or brand changes
    useEffect(() => {
        if (!open) return;
        const initialMatrix = formatPricingMatrix(pricingList || [], brand?.id);
        setMatrix(initialMatrix);
        setPreviewFormat("_2D");
    }, [pricingList, brand, open]);

    // Error handling for query
    useEffect(() => {
        if (isLoadingError && loadingError) {
            dispatch(
                openSnackbar({
                    message: loadingError?.data?.message || "Không thể tải dữ liệu bảng giá vé từ máy chủ.",
                    type: "error",
                })
            );
        }
    }, [isLoadingError, loadingError, dispatch]);

    // Handle single price cell change
    const handlePriceChange = (roomType, seatType, newValue) => {
        const parsed = Math.max(0, parseInt(String(newValue).replace(/\D/g, "") || "0", 10));
        setMatrix((prev) =>
            prev.map((r) => {
                if (r.roomType !== roomType) return r;
                return {
                    ...r,
                    seats: r.seats.map((s) => {
                        if (s.seatType !== seatType) return s;
                        return { ...s, price: parsed };
                    }),
                };
            })
        );
    };

    // Quick adjustment (+10% / -10%)
    const handleBatchPercentageChange = (multiplier) => {
        setMatrix((prev) =>
            prev.map((r) => ({
                ...r,
                seats: r.seats.map((s) => ({
                    ...s,
                    // Round to nearest 5,000 VND
                    price: Math.max(10000, Math.round((s.price * multiplier) / 5000) * 5000),
                })),
            }))
        );
        dispatch(
            openSnackbar({
                message: multiplier > 1 ? "Đã tăng toàn bộ biểu giá +10%" : "Đã giảm toàn bộ biểu giá -10%",
                type: "info",
            })
        );
    };

    // Apply Preset template
    const handleApplyPreset = (preset) => {
        setMatrix((prev) =>
            prev.map((r) => {
                const presetRoom = preset.values[r.roomType];
                if (!presetRoom) return r;
                return {
                    ...r,
                    seats: r.seats.map((s) => ({
                        ...s,
                        price: presetRoom[s.seatType] !== undefined ? presetRoom[s.seatType] : s.price,
                    })),
                };
            })
        );
        dispatch(
            openSnackbar({
                message: `Đã áp dụng mẫu giá: ${preset.name}`,
                type: "success",
            })
        );
    };

    // Reset to default
    const handleResetDefaults = () => {
        setMatrix(formatPricingMatrix([], brand?.id));
        dispatch(
            openSnackbar({
                message: "Đã thiết lập lại biểu giá theo định mức tiêu chuẩn",
                type: "info",
            })
        );
    };

    // Save Matrix
    const handleSave = async () => {
        const flattened = matrix.flatMap((room) =>
            room.seats.map((seat) => ({
                id: seat.id,
                brandId: brand?.id,
                roomType: seat.roomType,
                seatType: seat.seatType,
                price: Number(seat.price),
            }))
        );

        // Filter changed items
        const rawList = pricingList || [];
        const toUpdate = flattened.filter((newItem) => {
            if (!newItem.id) return false;
            const old = rawList.find((o) => o.id === newItem.id);
            return old && Number(old.price) !== newItem.price;
        });

        const toCreate = flattened.filter((newItem) => !newItem.id);

        if (toUpdate.length === 0 && toCreate.length === 0) {
            dispatch(openSnackbar({ message: "Không có thay đổi nào để lưu.", type: "info" }));
            onClose?.();
            return;
        }

        try {
            // Update existing
            for (const item of toUpdate) {
                await updatePrice({ id: item.id, ...item }).unwrap();
            }
            // Create new if missing
            for (const item of toCreate) {
                await createPrice(item).unwrap();
            }

            dispatch(openSnackbar({ message: `Đã cập nhật biểu giá vé cho ${brand?.name} thành công!`, type: "success" }));
            refetch?.();
            onClose?.();
        } catch (error) {
            dispatch(
                openSnackbar({
                    message: error?.data?.message || "Cập nhật biểu giá thất bại. Vui lòng thử lại!",
                    type: "error",
                })
            );
        }
    };

    const isSubmitting = isUpdating || isCreating;

    // Active room preview data
    const activePreviewRoom = useMemo(() => {
        return matrix.find((r) => r.roomType === previewFormat) || matrix[0];
    }, [matrix, previewFormat]);

    const previewNormalSeat = activePreviewRoom?.seats.find((s) => s.seatType === "NORMAL");
    const previewCoupleSeat = activePreviewRoom?.seats.find((s) => s.seatType === "COUPLE");

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
                        background: "#ffffff",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        maxHeight: "92vh",
                        display: "flex",
                        flexDirection: "column",
                    },
                },
            }}
        >
            {/* Top Gradient Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 shrink-0" />

            {/* 1. MODAL HEADER */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 bg-violet-50 text-violet-600 border border-violet-100">
                        <PaymentsOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                Thiết Lập Biểu Giá Vé: {brand?.name || "Chuỗi Rạp"}
                            </h2>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider bg-violet-50 text-violet-700 border-violet-200">
                                Ma Trận Định Giá
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Cấu hình mức phí vé theo từng định dạng phòng chiếu (2D, 3D, IMAX, 4DX) và phân hạng ghế khách hàng
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-100/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
                        title="Đóng cửa sổ"
                    >
                        <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>

            {/* 2. MODAL BODY (Grid 12 cols: 7 cols Form Matrix - 5 cols Live Client Ticket Preview) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: Pricing Matrix Table & Presets (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col gap-5">
                        {/* Card 1: Bảng ma trận định giá */}
                        <div className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <TableChartOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                        1. Ma Trận Giá Vé Chi Tiết Toàn Hệ Thống
                                    </h3>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400">
                                    Đơn vị tính: VNĐ (₫)
                                </span>
                            </div>

                            {isGetLoading ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                                    <CircularProgress size={28} className="text-violet-600" />
                                    <span className="text-xs font-bold">Đang tải bảng giá hiện hành...</span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-2xs">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">
                                                <th className="py-3 px-4 w-[36%]">Định Dạng Phòng</th>
                                                <th className="py-3 px-4 w-[32%] text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <ChairOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-500" />
                                                        <span>Ghế Đơn (NORMAL)</span>
                                                    </div>
                                                </th>
                                                <th className="py-3 px-4 w-[32%] text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <WeekendOutlinedIcon sx={{ fontSize: 15 }} className="text-rose-500" />
                                                        <span>Ghế Đôi (COUPLE)</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs">
                                            {matrix.map((row) => {
                                                const config = ROOM_FORMAT_CONFIG[row.roomType] || {};
                                                const normalSeat = row.seats.find((s) => s.seatType === "NORMAL");
                                                const coupleSeat = row.seats.find((s) => s.seatType === "COUPLE");
                                                const normalVal = normalSeat?.price || 0;
                                                const coupleVal = coupleSeat?.price || 0;
                                                const diffRatio = normalVal > 0 ? Math.round(((coupleVal - normalVal) / normalVal) * 100) : 0;

                                                return (
                                                    <tr key={row.roomType} className="hover:bg-slate-50/70 transition-colors">
                                                        {/* Room Format Details */}
                                                        <td className="py-3.5 px-4 align-middle">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2.5 h-2.5 rounded-full ${config.pillColor || "bg-violet-600"}`} />
                                                                <span className="font-extrabold text-slate-900 text-xs">
                                                                    {config.label || row.roomType}
                                                                </span>
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${config.badgeColor}`}>
                                                                    {config.shortLabel}
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                                                                {config.description}
                                                            </p>
                                                        </td>

                                                        {/* Normal Seat Price Input */}
                                                        <td className="py-3.5 px-3 align-middle text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <TextField
                                                                    size="small"
                                                                    value={normalVal.toLocaleString("vi-VN")}
                                                                    onChange={(e) =>
                                                                        handlePriceChange(row.roomType, "NORMAL", e.target.value)
                                                                    }
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <InputAdornment position="end">
                                                                                <span className="text-[11px] font-bold text-slate-400">₫</span>
                                                                            </InputAdornment>
                                                                        ),
                                                                        sx: {
                                                                            borderRadius: "10px",
                                                                            fontSize: "13px",
                                                                            fontWeight: 800,
                                                                            backgroundColor: "#F8FAFC",
                                                                            "& input": { textAlign: "right", pr: 0.5 },
                                                                        },
                                                                    }}
                                                                    sx={{ width: 140 }}
                                                                />
                                                            </div>
                                                        </td>

                                                        {/* Couple Seat Price Input */}
                                                        <td className="py-3.5 px-3 align-middle text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <TextField
                                                                    size="small"
                                                                    value={coupleVal.toLocaleString("vi-VN")}
                                                                    onChange={(e) =>
                                                                        handlePriceChange(row.roomType, "COUPLE", e.target.value)
                                                                    }
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <InputAdornment position="end">
                                                                                <span className="text-[11px] font-bold text-rose-500 font-extrabold">₫</span>
                                                                            </InputAdornment>
                                                                        ),
                                                                        sx: {
                                                                            borderRadius: "10px",
                                                                            fontSize: "13px",
                                                                            fontWeight: 800,
                                                                            backgroundColor: "#FFF1F2",
                                                                            borderColor: "#FECDD3",
                                                                            "& input": { textAlign: "right", pr: 0.5, color: "#BE123C" },
                                                                        },
                                                                    }}
                                                                    sx={{ width: 140 }}
                                                                />
                                                                <span className="text-[10px] font-bold text-slate-400">
                                                                    +{diffRatio}% vs ghế đơn
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Card 2: Mẫu định giá nhanh & công cụ tỷ lệ */}
                        <div className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <AutoFixHighOutlinedIcon sx={{ fontSize: 18 }} className="text-amber-500" />
                                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                        2. Mẫu Biểu Phí Chuẩn & Công Cụ Điều Chỉnh
                                    </h3>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400">
                                    1-Click Setup
                                </span>
                            </div>

                            {/* Presets */}
                            <div>
                                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                                    Mẫu biểu phí gợi ý theo phân khúc rạp:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {PRICING_PRESETS.map((p) => (
                                        <button
                                            key={p.name}
                                            type="button"
                                            onClick={() => handleApplyPreset(p)}
                                            className="p-3 rounded-xl border border-slate-200/90 hover:border-violet-300 hover:bg-violet-50/40 text-left transition group cursor-pointer shadow-2xs"
                                        >
                                            <p className="text-xs font-bold text-slate-800 group-hover:text-violet-700">
                                                {p.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                                                {p.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Batch Tools */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-500">
                                        Tỷ lệ nhanh:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleBatchPercentageChange(1.1)}
                                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-emerald-700 flex items-center gap-1 transition cursor-pointer"
                                    >
                                        <TrendingUpOutlinedIcon sx={{ fontSize: 14 }} />
                                        <span>Tăng +10%</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleBatchPercentageChange(0.9)}
                                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-rose-700 flex items-center gap-1 transition cursor-pointer"
                                    >
                                        <TrendingDownOutlinedIcon sx={{ fontSize: 14 }} />
                                        <span>Giảm -10%</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleResetDefaults}
                                    className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-1 transition cursor-pointer"
                                >
                                    <RestartAltOutlinedIcon sx={{ fontSize: 14 }} />
                                    <span>Đặt lại mặc định</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LIVE CLIENT TICKET & PRICING PREVIEW (Section 3.5 Mirroring) (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-2 space-y-3">
                            {/* Preview Header Bar */}
                            <div className="flex items-center justify-between px-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="font-extrabold uppercase tracking-wider text-slate-800 text-[11px]">
                                        Live Preview: Bảng Giá Vé Khách Hàng
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
                                    client-frontend / BookingSeatSelection
                                </span>
                            </div>

                            {/* EXACT CLIENT-FRONTEND TICKET & PRICING SIMULATOR */}
                            <div className="relative w-full overflow-hidden bg-[#0a0a0d] border border-violet-900/30 rounded-3xl shadow-2xl text-zinc-100 select-none p-5 sm:p-6">
                                {/* Ambient Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

                                {/* Brand Header */}
                                <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
                                    <div className="w-12 h-12 rounded-xl bg-white p-1 border border-white/20 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={brand?.logoUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150"}
                                            alt={brand?.name}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150";
                                            }}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="text-sm font-black text-white truncate">
                                                {brand?.name || "CineMeow Cinema"}
                                            </h4>
                                            <VerifiedIcon sx={{ fontSize: 14 }} className="text-indigo-400 shrink-0" />
                                        </div>
                                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                                            Bảng biểu phí chính thức áp dụng tại các phòng chiếu
                                        </p>
                                    </div>
                                </div>

                                {/* Room Format Switcher Tabs */}
                                <div className="py-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                                        Chọn định dạng xem thử:
                                    </span>
                                    <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-900/90 rounded-2xl border border-zinc-800">
                                        {ROOM_TYPES.map((fmt) => {
                                            const isActive = previewFormat === fmt;
                                            const cfg = ROOM_FORMAT_CONFIG[fmt];
                                            return (
                                                <button
                                                    key={fmt}
                                                    type="button"
                                                    onClick={() => setPreviewFormat(fmt)}
                                                    className={`py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                                                        isActive
                                                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/40"
                                                            : "text-zinc-400 hover:text-white"
                                                    }`}
                                                >
                                                    {cfg.shortLabel}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Active Format Description Banner */}
                                <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${ROOM_FORMAT_CONFIG[previewFormat]?.pillColor || "bg-violet-600"}`} />
                                        <span className="text-xs font-bold text-white">
                                            {ROOM_FORMAT_CONFIG[previewFormat]?.label}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                        {ROOM_FORMAT_CONFIG[previewFormat]?.badge}
                                    </span>
                                </div>

                                {/* Visual Seat Price Cards (Mirroring Booking Seat Selection) */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {/* Normal Seat Card */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 relative group overflow-hidden">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-zinc-800/90 flex items-center justify-center text-zinc-300">
                                                <ChairOutlinedIcon sx={{ fontSize: 18 }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase">
                                                1 Vé
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-bold text-zinc-300 block">
                                            Ghế Đơn
                                        </span>
                                        <span className="text-lg font-black text-white mt-0.5 block tracking-tight">
                                            {(previewNormalSeat?.price || 0).toLocaleString("vi-VN")} ₫
                                        </span>
                                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                                            Ghế nỉ cao cấp tiêu chuẩn
                                        </p>
                                    </div>

                                    {/* Couple Seat Card */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-rose-950/40 via-zinc-900 to-zinc-950 border border-rose-900/30 relative group overflow-hidden">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-rose-950/60 flex items-center justify-center text-rose-300">
                                                <WeekendOutlinedIcon sx={{ fontSize: 18 }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-rose-300 uppercase">
                                                2 Vé
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-bold text-rose-200 block">
                                            Ghế Đôi Sweetbox
                                        </span>
                                        <span className="text-lg font-black text-rose-400 mt-0.5 block tracking-tight">
                                            {(previewCoupleSeat?.price || 0).toLocaleString("vi-VN")} ₫
                                        </span>
                                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                                            Sofa đôi riêng tư cho 2 người
                                        </p>
                                    </div>
                                </div>

                                {/* Order Summary Breakdown Replica (from client BookingSummary.jsx) */}
                                <div className="rounded-2xl bg-black/60 p-3.5 border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                                        <span>Phòng vé mô phỏng (2 vé đơn)</span>
                                        <span className="font-extrabold text-white">
                                            {((previewNormalSeat?.price || 0) * 2).toLocaleString("vi-VN")} ₫
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-zinc-400">
                                        <span>Phòng vé mô phỏng (1 ghế đôi)</span>
                                        <span className="font-extrabold text-rose-400">
                                            {(previewCoupleSeat?.price || 0).toLocaleString("vi-VN")} ₫
                                        </span>
                                    </div>
                                </div>

                                {/* Policy Footer */}
                                <p className="text-[10px] text-zinc-500 text-center mt-3 leading-relaxed">
                                    * Giá vé đã bao gồm 8% thuế VAT & áp dụng tại tất cả các cụm rạp của hệ thống.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. MODAL FOOTER */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-400 font-medium">
                    * Mức giá sau khi lưu sẽ có hiệu lực ngay cho các suất chiếu mới mở bán
                </span>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100/80 text-xs font-semibold cursor-pointer transition"
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSubmitting || isGetLoading}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-violet-500/20 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <CircularProgress size={15} color="inherit" />
                                <span>Đang lưu biểu giá...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                                <span>Lưu Biểu Giá Vé</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
