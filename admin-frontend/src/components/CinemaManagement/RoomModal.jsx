import React, { useState } from "react";
import {
    Modal,
    Box,
    Tabs,
    Tab,
    IconButton,
    Typography,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SeatMapTab from "./SeatMapTab.jsx";

const schema = yup.object().shape({
    name: yup.string().required("Tên phòng là bắt buộc"),
    type: yup.string().required("Loại phòng là bắt buộc"),
    status: yup.string().required("Trạng thái là bắt buộc"),
    seatCount: yup
        .number()
        .typeError("Sức chứa phải là số")
        .positive("Sức chứa phải > 0")
        .integer("Sức chứa phải là số nguyên")
        .required("Sức chứa là bắt buộc"),
    description: yup.string().nullable(),
});

export default function RoomModal({ open, onClose, mode = "add" }) {
    const [tab, setTab] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            type: "",
            status: "Active",
            seatCount: "",
            description: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Room data:", data);
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

                                {/* Loại phòng */}
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
                                            <MenuItem value="2D">2D</MenuItem>
                                            <MenuItem value="3D">3D</MenuItem>
                                            <MenuItem value="IMAX">IMAX</MenuItem>
                                            <MenuItem value="VIP">VIP</MenuItem>
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
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Maintenance">Maintenance</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                        </TextField>
                                    )}
                                />

                                {/* Sức chứa */}
                                <Controller
                                    name="seatCount"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Sức chứa"
                                            type="number"
                                            error={!!errors.seatCount}
                                            helperText={errors.seatCount?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>

                            {/* Buttons */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                <Button onClick={onClose} sx={{ mr: 2 }}>
                                    Hủy
                                </Button>
                                <Button type="submit" variant="contained">
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
