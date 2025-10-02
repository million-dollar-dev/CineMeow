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
    TextField,
    Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import {useGetAllCinemasQuery, useGetRoomsQuery} from "../../services/cinemaService.js";
import {useDispatch} from "react-redux";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {SHOWTIME_STATUS_OPTIONS} from "../../constants/showtimeStatus.js";

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
        posterUrl: "https://static.nutscdn.com/vimg/100-0/3c42915d9af0eb6a87bd236d90336ae8.jpg",
    },
];

const EMPTY_SHOWTIME = {
    status: '',
    cinemaId: '',
    roomId: '',
    movieId: '',
};

const showtimeSchema = yup.object().shape({
    movieId: yup
        .string()
        .required("Vui lòng chọn phim"),
    cinemaId: yup
        .string()
        .required("Vui lòng chọn rạp phim"),
    roomId: yup
        .string()
        .required("Vui lòng chọn phòng chiếu"),
    startTime: yup
        .date()
        .typeError("Vui lòng chọn thời gian hợp lệ")
        .min(new Date(), "Thời gian chiếu phải lớn hơn hiện tại")
        .required("Vui lòng chọn thời gian chiếu"),
    status: yup
        .string()
        .oneOf(["COMING_SOON", "NOW_SHOWING", "ENDED"], "Trạng thái không hợp lệ")
        .required("Vui lòng chọn trạng thái"),
});

export default function ShowtimeModal({open, onClose, mode = "add", showtimeData}) {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(showtimeSchema),
        defaultValues: EMPTY_SHOWTIME
    });

    const dispatch = useDispatch();
    const [selectedCinemaId, setSelectedCinemaId] = useState(null);
    const {
        data: cinemaResponse = [],
        isLoading: isLoadingCinemas,
        isError: isErrorCinemas,
        isSuccess: isSuccessCinemas,
        error: errorCinemas,
    } = useGetAllCinemasQuery();
    const cinemas = cinemaResponse?.data || [];

    const {
        data: roomResponse = [],
        isLoading: isLoadingRooms,
        isError: isErrorRooms,
        isSuccess: isSuccessRooms,
        error: errorRooms,
    } = useGetRoomsQuery(selectedCinemaId, { skip: !selectedCinemaId });
    const rooms = roomResponse?.data || [];

    useEffect(() => {
        if (isErrorCinemas) {
            dispatch(openSnackbar({ message: errorCinemas?.data?.message || "Không thể tải rạp!", type: "error" }));
        }
    }, [isSuccessCinemas, isErrorCinemas, errorCinemas, dispatch]);

    useEffect(() => {
        if (isErrorRooms) {
            dispatch(openSnackbar({ message: errorRooms?.data?.message || "Không thể tải phòng!", type: "error" }));
        }
    }, [isSuccessRooms, isErrorRooms, errorRooms, dispatch]);

    useEffect(() => {
        if (showtimeData) {
            reset({
                ...showtimeData,
            });
        } else {
            reset(EMPTY_SHOWTIME);
        }
    }, [showtimeData, open, reset]);

    console.log('cinam', cinemas)

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
                                    value={movies.find((m) => m.id === field.value) || null} // ánh xạ id -> object
                                    onChange={(_, newValue) => field.onChange(newValue?.id || null)} // chỉ lưu id vào form
                                    options={movies}
                                    getOptionLabel={(option) => option.title || ""}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
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


                        {/* Chọn Rạp */}
                        <Controller
                            name="cinemaId"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    value={cinemas.find((c) => c.id === field.value) || null} // ánh xạ id -> object
                                    onChange={(_, newValue) => {
                                        field.onChange(newValue?.id || null); // lưu id vào form
                                        setSelectedCinemaId(newValue?.id || null); // trigger load rooms
                                        setValue("roomId", ""); // reset roomId khi đổi rạp
                                    }}
                                    options={cinemas}
                                    getOptionLabel={(option) => option.name || ""}
                                    loading={isLoadingCinemas}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Rạp phim"
                                            error={!!errors.cinemaId}
                                            helperText={errors.cinemaId?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoadingCinemas ? (
                                                            <CircularProgress size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />


                        {/* Chọn Phòng */}
                        <Controller
                            name="roomId"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.roomId}>
                                    <InputLabel id="room-label">Phòng chiếu</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="room-label"
                                        label="Phòng chiếu"
                                        value={rooms.some(r => r.id === field.value) ? field.value : ""} // ✅ fix out-of-range
                                    >
                                        {isLoadingRooms ? (
                                            <MenuItem disabled>
                                                <CircularProgress size={20} />
                                            </MenuItem>
                                        ) : rooms.length === 0 ? (
                                            <MenuItem disabled>Không có lựa chọn</MenuItem>
                                        ) : (
                                            rooms.map((room) => (
                                                <MenuItem key={room.id} value={room.id}>
                                                    {room.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    <FormHelperText>{errors.roomId?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />



                        {/* Chọn thời gian suất chiếu */}
                        <Controller
                            name="startTime"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    type="datetime-local"
                                    label="Thời gian chiếu"
                                    InputLabelProps={{shrink: true}}
                                    error={!!errors.startTime}
                                    helperText={errors.startTime?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="status"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth error={!!errors.status}>
                                    <InputLabel id="status-label">Trạng thái</InputLabel>
                                    <Select {...field} label="Trạng thái">
                                        {SHOWTIME_STATUS_OPTIONS.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
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
