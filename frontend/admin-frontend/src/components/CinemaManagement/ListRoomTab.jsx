import React, {useState} from 'react';
import {Box, Button, Card, CardActions, CardContent, Chip, DialogActions, Grid, Typography} from "@mui/material";
import RoomModal from "./RoomModal.jsx";
import {getRoomStatusLabel, getRoomTypeLabel} from "../../constants/roomOptions.js";

const ListRoomTab = ({onClose, rooms, cinemaId}) => {
    const [openRoomModal, setOpenRoomModal] = React.useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedRoom, setSelectedRoom] = React.useState(null);

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedRoom(null);
        setOpenRoomModal(true);
    };

    const handleEditClick = (room) => {
        setModalMode("edit");
        setSelectedRoom(room);
        setOpenRoomModal(true);
    };

    return (
        <>
            <RoomModal
                open={openRoomModal}
                onClose={() => setOpenRoomModal(false)}
                roomData={selectedRoom}
                mode={modalMode}
                cinemaId={cinemaId}
            />
            <Box sx={{ Height: 460, overflowY: "auto", pr: 1 }}>
                {
                    rooms.length > 0 ?
                        (<Grid container spacing={2} justifyContent="center">
                            {rooms.map((room) => (
                                <Box
                                    key={room.id}
                                    sx={{
                                        width: 240,
                                        height: 180,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        transition: "0.3s",
                                        "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                                        m: 2, // khoảng cách giữa các box
                                    }}
                                >
                                    {/* Header */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            px: 2,
                                            py: 1.5,
                                            borderBottom: "1px solid #eee",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                        >
                                            {room.name}
                                        </Typography>
                                        <Chip
                                            label={getRoomStatusLabel(room.status)}
                                            color={room.status === "ACTIVE" ? "success" : room.status === "MAINTENANCE" ? "warning" : "error"}
                                            size="small"
                                            sx={{
                                                minWidth: 90,
                                                textAlign: "center",
                                                fontWeight: "bold",
                                            }}
                                        />
                                    </Box>

                                    {/* Nội dung */}
                                    <Box sx={{ flexGrow: 1, px: 2, py: 1 }}>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            <strong>Số ghế:</strong> {room.seatCount}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Loại phòng:</strong> {getRoomTypeLabel(room.type)}
                                        </Typography>
                                    </Box>

                                    {/* Footer */}
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            borderTop: "1px solid #eee",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ textTransform: "none" }}
                                            onClick={() => handleEditClick(room)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Grid>)
                        :
                        (
                            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                                <Typography>Không có phòng chiếu</Typography>
                            </Box>
                        )
                }
            </Box>

            <DialogActions>
                <Button
                    onClick={onClose} color="error" variant="outlined">
                    Đóng
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={() => handleAddClick()}
                >
                    Thêm mới
                </Button>
            </DialogActions>
        </>
    );
};

export default ListRoomTab;