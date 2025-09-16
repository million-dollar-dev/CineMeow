import React from 'react';
import {Box, Button, Card, CardActions, CardContent, Chip, DialogActions, Grid, Typography} from "@mui/material";
import RoomModal from "./RoomModal.jsx";

const ListRoomTab = ({onClose, rooms, cinemaId}) => {
    const [openRoomModal, setOpenRoomModal] = React.useState(false);

    const handleDetailClick = () => {
        setOpenRoomModal(true);
    }

    return (
        <>
            <RoomModal
                open={openRoomModal}
                onClose={() => setOpenRoomModal(false)}
                cinemaId={cinemaId}
            />
            <Box sx={{ maxHeight: 460, overflowY: "auto", pr: 1 }}>
                <Grid container spacing={2} justifyContent="center">
                    {rooms.map((room, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "0.3s",
                                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                                }}
                            >
                                {/* Header */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        px: 3,
                                        py: 2,
                                        width: "100%",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                                    >
                                        {room.name}
                                    </Typography>
                                    <Chip
                                        label={room.status}
                                        color={room.status === "Active" ? "success" : "error"}
                                        size="small"
                                        sx={{
                                            minWidth: 100,
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}
                                    />
                                </Box>

                                {/* Nội dung */}
                                <CardContent sx={{ flexGrow: 1, px: 3 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Số ghế:</strong> {room.seatCount}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Loại phòng:</strong> {room.type}
                                    </Typography>
                                </CardContent>

                                {/* Footer */}
                                <CardActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ textTransform: "none" }}
                                        onClick={() => handleDetailClick()}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
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
                    onClick={() => setOpenRoomModal(true)}
                >
                    Thêm mới
                </Button>
            </DialogActions>
        </>
    );
};

export default ListRoomTab;