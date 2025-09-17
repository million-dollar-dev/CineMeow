import React, {useEffect, useState} from "react";
import {
    Modal,
    Box,
    Tabs,
    Tab,
    IconButton,
    Typography,
    TextField,
    Button,
    MenuItem, CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SeatMapTab from "./SeatMapTab.jsx";
import { ROOM_TYPES, ROOM_STATUSES } from "../../constants/roomOptions.js";
import {useDispatch} from "react-redux";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";
import {useCreateRoomMutation} from "../../services/cinemaService.js";

const schema = yup.object().shape({
    name: yup.string().required("Tên phòng là bắt buộc"),
    type: yup.string().required("Loại phòng là bắt buộc"),
    status: yup.string().required("Trạng thái là bắt buộc"),
});

const EMPTY_ROOM = {
    name: "",
    type: "",
    status: "INACTIVE",
}

export default function RoomModal({ open, onClose, mode = "add", roomData, cinemaId }) {
    const [tab, setTab] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: EMPTY_ROOM,
    });

    const dispatch = useDispatch();
    const [
        createRoom,
        {isLoading: isCreating, isError: isCreateError, error: createError},
    ] = useCreateRoomMutation();

    useFormServerErrors(isCreateError, createError, setError);

    useEffect(() => {
        if (roomData) {
            reset({
                ...roomData,
                cinemaId: cinemaId,
            });
        } else {
            reset(EMPTY_ROOM);
        }
    }, [roomData, open, reset]);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            cinemaId: cinemaId,
        };

        if (mode === "add") {
            await createRoom(payload).unwrap();
            dispatch(openSnackbar({message: "Thêm thành công!", type: "success"}));
            console.log(payload);
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxHeight: "90vh",
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <IconButton onClick={onClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
                        {mode === "add" ? "Thêm Phòng Chiếu" : "Chỉnh Sửa Phòng Chiếu"}
                    </Typography>
                </Box>

                {/* Tabs */}
                <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                    <Tab label="Thông tin" />
                    <Tab label="Sơ đồ ghế" />
                    <Tab label="Suất chiếu" />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ mt: 2, flex: 1, overflowY: "auto" }}>
                    {/* Tab 1 - Thông tin phòng chiếu */}
                    {tab === 0 && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 gap-6 mt-2">
                                {/* Tên phòng */}
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Tên phòng"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            fullWidth
                                        />
                                    )}
                                />

                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Loại phòng"
                                            error={!!errors.type}
                                            helperText={errors.type?.message}
                                            fullWidth
                                        >
                                            {ROOM_TYPES.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                                {/* Trạng thái */}
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Trạng thái"
                                            error={!!errors.status}
                                            helperText={errors.status?.message}
                                            fullWidth
                                        >
                                            {ROOM_STATUSES.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                            </div>

                            {/* Buttons */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                <Button onClick={onClose} sx={{ mr: 2 }}>
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isCreating}
                                    startIcon={
                                        (isCreating) && (
                                            <CircularProgress size={20} color="inherit"/>
                                        )
                                    }
                                >
                                    {mode === "add" ? "Thêm" : "Lưu"}
                                </Button>
                            </Box>
                        </form>
                    )}

                    {/* Tab 2 - Sơ đồ ghế */}
                    {tab === 1 && (
                        <SeatMapTab />
                    )}

                    {/* Tab 3 - Suất chiếu */}
                    {tab === 2 && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body1">
                                🎬 Danh sách suất chiếu sẽ được hiển thị ở đây.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>
    );
}
