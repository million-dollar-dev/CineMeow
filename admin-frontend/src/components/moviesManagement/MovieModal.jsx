import React, {useEffect, useState} from "react";
import {
    Autocomplete,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

const STATUS_OPTIONS = ["NOW_PLAYING", "COMING_SOON", "RELEASED", "POST_PRODUCTION"];
const RATING_OPTIONS = ["G", "PG", "PG13", "R", "NC17", "C13"];
const GENRES = [
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
    backdropPath: "",
    duration: "",
    originCountry: "",
    originalLanguage: "",
    overview: "",
    posterPath: "",
    rating: "",
    releaseDate: "",
    status: "",
    subtitle: "",
    tagline: "",
    title: "",
    director: "",
    casts: [],
    genres: [],
};

export default function MovieModal({open, onClose, onSave, mode = "add", movieData}) {
    const [movie, setMovie] = useState(EMPTY_MOVIE);

    const handleChange = (e) => {
        setMovie({
            ...movie,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        onSave(movie, mode);
        onClose();
    };

    useEffect(() => {
        setMovie(movieData || EMPTY_MOVIE);
    }, [movieData, open]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle className="text-xl font-semibold text-gray-700">
                {mode === "add" && "🎬 Thêm phim mới"}
                {mode === "edit" && "✏️ Chỉnh sửa phim"}
            </DialogTitle>
            <DialogContent className="!p-4">
                {/* Grid chính */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Cột trái */}
                    <div className="flex flex-col gap-4">
                        <TextField label="Title" name="title" value={movie.title} onChange={handleChange} fullWidth/>
                        <TextField label="Subtitle" name="subtitle" value={movie.subtitle} onChange={handleChange}
                                   fullWidth/>
                        <TextField label="Tagline" name="tagline" value={movie.tagline} onChange={handleChange}
                                   fullWidth/>
                        <TextField label="Director" name="director" value={movie.director} onChange={handleChange}
                                   fullWidth/>
                        <TextField
                            label="Casts"
                            name="casts"
                            value={Array.isArray(movie.casts) ? movie.casts.map((g) => g.name).join(", ") : movie.casts || ""}
                            onChange={(e) => setMovie({
                                ...movie,
                                casts: e.target.value // lưu tạm string
                            })}
                            fullWidth
                        />
                        <TextField label="Duration (phút)" name="duration" value={movie.duration}
                                   onChange={handleChange} fullWidth/>

                        {/* Status */}
                        <FormControl fullWidth variant="outlined" className="mb-2">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                id="status-select"
                                name="status"
                                value={movie.status}
                                onChange={handleChange}
                                label="Status"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Rating */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="rating-label">Rating</InputLabel>
                            <Select
                                labelId="rating-label"
                                id="rating-select"
                                name="rating"
                                value={movie.rating}
                                onChange={handleChange}
                                label="Rating"
                            >
                                {RATING_OPTIONS.map((opt) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Cột phải */}
                    <div className="flex flex-col gap-4">
                        <TextField label="Country" name="country" value={movie.originCountry} onChange={handleChange}
                                   fullWidth/>
                        <TextField label="Original Language" name="original_language" value={movie.originalLanguage}
                                   onChange={handleChange} fullWidth/>
                        <TextField
                            label="Release Date"
                            name="release_date"
                            type="date"
                            value={movie.releaseDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{shrink: true}}
                        />
                        <Autocomplete
                            multiple
                            options={GENRES}
                            getOptionLabel={(option) => option.name}
                            value={movie.genres || []}
                            onChange={(e, newValue) => setMovie({ ...movie, genres: newValue })}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} />
                                    {option.name} {/* ✅ hiển thị name thay vì object */}
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} label="Genres" />}
                        />


                        {/* Overview cuối cột phải */}
                        <div className="flex flex-col flex-1">
                            <label className="block text-gray-700 font-medium mb-2">Overview</label>
                            <textarea
                                name="overview"
                                value={movie.overview}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 resize-y min-h-[240px] text-sm"
                                placeholder="Nhập mô tả phim..."
                            />
                        </div>
                    </div>
                </div>

                {/* Hình ảnh (Poster & Backdrop) */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="flex flex-col gap-2">
                        <TextField
                            label="Poster Path"
                            name="poster_path"
                            value={movie.posterPath}
                            onChange={handleChange}
                            fullWidth
                        />
                        {movie.posterPath && (
                            <div className="rounded-lg overflow-hidden shadow-md">
                                <img src={movie.posterPath} alt="Poster Preview"
                                     className="w-full max-h-64 object-contain"/>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <TextField
                            label="Backdrop Path"
                            name="backdrop_path"
                            value={movie.backdropPath}
                            onChange={handleChange}
                            fullWidth
                        />
                        {movie.backdropPath && (
                            <div className="rounded-lg overflow-hidden shadow-md">
                                <img src={movie.backdropPath} alt="Backdrop Preview"
                                     className="w-full max-h-64 object-cover"/>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    Đóng
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    {mode === "add" ? "Lưu" : "Cập nhật"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
