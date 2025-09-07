import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox, FormHelperText, TextareaAutosize,
} from "@mui/material";
import {useEffect, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import MovieStatusChip from "./MovieStatusChip";
import {useGetAllGenresQuery} from "../../services/genreService.js";

const STATUS_OPTIONS = ["NOW_PLAYING", "COMING_SOON", "RELEASED", "POST_PRODUCTION"];
const RATING_OPTIONS = ["G", "PG", "PG13", "R", "NC17", "C13"];
var GENRES = [
    "Action",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
];


const EMPTY_MOVIE = {
    // backdropPath: "",
    // duration: "",
    // originCountry: "",
    // originalLanguage: "",
    // overview: "",
    // posterPath: "",
    // rating: "",
    // releaseDate: "",
    // status: "",
    // subtitle: "",
    // tagline: "",
    // title: "",
    // director: "",
    // casts: [],
    // genres: [],

    title: "Avengers: Endgame",
    subtitle: "The Final Battle",
    tagline: "Part of the journey is the end",
    director: "Anthony Russo, Joe Russo",
    duration: "181",
    status: "RELEASED",
    rating: "PG13",
    releaseDate: "2019-04-26",
    overview: "Trận chiến cuối cùng chống lại Thanos để cứu vũ trụ.",
    originCountry: "USA",
    originalLanguage: "English",
    posterPath: "https://image.tmdb.org/t/p/original/jiZsghGFHmeINTkjp3v1ZfuXfCO.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/8btfz81bOJ2lC7cujYBTw03wzg3.jpg",
    casts: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    genres: [],
};

const movieSchema = yup.object().shape({
    title: yup.string().required("Vui lòng nhập tên phim"),
    subtitle: yup.string().required("Vui lòng nhập subtitle"),
    tagline: yup.string().required("Vui lòng nhập tagline"),
    director: yup.string().required("Vui lòng nhập đạo diễn"),
    duration: yup
        .number()
        .typeError("Thời lượng phải là số")
        .required("Vui lòng nhập thời lượng"),
    status: yup.string().required("Chọn trạng thái"),
    originCountry: yup.string().required("Điền quốc gia"),
    originalLanguage: yup.string().required("Điền ngôn ngữ"),
    rating: yup.string().required("Chọn phân loại độ tuổi"),
    releaseDate: yup.string().required("Chọn ngày phát hành"),
    overview: yup.string().required("Nhập mô tả phim"),
    genres: yup
        .array()
        .of(yup.number())
        .min(1, "Chọn ít nhất 1 thể loại"),
    posterPath: yup
        .string()
        .url("Phải là đường dẫn hợp lệ")
        .required("Vui lòng nhập poster"),
    backdropPath: yup
        .string()
        .url("Phải là đường dẫn hợp lệ")
        .nullable(),
});

export default function MovieModal({ open, onClose, mode = "add", movieData, onSave }) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        register,
    } = useForm({
        resolver: yupResolver(movieSchema),
        defaultValues: EMPTY_MOVIE,
    });

    useEffect(() => {
        reset(movieData || EMPTY_MOVIE);
    }, [movieData, open, reset]);

    const { data: genresData = [], isLoading } = useGetAllGenresQuery();
    const genres = genresData.data ?? [];
    console.log('gd', genres);
    const onSubmit = (data) => {
        console.log(data);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle className="text-xl font-semibold text-gray-700">
                {mode === "add" ? "🎬 Thêm phim mới" : "✏️ Chỉnh sửa phim"}
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="!p-4">
                    {/* Grid chính */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Cột trái */}
                        <div className="flex flex-col gap-4">
                            <TextField
                                label="Title"
                                {...register("title")}
                                error={!!errors.title}
                                helperText={errors.title?.message}
                                fullWidth
                            />

                            <TextField
                                label="Subtitle"
                                {...register("subtitle")}
                                error={!!errors.subtitle}
                                helperText={errors.subtitle?.message}
                                fullWidth
                            />

                            <TextField
                                label="Tagline"
                                {...register("tagline")}
                                fullWidth
                                error={!!errors.tagline}
                                helperText={errors.tagline?.message}
                            />

                            <TextField
                                label="Director"
                                {...register("director")}
                                error={!!errors.director}
                                helperText={errors.director?.message}
                                fullWidth
                            />

                            {/* Casts (tạm lưu string, bạn có thể nâng cấp sau thành array) */}
                            <TextField label="Casts (phân cách bằng dấu phẩy)" {...register("casts")} fullWidth />

                            <TextField
                                label="Duration (phút)"
                                {...register("duration")}
                                error={!!errors.duration}
                                helperText={errors.duration?.message}
                                fullWidth
                            />

                            {/* Status */}
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.status}>
                                        <InputLabel id="status-label">Status</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="status-label"
                                            id="status-select"
                                            label="Status"
                                            renderValue={(selected) => <MovieStatusChip status={selected} />}
                                        >
                                            {STATUS_OPTIONS.map((opt) => (
                                                <MenuItem key={opt} value={opt}>
                                                    <MovieStatusChip status={opt} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.status?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />

                            {/* Rating */}
                            <Controller
                                name="rating"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.rating}>
                                        <InputLabel id="rating-label">Rating</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="rating-label"
                                            id="rating-select"
                                            label="Rating"
                                        >
                                            {RATING_OPTIONS.map((opt) => (
                                                <MenuItem key={opt} value={opt}>
                                                    {opt}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.rating?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </div>

                        {/* Cột phải */}
                        <div className="flex flex-col gap-4">
                            <TextField
                                label="Country"
                                {...register("originCountry")}
                                error={!!errors.originCountry}
                                helperText={errors.originCountry?.message}
                                fullWidth
                            />

                            <TextField
                                label="Original
                                Language" {...register("originalLanguage")}
                                error={!!errors.originalLanguage}
                                helperText={errors.originalLanguage?.message}
                                fullWidth
                            />

                            <Controller
                                name="releaseDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="date"
                                        label="Release Date"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.releaseDate}
                                        helperText={errors.releaseDate?.message}
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="genres"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <Autocomplete
                                            multiple
                                            options={genres}
                                            getOptionLabel={(option) => option.name}
                                            value={genres.filter((g) => field.value?.includes(g.id))}
                                            onChange={(_, newValue) =>
                                                field.onChange(newValue.map((g) => Number(g.id)))
                                            }
                                            loading={isLoading}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox checked={selected} />
                                                    {option.name}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Genres"
                                                    error={!!errors.genres}
                                                    helperText={errors.genres?.message}
                                                />
                                            )}
                                        />
                                    );
                                }}
                            />

                            <Controller
                                name="overview"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-medium mb-1">Overview</label>
                                        <TextareaAutosize
                                            {...field}
                                            minRows={6}
                                            placeholder="Nhập mô tả phim..."
                                            style={{
                                                width: "100%",
                                                padding: "8px 12px",
                                                border: errors.overview ? "2px solid #f44336" : "1px solid #ccc",
                                                borderRadius: "4px",
                                                fontSize: "14px",
                                                resize: "vertical",
                                                minHeight: "150px",
                                                maxHeight: "248px",
                                            }}
                                        />
                                        {errors.overview && (
                                            <FormHelperText error>{errors.overview.message}</FormHelperText>
                                        )}
                                    </div>
                                )}
                            />


                        </div>
                    </div>

                    {/* Hình ảnh (Poster & Backdrop) */}
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        {/* Poster */}
                        <Controller
                            name="posterPath"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-2">
                                    <TextField
                                        {...field}
                                        label="Poster Path"
                                        fullWidth
                                        error={!!errors.posterPath}
                                        helperText={errors.posterPath?.message}
                                    />
                                    {field.value && (
                                        <div className="rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={field.value}
                                                alt="Poster Preview"
                                                className="w-full max-h-64 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        />

                        {/* Backdrop */}
                        <Controller
                            name="backdropPath"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-2">
                                    <TextField
                                        {...field}
                                        label="Backdrop Path"
                                        fullWidth
                                        error={!!errors.backdropPath}
                                        helperText={errors.backdropPath?.message}
                                    />
                                    {field.value && (
                                        <div className="rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={field.value}
                                                alt="Backdrop Preview"
                                                className="w-full max-h-64 object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="error" variant="outlined">
                        Đóng
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                        {mode === "add" ? "Lưu" : "Cập nhật"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
