import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";

// Material Icons
import EventSeatIcon from "@mui/icons-material/EventSeat";
import WeekendIcon from "@mui/icons-material/Weekend";
import BlockIcon from "@mui/icons-material/Block";
import BuildIcon from "@mui/icons-material/Build";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";

// Services & Redux
import {
    useGetSeatMapQuery,
    useUpdateSeatMapMutation,
} from "../../services/cinemaService.js";
import { openSnackbar } from "../../redux/slices/snackbarSlice.js";

// Helper: Convert row index (0, 1...) to Letter (A, B...)
const getRowLetter = (index) => String.fromCharCode(65 + index);

// Brush Types definition
const BRUSH_TYPES = [
    {
        key: "NORMAL",
        label: "Ghế thường",
        sublabel: "Tiêu chuẩn đơn (1 chỗ)",
        icon: <EventSeatIcon sx={{ fontSize: 16 }} />,
        activeBg: "bg-slate-800 text-white shadow-xs",
        indicatorBg: "bg-slate-400",
        previewBorder: "border-slate-300",
    },
    {
        key: "COUPLE",
        label: "Ghế Couple",
        sublabel: "Ghế đôi ngọt ngào (2 chỗ)",
        icon: <WeekendIcon sx={{ fontSize: 16 }} />,
        activeBg: "bg-pink-600 text-white shadow-xs shadow-pink-500/25",
        indicatorBg: "bg-pink-500",
        previewBorder: "border-pink-300",
    },
    {
        key: "EMPTY",
        label: "Lối đi / Trống",
        sublabel: "Khoảng trống di chuyển",
        icon: <BlockIcon sx={{ fontSize: 16 }} />,
        activeBg: "bg-zinc-700 text-white shadow-xs",
        indicatorBg: "bg-slate-300 border border-dashed border-slate-500",
        previewBorder: "border-slate-300",
    },
    {
        key: "MAINTENANCE",
        label: "Bảo trì",
        sublabel: "Tạm khóa sửa chữa kỹ thuật",
        icon: <BuildIcon sx={{ fontSize: 16 }} />,
        activeBg: "bg-amber-600 text-white shadow-xs shadow-amber-500/25",
        indicatorBg: "bg-amber-500",
        previewBorder: "border-amber-300",
    },
];

// Presets
const MATRIX_PRESETS = [
    { r: 6, c: 8, label: "6 × 8", name: "Mini", note: "48 chỗ" },
    { r: 8, c: 12, label: "8 × 12", name: "Chuẩn", note: "96 chỗ" },
    { r: 10, c: 14, label: "10 × 14", name: "Rộng", note: "140 chỗ" },
    { r: 12, c: 18, label: "12 × 18", name: "IMAX", note: "216 chỗ" },
];

export default function SeatMapTab({ roomId }) {
    const dispatch = useDispatch();

    // Data query & mutation
    const {
        data: seatResponse,
        isLoading,
    } = useGetSeatMapQuery(roomId, { skip: !roomId });

    const [
        updateSeatMap,
        { isLoading: isUpdating },
    ] = useUpdateSeatMapMutation();

    // Matrix dimensions
    const [rows, setRows] = useState(8);
    const [cols, setCols] = useState(12);

    // Active brush: "NORMAL" | "COUPLE" | "EMPTY" | "MAINTENANCE"
    const [activeBrush, setActiveBrush] = useState("NORMAL");

    // Canvas zoom level: 75, 85, 100, 115, 125
    const [zoom, setZoom] = useState(100);

    // Drag-painting state
    const [isMouseDown, setIsMouseDown] = useState(false);
    const containerRef = useRef(null);

    // Helper: Build default matrix
    const createDefaultMatrix = (numRows, numCols) => {
        return Array.from({ length: numRows }, (_, r) =>
            Array.from({ length: numCols }, (_, c) => ({
                seatId: null,
                type: "NORMAL",
                status: "ACTIVE",
                label: `${getRowLetter(r)}${c + 1}`,
            }))
        );
    };

    // Matrix state
    const [seats, setSeats] = useState(() => createDefaultMatrix(8, 12));

    // History stack for Undo / Redo
    const [history, setHistory] = useState([createDefaultMatrix(8, 12)]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Push new snapshot to history
    const pushHistory = useCallback((newSeats) => {
        setHistory((prev) => {
            const upToCurrent = prev.slice(0, historyIndex + 1);
            // Limit history length to 25 to save memory
            const updated = [...upToCurrent, newSeats];
            if (updated.length > 25) updated.shift();
            return updated;
        });
        setHistoryIndex((prev) => Math.min(prev + 1, 24));
    }, [historyIndex]);

    // Calculate auto-labels for rows (A1, A2...) skipping empty seats
    const autoLabelSeats = useCallback((currentMatrix) => {
        return currentMatrix.map((rowArr, r) => {
            let seatNumber = 1;
            return rowArr.map((seat) => {
                if (seat.type === "EMPTY") {
                    return { ...seat, label: null };
                }
                const label = `${getRowLetter(r)}${seatNumber++}`;
                return { ...seat, label };
            });
        });
    }, []);

    // Parse seats from backend response on load
    useEffect(() => {
        if (seatResponse?.data?.seats && seatResponse.data.seats.length > 0) {
            const seatList = seatResponse.data.seats;
            const maxRow = Math.max(...seatList.map((s) => s.rowIndex)) + 1;
            const maxCol = Math.max(...seatList.map((s) => s.colIndex)) + 1;

            const loadedSeats = Array.from({ length: maxRow }, (_, r) =>
                Array.from({ length: maxCol }, (_, c) => {
                    const seat = seatList.find((s) => s.rowIndex === r && s.colIndex === c);
                    if (seat) {
                        return {
                            seatId: seat.id,
                            type: seat.type || "NORMAL",
                            status: seat.status || "ACTIVE",
                            label: seat.label || `${getRowLetter(r)}${c + 1}`,
                        };
                    }
                    return {
                        seatId: null,
                        type: "EMPTY",
                        status: "ACTIVE",
                        label: null,
                    };
                })
            );

            const labeled = autoLabelSeats(loadedSeats);
            setSeats(labeled);
            setRows(maxRow);
            setCols(maxCol);
            setHistory([labeled]);
            setHistoryIndex(0);
        }
    }, [seatResponse, autoLabelSeats]);

    // Handle Global Mouse Up for drag painting
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsMouseDown(false);
        window.addEventListener("mouseup", handleGlobalMouseUp);
        return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }, []);

    // Undo action
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            const prevSeats = history[prevIndex];
            setSeats(prevSeats);
            setRows(prevSeats.length);
            setCols(prevSeats[0]?.length || 0);
            setHistoryIndex(prevIndex);
        }
    }, [history, historyIndex]);

    // Redo action
    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            const nextSeats = history[nextIndex];
            setSeats(nextSeats);
            setRows(nextSeats.length);
            setCols(nextSeats[0]?.length || 0);
            setHistoryIndex(nextIndex);
        }
    }, [history, historyIndex]);

    // Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleUndo, handleRedo]);

    // Apply active brush to single seat
    const applyBrushToSeat = (r, c, overrideBrush = null) => {
        const brush = overrideBrush || activeBrush;
        setSeats((prev) => {
            const next = prev.map((rowArr, rowIdx) =>
                rowArr.map((seat, colIdx) => {
                    if (rowIdx === r && colIdx === c) {
                        if (brush === "MAINTENANCE") {
                            return { ...seat, type: "NORMAL", status: "MAINTENANCE" };
                        }
                        return { ...seat, type: brush, status: "ACTIVE" };
                    }
                    return seat;
                })
            );
            const labeled = autoLabelSeats(next);
            pushHistory(labeled);
            return labeled;
        });
    };

    // Drag-paint trigger
    const handleSeatMouseDown = (e, r, c) => {
        e.preventDefault();
        setIsMouseDown(true);
        applyBrushToSeat(r, c);
    };

    const handleSeatMouseEnter = (r, c) => {
        if (isMouseDown) {
            applyBrushToSeat(r, c);
        }
    };

    // Apply active brush to ENTIRE ROW
    const handleRowClick = (r) => {
        setSeats((prev) => {
            const next = prev.map((rowArr, rowIdx) => {
                if (rowIdx === r) {
                    return rowArr.map((seat) => {
                        if (activeBrush === "MAINTENANCE") {
                            return { ...seat, type: "NORMAL", status: "MAINTENANCE" };
                        }
                        return { ...seat, type: activeBrush, status: "ACTIVE" };
                    });
                }
                return rowArr;
            });
            const labeled = autoLabelSeats(next);
            pushHistory(labeled);
            return labeled;
        });
    };

    // Apply active brush to ENTIRE COLUMN
    const handleColClick = (c) => {
        setSeats((prev) => {
            const next = prev.map((rowArr) =>
                rowArr.map((seat, colIdx) => {
                    if (colIdx === c) {
                        if (activeBrush === "MAINTENANCE") {
                            return { ...seat, type: "NORMAL", status: "MAINTENANCE" };
                        }
                        return { ...seat, type: activeBrush, status: "ACTIVE" };
                    }
                    return seat;
                })
            );
            const labeled = autoLabelSeats(next);
            pushHistory(labeled);
            return labeled;
        });
    };

    // Matrix Resize logic (preserving existing seats where possible)
    const handleApplyResize = (targetRows, targetCols) => {
        const clampedRows = Math.max(4, Math.min(22, targetRows));
        const clampedCols = Math.max(6, Math.min(28, targetCols));

        setRows(clampedRows);
        setCols(clampedCols);

        setSeats((prevSeats) => {
            const newSeats = Array.from({ length: clampedRows }, (_, r) =>
                Array.from({ length: clampedCols }, (_, c) => {
                    if (prevSeats[r]?.[c]) {
                        return prevSeats[r][c];
                    }
                    return {
                        seatId: null,
                        type: "NORMAL",
                        status: "ACTIVE",
                        label: `${getRowLetter(r)}${c + 1}`,
                    };
                })
            );
            const labeled = autoLabelSeats(newSeats);
            pushHistory(labeled);
            return labeled;
        });
    };

    // Smart Batch Actions
    // 1. Tạo lối đi ở giữa
    const handleCreateCenterAisle = () => {
        const midCol = Math.floor(cols / 2);
        setSeats((prev) => {
            const next = prev.map((rowArr) =>
                rowArr.map((seat, colIdx) => {
                    if (colIdx === midCol) {
                        return { ...seat, type: "EMPTY", status: "ACTIVE" };
                    }
                    return seat;
                })
            );
            const labeled = autoLabelSeats(next);
            pushHistory(labeled);
            return labeled;
        });
        dispatch(openSnackbar({ message: `Đã tạo lối đi giữa tại cột ${midCol + 1}`, type: "info" }));
    };

    // 2. Tạo 2 lối đi 2 bên (Dual Aisles)
    const handleCreateDualAisles = () => {
        const leftAisle = Math.max(1, Math.floor(cols * 0.25));
        const rightAisle = Math.min(cols - 2, Math.floor(cols * 0.75));
        setSeats((prev) => {
            const next = prev.map((rowArr) =>
                rowArr.map((seat, colIdx) => {
                    if (colIdx === leftAisle || colIdx === rightAisle) {
                        return { ...seat, type: "EMPTY", status: "ACTIVE" };
                    }
                    return seat;
                })
            );
            const labeled = autoLabelSeats(next);
            pushHistory(labeled);
            return labeled;
        });
        dispatch(openSnackbar({ message: `Đã tạo 2 lối đi tại cột ${leftAisle + 1} và ${rightAisle + 1}`, type: "info" }));
    };

    // 3. Đổi hàng cuối thành Couple
    const handleLastRowCouple = () => {
        const lastRowIdx = rows - 1;
        setSeats((prev) => {
            const next = prev.map((rowArr, rIdx) => {
                if (rIdx === lastRowIdx) {
                    return rowArr.map((seat) => ({
                        ...seat,
                        type: "COUPLE",
                        status: "ACTIVE",
                    }));
                }
                return rowArr;
            });
            const labeled = autoLabelSeats(next);
            pushHistory(labeled);
            return labeled;
        });
        dispatch(openSnackbar({ message: `Đã cấu hình hàng cuối (${getRowLetter(rows - 1)}) thành ghế Couple`, type: "info" }));
    };

    // 4. Đánh số lại toàn bộ ghế tự động
    const handleReindexSeats = () => {
        setSeats((prev) => {
            const labeled = autoLabelSeats(prev);
            pushHistory(labeled);
            return labeled;
        });
        dispatch(openSnackbar({ message: "Đã tối ưu và đánh số lại tất cả các ghế", type: "success" }));
    };

    // 5. Đặt lại toàn bộ thành ghế thường
    const handleResetAllNormal = () => {
        setSeats((prev) => {
            const next = prev.map((rowArr) =>
                rowArr.map((seat) => ({
                    ...seat,
                    type: "NORMAL",
                    status: "ACTIVE",
                }))
            );
            const labeled = autoLabelSeats(next);
            pushHistory(labeled);
            return labeled;
        });
        dispatch(openSnackbar({ message: "Đã thiết lập lại toàn bộ thành ghế thường", type: "info" }));
    };

    // Build payload to send to backend
    const buildSeatMapRequest = (seatMatrix) => {
        const rowsCount = seatMatrix.length;
        const columnsCount = seatMatrix[0]?.length || 0;
        const seatPayloadList = [];

        seatMatrix.forEach((rowArr, rowIndex) => {
            rowArr.forEach((seat, colIndex) => {
                if (seat) {
                    seatPayloadList.push({
                        seatId: seat.seatId ?? null,
                        rowIndex,
                        colIndex,
                        type: seat.type === "MAINTENANCE" ? "NORMAL" : (seat.type ?? "NORMAL"),
                        status: seat.type === "MAINTENANCE" ? "MAINTENANCE" : (seat.status ?? "ACTIVE"),
                    });
                }
            });
        });

        return {
            rows: rowsCount,
            columns: columnsCount,
            seats: seatPayloadList,
        };
    };

    // Save seat map
    const handleSaveClick = async () => {
        if (!roomId) {
            dispatch(openSnackbar({ message: "Thiếu mã phòng chiếu để lưu sơ đồ ghế", type: "error" }));
            return;
        }

        try {
            const payload = buildSeatMapRequest(seats);
            await updateSeatMap({ id: roomId, ...payload }).unwrap();
            dispatch(openSnackbar({ message: "Lưu sơ đồ ghế thành công!", type: "success" }));
        } catch (err) {
            dispatch(
                openSnackbar({
                    message: err?.data?.message || "Không thể lưu sơ đồ ghế. Vui lòng thử lại.",
                    type: "error",
                })
            );
        }
    };

    // Stats calculations
    const allSeats = useMemo(() => seats.flat(), [seats]);
    const normalCount = allSeats.filter((s) => s.type === "NORMAL" && s.status !== "MAINTENANCE").length;
    const coupleCount = allSeats.filter((s) => s.type === "COUPLE" && s.status !== "MAINTENANCE").length;
    const maintenanceCount = allSeats.filter((s) => s.status === "MAINTENANCE" || s.type === "MAINTENANCE").length;
    const emptyCount = allSeats.filter((s) => s.type === "EMPTY").length;
    const totalPhysicalSeats = normalCount + coupleCount + maintenanceCount;
    const totalActiveAudienceCapacity = normalCount + coupleCount * 2;

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <CircularProgress size={36} sx={{ color: "#7C3AED" }} />
                <p className="text-xs font-semibold text-slate-500">Đang tải cấu trúc sơ đồ ghế...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 select-none">
            {/* 1. TOP STUDIO CONTROL BAR */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                {/* Left: Studio Title & Specs */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-2xs">
                        <TableRowsOutlinedIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            Studio Bố Trí Ghế
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                                {rows} Hàng × {cols} Cột
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {totalActiveAudienceCapacity} chỗ ngồi khán giả
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center: Brush Tools Palette */}
                <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 flex-wrap">
                    {BRUSH_TYPES.map((b) => {
                        const isSelected = activeBrush === b.key;
                        return (
                            <Tooltip
                                key={b.key}
                                title={`${b.label} (${b.sublabel}) - Nhấp hoặc kéo chuột để tô ghế`}
                                arrow
                                disableInteractive
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveBrush(b.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                        isSelected
                                            ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                                            : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${b.indicatorBg}`} />
                                    <span>{b.label}</span>
                                </button>
                            </Tooltip>
                        );
                    })}
                </div>

                {/* Right: History, Zoom & Save Action */}
                <div className="flex items-center gap-2">
                    {/* Undo / Redo Buttons */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
                        <Tooltip title="Hoàn tác (Ctrl+Z)" arrow disableInteractive>
                            <span>
                                <button
                                    type="button"
                                    onClick={handleUndo}
                                    disabled={historyIndex <= 0}
                                    className="w-8 h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition"
                                >
                                    <UndoOutlinedIcon sx={{ fontSize: 16 }} />
                                </button>
                            </span>
                        </Tooltip>
                        <Tooltip title="Làm lại (Ctrl+Y)" arrow disableInteractive>
                            <span>
                                <button
                                    type="button"
                                    onClick={handleRedo}
                                    disabled={historyIndex >= history.length - 1}
                                    className="w-8 h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition"
                                >
                                    <RedoOutlinedIcon sx={{ fontSize: 16 }} />
                                </button>
                            </span>
                        </Tooltip>
                    </div>

                    {/* Zoom Stepper */}
                    <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 text-slate-600">
                        <button
                            type="button"
                            onClick={() => setZoom((z) => Math.max(75, z - 15))}
                            disabled={zoom <= 75}
                            className="w-7 h-7 rounded-lg hover:bg-white hover:text-slate-900 flex items-center justify-center cursor-pointer disabled:opacity-30 transition"
                            title="Thu nhỏ"
                        >
                            <ZoomOutOutlinedIcon sx={{ fontSize: 15 }} />
                        </button>
                        <span className="text-[10px] font-black w-9 text-center text-slate-700">{zoom}%</span>
                        <button
                            type="button"
                            onClick={() => setZoom((z) => Math.min(125, z + 15))}
                            disabled={zoom >= 125}
                            className="w-7 h-7 rounded-lg hover:bg-white hover:text-slate-900 flex items-center justify-center cursor-pointer disabled:opacity-30 transition"
                            title="Phóng to"
                        >
                            <ZoomInOutlinedIcon sx={{ fontSize: 15 }} />
                        </button>
                    </div>

                    {/* Save Button */}
                    <button
                        type="button"
                        onClick={handleSaveClick}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-500/20 active:scale-95 disabled:opacity-50"
                    >
                        {isUpdating ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <SaveOutlinedIcon sx={{ fontSize: 16 }} />
                        )}
                        <span>Lưu Sơ Đồ Ghế</span>
                    </button>
                </div>
            </div>

            {/* 2. MAIN WORKSPACE */}
            <div className="grid grid-cols-12 gap-5 items-start">
                {/* LEFT: CINEMA FLOOR STAGE (8 cols on XL) */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-3">
                    <div
                        ref={containerRef}
                        className="relative rounded-3xl bg-slate-50/90 border border-slate-200/90 shadow-2xs p-5 sm:p-7 overflow-x-auto min-h-[540px] flex flex-col justify-between"
                    >
                        {/* Curved Neon Screen Arc */}
                        <div className="w-full max-w-xl mx-auto mb-8 text-center shrink-0">
                            <div className="relative h-4 w-full flex items-center justify-center">
                                <div className="w-full h-2 bg-gradient-to-r from-transparent via-violet-600 to-transparent rounded-full shadow-[0_4px_16px_rgba(124,58,237,0.35)]" />
                                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/15 to-transparent blur-xs pointer-events-none" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-violet-700 mt-2 select-none">
                                MÀN HÌNH CHIẾU CHÍNH (SCREEN)
                            </p>
                        </div>

                        {/* Interactive Grid Stage with Zoom Scaling */}
                        <div
                            className="flex justify-center items-center py-2 flex-1 transition-transform duration-200"
                            style={{
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: "top center",
                            }}
                        >
                            <div className="inline-block">
                                {/* Top Column Numbers (Clickable to paint entire column) */}
                                <div className="flex items-center gap-1.5 pb-2 pl-9">
                                    {Array.from({ length: cols }, (_, c) => (
                                        <Tooltip
                                            key={`col-head-${c}`}
                                            title={`Nhấp để đổi cả Cột ${c + 1} thành ${
                                                BRUSH_TYPES.find((b) => b.key === activeBrush)?.label
                                            }`}
                                            arrow
                                            disableInteractive
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleColClick(c)}
                                                className="w-8 h-6 rounded text-[10px] font-extrabold text-slate-400 hover:text-violet-700 hover:bg-violet-100/70 transition flex items-center justify-center cursor-pointer select-none"
                                            >
                                                {c + 1}
                                            </button>
                                        </Tooltip>
                                    ))}
                                </div>

                                {/* Matrix Rows */}
                                <div className="flex flex-col gap-1.5">
                                    {seats.map((rowArr, r) => {
                                        const rowLetter = getRowLetter(r);
                                        return (
                                            <div key={`row-${r}`} className="flex items-center gap-1.5">
                                                {/* Row Header Letter (Clickable to paint entire row) */}
                                                <Tooltip
                                                    title={`Nhấp để đổi cả Hàng ${rowLetter} thành ${
                                                        BRUSH_TYPES.find((b) => b.key === activeBrush)?.label
                                                    }`}
                                                    arrow
                                                    disableInteractive
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRowClick(r)}
                                                        className="w-7 h-8 rounded text-xs font-black text-slate-400 hover:text-violet-700 hover:bg-violet-100/70 transition flex items-center justify-center cursor-pointer select-none shrink-0"
                                                    >
                                                        {rowLetter}
                                                    </button>
                                                </Tooltip>

                                                {/* Seats in this row */}
                                                <div className="flex items-center gap-1.5">
                                                    {rowArr.map((seat, c) => {
                                                        const isCouple = seat.type === "COUPLE";
                                                        const isEmpty = seat.type === "EMPTY";
                                                        const isMaintenance =
                                                            seat.status === "MAINTENANCE" ||
                                                            seat.type === "MAINTENANCE";

                                                        // Light theme styling based on seat type
                                                        let seatStyle =
                                                            "bg-white border-slate-300 text-slate-700 shadow-2xs hover:border-violet-500 hover:bg-violet-50/80 hover:text-violet-900";
                                                        if (isCouple) {
                                                            seatStyle =
                                                                "bg-pink-50 border-pink-300 text-pink-700 shadow-2xs hover:bg-pink-100 hover:border-pink-500 hover:scale-105";
                                                        } else if (isEmpty) {
                                                            seatStyle =
                                                                "bg-transparent border-dashed border-slate-200 text-slate-300 hover:border-slate-400";
                                                        } else if (isMaintenance) {
                                                            seatStyle =
                                                                "bg-amber-50 border-amber-300 text-amber-700 shadow-2xs hover:border-amber-500 hover:bg-amber-100";
                                                        }

                                                        return (
                                                            <Tooltip
                                                                key={`${r}-${c}`}
                                                                title={
                                                                    isEmpty
                                                                        ? `Khoảng trống Hàng ${rowLetter}-${c + 1}`
                                                                        : `Ghế ${seat.label || `${rowLetter}${c + 1}`} (${
                                                                              isCouple
                                                                                  ? "Ghế Couple"
                                                                                  : isMaintenance
                                                                                  ? "Bảo trì"
                                                                                  : "Ghế thường"
                                                                          })`
                                                                }
                                                                arrow
                                                                disableInteractive
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onMouseDown={(e) => handleSeatMouseDown(e, r, c)}
                                                                    onMouseEnter={() => handleSeatMouseEnter(r, c)}
                                                                    className={`w-8 h-8 rounded-lg border text-[10px] font-extrabold flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 select-none relative group ${seatStyle}`}
                                                                >
                                                                    {isEmpty ? (
                                                                        <span className="text-[8px] opacity-40">•</span>
                                                                    ) : isMaintenance ? (
                                                                        <BuildIcon sx={{ fontSize: 13 }} />
                                                                    ) : (
                                                                        <span>{seat.label ? seat.label.replace(/^[A-Z]/, "") : c + 1}</span>
                                                                    )}

                                                                    {/* Cinema cushion top notch highlight in light theme */}
                                                                    {!isEmpty && !isMaintenance && (
                                                                        <span
                                                                            className={`absolute top-0.5 inset-x-1.5 h-0.5 rounded-full pointer-events-none ${
                                                                                isCouple ? "bg-pink-200" : "bg-slate-200"
                                                                            }`}
                                                                        />
                                                                    )}
                                                                </button>
                                                            </Tooltip>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stage Legend & Instruction Hint */}
                        <div className="pt-5 mt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 select-none">
                            <div className="flex flex-wrap items-center gap-5">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3.5 h-3.5 rounded bg-white border border-slate-300 shadow-2xs" />
                                    <span className="font-semibold text-slate-600">Thường ({normalCount})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3.5 h-3.5 rounded bg-pink-50 border border-pink-300 shadow-2xs" />
                                    <span className="font-semibold text-pink-700">Couple ({coupleCount})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-300 shadow-2xs" />
                                    <span className="font-semibold text-amber-700">Bảo trì ({maintenanceCount})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3.5 h-3.5 rounded bg-transparent border border-dashed border-slate-300" />
                                    <span className="font-semibold text-slate-400">Lối đi ({emptyCount})</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-slate-400 italic">
                                * Mẹo: Giữ chuột và kéo để tô nhanh liên tục nhiều ghế
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: STUDIO TOOLS & STATS SIDEBAR (4 cols on XL) */}
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
                    {/* Panel 1: Điều chỉnh ma trận */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <TableRowsOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                1. Kích Thước Ma Trận Ghế
                            </h3>
                        </div>

                        {/* Steppers */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Rows control */}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                                    Số hàng ghế (H)
                                </span>
                                <div className="flex items-center justify-between mt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleApplyResize(rows - 1, cols)}
                                        disabled={rows <= 4}
                                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer disabled:opacity-30 transition"
                                    >
                                        <RemoveOutlinedIcon sx={{ fontSize: 14 }} />
                                    </button>
                                    <span className="text-sm font-black text-slate-800">{rows}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleApplyResize(rows + 1, cols)}
                                        disabled={rows >= 22}
                                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer disabled:opacity-30 transition"
                                    >
                                        <AddOutlinedIcon sx={{ fontSize: 14 }} />
                                    </button>
                                </div>
                            </div>

                            {/* Cols control */}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                                    Số cột ghế (C)
                                </span>
                                <div className="flex items-center justify-between mt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleApplyResize(rows, cols - 1)}
                                        disabled={cols <= 6}
                                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer disabled:opacity-30 transition"
                                    >
                                        <RemoveOutlinedIcon sx={{ fontSize: 14 }} />
                                    </button>
                                    <span className="text-sm font-black text-slate-800">{cols}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleApplyResize(rows, cols + 1)}
                                        disabled={cols >= 28}
                                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer disabled:opacity-30 transition"
                                    >
                                        <AddOutlinedIcon sx={{ fontSize: 14 }} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Size Presets */}
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                Mẫu ma trận chuẩn
                            </span>
                            <div className="grid grid-cols-4 gap-1.5">
                                {MATRIX_PRESETS.map((p, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleApplyResize(p.r, p.c)}
                                        className={`p-2 rounded-xl text-center border transition cursor-pointer ${
                                            rows === p.r && cols === p.c
                                                 ? "bg-violet-50 text-violet-700 border-violet-200 font-bold"
                                                 : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 font-semibold"
                                        }`}
                                    >
                                        <p className="text-xs font-black">{p.label}</p>
                                        <p className="text-[9px] text-slate-400 mt-0.5">{p.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Panel 2: Thao tác hàng loạt (Smart Actions) */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <AutoFixHighOutlinedIcon sx={{ fontSize: 18 }} className="text-violet-600" />
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                2. Thao Tác Nhanh (Smart Batch)
                            </h3>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleCreateCenterAisle}
                                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-violet-50 border border-slate-200/80 hover:border-violet-200 text-slate-700 hover:text-violet-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                            >
                                <ViewWeekOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                                <span>Tạo lối đi ở giữa phòng</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleCreateDualAisles}
                                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-violet-50 border border-slate-200/80 hover:border-violet-200 text-slate-700 hover:text-violet-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                            >
                                <ViewWeekOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                                <span>Tạo 2 lối đi hai bên</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleLastRowCouple}
                                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-200/80 hover:border-pink-200 text-slate-700 hover:text-pink-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                            >
                                <WeekendIcon sx={{ fontSize: 16 }} className="text-pink-500" />
                                <span>Đổi hàng cuối thành ghế Couple</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleReindexSeats}
                                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                            >
                                <FormatListNumberedOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                                <span>Tự động đánh số lại ghế</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleResetAllNormal}
                                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                            >
                                <RestartAltOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                                <span>Đặt lại toàn bộ thành ghế thường</span>
                            </button>
                        </div>
                    </div>

                    {/* Panel 3: Thống kê số lượng ghế */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                                3. Năng Lực Phòng Chiếu
                            </span>
                            <span className="text-xs font-black text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                                {totalActiveAudienceCapacity} chỗ ngồi
                            </span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-slate-700" />
                                    <span>Ghế tiêu chuẩn (Standard)</span>
                                </span>
                                <span className="font-black text-slate-900">{normalCount}</span>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-pink-500" />
                                    <span>Ghế Couple (Đôi)</span>
                                </span>
                                <span className="font-black text-pink-600">{coupleCount} ({coupleCount * 2} chỗ)</span>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                                    <span>Ghế bảo trì / Khóa</span>
                                </span>
                                <span className="font-black text-amber-600">{maintenanceCount}</span>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded border border-dashed border-zinc-400" />
                                    <span>Lối đi / Khoảng trống</span>
                                </span>
                                <span className="font-bold text-slate-400">{emptyCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
