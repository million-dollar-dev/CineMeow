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
import {Controller, useForm, useWatch} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import {useGetAllCinemasQuery, useGetRoomsQuery} from "../../services/cinemaService.js";
import {useDispatch} from "react-redux";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useGetAllMoviesQuery} from "../../services/movieService.js";
import dayjs from "dayjs";
import {useCreateShowtimeMutation, useUpdateShowtimeMutation} from "../../services/showtimeService.js";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import {SHOWTIME_STATUS_CONFIG} from "../../constants/showtimeStatus.js";
import StatusChip from "../StatusChip.jsx";
import {useUpdateBrandMutation} from "../../services/brandService.js";

const EMPTY_SHOWTIME = {
    status: '',
    cinemaId: '',
    roomId: '',
    movieId: '',
    startTime: '',
    endTime: '',
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
        // .min(new Date(), "Thời gian chiếu phải lớn hơn hiện tại")
        .required("Vui lòng chọn thời gian chiếu"),
    status: yup
        .string()
        .required("Vui lòng chọn trạng thái"),
});

export default function ShowtimeModal({open, onClose, mode = "add", showtimeData}) {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
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

    const {
        data: movieResponse = [],
        isError: isErrorMovies,
        isSuccess: isSuccessMovies,
        error: errorMovies,
        isLoading: isLoadingMovies,
    } = useGetAllMoviesQuery();
    const movies = movieResponse?.data || [];

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
        if (isErrorMovies) {
            dispatch(openSnackbar({ message: errorCinemas?.data?.message || "Không thể tải phim!", type: "error" }));
        }
    }, [isSuccessMovies, isErrorMovies, errorMovies, dispatch]);

    const selectedMovieId = useWatch({ control, name: "movieId" });
    const selectedMovie = movies.find((m) => m.id === selectedMovieId);

    const [
        createShowtime,
        {isLoading: isCreating, isError: isCreateError, error: createError},
    ] = useCreateShowtimeMutation();

    const [
        updateShowtime,
        {isLoading: isUpdating, isError: isUpdateError, error: updateError},
    ] = useUpdateShowtimeMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            startTime: dayjs(data.startTime).format("YYYY-MM-DDTHH:mm:ss"),
            endTime: dayjs(data.endTime).format("YYYY-MM-DDTHH:mm:ss"),
        };
        console.log(payload);

        if (mode === "add") {
            await createShowtime(payload).unwrap();
            dispatch(openSnackbar({message: "Thêm thành công!", type: "success"}));
        } else {
            await updateShowtime({id: showtimeData.id, ...payload}).unwrap();
            dispatch(openSnackbar({message: "Cập nhật thành công!", type: "success"}));
        }
        onClose();
    };

    useEffect(() => {
        if (showtimeData) {
            reset({
                ...showtimeData,
            });
        } else {
            reset(EMPTY_SHOWTIME);
        }
    }, [showtimeData, open, reset]);

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
                                    value={movies.find((m) => m.id === field.value) || null}
                                    onChange={(_, newValue) => field.onChange(newValue?.id || null)} // chỉ lưu id vào form
                                    options={movies}
                                    getOptionLabel={(option) => option.title || ""}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <img
                                                    src={option.posterPath}
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
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="datetime-local"
                                    label="Thời gian chiếu"
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.startTime}
                                    helperText={errors.startTime?.message}
                                    fullWidth
                                    onChange={(e) => {
                                        const value = e.target.value; // dạng YYYY-MM-DDTHH:mm
                                        field.onChange(value);

                                        if (selectedMovie?.duration && value) {
                                            const end = dayjs(value).add(selectedMovie.duration, "minute");
                                            // format đúng cho datetime-local
                                            setValue("endTime", end.format("YYYY-MM-DDTHH:mm"));
                                        }
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="endTime"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="datetime-local"
                                    label="Thời gian kết thúc"
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.endTime}
                                    helperText={errors.endTime?.message}
                                    fullWidth
                                    disabled
                                />
                            )}
                        />


                        <Controller
                            name="status"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth error={!!errors.status}>
                                    <InputLabel id="status-label">Trạng thái</InputLabel>
                                    <Select {...field}
                                            label="Trạng thái"
                                            renderValue={(selected) => <StatusChip status={selected} configs={SHOWTIME_STATUS_CONFIG}/>}
                                    >
                                        {Object.values(SHOWTIME_STATUS_CONFIG).map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                <StatusChip status={opt.value} configs={SHOWTIME_STATUS_CONFIG}/>
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
        </Dialog>
    );
}
