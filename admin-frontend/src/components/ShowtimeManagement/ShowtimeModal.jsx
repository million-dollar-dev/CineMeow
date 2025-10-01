import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField, Typography,
} from "@mui/material";
import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import {useGetAllCinemasQuery} from "../../services/cinemaService.js";

// Dữ liệu mẫu
const movies = [
    {
        id: "m1",
        title: "Avengers: Endgame",
        posterUrl: "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SY679_.jpg",
    },
    {
        id: "m2",
        title: "Inception",
        posterUrl: "https://m.media-amazon.com/images/I/91G6klI-N1L._AC_SL1500_.jpg",
    },
];

const rooms = [
    { id: "r1", name: "Phòng 1 - 2D", cinemaId: "c1" },
    { id: "r2", name: "Phòng 2 - IMAX", cinemaId: "c1" },
    { id: "r3", name: "Phòng 3 - 3D", cinemaId: "c2" },
];


export default function ShowtimeModal({open, onClose, mode = "add", showtimeData}) {
    const {
        control,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: {errors},
    } = useForm({

    });

    const {data: cinemaResponse,
        isError: cinemaIsErring,
        error: cinemaError,
        isLoading: cinemaisLoading} = useGetAllCinemasQuery();
    const cinemas = cinemaResponse?.data ?? [];


    useEffect(() => {
        if (showtimeData) {
            reset({
                ...showtimeData,
            });
        } else {
            // reset(EMPTY_MOVIE);
        }
    }, [showtimeData, open, reset]);


    const onSubmit = async (data) => {
        console.log(data);
        onClose();

    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle className="text-xl font-semibold text-gray-700">
                {mode === "add" ? "Thêm xuất chiếu mới" : "Chỉnh sửa xuất chiếu"}
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="!py-4 !px-8">
                    <div className="grid gap-4">
                        {/* Chọn phim */}
                        <Controller
                            name="movieId"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    options={movies}
                                    getOptionLabel={(option) => option.title || ""}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    onChange={(_, newValue) => field.onChange(newValue?.id || null)} // chỉ lưu id
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <img
                                                    src={option.posterUrl}
                                                    alt={option.title}
                                                    style={{
                                                        width: 50,
                                                        height: 70,
                                                        objectFit: "cover",
                                                        borderRadius: 4,
                                                    }}
                                                />
                                                <Typography>{option.title}</Typography>
                                            </Box>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Phim"
                                            error={!!errors.movieId}
                                            helperText={errors.movieId?.message}
                                        />
                                    )}
                                />
                            )}
                        />


                        {/* Chọn rạp */}
                        <Controller
                            name="cinemaId"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    options={cinemas} // danh sách rạp
                                    getOptionLabel={(option) => option.name || ""} // hiển thị tên rạp
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    onChange={(_, newValue) => field.onChange(newValue?.id || null)} // lưu id vào form
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Rạp phim"
                                            error={!!errors.cinemaId}
                                            helperText={errors.cinemaId?.message}
                                        />
                                    )}
                                />
                            )}
                        />


                        {/* Chọn phòng chiếu */}
                        <Controller
                            name="roomId"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.roomId}>
                                    <InputLabel id="room-label">Phòng chiếu</InputLabel>
                                    <Select {...field}
                                            labelId="room-label"
                                            id="room-select"
                                            label="Phòng Chiếu"
                                    >
                                        {rooms
                                            .filter((room) => room.cinemaId === watch("cinemaId")) // lọc theo rạp đã chọn
                                            .map((room) => (
                                                <MenuItem key={room.id} value={room.id}>
                                                    {room.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    <FormHelperText>{errors.roomId?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />

                        {/* Chọn thời gian suất chiếu */}
                        <Controller
                            name="startTime"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="datetime-local"
                                    label="Thời gian chiếu"
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.startTime}
                                    helperText={errors.startTime?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.status}>
                                    <InputLabel id="status-label">Trạng thái</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="status-label"
                                        id="status-select"
                                        label="Trạng thái"
                                    >
                                        <MenuItem value="COMING_SOON">Sắp chiếu</MenuItem>
                                        <MenuItem value="NOW_SHOWING">Đang chiếu</MenuItem>
                                        <MenuItem value="ENDED">Đã chiếu</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.status?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />

                    </div>
                </DialogContent>


                <DialogActions>
                    <Button onClick={onClose} color="error" variant="outlined">
                        Đóng
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                    >
                        {mode === "add" ? "Lưu" : "Cập nhật"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
