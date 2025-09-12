import React, {useEffect, useState} from "react";
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
    Grid, CardActions, CardHeader, Chip, MenuItem, CircularProgress, DialogActions, DialogTitle, DialogContent, Dialog,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useDispatch} from "react-redux";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import {useCreateCinemaMutation, useUpdateCinemaMutation} from "../../services/cinemaService.js";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";
import {useGetAllBrandsQuery} from "../../services/brandService.js";

const EMPTY_CINEMA = {
    name: "",
    address: "",
    brandId: "",
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

export default function CinemaModal({ open, onClose, cinemaData, rooms = [], mode = "add" }) {
    const [tab, setTab] = useState(0);

    const {
        control,
        handleSubmit,
        setError,
        formState: {errors},
        reset,
        watch
    } = useForm({
        resolver: yupResolver(cinemaSchema),
        defaultValues: {
            ...EMPTY_CINEMA,
            brandId: cinemaData?.brand?.id || ""
        },
    });

    const imageValue = watch("imageUrl");

    const dispatch = useDispatch();

    const {data: brandResponse, isError, error, isLoading} = useGetAllBrandsQuery();
    const brands = brandResponse?.data ?? [];

    const [
        createCinema,
        {isLoading: isCreating, isError: isCreateError, error: createError},
    ] = useCreateCinemaMutation();

    const [
        updateCinema,
        {isLoading: isUpdating, isError: isUpdateError, error: updateError},
    ] = useUpdateCinemaMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    useEffect(() => {
        if (cinemaData) {
            reset({
                ...EMPTY_CINEMA,
                ...cinemaData,
                brandId: cinemaData.brand.id,
            });
        } else {
            reset(EMPTY_CINEMA);
        }
    }, [cinemaData, open, reset]);

    useEffect(() => {
        if (isError) {
            dispatch(openSnackbar({message: error?.error, type: "error"}));
        }
    }, [isError, error, isLoading, brandResponse]);

    const onSubmit = async (data) => {
        const payload = {
            ...data
        };

        if (mode === "add") {
            await createCinema(payload).unwrap();
            dispatch(openSnackbar({message: "Thêm thành công!", type: "success"}));
            console.log(payload)
        } else {
            console.log(payload)
            await updateCinema({id: cinemaData.id, ...payload}).unwrap();
            dispatch(openSnackbar({message: "Cập nhật thành công!", type: "success"}));
        }
        onClose();
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            {/* Title */}
            {mode === "edit" ? (
                <DialogTitle>
                    <Tabs value={tab} onChange={(e, val) => setTab(val)}>
                        <Tab label="Thông tin rạp" />
                        <Tab label="Phòng chiếu" />
                    </Tabs>
                </DialogTitle>
            ) : (
                <DialogTitle className="text-xl font-semibold text-gray-700">
                    Thêm mới rạp
                </DialogTitle>
            )}

            {/* Nội dung */}
            <DialogContent dividers>
                {/* Tab Thông tin */}
                {(mode === "add" || tab === 0) && (
                    <form onSubmit={handleSubmit(onSubmit)}>
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

                                        {
                                            brands.length === 0 && (
                                                <MenuItem>
                                                    <p>Không có dữ liệu</p>
                                                </MenuItem>
                                            )
                                        }
                                    </TextField>
                                )}
                            />

                            {/* Image */}
                            <Controller
                                name="imageUrl"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Image"
                                        fullWidth
                                        error={!!errors.imageUrl}
                                        helperText={errors.imageUrl?.message}
                                    />
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

                        <DialogActions>
                            <Button onClick={onClose} color="error" variant="outlined">
                                Đóng
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                disabled={isCreating || isUpdating}
                                startIcon={
                                    (isCreating || isUpdating) && (
                                        <CircularProgress size={20} color="inherit"/>
                                    )
                                }
                            >
                                {mode === "add" ? "Lưu" : "Cập nhật"}
                            </Button>
                        </DialogActions>
                    </form>
                )}

                {/* Tab Phòng chiếu */}
                {mode === "edit" && tab === 1 && (
                    <>
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
                                disabled={isCreating || isUpdating}
                                startIcon={
                                    (isCreating || isUpdating) && (
                                        <CircularProgress size={20} color="inherit"/>
                                    )
                                }
                            >
                                {mode === "add" ? "Lưu" : "Cập nhật"}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );

}
