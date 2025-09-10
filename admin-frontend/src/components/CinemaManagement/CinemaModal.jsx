import React, { useState } from "react";
import {
    Modal,
    Box,
    Tabs,
    Tab,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Grid, CardActions, CardHeader, Chip, MenuItem, CircularProgress, DialogActions,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const EMPTY_CINEMA = {
    name: "",
    address: "",
    city: "",
    imageUrl: ""
}

const cinemaSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên rạp là bắt buộc")
        .max(100, "Tên rạp không được quá 100 ký tự"),

    address: yup
        .string()
        .required("Địa chỉ là bắt buộc")
        .max(200, "Địa chỉ không được quá 200 ký tự"),

    city: yup
        .string()
        .required("Thành phố là bắt buộc")
        .max(50, "Tên thành phố không được quá 50 ký tự"),

    brandId: yup
        .string()
        .required("Bạn phải chọn thương hiệu"),

    imageUrl: yup
        .string()
        .url("Ảnh phải là một URL hợp lệ")
        .required("Ảnh rạp là bắt buộc"),
});

const brands = [
    { id: "brand-1", name: "CGV", logoUrl: "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png" },
    { id: "brand-2", name: "Galaxy", logoUrl: "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png" },
    { id: "brand-3", name: "Lotte", logoUrl: "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png" },
];

export default function CinemaModal({ open, onClose, cinema, rooms = [], mode = "add" }) {
    const [tab, setTab] = useState(0);
    const [formData, setFormData] = useState(cinema || {});

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: {errors},
        watch
    } = useForm({
        resolver: yupResolver(cinemaSchema),
        defaultValues: EMPTY_CINEMA,
    });

    const imageValue = watch("imageUrl");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        console.log("Save data:", formData);
        // gọi API create hoặc update cinema ở đây
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    bgcolor: "white",
                    width: 980,
                    margin: "30px auto",
                    borderRadius: 2,
                    p: 3,
                    boxShadow: 24,
                }}
            >
                {/* Tabs chỉ xuất hiện nếu mode === "edit" */}
                {mode === "edit" && (
                    <Tabs value={tab} onChange={(e, val) => setTab(val)}>
                        <Tab label="Thông tin rạp" />
                        <Tab label="Phòng chiếu" />
                    </Tabs>
                )}

                {/* Tab Thông tin */}
                {(mode === "add" || tab === 0) && (
                    <form onSubmit={handleSubmit(handleSave)}>
                        <div className="grid grid-cols-2 gap-6 mt-4">
                            {/* Tên rạp */}
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Tên rạp"
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />

                            {/* Địa chỉ */}
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Địa chỉ"
                                        fullWidth
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                    />
                                )}
                            />

                            {/* Thành phố */}
                            <Controller
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Thành phố"
                                        fullWidth
                                        error={!!errors.city}
                                        helperText={errors.city?.message}
                                    />
                                )}
                            />

                            {/* Ảnh đại diện */}
                            <Controller
                                name="imageUrl"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Ảnh đại diện"
                                        fullWidth
                                        error={!!errors.imageUrl}
                                        helperText={errors.imageUrl?.message}
                                    />
                                )}
                            />

                            {/* Brand select */}
                            <Controller
                                name="brandId"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Thương hiệu"
                                        fullWidth
                                        error={!!errors.brandId}
                                        helperText={errors.brandId?.message}
                                        SelectProps={{
                                            renderValue: (selected) => {
                                                const brand = brands.find((b) => b.id === selected);
                                                if (!brand) return "";
                                                return (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <img
                                                            src={brand.logoUrl}
                                                            alt={brand.name}
                                                            style={{ width: 30, height: 30, borderRadius: "50%" }}
                                                        />
                                                        <span>{brand.name}</span>
                                                    </Box>
                                                );
                                            },
                                        }}
                                    >
                                        {brands.map((brand) => (
                                            <MenuItem key={brand.id} value={brand.id}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <img
                                                        src={brand.logoUrl}
                                                        alt={brand.name}
                                                        style={{ width: 30, height: 30, borderRadius: "50%" }}
                                                    />
                                                    <span>{brand.name}</span>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />

                            {/* Backdrop Path */}
                            <Controller
                                name="imageUrl"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-2">
                                        <TextField
                                            {...field}
                                            label="Image"
                                            fullWidth
                                            error={!!errors.imageUrl}
                                            helperText={errors.imageUrl?.message}
                                        />
                                    </div>
                                )}
                            />


                        </div>

                        {imageValue && (
                            <div className="rounded-lg overflow-hidden shadow-md mt-4">
                                <img
                                    src={imageValue}
                                    alt="Backdrop Preview"
                                    className="w-full max-h-64 object-cover"
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        <DialogActions>
                            <Button onClick={onClose} color="error" variant="outlined">
                                Đóng
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                startIcon={

                                        <CircularProgress size={20} color="inherit"/>

                                }
                            >
                                {mode === "add" ? "Lưu" : "Cập nhật"}
                            </Button>
                        </DialogActions>
                    </form>
                )}

                {/* Tab Phòng chiếu (chỉ hiện khi edit) */}
                {mode === "edit" && tab === 1 && (
                    <>
                        <Box sx={{ maxHeight: 460, overflowY: "auto", pr: 1 }}>
                            <Grid container spacing={2} sx={{ p: 2 }} alignItems="stretch">
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
                                                    onClick={() => console.log("Xem chi tiết", room)}
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
                            <Button onClick={onClose} color="error" variant="outlined">
                                Đóng
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                            >
                                Thêm mới
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Box>
        </Modal>
    );
}
