import React, { useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RoomModal from "./RoomModal.jsx";
import { getRoomStatusLabel, getRoomTypeLabel } from "../../constants/roomOptions.js";

export default function ListRoomTab({ onClose, rooms = [], cinemaId, cinemaName }) {
    const [openRoomModal, setOpenRoomModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [modalTab, setModalTab] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedRoom(null);
        setModalTab(0);
        setOpenRoomModal(true);
    };

    const handleEditClick = (room) => {
        setModalMode("edit");
        setSelectedRoom(room);
        setModalTab(0);
        setOpenRoomModal(true);
    };

    const handleSeatMapClick = (room) => {
        setModalMode("edit");
        setSelectedRoom(room);
        setModalTab(1);
        setOpenRoomModal(true);
    };

    return (
        <div className="flex flex-col gap-4">
            <RoomModal
                open={openRoomModal}
                onClose={() => setOpenRoomModal(false)}
                roomData={selectedRoom}
                mode={modalMode}
                cinemaId={cinemaId}
                cinemaName={cinemaName}
                initialTab={modalTab}
            />

            {/* Toolbar: Count & Add Button */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <MeetingRoomOutlinedIcon sx={{ fontSize: 20 }} className="text-violet-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Danh sách phòng máy ({rooms.length} phòng)
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleAddClick}
                    className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                    <AddCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Thêm phòng chiếu</span>
                </button>
            </div>

            {/* Room Cards Grid */}
            <div className="max-h-[460px] overflow-y-auto pr-1">
                {rooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                        {rooms.map((room) => {
                            const roomType = room.type || room.roomType || "2D";
                            const isImax = roomType === "IMAX";
                            const isVip = roomType === "VIP";

                            return (
                                <div
                                    key={room.id}
                                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-violet-200 transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Header: Name & Type */}
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-xs font-black text-slate-900 group-hover:text-violet-700 transition line-clamp-1" title={room.name}>
                                                {room.name}
                                            </h4>
                                            <span
                                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                                                    isImax
                                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                                        : isVip
                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                        : "bg-slate-100 text-slate-700 border-slate-200"
                                                }`}
                                            >
                                                {getRoomTypeLabel(roomType)}
                                            </span>
                                        </div>

                                        {/* Specs: Seat count & Status */}
                                        <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
                                            <span className="flex items-center gap-1 font-semibold">
                                                <EventSeatOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400" />
                                                <span>{room.seatCount || room.totalSeats || 150} ghế</span>
                                            </span>

                                            <span className="flex items-center gap-1 font-medium text-[11px]">
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        room.status === "ACTIVE"
                                                            ? "bg-emerald-500"
                                                            : room.status === "MAINTENANCE"
                                                            ? "bg-amber-500"
                                                            : "bg-slate-400"
                                                    }`}
                                                />
                                                <span>{getRoomStatusLabel(room.status)}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSeatMapClick(room)}
                                            className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 hover:text-violet-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs group-hover:bg-violet-600 group-hover:text-white"
                                        >
                                            <EventSeatOutlinedIcon sx={{ fontSize: 15 }} />
                                            <span>Sơ đồ ghế</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleEditClick(room)}
                                            className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                        >
                                            <EditOutlinedIcon sx={{ fontSize: 14 }} />
                                            <span>Cấu hình</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                        <MeetingRoomOutlinedIcon sx={{ fontSize: 40 }} className="text-slate-300 mb-2" />
                        <h4 className="text-xs font-bold text-slate-700">Chưa có phòng chiếu nào</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                            Khởi tạo phòng máy đầu tiên cho cụm rạp này
                        </p>
                        <button
                            type="button"
                            onClick={handleAddClick}
                            className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <AddCircleOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                            <span>Thêm phòng ngay</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}